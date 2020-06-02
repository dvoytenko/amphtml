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

import {ContextNode} from './node';
import {devAssert, rethrowAsync} from '../log';
import {findIndex, pushIfNotExist, removeItem} from '../utils/array';
import {isArray} from '../types';
import {protectedNoInline, throttleTail} from './scheduler';
import {withComponent} from './component-hooks';

const MAX_DEPS = 3;
const EMPTY_ARRAY = [];
const EMPTY_FUNC = () => {};

export class ComponentImpl {
  /**
   * @param {*} id
   * @param {!ContextNode} contextNode
   * @param {!Function} func
   * @param {?Array<!ContextProp>} deps
   */
  constructor(id, contextNode, func, deps) {
    /** @package @const {*} */
    this.id = id;

    /** @package @const {!ContextNode} */
    this.contextNode = contextNode;

    /** @private @const {!Function} */
    this.func_ = func;

    deps = deps || EMPTY_ARRAY;

    /** @private @const {!Array<!ContextProp>} */
    this.deps_ = deps;

    /** @private @const {!Array} */
    this.depValues_ = deps.length > 0 ? deps.map(EMPTY_FUNC) : EMPTY_ARRAY;

    /** @private @const {!Array<function(*)>} */
    this.depSubscribers_ =
      deps.length > 0
        ? deps.map((dep, index) => (value) => {
            this.depValues_[index] = value;
            this.update_();
          })
        : EMPTY_ARRAY;

    /** @private {*|undefined} */
    this.input_ = undefined;

    /** @private {boolean} */
    this.running_ = false;

    /** @private {?Array<{current: *}>} */
    this.refs_ = null;

    /** @private {number} */
    this.refPointer_ = -1;

    /** @private {?function()} */
    this.runCleanup_ = null;

    /** @private {?Array<function()>} */
    this.cleanups_ = null;

    /** @private {?Map<!ContextNode, !Array<!ContextProp>>} */
    this.nodeProps_ = null;

    /** @private {?Map<!ContextNode, !Array<*>>} */
    this.nodeComps_ = null;

    // Schedulers.
    /** @private @const {function()} */
    this.update_ = throttleTail(this.update_.bind(this), setTimeout);

    /** @private @const {function()} */
    this.run_ = this.run_.bind(this);

    // QQQ: clarify/confirm
    this.setProp = this.setProp.bind(this);
    this.removeProp = this.removeProp.bind(this);

    /** @private @const {function(!ContextNode)} */
    this.cleanupPropNode_ = this.cleanupPropNode_.bind(this);

    // Subscribe to all dependencies.
    if (deps.length > 0) {
      const {values} = this.contextNode;
      deps.forEach((dep, index) =>
        values.subscribe(dep, this.depSubscribers_[index])
      );
    }

    // Run the first time.
    if (this.isConnected_()) {
      console.log('qqq: first schedule');
      this.update_();
    }
  }

  /**
   * Called when the component is completely discarded.
   */
  dispose() {
    console.log('qqq: dispose');

    // Unsubscribe from all dependencies.
    if (this.deps_.length > 0) {
      const {values} = this.contextNode;
      this.deps_.forEach((dep, index) =>
        values.unsubscribe(dep, this.depSubscribers_[index])
      );
    }

    this.cleanup_(/* cleanupProps */ true);
  }

  removeSelf() {
    //QQQ:test
    this.contextNode.removeComponent(this.id);
  }

  /**
   * Called when the node's root has changed. It can be a different root or
   * the node can be disconnected entirely.
   */
  rootUpdated() {
    const isConnected = this.isConnected_();
    this.cleanup_(/* cleanupProps */ !isConnected);
    if (isConnected) {
      this.update_();
    }
  }

  /**
   * Sets the component's input.
   * @param {*} input
   * @override
   */
  set(input) {
    console.log('qqq: set input:', input);
    if (this.input_ !== input) {
      this.input_ = input;
      if (this.isConnected_()) {
        console.log('qqq: schedule');
        this.update_();
      }
    }
  }

  /** @override ComponentProps */
  setProp(prop, value, node = null) {
    console.log(
      'qqq: set prop: ',
      prop.key,
      value,
      contextNode?.node?.id || 'self'
    );

    // Set the prop.
    const contextNode = node ? ContextNode.get(node) : this.contextNode;
    contextNode.values.set(prop, /* setter */ this, value);

    // Track the prop on the node.
    const nodeProps = this.nodeProps_ || (this.nodeProps_ = new Map());
    let props = nodeProps && nodeProps.get(contextNode);
    if (!props) {
      props = [];
      nodeProps.set(contextNode, props);
    }

    // The first prop set on another (not this) node: register the cleanup
    // handler.
    if (props.length == 0 && contextNode != this.contextNode) {
      contextNode.pushCleanup(this.cleanupPropNode_);
    }

    pushIfNotExist(props, prop);
  }

  /** @override ComponentProps */
  removeProp(prop, node = null) {
    console.log(
      'qqq: remove prop: ',
      prop.key,
      contextNode?.node?.id || 'self'
    );

    // Remove the prop.
    const contextNode = node ? ContextNode.get(node) : this.contextNode;
    contextNode.values.remove(prop, /* setter */ this);

    // Untrack the prop.
    const nodeProps = this.nodeProps_;
    const props = nodeProps && nodeProps.get(contextNode);
    if (props) {
      removeItem(props, prop);
      if (props.length == 0 && contextNode != this.contextNode) {
        nodeProps.delete(contextNode);
        contextNode.popCleanup(this.cleanupPropNode_);
      }
    }
  }

