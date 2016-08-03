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
