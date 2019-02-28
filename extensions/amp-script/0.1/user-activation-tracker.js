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


// TODO: move to utils/?

export const ACTIVATION_TIMEOUT = 5000;  // 5 seconds.

const ACTIVATION_EVENTS = ['click', 'input', 'dblclick', 'keypress', 'submit'];


/**
 * See https://github.com/dtapuska/useractivation for inspiration.
 */
export class UserActivationTracker {

  /**
   * @param {!Element} root
   */
  constructor(root) {
    /** @private @const */
    this.root_ = root;
    /** @private @const */
    this.boundActivated_ = this.activated_.bind(this);
    /** @private {number} */
    this.lastActivationTime_ = 0;

    ACTIVATION_EVENTS.forEach(type => {
      this.root_.addEventListener(
          type,
          this.boundActivated_,
          /* capture */ true);
    });
  }

  destroy() {
    ACTIVATION_EVENTS.forEach(type => {
      this.root_.removeEventListener(
          type,
          this.boundActivated_,
          /* capture */ true);
    });
  }

  /**
   * @return {boolean}
   */
  hasBeenActive() {
    return this.lastActivationTime_ > 0;
  }

  /**
   * @return {boolean}
   */
  isActive() {
    return Date.now() - this.lastActivationTime_ <= ACTIVATION_TIMEOUT;
  }

  /** @private */
  activated_() {
    this.lastActivationTime_ = Date.now();
  }
}
