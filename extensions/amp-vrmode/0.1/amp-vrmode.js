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

import {CSS} from '../../../build/amp-vrmode-0.1.css';
import {Layout} from '../../../src/layout';
import {historyFor} from '../../../src/history';
import * as st from '../../../src/style';

import {ViewManager} from './view';
import {ThreeView} from './three-view';
import {GalleryView} from './gallery';


class AmpVrmode extends AMP.BaseElement {

  /** @override */
  isLayoutSupported(layout) {
    return layout == Layout.NODISPLAY;
  }

  /** @override */
  buildCallback() {
    /** @private {!Element} */
    this.container_ = this.element.ownerDocument.createElement('div');
    this.applyFillContent(this.container_);
    this.element.appendChild(this.container_);

    this.registerAction('close', this.close.bind(this));

    /** @private {number} */
    this.historyId_ = -1;

    /** @private {boolean} */
    this.active_ = false;

    const startButton = this.win.document.createElement('button');
    startButton.classList.add('amp-vrmode-button');
    startButton.textContent = 'VRMODE';
    this.win.document.body.appendChild(startButton);
    startButton.addEventListener('click', () => {
      this.activate();
    });

    /**
     * @return {!Promise}
     */
    addScript = src => {
      return new Promise((resolve, reject) => {
        var script = this.win.document.createElement('script');
        script.onload = resolve;
        script.onerror = reject;
        script.src = src;
        this.win.document.head.appendChild(script);
      });
    }

    // TODO(dvoytenko): WAT!? Remove this craziness!!!
    /** @private @const {!Promise} */
    this.threePromise_ =
        addScript('/node_modules/three/build/three.js').then(() => {
          return Promise.all([
            addScript('https://toji.github.io/webvr-samples/js/third-party/webvr-polyfill.js'),
            addScript('/node_modules/three/examples/js/effects/StereoEffect.js'),
            addScript('/node_modules/three/examples/js/effects/VREffect.js'),
            addScript('/node_modules/three/examples/js/controls/DeviceOrientationControls.js'),
            addScript('/node_modules/three/examples/js/controls/OrbitControls.js'),
            addScript('/node_modules/three/examples/js/controls/TrackballControls.js'),
            addScript('/node_modules/three/examples/js/renderers/Projector.js'),
          ]);
        }).then(() => {
          console.log('THREE loaded.');
        }, error => {
          console.log('THREE load failed: ', error);
        });
  }

  /** @override */
  layoutCallback() {
    return Promise.resolve();
  }

  /** @override */
  activate() {
    if (this.active_) {
      return;
    }
    /**  @private {function(this:AmpVrmode, Event)}*/
    this.boundCloseOnEscape_ = this.closeOnEscape_.bind(this);
    this.win.document.documentElement.addEventListener(
        'keydown', this.boundCloseOnEscape_);
    this.getViewport().enterLightboxMode();

    this.mutateElement(() => {
      this.element.style.display = '';
    });

    this.getHistory_().push(this.close.bind(this)).then(historyId => {
      this.historyId_ = historyId;
    });

    this.active_ = true;

    this.threePromise_.then(() => {
      this.construct_();
    });
  }

  /**
   * Handles closing the vrmode when the ESC key is pressed.
   * @param {!Event} event.
   * @private
   */
  closeOnEscape_(event) {
    if (event.keyCode == 27) {
      this.close();
    }
  }

  close() {
    if (!this.active_) {
      return;
    }
    this.getViewport().leaveLightboxMode();
    this.element.style.display = 'none';
    if (this.historyId_ != -1) {
      this.getHistory_().pop(this.historyId_);
    }
    this.win.document.documentElement.removeEventListener(
        'keydown', this.boundCloseOnEscape_);
    this.boundCloseOnEscape_ = null;
    this.active_ = false;
  }

  getHistory_() {
    return historyFor(this.element.ownerDocument.defaultView);
  }

  /**
   * @private
   */
  construct_() {
    /** @private @const {!ViewManager} */
    this.viewManager_ = new ViewManager(this.win, this.container_);
    this.viewManager_.openPush(new GalleryView());
  }
}

AMP.registerElement('amp-vrmode', AmpVrmode, CSS);
