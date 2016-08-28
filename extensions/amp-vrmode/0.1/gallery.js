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

import {BasicImageView} from './basic-image-view';
import {BasicTextView} from './basic-text-view';
import {BasicVideoView} from './basic-video-view';
import {GvrView} from './gvr-view';
import {SkyMapImageView} from './skymap-image-view';
import {TextImage} from './text-image';
import {ThreeView} from './three-view';
import {View} from './view';
import {toArray} from '../../../src/types';
import * as tr from '../../../src/transition';


export class GalleryView extends ThreeView {

  constructor() {
    super();

    /** @const {number} */
    this.scale = 3;
  }

  /** @override */
  createCamera() {
    /** @const {!Cursor} */
    this.cursor = new Cursor(0.1 * this.scale);
    const cursor3d = this.cursor.object3d;
    cursor3d.position.z = -3 * this.scale;
    const camera = new THREE.PerspectiveCamera(90, 1, 0.001, 700);
    cursor3d.lookAt(camera.position);
    camera.add(cursor3d);

    this.raycaster = new THREE.Raycaster();

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
    /** @private @const {!TextImage} */
    this.textImage_ = new TextImage();

    // Fog
    this.scene.fog = new THREE.Fog(0xffffff, 2000, 10000);

    // Lighting
    // const light = new THREE.DirectionalLight( 0xffffff );
    const light = new THREE.HemisphereLight(0xffffff, 0x000000, 1);
    light.position.set( 0, 1, 1 ).normalize();
    this.scene.add(light);

    // Sample shape
    const sphereMaterial = new THREE.MeshLambertMaterial({
      color: 0xCC0000
    });
    const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(
            /*radius*/ 50,
            /*segments*/ 16,
            /*rings*/ 16),
        sphereMaterial);
    this.scene.add(sphere);

    this.candidates_ = toArray(document.querySelectorAll(
        'amp-img,amp-video,amp-google-vrview-image,blockquote'));// XXX: amp-twitter,amp-youtube
    console.log('candidates: ', this.candidates_.length, this.candidates_);
    this.vrInfo_ = [];
    for (let i = 0; i < this.candidates_.length; i++) {
      const candidate = this.candidates_[i];
      const vrInfo = this.getVrInfo_(candidate);
      vrInfo.aspect = candidate.offsetHeight == 0 ? 0 :
          candidate.offsetWidth / candidate.offsetHeight;
      if (!vrInfo.thumbImage) {
        vrInfo.thumbImage = '/examples/img/unknown.jpg';
      }
      this.vrInfo_.push(vrInfo);
    }
    console.log('vr info: ', this.vrInfo_);

    this.intersectables = [];
    const imageMesh = [];
    const hl = Math.max(6, this.vrInfo_.length) / 3;
    const scale = this.scale;
    const radius = 4 * scale;
    for (let i = 0; i < this.vrInfo_.length; i++) {
      const vrInfo = this.vrInfo_[i];

      const cubeGeometry = new THREE.PlaneGeometry(scale, scale);
      // const cubeGeometry = new THREE.CubeGeometry(200, 320, 50);
      const cubeMaterial = new THREE.MeshPhongMaterial({
        map: THREE.ImageUtils.loadTexture(vrInfo.thumbImage)
      });
      const cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);

      const group = new THREE.Group();
      group.add(cubeMesh);

      const theta = (i * hl) * 0.15;
      group.position.x = radius * Math.sin(theta);
      group.position.z = - radius * Math.cos(theta);
      group.lookAt(this.camera.position);

      this.scene.add(group);
      imageMesh[i] = group;
      this.intersectables.push(cubeMesh);

