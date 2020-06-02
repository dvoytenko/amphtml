/**
 * Copyright 2020 The AMP HTML Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {ContextNode} from '../../../src/context/node';
import {
  withMetaData,
} from '../../../src/context/component-meta';
import {
  installFactory,
  installFactoryForProp,
  removeComponent,
  setComponent,
  subscribe,
  uninstallFactory,
  uninstallFactoryForProp,
  unsubscribe,
  useSetComponent,
  useRemoveComponent,
} from '../../../src/context/component-install';
import {contextProp} from '../../../src/context/prop';
import {
  useFactory,
  useSetProp,
  useRemoveProp,
  useRef,
  useSyncEffect,
} from '../../../src/context/component-hooks';

const NonRecursive = contextProp('NonRecursive');

const Recursive = contextProp('Recursive', {needsParent: true});

const Concat = contextProp('Concat', {
  needsParent: true,
  compute: (contextNode, inputs, parentValue) =>
    `${parentValue}${inputs.length > 1 ? `(${inputs.join('|')})` : inputs[0]}`,
  defaultValue: '',
});

const Computed = contextProp('Computed', {
  deps: [NonRecursive, Recursive, Concat],
  compute: (contextNode, inputs, nonRecursive, recursive, concat) =>
    `${inputs[0] ?? 'no-input'}/${nonRecursive}/${recursive}/${concat}`,
});

describes.realWin('ContextNode - components', {}, (env) => {
  let sandbox;
  let win, doc;
  let tree;
  let clock;
  let discoverWrapper;
  let Component1, component1Spy;
  let ComponentWithDeps, componentWithDepsSpy;

  beforeEach(() => {
    sandbox = env.sandbox;
    win = env.win;
    doc = win.document;
    clock = sandbox.useFakeTimers();

    tree = (() => {
      function createSubtree(id, children, depth) {
        const el = doc.createElement('div');
        el.id = id;
        el.textContent = id;
        if (depth > 1) {
          for (let i = 0; i < children; i++) {
            const child = createSubtree(`${id}-${i + 1}`, children, depth - 1);
            el.appendChild(child);
          }
        }
        return el;
      }
      return createSubtree('T', 4, 4);
    })();

    discoverWrapper = wrapper(ContextNode.prototype, 'discover_');

    // Customize output of the ContextNode for easy debug.
    ContextNode.prototype.inspect = function () {
      const contextNode = this;
      return `ContextNode(${contextNode.node.id || contextNode.node.nodeName})`;
    };

    component1Spy = sandbox.spy();
    Component1 = withMetaData(component1Spy);

    componentWithDepsSpy = sandbox.spy();
    ComponentWithDeps = withMetaData(
      [NonRecursive, Concat],
      componentWithDepsSpy
    );
  });

  afterEach(() => {
    delete ContextNode.prototype.inspect;
  });

  function el(id) {
    if (id == 'T') {
      return tree;
    }
    const found = tree.querySelector(`#${id}`);
    if (!found) {
      throw new Error(`element not found ${id}`);
    }
    return found;
  }

  /**
   * @param {Object} obj
   * @param {string} name
   */
  function wrapper(obj, name) {
    const original = obj[name];
    const stub = env.sandbox.stub(ContextNode.prototype, name);
    const wrapperName = `__wrapper_${name}`;
    stub.callsFake(function (...args) {
      const obj = this;
      const resolvers = obj[wrapperName] ?? (obj[wrapperName] = []);
      const result = original.apply(this, args);
      const current = resolvers.slice(0);
      resolvers.length = 0;
      current.forEach((resolver) => resolver(result));
      return result;
    });
    return {
      spy: stub,
      waitFor: (obj) => {
        const resolvers = obj[wrapperName] ?? (obj[wrapperName] = []);
        return new Promise((resolve) => {
          resolvers.push(resolve);
        });
      },
    };
  }

  function waitForDiscover(...nodesOrContextNodes) {
    const contextNodes = nodesOrContextNodes.map((arg) =>
      arg.nodeType ? ContextNode.get(arg) : arg
    );
    const promises = contextNodes.map((contextNode) =>
      discoverWrapper.waitFor(contextNode)
    );
    clock.tick(1);
    return Promise.all(promises);
  }

  function rediscover(...nodesOrContextNodes) {
    const contextNodes = nodesOrContextNodes.map((arg) =>
      arg.nodeType ? ContextNode.get(arg) : arg
    );
    contextNodes.forEach((cn) => cn.discover());
    return waitForDiscover.apply(null, contextNodes);
  }

  describe('connected', () => {
    let sibling1, sibling1Stub;
    let sibling2, sibling2Stub;
    let cousin1, cousin1Stub;
    let parent, parentStub;
    let grandparent, grandparentStub;

    beforeEach(async () => {
      doc.body.appendChild(tree);
      sibling1 = ContextNode.get(el('T-1-1-1'));
      sibling2 = ContextNode.get(el('T-1-1-2'));
      cousin1 = ContextNode.get(el('T-1-2-1'));
      parent = ContextNode.get(el('T-1-1'));
      grandparent = ContextNode.get(el('T-1'));

      sibling1Stub = sandbox.stub();
      sibling2Stub = sandbox.stub();
      cousin1Stub = sandbox.stub();
      parentStub = sandbox.stub();
      grandparentStub = sandbox.stub();

      await waitForDiscover(grandparent, parent, sibling1, sibling2, cousin1);
    });

    it('should only call component once w/o input', () => {
      setComponent(parent.node, Component1);
      expect(component1Spy).to.not.be.called;

      clock.runAll();
      expect(component1Spy).to.be.calledOnce.calledWith(parent.node, undefined);

      setComponent(parent.node, Component1);
      clock.runAll();
      expect(component1Spy).to.be.calledOnce; // no changes.
    });

    it('should only call component once per input', () => {
      setComponent(parent.node, Component1, 1);
      clock.runAll();
      expect(component1Spy).to.be.calledOnce.calledWith(parent.node, 1);

      // Rerun the component due to the input change.
      setComponent(parent.node, Component1, 2);
      clock.runAll();
      expect(component1Spy).to.be.calledTwice.calledWith(parent.node, 2);

      // Input didn't change - do not rerun.
      setComponent(parent.node, Component1, 2);
      clock.runAll();
      expect(component1Spy).to.be.calledTwice;
    });

    it('should reconnect component when the node is reconnected', async () => {
      setComponent(parent.node, Component1, 1);
      clock.runAll();
      expect(component1Spy).to.be.calledOnce.calledWith(parent.node, 1);

      parent.node.remove();
      await rediscover(parent);
      clock.runAll();

      setComponent(parent.node, Component1, 2);
      clock.runAll();
      expect(component1Spy).to.be.calledOnce;

      grandparent.node.appendChild(parent.node);
      await rediscover(parent);
      clock.runAll();
      expect(component1Spy).to.be.calledTwice.calledWith(parent.node, 2);
    });

    it('should wait until all deps satisfied', () => {
      setComponent(parent.node, ComponentWithDeps, 1);

      clock.runAll();
      expect(componentWithDepsSpy).to.not.be.called;

      grandparent.values.set(Concat, 'OWNER1', 'A');
      clock.runAll();
      expect(componentWithDepsSpy).to.not.be.called;

      parent.values.set(Concat, 'OWNER1', 'B');
      clock.runAll();
      expect(componentWithDepsSpy).to.not.be.called;

      parent.values.set(NonRecursive, 'OWNER1', 'NR');
      clock.runAll();
      expect(componentWithDepsSpy).to.be.calledOnce.calledWith(
        parent.node,
        1,
        'NR',
        'AB'
      );

      parent.values.remove(NonRecursive, 'OWNER1');
      clock.runAll();
      expect(componentWithDepsSpy).to.be.calledOnce;
    });

    describe('factory', () => {
      let factorySpy;
      let factoryDisconnectSpy;
      let factory1;
      let factoryWithDeps;

      beforeEach(() => {
        factorySpy = sandbox.spy();
        factoryDisconnectSpy = sandbox.spy();

        factory1 = (...args) => {
          factorySpy.apply(null, args);
          return {value: 'A', disconnect: factoryDisconnectSpy};
        };
        factoryWithDeps = withMetaData(
          [NonRecursive, Concat],
          (...args) => {
            factorySpy.apply(null, args);
            return {
              value: `${args[1]}-${args[2]}`,
              disconnect: factoryDisconnectSpy,
            };
          }
        );
      });

      it('should install and remove factory', () => {
        installFactory(parent.node, factory1);
        clock.runAll();
        expect(factorySpy).to.be.calledOnce.calledWith(parent.node);
        expect(factoryDisconnectSpy).to.not.be.called;

        uninstallFactory(parent.node, factory1);
        clock.runAll();
        expect(factorySpy).to.be.calledOnce;
        expect(factoryDisconnectSpy).to.be.calledOnce;
      });

      it('should reconnect the factory when the node is reconnected', async () => {
        installFactory(parent.node, factory1);
        clock.runAll();
        expect(factorySpy).to.be.calledOnce.calledWith(parent.node);
        expect(factoryDisconnectSpy).to.not.be.called;

        parent.node.remove();
        await rediscover(parent);
        clock.runAll();
        expect(factorySpy).to.be.calledOnce;
        expect(factoryDisconnectSpy).to.be.calledOnce;

        grandparent.node.appendChild(parent.node);
        await rediscover(parent);
        clock.runAll();
        expect(factorySpy).to.be.calledTwice;
        expect(factoryDisconnectSpy).to.be.calledOnce;
      });

      it('should install factory with deps', async () => {
        installFactory(parent.node, factoryWithDeps);
        clock.runAll();
        expect(factoryDisconnectSpy).to.not.be.called;
        expect(factorySpy).to.not.be.called;

        // Satisfy all deps.
        parent.values.set(NonRecursive, 'OWNER1', 'NR');
        grandparent.values.set(Concat, 'OWNER1', 'A');
        clock.runAll();
        expect(factoryDisconnectSpy).to.not.be.called;
        expect(factorySpy).to.be.calledOnce.calledWith(parent.node, 'NR', 'A');

        // Change a dep.
        parent.values.set(Concat, 'OWNER1', 'B');
        clock.runAll();
        expect(factoryDisconnectSpy).to.be.calledOnce;
        expect(factorySpy).to.be.calledTwice.calledWith(
          parent.node,
          'NR',
          'AB'
        );

        // Should unsatisfy a dep.
        parent.values.remove(NonRecursive, 'OWNER1');
        clock.runAll();
        expect(factoryDisconnectSpy).to.be.calledTwice;
        expect(factorySpy).to.be.calledTwice;
      });

      describe('for prop', () => {
        let sibling1Stub;

        beforeEach(() => {
          sibling1Stub = sandbox.stub();
          parentStub = sandbox.stub();
          grandparentStub = sandbox.stub();
          sibling1.values.subscribe(Recursive, sibling1Stub);
          clock.runAll();
        });

        it('should install and remove factory for a prop', () => {
          installFactoryForProp(grandparent.node, Recursive, factory1);
          clock.runAll();
          expect(sibling1Stub).to.be.calledOnce.calledWith('A');

          uninstallFactoryForProp(grandparent.node, Recursive, factory1);
          clock.runAll();
          expect(sibling1Stub).to.be.calledTwice.calledWith(undefined);
        });

        it('should install and remove factory with deps for a prop', () => {
          installFactoryForProp(grandparent.node, Recursive, factoryWithDeps);
          grandparent.values.set(NonRecursive, 'OWNER1', 'NR');
          grandparent.values.set(Concat, 'OWNER1', 'A');
          clock.runAll();
          expect(sibling1Stub).to.be.calledOnce.calledWith('NR-A');

          // Remove.
          uninstallFactoryForProp(grandparent.node, Recursive, factoryWithDeps);
          clock.runAll();
          expect(sibling1Stub).to.be.calledTwice.calledWith(undefined);
        });

        it('should reinstall prop when deps change', () => {
          installFactoryForProp(grandparent.node, Recursive, factoryWithDeps);
          grandparent.values.set(NonRecursive, 'OWNER1', 'NR');
          grandparent.values.set(Concat, 'OWNER1', 'A');
          clock.runAll();
          expect(sibling1Stub).to.be.calledOnce.calledWith('NR-A');

          // Update.
          grandparent.values.set(NonRecursive, 'OWNER1', 'NR2');
          clock.runAll();
          expect(sibling1Stub).to.be.calledTwice.calledWith('NR2-A');
        });

        it('should remove prop when deps are unsatisfied', () => {
          installFactoryForProp(grandparent.node, Recursive, factoryWithDeps);
          grandparent.values.set(NonRecursive, 'OWNER1', 'NR');
          grandparent.values.set(Concat, 'OWNER1', 'A');
          clock.runAll();
          expect(sibling1Stub).to.be.calledOnce.calledWith('NR-A');

          // Update.
          grandparent.values.remove(NonRecursive, 'OWNER1');
          clock.runAll();
          expect(sibling1Stub).to.be.calledTwice.calledWith(undefined);
        });
      });
    });

    describe('subscriber', () => {
      let spy;
      let cleanupSpy;
      let subscriber;

      beforeEach(() => {
        spy = sandbox.spy();
        cleanupSpy = sandbox.spy();
        subscriber = (...args) => {
          spy.apply(null, args);
          return cleanupSpy;
        };
      });

      it('should subscribe with a single dep', () => {
        subscribe(parent.node, NonRecursive, subscriber);
        clock.runAll();
        expect(spy).to.not.be.called;
        expect(cleanupSpy).to.not.be.called;

        parent.values.set(NonRecursive, 'OWNER1', 'NR');
        clock.runAll();
        expect(spy).to.be.calledOnce.calledWith('NR');
        expect(cleanupSpy).to.not.be.called;

        // Repeat: no changes.
        parent.values.set(NonRecursive, 'OWNER1', 'NR');
        clock.runAll();
        expect(spy).to.be.calledOnce.calledWith('NR');
        expect(cleanupSpy).to.not.be.called;

        // Change value.
        parent.values.set(NonRecursive, 'OWNER1', 'NR2');
        clock.runAll();
        expect(spy).to.be.calledTwice.calledWith('NR2');
        expect(cleanupSpy).to.be.calledOnce;

        // Remove value.
        parent.values.remove(NonRecursive, 'OWNER1');
        clock.runAll();
        expect(spy).to.be.calledTwice; // no change.
        expect(cleanupSpy).to.be.calledTwice;
      });

      it('should subscribe with multiple deps', () => {
        subscribe(parent.node, [NonRecursive, Concat], subscriber);
        clock.runAll();
        expect(spy).to.not.be.called;
        expect(cleanupSpy).to.not.be.called;

        grandparent.values.set(Concat, 'OWNER1', 'A');
        clock.runAll();
        expect(spy).to.not.be.called;
        expect(cleanupSpy).to.not.be.called;

        parent.values.set(NonRecursive, 'OWNER1', 'NR');
        clock.runAll();
        expect(spy).to.be.calledOnce.calledWith('NR', 'A');
        expect(cleanupSpy).to.not.be.called;

        // Change value.
        parent.values.set(Concat, 'OWNER1', 'B');
        clock.runAll();
        expect(spy).to.be.calledTwice.calledWith('NR', 'AB');
        expect(cleanupSpy).to.be.calledOnce;

        // Remove value.
        parent.values.remove(NonRecursive, 'OWNER1');
        clock.runAll();
        expect(spy).to.be.calledTwice; // no change.
        expect(cleanupSpy).to.be.calledTwice;
      });

      it('should unsubscribe', () => {
        subscribe(parent.node, [NonRecursive], subscriber);
        parent.values.set(NonRecursive, 'OWNER1', 'NR');
        clock.runAll();
        expect(spy).to.be.calledOnce;
        expect(cleanupSpy).to.not.be.called;

        unsubscribe(parent.node, subscriber);
        clock.runAll();
        expect(spy).to.be.calledOnce; // no change.
        expect(cleanupSpy).to.be.calledOnce;

        // Change value.
        parent.values.set(NonRecursive, 'OWNER1', 'NR2');
        clock.runAll();
        expect(spy).to.be.calledOnce; // no change.
        expect(cleanupSpy).to.be.calledOnce; // no change.
      });

      it('should reconnect the subscriber when the node is reconnected', async () => {
        subscribe(parent.node, [NonRecursive], subscriber);
        parent.values.set(NonRecursive, 'OWNER1', 'NR');
        clock.runAll();
        expect(spy).to.be.calledOnce;
        expect(cleanupSpy).to.not.be.called;

        parent.node.remove();
        await rediscover(parent);
        clock.runAll();
        expect(spy).to.be.calledOnce; // no change.
        expect(cleanupSpy).to.be.calledOnce;

        grandparent.node.appendChild(parent.node);
        await rediscover(parent);
        clock.runAll();
        expect(spy).to.be.calledTwice;
        expect(cleanupSpy).to.be.calledOnce; // no change.
      });
    });

    describe('props', () => {
      let ComponentSelfProps;
      let ComponentParentProps;
      let sibling1Stub;
      let parentStub;
      let grandparentStub;

      beforeEach(() => {
        ComponentSelfProps = (unusedNode, input) => {
          const setProp = useSetProp();
          const removeProp = useRemoveProp();
          if (input) {
            setProp(Concat, input);
          } else {
            removeProp(Concat);
          }
        };
        ComponentParentProps = (unusedNode, input) => {
          const setProp = useSetProp();
          const removeProp = useRemoveProp();
          if (input) {
            setProp(Concat, input, parent.node);
          } else {
            removeProp(Concat, parent.node);
          }
        };

        sibling1Stub = sandbox.stub();
        parentStub = sandbox.stub();
        grandparentStub = sandbox.stub();
        sibling1.values.subscribe(Concat, sibling1Stub);
        parent.values.subscribe(Concat, parentStub);
        grandparent.values.subscribe(Concat, grandparentStub);
        clock.runAll();
        [sibling1Stub, parentStub, grandparentStub].forEach(stub => {
          stub.resetHistory();
        });
      });

      it('should set props in components', () => {
        setComponent(grandparent.node, ComponentSelfProps, 'A');
        clock.runAll();
        expect(sibling1Stub).to.be.calledOnce.calledWith('A');
        expect(parentStub).to.be.calledOnce.calledWith('A');
        expect(grandparentStub).to.be.calledOnce.calledWith('A');

        setComponent(grandparent.node, ComponentParentProps, 'B');
        clock.runAll();
        expect(sibling1Stub).to.be.calledTwice.calledWith('AB');
        expect(parentStub).to.be.calledTwice.calledWith('AB');
        expect(grandparentStub).to.be.calledOnce; // no change.
      });

      it('should remove props', () => {
        setComponent(grandparent.node, ComponentSelfProps, 'A');
        setComponent(grandparent.node, ComponentParentProps, 'B');
        clock.runAll();
        expect(sibling1Stub).to.be.calledOnce.calledWith('AB');
        expect(parentStub).to.be.calledOnce.calledWith('AB');
        expect(grandparentStub).to.be.calledOnce.calledWith('A');

        setComponent(grandparent.node, ComponentSelfProps, null);
        clock.runAll();
        expect(sibling1Stub).to.be.calledTwice.calledWith('B');
        expect(parentStub).to.be.calledTwice.calledWith('B');
        expect(grandparentStub).to.be.calledTwice.calledWith('');

        setComponent(grandparent.node, ComponentParentProps, null);
        clock.runAll();
        expect(sibling1Stub).to.be.calledThrice.calledWith('');
        expect(parentStub).to.be.calledThrice.calledWith('');
        expect(grandparentStub).to.be.calledTwice; // no change.
      });

      it('should remove props when component is disconnected', () => {
        setComponent(grandparent.node, ComponentSelfProps, 'A');
        setComponent(grandparent.node, ComponentParentProps, 'B');
        clock.runAll();
        expect(sibling1Stub).to.be.calledOnce.calledWith('AB');
        expect(parentStub).to.be.calledOnce.calledWith('AB');
        expect(grandparentStub).to.be.calledOnce.calledWith('A');

        removeComponent(grandparent.node, ComponentSelfProps);
        clock.runAll();
        expect(sibling1Stub).to.be.calledTwice.calledWith('B');
        expect(parentStub).to.be.calledTwice.calledWith('B');
        expect(grandparentStub).to.be.calledTwice.calledWith('');

        removeComponent(grandparent.node, ComponentParentProps);
        clock.runAll();
        expect(sibling1Stub).to.be.calledThrice.calledWith('');
        expect(parentStub).to.be.calledThrice.calledWith('');
        expect(grandparentStub).to.be.calledTwice; // no change.
      });

      it('should remove props when other node is disconnected', async () => {
        setComponent(grandparent.node, ComponentSelfProps, 'A');
        setComponent(grandparent.node, ComponentParentProps, 'B');
        clock.runAll();
        expect(sibling1Stub).to.be.calledOnce.calledWith('AB');
        expect(parentStub).to.be.calledOnce.calledWith('AB');
        expect(grandparentStub).to.be.calledOnce.calledWith('A');

        parent.node.remove();
        await rediscover(parent);
        clock.runAll();
        expect(grandparent.values.has(Concat)).to.be.true;
        expect(parent.values.has(Concat)).to.be.false;
      });

      it('should remove props when node is disconnected', async () => {
        setComponent(grandparent.node, ComponentSelfProps, 'A');
        setComponent(grandparent.node, ComponentParentProps, 'B');
        clock.runAll();
        expect(sibling1Stub).to.be.calledOnce.calledWith('AB');
        expect(parentStub).to.be.calledOnce.calledWith('AB');
        expect(grandparentStub).to.be.calledOnce.calledWith('A');

        grandparent.node.remove();
        await rediscover(grandparent);
        clock.runAll();
        expect(grandparent.values.has(Concat)).to.be.false;
        expect(parent.values.has(Concat)).to.be.false;
      });
    });

    describe('child components', () => {
      let ComponentSelfChildren;
      let ComponentParentChildren;
      let ChildComponent, childComponentSpy, childCleanupSpy;

      beforeEach(() => {
        ComponentSelfChildren = (unusedNode, input) => {
          const setComponent = useSetComponent();
          const removeComponent = useRemoveComponent();
          if (input) {
            setComponent(ChildComponent, input);
          } else {
            removeComponent(ChildComponent);
          }
        };
        ComponentParentChildren = (unusedNode, input) => {
          const setComponent = useSetComponent();
          const removeComponent = useRemoveComponent();
          if (input) {
            setComponent(ChildComponent, input, parent.node);
          } else {
            removeComponent(ChildComponent, parent.node);
          }
        };

        childComponentSpy = sandbox.spy();
        childCleanupSpy = sandbox.spy();
        ChildComponent = function(...args) {
          childComponentSpy.apply(null, args);
          useSyncEffect(() => childCleanupSpy);
        };
      });

      it('should set child component', () => {
        setComponent(grandparent.node, ComponentSelfChildren, 'A');
        clock.runAll();
        expect(childComponentSpy).to.be.calledOnce.calledWith(grandparent.node, 'A');

        setComponent(grandparent.node, ComponentParentChildren, 'B');
        clock.runAll();
        expect(childComponentSpy).to.be.calledTwice.calledWith(parent.node, 'B');

        expect(childCleanupSpy).to.not.be.called;
      });

      it('should update child component', () => {
        setComponent(grandparent.node, ComponentSelfChildren, 'A');
        clock.runAll();
        expect(childComponentSpy).to.be.calledOnce.calledWith(grandparent.node, 'A');

        setComponent(grandparent.node, ComponentSelfChildren, 'B');
        clock.runAll();
        expect(childComponentSpy).to.be.calledTwice.calledWith(grandparent.node, 'B');

        expect(childCleanupSpy).to.not.be.called;
      });

      it('should remove child component on removal', () => {
        setComponent(grandparent.node, ComponentSelfChildren, 'A');
        setComponent(grandparent.node, ComponentParentChildren, 'B');
        clock.runAll();
        expect(childComponentSpy).to.be.calledTwice
          .calledWith(grandparent.node, 'A')
          .calledWith(parent.node, 'B');

        removeComponent(grandparent.node, ComponentSelfChildren);
        clock.runAll();
        expect(childCleanupSpy).to.be.calledOnce;

        removeComponent(grandparent.node, ComponentParentChildren);
        clock.runAll();
        expect(childCleanupSpy).to.be.calledTwice;
      });
    });
  });
});
