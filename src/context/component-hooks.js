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
import {protectedNoInline} from './scheduler';
import {withMetaData, getDeps, getKey} from './component-meta';

/**
 * @type {!ComponentImpl|undefined}
 */
let currentComponent;

export function withComponent(component, callback) {
  currentComponent = component;
  try {
    callback();
  } finally {
    currentComponent = undefined;
  }
}

function getComponent() {
  return devAssert(currentComponent);
}

export function useComponentCallback(callback) {
  const ref = useRef();
  if (!ref.current) {
    const component = getComponent();
    ref.current = callback.bind(null, component);
  }
  return ref.current;
}

export function useRef(def = undefined) {
  return getComponent().allocRef(def);
}

export function useMemo(compute, deps = []) {
  const ref = useRef();
  useSyncEffect(() => {
    ref.current = compute();
  }, deps);
  return ref.current;
}

export function useSetProp() {
  return getComponent().setProp;
}

export function useRemoveProp() {
  return getComponent().removeProp;
}

export function useFactory(factory, deps = []) {
  const component = getComponent();
  const ref = component.allocRef();
  console.log('qqqq: useFactory: ', !!ref.current);
  // QQQ: optimize function re-alloc?
  useSyncEffect(() => {
    console.log('qqqq: call factory');
    const {value, disconnect} = factory(component.contextNode.node, ...deps);
    console.log(
      'qqqq: factory result: ',
      value,
      '; has cleanup: ',
      !!disconnect
    );
    ref.current = value;
    return () => {
      ref.current = undefined;
      if (disconnect) {
        disconnect();
      }
    };
  }, deps);
  return ref.current;
}

export function useSyncEffect(callback, deps = []) {
  const component = getComponent();
  const depRef = component.allocRef();
  const cleanupRef = component.allocRef();
  if (!depRef.current) {
    // Mounting.
    component.pushCleanup(() => {
      depRef.current = undefined;
      cleanupRef.current = undefined;
    });
  }
  const changed = !depRef.current || !eq(depRef.current, deps);
  if (changed) {
    depRef.current = deps.slice(0);

    // Cleanup.
    const cleanup = cleanupRef.current;
    if (cleanup) {
      cleanupRef.current = null;
      component.popCleanup(cleanup);
      protectedNoInline(cleanup);
    }

    const newCleanup = callback(...deps);
    if (newCleanup) {
      cleanupRef.current = newCleanup;
      component.pushCleanup(newCleanup);
    }
  }
}

function eq(a1, a2) {
  if (a1.length != a2.length) {
    return false;
  }
  for (let i = 0; i < a1.length; i++) {
    if (a1[i] !== a2[i]) {
      return false;
    }
  }
  return true;
}
