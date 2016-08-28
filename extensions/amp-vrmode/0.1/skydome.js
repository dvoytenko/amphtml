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

export class SkyDome {

  constructor(source) {
    /** @const {string} */
    this.source = source;
  }

  /** */
  create() {
    const geometry = new THREE.SphereGeometry(100, 32, 32);
    const uniforms = {
      texture: {
        type: 't',
        value: THREE.ImageUtils.loadTexture(this.source),
      }
    };

    const material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: `
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
    skyBox.rotation.y = Math.PI;
    skyBox.scale.set(-1, 1, 1);
    skyBox.eulerOrder = 'XZY';
    skyBox.renderDepth = 50.0;
    return skyBox;
  }
}
