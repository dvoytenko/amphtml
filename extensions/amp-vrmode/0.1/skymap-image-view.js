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

export class SkyMapImageView extends ThreeView {

  constructor(vrInfo) {
    super();
    /** @const {!VrInfo} */
    this.vrInfo = vrInfo;
  }

  /** @override */
  createCamera() {
    const camera = new THREE.PerspectiveCamera(90, 1, 0.001, 700);
    return camera;
  }

  /** @override */
  createControls(element) {
    const bestType = this.viewManager.getBestControlsDeviceType();

    // Cardboard: use device orientation.
    if (bestType == 'cardboard') {
      return new THREE.DeviceOrientationControls(this.camera, true);
    }

    // Most likely only "mouse" left: use basic orbit controls.
    const controls = new THREE.OrbitControls(this.camera, element);
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.autoRotate = false;
    controls.target.set(-0.1, 0.1 * 0, -1);
    return controls;
  }

  /** @override */
  constructScene() {
    // Fog
    this.scene.fog = new THREE.Fog(0xffffff, 2000, 10000);

    // Lighting
    const light = new THREE.DirectionalLight( 0xffffff );
    light.position.set( 0, 1, 1 ).normalize();
    this.scene.add(light);

    const geometry = new THREE.SphereGeometry(50, 32, 32);
    const uniforms = {
      texture: {
        type: 't',
        value: THREE.ImageUtils.loadTexture(this.vrInfo.source)
      }
    };

    const material = new THREE.ShaderMaterial({
      uniforms:       uniforms,
      vertexShader:   `
          varying vec2 vUV;
          void main() {
            vUV = uv;
            vec4 pos = vec4(position, 1.0);
            gl_Position = projectionMatrix * modelViewMatrix * pos;
          }
          `,
      fragmentShader: `
          uniform sampler2D texture;
          varying vec2 vUV;
          void main() {
            vec4 sample = texture2D(texture, vUV);
            gl_FragColor = vec4(sample.xyz, sample.w);
          }
          `,
    });

    const skyBox = new THREE.Mesh(geometry, material);
    skyBox.scale.set(-1, 1, 1);
    skyBox.eulerOrder = 'XZY';
    skyBox.renderDepth = 100.0;
    this.scene.add(skyBox);

    this.getElement().addEventListener('click', this.handleClick_.bind(this));
  }

  /** @override */
  resize(width, height) {
    // const dist = Math.min(width, height * this.vrInfo.aspect);
    // this.mesh_.position.z = -1;
  }

  /** @private */
  handleClick_() {
    this.viewManager.close(this);
  }
}
