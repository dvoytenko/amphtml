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

import {View} from './view';
import {dev} from '../../../src/log';
import {getCurve} from '../../../src/curve';
import {vsyncFor} from '../../../src/vsync';


/**
 */
export class ThreeView extends View {

  /** @override */
  build() {
    /** @private @const {!Vsync} */
    this.vsync_ = vsyncFor(this.win);

    /** @private {boolean} */
    this.running_ = false;

    /** @private {boolean} */
    this.animating_ = false;

    /** @private @const {!THREE.Clock} */
    this.clock_ = new THREE.Clock();

    /** @private @const {!Array<!AnimationDef>} */
    this.animations_ = [];

    /** @private @const {!THREE.WebGLRenderer} */
    this.renderer_ = new THREE.WebGLRenderer();
    if (this.win.devicePixelRatio) {
      this.renderer_.setPixelRatio(this.win.devicePixelRatio);
    }

    /** @private @const {!Element} */
    this.renderElement_ = this.renderer_.domElement;

    /** @private @const {!THREE.WebGLRenderer} */
    this.effect_ = this.viewManager.stereo ?
        new THREE.StereoEffect(this.renderer_) :
        this.renderer_;

    /** @private {number} */
    this.width_ = 0;

    /** @private {number} */
    this.height_ = 0;

    /** @protected @const {!THREE.Scene} */
    this.scene = new THREE.Scene();

    /** @protected @const {!THREE.Camera} */
    this.camera = this.createCamera();
    this.scene.add(this.camera);

    /** @protected @const {?THREE.Controls} */
    this.controls = this.createControls(this.renderElement_);
    if (this.controls && this.controls.connect) {
      this.controls.connect();
    }

    /** @protected {boolean} */
    this.controlsState = true;

    this.constructScene();

    return this.renderElement_;
  }

  /** @override */
  getElement() {
    return this.renderElement_;
  }

  /** @override */
  start() {
    if (this.running_) {
      return;
    }
    console.log('start');
    this.running_ = true;
    this.resize_();
    this.clock_.start();
    this.animate_();
  }

  /** @override */
  stop() {
    if (!this.running_) {
      return;
    }
    this.running_ = false;
    this.clock_.stop();
  }

  /**
   */
  render() {
    this.resize_();
    this.vsync_.mutate(() => {
      this.camera.updateProjectionMatrix();
      if (this.controls && this.controlsState) {
        this.controls.update(0);
      }
      this.update(0);
      this.effect_.render(this.scene, this.camera);
    });
  }

  /** @override */
  resizeElement() {
    this.resize_();
  }

  /** @return {number} */
  getWidth() {
    return this.width_;
  }

  /** @return {number} */
  getHeight() {
    return this.height_;
  }

  /** @private */
  resize_() {
    const width = this.win.innerWidth;
    const height = this.win.innerHeight;
    console.log('new size: ', width, height);
    this.effect_.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.resize(width, height);
    this.width_ = width;
    this.height_ = height;
  }

  /** @private */
  animate_() {
    if (this.animating_) {
      return;
    }
    this.vsync_.mutate(() => {
      this.animating_ = false;
      const delta = this.clock_.getDelta();
      this.camera.updateProjectionMatrix();
      if (this.controls && this.controlsState) {
        this.controls.update(delta);
      }
      this.update(delta);
      this.runAnimations_();
      this.effect_.render(this.scene, this.camera);
      if (this.running_) {
        this.animate_();
      }
    });
  }

  /**
   * @return {!THREE.Camera}
   * @protected
   */
  createCamera() {
    return dev.assert(null, 'not implement');
  }

  /**
   * @param {!Element} element
   * @return {?THREE.Controls}
   * @protected
   */
  createControls(element) {
    return null;
  }

  /** @protected */
  constructScene() {
    dev.assert(null, 'not implement');
  }

  /**
   * @param {number} width
   * @param {number} height
   * @protected
   */
  resize(width, height) {}

  /**
   * @param {number} delta
   * @protected
   */
  update(delta) {}

  /**
   * @param {boolean} state
   * @protected
   */
  setControlsState(state) {
    this.controlsState = state;
  }

  /**
   * @param {function(number)} callback
   * @param {number} duration In seconds.
   * @param {!CurveDef=} opt_curve
   * @param {function()=} opt_onDone
   * @protected
   */
  startAnimation(callback, duration, opt_curve, opt_onDone) {
    if (duration <= 0) {
      callback(1);
      return;
    }
    this.animations_.push({
      callback: callback,
      duration: duration,
      curve: opt_curve ? getCurve(opt_curve) : null,
      onDone: opt_onDone || null,
      startTime: this.clock_.getElapsedTime(),
    });
  }

  /** @private */
  runAnimations_() {
    if (this.animations_.length == 0) {
      return;
    }
    const now = this.clock_.getElapsedTime();
    let toRemove = null;
    for (let i = 0; i < this.animations_.length; i++) {
      const anim = this.animations_[i];
      const time = Math.min((now - anim.startTime) / anim.duration, 1);
      const curveTime = Math.min(
          (time >= 1 || !anim.curve) ? time : anim.curve(time),
          1);
      anim.callback(curveTime);
      if (time >= 1) {
        if (toRemove) {
          toRemove.push(i);
        } else {
          toRemove = [i];
        }
        if (anim.onDone) {
          anim.onDone();
        }
      }
    }
    if (toRemove) {
      for (let i = toRemove.length - 1; i >= 0; i--) {
        const index = toRemove[i];
        this.animations_.splice(index, 1);
      }
    }
  }
}


/**
 * @typedef {{
 *   duration: number,
 *   curve: (function(numnber):number|null),
 *   callback: function(number),
 *   startTime: number,
 * }}
 */
let AnimationDef;
