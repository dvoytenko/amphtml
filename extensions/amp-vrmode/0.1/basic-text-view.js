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

import {TextImage} from './text-image';
import {ThreeView} from './three-view';
import {View} from './view';


export class BasicTextView extends ThreeView {

  constructor(vrInfo) {
    super();
    /** @const {!VrInfo} */
    this.vrInfo = vrInfo;
    /** @private @const {!TextImage} */
    this.textImage_ = new TextImage();
  }

  /** @override */
  createCamera() {
    const camera = new THREE.PerspectiveCamera(90, 1, 0.001, 700);
    return camera;
  }

  /** @override */
  constructScene() {
    console.log('Text: ', this.vrInfo.source);

    // Fog
    this.scene.fog = new THREE.Fog(0xffffff, 2000, 10000);

    // Lighting
    const light = new THREE.DirectionalLight(0xffffff);
    light.position.set(0, 1, 1).normalize();
    this.scene.add(light);

    // Image
    const geometry = new THREE.PlaneGeometry(1, 1);
    const material = new THREE.MeshPhongMaterial({
      map: THREE.ImageUtils.loadTexture(
          this.textImage_.getImageUrl(this.vrInfo.source))
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = 0;
    mesh.position.y = 0;
    mesh.position.z = 0;
    mesh.lookAt(this.camera.position);
    this.scene.add(mesh);
    /** @private @const {!THREE.Mesh} */
    this.mesh_ = mesh;

    this.getElement().addEventListener('click', this.handleClick_.bind(this));
  }

  /** @override */
  resize(width, height) {
    // const dist = Math.min(width, height * this.vrInfo.aspect);
    this.mesh_.position.z = -1;
  }

  /** @private */
  handleClick_() {
    this.viewManager.close(this);
  }
}
