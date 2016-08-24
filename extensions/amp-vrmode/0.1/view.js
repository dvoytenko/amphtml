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

import {dev} from '../../../src/log';
import {historyFor} from '../../../src/history';
import {toggle} from '../../../src/style';


/**
 */
export class ViewManager {

  constructor(win, container, stereo, vrDevices) {
    /** @const {!Window} */
    this.win = win;

    /** @const {boolean} */
    this.stereo = stereo;

    /** @const {!Array<!VRDisplay>} */
    this.vrDevices = vrDevices;

    /** @const {!History} */
    this.history_ = historyFor(win);

    /** @private @const {!Element} */
    this.container_ = container;

    /** @private @const {!View} */
    this.stack_ = [];

    /** @private @const {!Element} */
    this.elements_ = [];

    this.win.addEventListener('resize', () => this.resizeAll_());
  }

  /**
   * @return {string}
   */
  getBestControlsDeviceType() {
    for (let i = 0; i < this.vrDevices.length; i++) {
      const device = this.vrDevices[i];
      if ((device.displayName || '').indexOf('Cardboard') != -1) {
        return 'cardboard';
      }
    }
    return 'mouse';
  }

  /** */
  stop() {
    for (let i = 0; i < this.stack_.length; i++) {
      this.stack_[i].stop();
    }
  }

  /**
   * @param {!View} view
   */
  initView(view) {
    const element = view.buildIfNeeded(this);
    dev.assert(element);
    toggle(element, false);
    if (!element.parentElement) {
      this.container_.appendChild(element);
    }
  }

  /**
   * @param {!View} view
   */
  openPush(view) {
    this.openView_(view);
    if (this.stack_.length > 1) {
      this.history_.push(() => {
        this.close(view);
      });
    }
  }

  /**
   * @param {!View} view
   */
  openReplace(view) {
    if (this.stack_.length > 1) {
      this.closeView_(this.stack_[this.stack_.length - 1], true);
    }
    this.openView_(view);
  }

  /**
   * @param {!View} view
   */
  close(view) {
    const currentView = this.stack_.length > 0 &&
        this.stack_[this.stack_.length - 1];
    this.closeView_(view, true);
    if (view == currentView && this.stack_.length > 0) {
      this.showView_(this.stack_[this.stack_.length - 1]);
    }
  }

  /**
   * @param {!View} view
   * @private
   */
  openView_(view) {
    this.initView(view);
    this.stack_.push(view);
    this.showView_(view);
  }

  /**
   * @param {!View} view
   * @param {boolean} remove
   * @private
   */
  closeView_(view, remove) {
    this.hideView_(view, remove);
    const index = this.stack_.indexOf(view);
    if (index != -1) {
      this.stack_.splice(index, 1);
    }
  }

  /**
   * @param {!View} view
   * @private
   */
  showView_(view) {
    let element = view.getElement();
    dev.assert(element, 'element not created');

    let found = false;
    for (let i = 0; i < this.elements_.length; i++) {
      if (this.elements_[i] != element) {
        toggle(this.elements_[i], false);
      } else {
        found = true;
      }
    }
    if (!found) {
      this.elements_.push(element);
    }
    toggle(element, true);
    view.start();
  }

  /**
   * @param {!View} view
   * @param {boolean} remove
   * @private
   */
  hideView_(view, remove) {
    let element = view.getElement();
    dev.assert(element, 'element not created');

    view.stop();
    toggle(element, false);

    if (remove) {
      const index = this.elements_.indexOf(element);
      if (index != -1) {
        this.elements_.splice(index, 1);
      }
      if (element.parentElement == this.container_) {
        this.container_.removeChild(element);
      }
    }
  }

  /** @private */
  resizeAll_() {
    for (let i = this.stack_.length - 1; i >= 0; i--) {
      this.stack_[i].resizeElement();
    }
  }
}


/**
 */
export class View {

  constructor() {
    /** @private {boolean} */
    this.built_ = false;
  }

  /**
   * @return {boolean}
   */
  isBuilt() {
    return this.built_;
  }

  /** */
  buildIfNeeded(viewManager) {
    if (!this.built_) {
      /** @protected @const {!ViewManager} */
      this.viewManager = viewManager;
      /** @protected @const {!Window} */
      this.win = viewManager.win;

      this.build();
      this.built_ = true;
    }
    return this.getElement();
  }

  /** */
  build() {
    dev.assert(null, 'not implemented');
  }

  /**
   * @return {!Element}
   */
  getElement() {
    return dev.assert(null, 'not implemented');
  }

  /** */
  start() {}

  /** */
  resizeElement() {}

  /** */
  stop() {}
}
