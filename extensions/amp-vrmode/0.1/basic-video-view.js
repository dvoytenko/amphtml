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

export class BasicVideoView extends ThreeView {

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
  constructScene() {
    // Fog
    this.scene.fog = new THREE.Fog(0xffffff, 2000, 10000);

    // Lighting
    const light = new THREE.DirectionalLight( 0xffffff );
    light.position.set( 0, 1, 1 ).normalize();
    this.scene.add(light);

    /** @const {!HTMLVideoElement} */
    this.video = document.createElement('video');
    this.video.style.visibility = 'hidden';
    /* debug:
    this.video.style.position = 'fixed';
    this.video.style.top = 0;
    this.video.style.left = 0;
    this.video.style.zIndex = 10000000;
    */
    document.body.appendChild(this.video);
    this.video.src = this.vrInfo.source;
    /** @private @const {!Promise} */
    this.playPromise_ = this.video.play();

    // Video
    const videoTexture = new THREE.VideoTexture(this.video);
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;
    videoTexture.format = THREE.RGBFormat;
    videoTexture.generateMipmaps = false;
    videoTexture.needsUpdate = true;

    const geometry = this.createGeometry_();

    const material = new THREE.MeshBasicMaterial({map: videoTexture});
    /* Distorter?
      this.distorter.setMap(texture);
     */

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = 0;
    mesh.position.y = 0;
    mesh.position.z = -1;
    mesh.lookAt(this.camera.position);
    this.scene.add(mesh);

    /** @private @const {!THREE.Mesh} */
    this.mesh_ = mesh;

    this.getElement().addEventListener('click', this.handleClick_.bind(this));
  }

  /**
   * @return {!THREE.Geometry}
   * @private
   */
  createGeometry_() {
    return new THREE.PlaneGeometry(1, 1 / this.vrInfo.aspect);

    /* With spherical distortion
    const p = {};
    p.scaleX = p.scaleX || 1;
    p.scaleY = p.scaleY || 1 / this.vrInfo.aspect;
    p.offsetX = p.offsetX || 0;
    p.offsetY = p.offsetY || 0;
    p.phiStart = p.phiStart || 0;
    p.phiLength = p.phiLength || Math.PI * 2;
    p.thetaStart = p.thetaStart || 0;
    p.thetaLength = p.thetaLength || Math.PI;

    const geometry = new THREE.SphereGeometry(1, 48, 48,
        p.phiStart, p.phiLength, p.thetaStart, p.thetaLength);
    geometry.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1));
    const uvs = geometry.faceVertexUvs[0];
    for (let i = 0; i < uvs.length; i ++) {
      for (let j = 0; j < 3; j ++) {
        uvs[i][j].x *= p.scaleX;
        uvs[i][j].x += p.offsetX;
        uvs[i][j].y *= p.scaleY;
        uvs[i][j].y += p.offsetY;
      }
    }
    return geometry;
    */
  }

  /** @override */
  stop() {
    super.stop();
    this.video.pause();
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
