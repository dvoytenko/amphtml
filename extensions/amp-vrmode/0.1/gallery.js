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
import {ThreeView} from './three-view';
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
        'amp-img,amp-video,amp-twitter,amp-youtube,blockquote'));
    console.log('candidates: ', this.candidates_.length, this.candidates_);
    this.vrInfo_ = [];
    for (let i = 0; i < this.candidates_.length; i++) {
      const candidate = this.candidates_[i];
      const vrInfo = this.getVrInfo_(candidate);
      this.vrInfo_.push(vrInfo);
    }
    console.log('vr info: ', this.vrInfo_);

    this.intersectables = [];
    const images = [
      '/93-b1dDH2pOW4e2HWxVlO5j_Ll1iHbLKjrDKUl4k8P2QZzwBMztxDWgWDn-GggxFgACb2P4h78rrM65uIeik9R3TYUIdHFuHTm-dxY0Bu864I2Qb20qLR9PHyPZmUhwfwUVzyC-35U_LqlCgY5pz-pUdUYGNA0UBt56cLoeJZTrueJJfDJTCqhoyOnDHeWOaB5R_9G7m9deWqV9CWY4lI6DzsQ2g8-piw8Z_Fo0n1T4lHtXExuAsHgqGe6v7g3CxKsG0j9A330asb1Xb-1XYDrRZNem5gEGXDu24dvG6plltGdDYQLFRoAjQ2RxbIvvb6BUws1TTSy0-qaaDKVYmTale2-S-cqYSTNHL915QSoXXkinNqP6Yet8YjmzOX9R8utDFJ1Y-9ubCGF89UnCR_grIKy1wkEs7LmljMpgyWHgX_u8p1573QGISi2I_Mr0rGZ6zNWGq2uw8CmiVQwNKYgwi7zGzUy3_u_SLrjzxoUqa5oRvmGKhBjrR-nl4P6UPvC3XHJ5ivru50faETu67AGDQfJsz0hTQFc5bmEe-x94DrR4Vm8JUopwfiYlQi1lYCSRZSnZC1Qd7DfEo4Hx2py2KXLA0g48',
      '/Nf0HFZgIKJRa8p9xNaWOteK6J7CZwxaDBZEo1Hr4HeB9yqVMoaA2c-kFWR5qvpglmj3eesObKr8c8q5FRUpaey5cRbvyO0NrFLA8B7A81PdS6PVjlblyzxFj4DIsxZ6XvyrnsJxI0VHqSOIuZKf5VuZ1udTNP5AdCtqmVYV8DGNysFiZ_LMybB8fQVFjGjVDvXIwQ-LXpJg2zXCjgPITfW2iAkM_ia8Pu8pxsLAlbjIMeIybSeWeyRBvoAKiJpPsHHq-8SiEZal1kDNxLgLJgpJHxgk6Id6qvZhieEnAX9rqmEBIIBaibNFwedrKYxiCBgsbC1rr5dY197xGlW6_2TTdshg8zaIe2K_BChjJZ0u_duQRhoind8fNKfa9B3zRkBRqEOzi0uNQnmDQ4IN5QKMRQD4ZpIdSyy1SKq5vJDWsgDJzy33cSQzpH-O6WYPpZCW4uIGIkuSWi6SgWmffuFKVXTxO3jBBUnG4OPt22mltKZBDbvoESUYzeR6vYJxD_7FeaK6gStigp3aO9cHoxMWUErwUOzpH0Sorcnm-zfPIZhzbbyDzT75c4NMRwUvYP2L1w7FgZYPTd2g7S5RquBW-5KLAND8',
      '/d4Qt7I8iBVgfVJPYBI_37bVIeNgDJ1HcKQhxhuNmCngeAEHiiFA4evjP3iegLKGb78OWGrsVlgT84mRxKsLdzQ-WRshmo-20moUvadMNFsOZ21uvjSXlNJtKiUQCvfl6xY6gT3GhkWGIY8RGWYAqXn9NS-J2zTGGuzCBjIeM73yT_OLdX6Jroo_zacQv4RwJGBWLUWxTZbHi42UOodlHI62n_X_CnuAo3r0DI2pIqLUGRjG3D1Ze2UIPsCD1lwPBHAKSn9BAm_YeN8-Ni3IN990BFA-xOXlbF-8V3x9B5SQauq-Kxg2ZLiVMUWSazA25RTBGXeZZcRmiGLngKE5ln_JJ6AWHA-1FusALC4Fn0ka8r6d4NHcBq7sqhdQfu3oWBxYg1UCtl4DvOILDeBC_EHSJD_jQ3apNYWYBGPZy-WF0ryQNagVselOcYPLYcDapMSlJPWn1-HaAKbv7pIUdUWHN0Y1nu8b9b9nDePq3qlh8oAUwnYg6JnoFglfYwg8gYbM9H9QwLJokIHUiTiU3LMXN_JD1UypQzFfH_hoEw1ek_Br9j2gi3bML8EeYNzdculw1E0Zy3hZDXpeni7s4AoWcaJf7hO8',
      '/-fdPJbu0f3MJ6OTuKr5Q7y9lGVbIX3ZI83TzuVMxzKmJghuYFzOlJ5pk3HhXet_ttEo8lJ9RhB2ixIZ_W1pApDxkA2Ntd3Y8HLhlDatLo_kIUwcdnsypiS8zHo_dx9PlgCp-vwdQxdW_7VNka3YFMjFDG1eZXDz8rfEEoZo_z8TM0NgHVxzWlOxxIU9xQuE_K9g944h3mQ1YKZZECapsGlYbEe6dMhQgLmaY_1maQDsX4w2eruL1uIcq3tEHTSvqpesQhY-CT66kvMBJ_NO8TnfbeRHRJy2fqS7isOK4M5m5TGUaYK5yQOn0UOM3stHq9OtSPDYKoL2xmOyZ_sly6n9J_fcpU0Qjg29qd_WJcWkgkNOeO1p0hDAYgt376iw_CvZPLry3ldNTVh8cXz-kAESAl1XmONyoWoSFH7dcGVM972jwlKHiyqXROjUwKkRBgtMaQVHdmFtfUFEjZ7Oo-HaW0wceB-Kapijk5ED2ENM-tdcESAWY3YtdFA2y1Tg1GzkH1Xay_eGFTpKYgNfJ_4A_XlXcRsEjoPyABFi8k4U2_qoUpi4V8e_N7mYKO2sAqZMQs4QUXwiAQaFNb2eHDPUNuKor2Oo',
      '/FaykW93Ao6WQ9DsGvbjosRyKmZ6W1MD9909T6GeZQH6Ve57qGjdjeZBTYjisYNEvDYR7Ixh2UL8mTc9ym1ymTer2RtHW1Y5HfhPxjW4JThH2Mu9cJrPZ3J3G4j09zAxvPEN_TmxYhYyF3_9W8Fmy03gHZvWKzlND-LRGqXh65_9XRJRdqIToQu1mPUzDXgvm6O3_4aj0WRg9gXFI03DMxVSZwEnOhOc7VkzL6DQWIx-bq3gIUMSIIYoF8Q654_VhgqU-Qr3YcomHNSuY5dYf__L-X4pP9qn9bE3-dEFLcHQs1d9nk377GvSjXk0dZsxQ3_06Te5s73PiRgIbmYknl_CKjztCfO8PwhtOHOStFFI6bPrxuSWEZ3Vu0wa8YzwTERlQ8Eba3VqWghZjg2_5AQ9gFyVFP_Udcb98KLZe4bBidwNp77MpO-qkHvwvImKHDQ0bZRQAyV2CR5RLezklukETekqVxA7EqD0cPsOpeeXjmmfvtZW6g__SuqvYR5K_dq6xnXmj4tZOm3G42Wuw3TEPMnGznNey-lptJLV5LcaHpXdN_40Rdv57fVOq78T2NdBwJISU7qoOHMqaNNsWkDAOxV8YFzo',
    ];
    const imageMesh = [];
    const hl = images.length / 3;
    const scale = this.scale;
    const radius = 4 * scale;
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      const imageUrl = 'https://lh3.googleusercontent.com' + image + '=w200-h320-p';

      const cubeGeometry = new THREE.PlaneGeometry(scale, scale);
      // const cubeGeometry = new THREE.CubeGeometry(200, 320, 50);
      const cubeMaterial = new THREE.MeshPhongMaterial({
        map: THREE.ImageUtils.loadTexture(imageUrl)
      });
      const cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);

      const group = new THREE.Group();
      group.add(cubeMesh);

      const theta = (i + hl) * 0.3;
      group.position.x = radius * Math.cos(theta);
      group.position.z = - radius * Math.sin(theta);
      group.lookAt(this.camera.position);

      this.scene.add(group);
      imageMesh[i] = group;
      this.intersectables.push(cubeMesh);

      cubeMesh.group = group;
      cubeMesh.setSelected = function(value) {
        const scale = value ? 1.2 : 1.0;
        group.scale.set(scale, scale, scale);
      };
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
        console.log('new selected: ', this.selected);
      } else {
        this.cursor.object3d.scale.set(1, 1, 1);
        console.log('selected reset');
      }
    }
  }

  /** @private */
  handleClick_() {
    console.log('CLICK');
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
    console.log('zoom in: ', obj, oldPos, newPos);
    const x = tr.numeric(oldPos.x, newPos.x);
    const y = tr.numeric(oldPos.y, newPos.y);
    const z = tr.numeric(oldPos.z, newPos.z);
    this.setControlsState(false);
    this.startAnimation(time => {
      const t = time;
      this.camera.position.set(x(t), y(t), z(t));
    }, 2.0, 'ease-in-out', () => {
      this.viewManager.openPush(new BasicImageView());
      console.log('reset back to ', oldPos);
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
      const snippet = text.length > 50 ? text.substring(0, 50) + '...' : text;
      return {
        type: 'BLOCKQUOTE',
        playable: false,
        thumbImage: null,
        thumbText: `\u00AB${snippet}\u00BB`,
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
