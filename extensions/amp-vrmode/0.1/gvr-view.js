/**
 * Copyright 2016 The AMP HTML Authors. All Rights Reserved.
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

import {ThreeView} from './three-view';
import {View} from './view';
import {addParamToUrl} from '../../../src/url';
import * as st from '../../../src/style';


export class GvrView extends View {

  constructor(vrInfo) {
    super();
    /** @const {!VrInfo} */
    this.vrInfo = vrInfo;
  }

  /** @override */
  build() {

    const iframe = document.createElement('iframe');
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('allowfullscreen', 'true');
    iframe.width = '100%';
    iframe.height = '100%';
    iframe.onload = () => {
      // Chrome does not reflect the iframe readystate.
      iframe.readyState = 'complete';
    };

    st.setStyles(iframe, {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1,
    });

    let imageSrc = this.vrInfo.source;
    let src = 'https://storage.googleapis.com/vrview/index.html';
    src = addParamToUrl(src, 'image', imageSrc);
    src = addParamToUrl(src, 'is_stereo', 'true');
    src = addParamToUrl(src, 'start_mode', '3');
    iframe.setAttribute('src', src);

    /** @const {!Element} */
    this.iframe = iframe;
  }

  /** @override */
  getElement() {
    return this.iframe;
  }
}