      cubeMesh.group = group;
      cubeMesh.setSelected = function(value) {
        const scale = value ? 1.2 : 1.0;
        group.scale.set(scale, scale, scale);
      };
      cubeMesh.vrInfo = vrInfo;
    }

    this.getElement().addEventListener('click', this.handleClick_.bind(this));

    // XXX: skydome
    (() => {
      console.log('load sky');
      var geometry = new THREE.SphereGeometry(50, 32, 32);
      var uniforms = {
        texture: {
          type: 't',
          value: THREE.ImageUtils.loadTexture(
              'https://lh4.googleusercontent.com/-okOlNNHeoOc/VbYyrlFYFII/AAAAAAABYdA/La-3j3c-QQI/w1002-h557-no/PANO_20150726_171347%257E2.jpg')
        }
      };

      var material = new THREE.ShaderMaterial( {
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

      var skyBox = new THREE.Mesh(geometry, material);
      skyBox.scale.set(-1, 1, 1);
      skyBox.eulerOrder = 'XZY';
      skyBox.renderDepth = 50.0;
      this.scene.add(skyBox);
    });
  }

  findIntersections() {
    const TTL = 100;

    /* option 1
    const gaze = new THREE.Vector3(0, 0, -1);
    gaze.unproject(this.camera);
    this.raycaster.set(
      this.camera.position,
      gaze.sub(this.camera.position).normalize()
    );
    const intersects = this.raycaster.intersectObjects(this.intersectables);
    */

    /* option 2 */
    const directionVector = new THREE.Vector3(0, 0, -1).applyQuaternion(this.camera.quaternion);
    const raycaster = new THREE.Raycaster(this.camera.position, directionVector.normalize());
    const intersects = raycaster.intersectObjects(this.intersectables);

    const selected = intersects.length > 0 ? intersects[0].object : null;
    if (selected != this.selected) {
      if (this.selected) {
        this.selected.setSelected(false);
      }
      this.selected = selected;
      if (this.selected) {
        this.selected.setSelected(true);
        this.cursor.object3d.scale.set(1.1, 1.1, 1.1);
        navigator.vibrate(30);
      } else {
        this.cursor.object3d.scale.set(1, 1, 1);
      }
    }
  }

  /** @private */
  handleClick_() {
    if (!this.controlsState) {
      return;
    }

    if (!this.selected) {
      this.showPokes_();
      return;
    }

    const obj = this.selected.group || this.selected;
    const oldPos = {
      x: this.camera.position.x,
      y: this.camera.position.y,
      z: this.camera.position.z
    };
    const newPos = obj.position;
    const x = tr.numeric(oldPos.x, newPos.x);
    const y = tr.numeric(oldPos.y, newPos.y);
    const z = tr.numeric(oldPos.z, newPos.z);
    this.setControlsState(false);
    const vrInfo = this.selected.vrInfo;
    const newView = this.createView_(vrInfo);
    this.viewManager.initView(newView);
    this.startAnimation(time => {
      const t = time;
      this.camera.position.set(x(t), y(t), z(t));
    }, 2.0, 'ease-in-out', () => {
      this.viewManager.openPush(newView);
      this.camera.position.set(oldPos.x, oldPos.y, oldPos.z);
      this.setControlsState(true);
    });
  }

  /** @private */
  showPokes_() {
    console.log('SHOW POKES!!!');

    const loader = new THREE.ObjectLoader();
    // /models/dragonite/dragonite-pokemon-go.json
    // /models/pokeball/pokeball-vray.json
    // /models/squirtle/squirtle-pokemon-go.json
    console.log('try to load');
    loader.load('/examples/model3d/dragonite/dragonite-pokemon-go.json', obj => {
      console.log('loaded: ', obj);

      obj.position.x = 0;
      obj.position.y = -2;
      obj.position.z = -8;

      obj.rotation.x = 0.2;

      const startRot = Math.PI * 0.9;
      obj.rotation.y = startRot;

      const startScale = 0.02;
      obj.scale.x = obj.scale.y = obj.scale.z = startScale;
      this.scene.add(obj);

      const scaler = tr.numeric(startScale, 0.3);
      const rotator = tr.numeric(startRot, startRot + Math.PI * 2);
      this.startAnimation(time => {
        const t2 = (time <= 0.5 ? time / 0.5 : (1 - time) / 0.5);
        // obj.rotation.y = Math.PI * 2 * time;
        // const scale = startScale + (endScale - startScale) *
        //     (time <= 0.5 ? time / 0.5 : (1 - time) / 0.5);
        obj.rotation.y = rotator(time);
        obj.scale.x = obj.scale.y = obj.scale.z = scaler(t2);
        if (time == 1) {
          this.scene.remove(obj);
        }
      }, 2.0, 'ease-in-out');
    });
  }

  /**
   * @param {!Element} element
   * @return {!VrInfo}
   * @private
   */
  getVrInfo_(element) {
    if (element.getVrInfo) {
      const vrInfo = element.getVrInfo();
      if (vrInfo) {
        return vrInfo;
      }
    }

    if (element.tagName == 'BLOCKQUOTE') {
      const text = element.textContent;
      const snippet = text.length > 10 ? text.substring(0, 10) + '...' : text;
      const thumbText = `\u00AB${snippet}\u00BB`;
      return {
        type: 'BLOCKQUOTE',
        playable: false,
        thumbImage: this.textImage_.getImageUrl(thumbText),
        thumbText: thumbText,
        source: text,
      };
    }

    return {
      type: 'UNKNOWN',
      playable: false,
      thumbImage: null,
      thumbText: 'Unknown',
      source: 'Unknown',
    };
  }

  /**
   * @param {!VrInfo} vrInfo
   * @return {!View}
   * @private
   */
  createView_(vrInfo) {
    if (vrInfo.type == 'IMG') {
      if (vrInfo.source.indexOf('img1.jpg') != -1) {
        return new SkyMapImageView(vrInfo);
      }
      return new BasicImageView(vrInfo);
    }
    if (vrInfo.type == 'VIDEO') {
      return new BasicVideoView(vrInfo);
    }
    if (vrInfo.type == 'GVR') {
      return new GvrView(vrInfo);
    }
    if (vrInfo.type == 'BLOCKQUOTE') {
      return new BasicTextView(vrInfo);
    }
    return new UnknownView();
  }

  /** @override */
  update() {
    if (this.controlsState) {
      this.findIntersections();
    }
  }
}


class Cursor {
  /**
   * @param {number} size
   */
  constructor(size) {
    /** @const {number} */
    this.size = size;

    const geometry = new THREE.RingGeometry(
        0.85 * size,
        1 * size,
        32);

    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    });

    /** @const {!THREE.Object3D} */
    this.object3d = new THREE.Mesh(geometry, material);
  }

/* cursor
You'll want to create a raycaster based on the camera's direction, and to do that you apply the camera's quaternion to a direction vector. For example:

var directionVector = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);

var raycaster = new THREE.Raycaster(camera.position, directionVector.normalize());

The (0, 0, -1) in the direction vector indicates it's a straight-ahead movement (z-axis). Then you check for the objects the raycaster intersects in the scene, e.g.:

var intersections = raycaster.intersectObjects(scene.children);
*/
}


export class UnknownView extends View {

  /** @override */
  build() {
    this.element = document.createElement('div');
    this.element.textContent = 'Not implemented';
  }

  /** @override */
  getElement() {
    return this.element;
  }
}
