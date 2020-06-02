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

import {ComponentImpl} from './component-impl';
import {ContextNode} from './node';
import {devAssert, rethrowAsync} from '../log';
import {findIndex, pushIfNotExist, removeItem} from '../utils/array';
import {isArray} from '../types';
import {
  useCallback,
  useComponentCallback,
  useFactory,
  useProps,
  useRef,
  useSyncEffect,
} from './component-hooks';
import {throttleTail} from './scheduler';
import {withMetaData, getDeps, getKey} from './component-meta';

export function setComponent(node, func, input) {
  setComponentInternal(node, componentWithInputFactory, func, input);
}

export function removeComponent(node, func) {
  const id = getKey(func) || func;
  const contextNode = ContextNode.get(node);
  contextNode.removeComponent(id);
}

export function useSetComponent() {
  return useComponentCallback(setUseSetComponentCallback);
}

export function useRemoveComponent() {
  return useComponentCallback(setUseRemoveComponentCallback);
}

// QQQ: rename to installService or installDisposable or install() or remove
export function installFactory(node, factory) {
  const componentFactory = (id, contextNode, factory, deps) => {
    const comp = (component, unusedInput, deps) => {
      useFactory(factory, deps);
    };
    return new ComponentImpl(id, contextNode, comp, deps);
  };
  setComponentInternal(node, componentFactory, factory);
}

export function uninstallFactory(node, factory) {
  removeComponent(node, factory);
}

export function installFactoryForProp(node, prop, factory) {
  const componentFactory = (id, contextNode, factory, deps) => {
    const comp = (component, input, depValues) => {
      const value = useFactory(factory, depValues);
      useSyncEffect(() => {
        component.setProp(prop, value);
        return () => component.removeProp(prop);
      }, [value]);
    };
    return new ComponentImpl(id, contextNode, comp, deps);
  };
  setComponentInternal(node, componentFactory, factory);
}

export function uninstallFactoryForProp(node, prop, factory) {
  uninstallFactory(node, factory);
}

export function subscribe(node, deps, callback) {
  const id = callback;
  deps = isArray(deps) ? deps : [deps];
  const contextNode = ContextNode.get(node);
  contextNode.setComponent(id, subscriberFactory, callback, deps);
}

export function unsubscribe(node, callback) {
  const id = callback;
  removeComponent(node, id);
}

function setComponentInternal(node, factory, func, input) {
  const id = getKey(func);
  const deps = getDeps(func);
  console.log('qqqq: setComponent: ', factory.name, id.name || id, deps.map((dep) => dep.key));
  const contextNode = ContextNode.get(node);
  contextNode.setComponent(id, factory, func, deps, input);
}

function setUseSetComponentCallback(component, func, input, node) {
  setChildComponentInternal(component, componentWithInputFactory, func, input, node);
}

function setChildComponentInternal(component, factory, func, input, node = null) {
  const id = getKey(func);
  const deps = getDeps(func);
  console.log('qqqq: component.setComponent: ', factory.name, id.name || id, deps.map((dep) => dep.key));
  component.setComponent(id, factory, func, deps, input, node);
}

function setUseRemoveComponentCallback(component, func, node) {
  const id = getKey(func);
  component.removeComponent(id, node);
}

function componentWithInputFactory(id, contextNode, func, deps) {
  const comp = (component, input, deps) => {
    const {node} = component.contextNode;
    switch (deps.length) {
      case 0:
        return func(node, input);
      case 1:
        return func(node, input, deps[0]);
      case 2:
        return func(node, input, deps[0], deps[1]);
      case 3:
        return func(node, input, deps[0], deps[1], deps[2]);
      default:
        return func.call(null, [node, input].concat(deps));
    }
  };
  return new ComponentImpl(id, contextNode, comp, deps);
}

function subscriberFactory(id, contextNode, callback, deps) {
  const comp = (component, unusedInput, deps) => {
    switch (deps.length) {
      case 0:
        return callback();
      case 1:
        return callback(deps[0]);
      case 2:
        return callback(deps[0], deps[1]);
      case 3:
        return callback(deps[0], deps[1], deps[2]);
      default:
        return callback.call(null, deps);
    }
  };
  return new ComponentImpl(id, contextNode, comp, deps);
}
