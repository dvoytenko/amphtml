/**
 * Copyright 2019 The AMP HTML Authors. All Rights Reserved.
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

import {useAmpContext} from '../context';

// QQQ: find the right home.
// QQQ: combine with `element.loading`? "auto" might mean different things:
// - LoadRule=auto - eager.
// - loading=auto - lazy.
/** @enum {string} */
const LoadRule = {
  AUTO: 'auto',
  LAZY: 'lazy',
  UNLOAD: 'unload',
};


/**
 * @param {!Object} props
 * @return {{load: boolean, onLoad: function(), onLoadError: function(?)}}
 */
export function useLoad(props) {
  const {
    'loading': loadingProp,
    'onLoad': onLoad,
    'onLoadError': onLoadError,
  } = props;

  const {
    'loading': loadingContext,
    'renderable': renderable,
  } = useAmpContext();

  const loading =
    (loadingProp && loadingProp !== 'auto' ? loadingProp : loadingContext) ||
    'auto';

  const load =
    loading == 'eager' ||
    loading == 'auto' && renderable;

  return {load, onLoad, onLoadError};
}
