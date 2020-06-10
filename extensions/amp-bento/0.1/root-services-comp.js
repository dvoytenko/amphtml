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

import {ContextNode, RenderableProp, contextProp} from '../../../src/context';
import {Deferred} from '../../../src/utils/promise';

// comp_problem:
// 1. how to express ordering?
// 2. how to pre-install root factories? E.g. a queue or a size-measurer? This
//    is necessary to split default contexts between roots.
// 3. a lot of unmounts.
// 4. difficult transition path vs a neutral api.
// 5. how much code will have to go into the "shared bundle"? need the
//    "import-like" first-install-wins system. This system strictly relies
//    on correct and shared bundling!!! At least for any
//    `export const context = createContext(...)`.
// 5.b. Some components may need to be in shared bundle too. E.g. for API
//      `add(Component, props)` that would be keyed to `Component` identity.
//      Maybe `AmpPreact.sharedComponent()` and `AmpPreact.sharedContext()`?
// 6. hard to build lazy loading.
// 7. fake dom
// 8. mental model
// 9. one-flush queue
// 10. tighter coupling: have to combine props together. e.g. Renderable and
//     Playable to exporess `Playable = f(input, Renderable)`. This is because
//     Context.Consumer has no notion of computation.
// 11. context values are hidden and hard to debug.
// 12. context default vs provider: automatically block on non-availability.

export function installRootServices(ampdoc) {
  console.log('RootServices: init');
  const contextRoot = ContextNode.get(ampdoc.getRootNode());

  // Visibility.
  contextRoot.add(RootVisibilityProvider, {ampdoc});

  // Base URI.
  contextRoot.add(BaseUriContext.Provider, {value: ampdoc.getUrl()});
}

function RootVisibilityProvider({ampdoc, children}) {
  const [visibilityState, setVisibilityState] = useState(ampdoc.getVisibilityState());
  useEffect(() => {
    return ampdoc.onVisibilityChanged(() =>
      setVisibilityState(ampdoc.getVisibilityState());
    );
  }, [ampdoc]);
  return (
    <RootVisibilityContext.Provider value={visibilityState}>
      <RenderableProvider renderable={visibilityState == 'visible'}>
        {children}
      </RenderableProvider>
    </RootVisibilityContext.Provider>
  );
}

function RenderableProvider({comp_problem_node, renderable, children}) {
  const [renderable, setRenderable] = useState(renderable);
  const parent = useContext(RenderableContext);
  const measureSize = useContext(MeasureSizeContext);
  const hierResult = parent && renderable;
  if (parent && renderable) {
    // May or may not be renderable: need to measure.
    // comp_problem: too many remeasurements?
    measureSize(problem_node).then((size) => {
      setRenderable((prevRenderable) => {
        return prevRenderable && (size.width > 0 && size.height > 0);
      });
    });
  } else {
    // The answer is already known: no need to measure.
    setRenderable(false);
  }
  return (
    <RenderableContext.Provider value={renderable}>
      {children}
    </RenderableContext.Provider>
  );
}

function LightboxComponent({children}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <RenderableProvider renderable={isOpen}>
      {children}
    </RenderableProvider>
  );
}

function MeasureSizeProvider({children}) {
  // comp_problem: This ref will be completely reset the queue and InOb
  // each time the tree is shuffled.

  const scheduledRef = useRef(null);
  const ioRef = useRef(null);

  // Cleanup InOb on unmount.
  useEffect(() => {
    return () => {
      const io = ioRef.current;
      if (io) {
        io.disconnect();
      }
    };
  }, []);

  const measureSize = useCallback((element) => {
    const scheduled =
      scheduledRef.current ??
      (scheduledRef.current = typeof WeakMap == 'function' ? new WeakMap() : new Map());
    const io =
      ioRef ??
      (ioRef.current = new IntersectionObserver((records) => {
        const {target, boundingClientRect: {width, height}} = records[i];
        const deferred = scheduled.get(target);
        if (deferred) {
          deferred.resolve({width, height});
          scheduled.delete(target);
          io.unobserve(target);
        }
      }));
    let deferred = scheduled.get(node);
    if (!deferred) {
      deferred = new Deferred();
      scheduled.set(node, deferred);
      io.observe(node);
    }
    return deferred.promise;
  }, []);

  return (
    <MeasureSizeContext value={measureSize}>
      {children}
    </MeasureSizeContext>
  );
}

function AmpPreactBaseComponent({comp_problem_node, impl, children}) {
  const Name = comp_problem_node.tagName.toLowerCase();
  const Impl = impl;

  const [container, setContainer] = useState(null);
  const [implProps, setImplProps] = useState({});

  useLayoutEffect(() => {
    if (Impl.shadow) {
      setContainer(comp_problem_node.attachShadow({mode: 'open'}));
    } else {
      setContainer(comp_problem_node);
    }

    const mo = new MutationObserver((records) => {
      // Collect props from DOM, including children.
      const newProps = null;
      setImplProps(newProps);
    });
    mo.observe(comp_problem_node);
    return () => {
      mo.disconnect();
    };
  }, [Impl]);

  const loader = useContext(LoaderContext);
  useEffect(() => {
    return loader.schedule(comp_problem_node);
  }, [loader]);

  return (
    <Name>
      {Impl && container ?
        createPortal(
          <Impl {...implProps} />
          container
        ) : null
      }
      {/* Render unclaimed children */}
      <RenderableProvider renderable={false}>
        {children}
      </RenderableProvider>
    </Name>
  );
}

function WithLoadingIndicator({comp_problem_node, children}) {
  return (
    <Fragment>
      {children}
      {createPortal(
        <LoadingIndicator />
        comp_problem_node
      )}
    </Fragment>
  );
}

export class LoadingIndicatorService {
  toggle(contextNode, loading) {
    switch (loading) {
      case 'on':
        contextNode.set(WithLoadingIndicator, {on: true});
      case 'off':
        contextNode.set(WithLoadingIndicator, {on: false});
      case 'gone';
        contextNode.remove(WithLoadingIndicator);
    }
  }
}