  setComponent(id, factory, func, deps, input, node = null) {
    const contextNode = node ? ContextNode.get(node) : this.contextNode;
    contextNode.setComponent(id, factory, func, deps, input);

    // Track the child component on the node.
    const nodeComps = this.nodeComps_ || (this.nodeComps_ = new Map());
    let comps = nodeComps && nodeComps.get(contextNode);
    if (!comps) {
      comps = [];
      nodeComps.set(contextNode, comps);
    }

    // The first comp set on another (not this) node: register the cleanup
    // handler.
    if (comps.length == 0 && contextNode != this.contextNode) {
      contextNode.pushCleanup(this.cleanupPropNode_);
    }

    pushIfNotExist(comps, id);
  }

  removeComponent(id, node = null) {
    const contextNode = node ? ContextNode.get(node) : this.contextNode;
    contextNode.removeComponent(id);

    // Untrack the child component.
    const nodeComps = this.nodeComps_;
    const comps = nodeComps && nodeComps.get(contextNode);
    if (comps) {
      removeItem(comps, id);
      if (comps.length == 0 && contextNode != this.contextNode) {
        nodeComps.delete(contextNode);
        // QQQQ: double unsubscribe on this.cleanupPropNode_?
        contextNode.popCleanup(this.cleanupPropNode_);
      }
    }
  }

  /**
   * Allocates a new reference in the component's state.
   *
   * @param {*=} def
   * @return {{current: *}}
   */
  allocRef(def = undefined) {
    const refs = this.refs_ || (this.refs_ = []);
    const pointer = ++this.refPointer_;
    return refs[pointer] || (refs[pointer] = {current: def});
  }

  /**
   * Register a cleanup handler that will be called when the component is
   * cleaned up, either due to the node being disconnected, or the component
   * being removed.
   *
   * @param {function()} cleanup
   */
  pushCleanup(cleanup) {
    console.log('qqq: pushCleanup');
    const cleanups = this.cleanups_ || (this.cleanups_ = []);
    pushIfNotExist(cleanups, cleanup);
  }

  /**
   * Unregisters a cleanup handler previously registered with `pushCleanup`.
   *
   * @param {function()} cleanup
   */
  popCleanup(cleanup) {
    console.log('qqq: removeCleanup');
    const cleanups = this.cleanups_;
    if (cleanups) {
      removeItem(cleanups, cleanup);
    }
  }

  /**
   * @return {boolean}
   * @private
   */
  isConnected_() {
    console.log('qqq: isConnected_? ', !!this.contextNode.root);
    return !!this.contextNode.root;
  }

  /** @private */
  update_() {
    console.log('qqq: update_');
    if (!this.isConnected_()) {
      // The node was disconnected at some point.
      console.log('qqq: update_: not connected');
      return;
    }
    const {node} = this.contextNode;
    const running = this.depValues_.every(defined);
    console.log('qqq: update_:', running, this.input_, this.depValues_);
    if (running) {
      this.running_ = true;
      this.refPointer_ = -1;
      withComponent(this, this.run_);
    } else if (this.running_) {
      this.running_ = false;
      this.cleanup_();
    }
  }

  /** @private */
  run_() {
    // Cleanup the previous run.
    if (this.runCleanup_) {
      protectedNoInline(this.runCleanup_);
      this.runCleanup_ = null;
    }

    // Run the component.
    const func = this.func_;
    this.runCleanup_ = func(this, this.input_, this.depValues_);
  }

  /**
   * @param {!ContextNode}
   * @private
   */
  cleanupPropNode_(contextNode) {//QQQ:rename
    console.log('qqq: root cleanup for ', contextNode.node.id);

    const nodeProps = this.nodeProps_;
    const props = nodeProps && nodeProps.get(contextNode);
    if (props) {
      nodeProps.delete(contextNode);
      props.forEach((prop) =>
        contextNode.values.remove(prop, /* setter */ this)
      );
    }

    const nodeComps = this.nodeComps_;
    const comps = nodeComps && nodeComps.get(contextNode);
    if (comps) {
      nodeComps.delete(contextNode);
      comps.forEach((id) => contextNode.removeComponent(id));
    }
  }

  /**
   * @param {boolean} cleanupProps QQQQ:rename
   * @private
   */
  cleanup_(cleanupProps) {
    console.log('qqq: cleanup: ', this.cleanups_?.length);

    // Remove all props.
    if (cleanupProps) {
      const nodeProps = this.nodeProps_;
      if (nodeProps) {
        nodeProps.forEach((props, contextNode) => {
          props.forEach((prop) => {
            console.log(
              'qqq: dispose: remove prop: ',
              prop.key,
              contextNode?.node?.id || 'self'
            );
            contextNode.values.remove(prop, this);
          });
        });
        this.nodeProps_ = null;
      }

      const nodeComps = this.nodeComps_;
      if (nodeComps) {
        nodeComps.forEach((comps, contextNode) => {
          comps.forEach((id) => {
            contextNode.removeComponent(id);
          });
        });
      }
    }

    // Run cleanups.
    if (this.runCleanup_) {
      protectedNoInline(this.runCleanup_);
      this.runCleanup_ = null;
    }
    const cleanups = this.cleanups_;
    if (cleanups) {
      for (let i = 0; i < cleanups.length; i++) {
        protectedNoInline(cleanups[i]);
      }
      this.cleanups_.length = 0;
    }
  }
}

/**
 * Whether the value is defined.
 *
 * This function only exists to avoid function allocation when calling
 * `Array.every()` and `Array.some()`.
 *
 * @param {*} v
 * @return {boolean}
 */
function defined(v) {
  return v !== undefined;
}
