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

import {devAssert} from '../log';

const EMPTY_DEPS = [];

export function withMetaData(...args) {
  let func, deps, key;
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (typeof arg == 'function') {
      func = arg;
    } else if (typeof arg == 'string') {
      key = arg;
    } else {
      deps = arg;
    }
  }
  devAssert(func);
  return setMetaData(func, deps, key);
}

export function getDeps(func) {
  return func['deps'] || EMPTY_DEPS;
}

// QQQQ: rename to ID?
export function getKey(func) {
  return func['key'] || func;
}

function setMetaData(func, deps, key) {
  if (deps) {
    func['deps'] = deps;
  }
  if (key) {
    func['key'] = key;
  }
  return func;
}
