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

    /** @private @const {!THREE.WebGLRenderer} */
    this.renderer_ = new THREE.WebGLRenderer();
    if (this.win.devicePixelRatio) {
      this.renderer_.setPixelRatio(this.win.devicePixelRatio);
    }

    /** @private @const {!Element} */
    this.renderElement_ = this.renderer_.domElement;

    /** @private @const {!THREE.WebGLRenderer} */
    this.effect_ = this.renderer_;
    // TODO(dvoytenko): enable stereo effect:
    // `new THREE.StereoEffect(this.renderer_)`

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

    this.constructScene();

    return this.renderElement_;
  }

  getElement() {
    return this.renderElement_;
  }

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

  stop() {
    if (!this.running_) {
      return;
    }
    this.running_ = false;
    this.clock_.stop();
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
      if (this.controls) {
        this.controls.update(delta);
      }
      this.update(delta);
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
}
