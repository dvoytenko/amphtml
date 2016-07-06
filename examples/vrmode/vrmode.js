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

'use strict';

/*
 * Notable:
 * - hit (ray caster): https://github.com/mrdoob/three.js/blob/master/examples/webgl_interactive_cubes.html
 * - http://www.html5rocks.com/en/tutorials/webgl/million_letters/
 */

function log(args) {
  var var_args = Array.prototype.slice.call(arguments, 0);
  var_args.unshift('[VRMODE]');
  console/*OK*/.log.apply(console, var_args);
}

class VRMode {

  constructor(win) {
    /** @private @const {!Window} */
    this.win = win;

    /** @private @const {!Document} */
    this.doc = win.document;

    /** @private @const {!Element} */
    this.container = this.doc.getElementById('webglviewer');

    /** @private @const {function(!Event)} */
    this.clock = new THREE.Clock();

    /** @private @const {!THREE.Scene} */
    this.scene = new THREE.Scene();

    /** @private @const {!THREE.PerspectiveCamera} */
    this.camera = new THREE.PerspectiveCamera(45,
        win.innerWidth / win.innerHeight, 0.1, 10000);
    this.camera.position.set(0, 0, 2000);
    this.scene.add(this.camera);

    /** @private @const {!THREE.WebGLRenderer} */
    this.renderer = new THREE.WebGLRenderer();
    if (win.devicePixelRatio) {
      this.renderer.setPixelRatio(win.devicePixelRatio);
    }
    /** @private @const {!Element} */
    this.element = this.renderer.domElement;
    this.container.appendChild(this.element);

    this.scene.fog = new THREE.Fog(0xffffff, 2000, 10000);
    this.renderer.setClearColor(this.scene.fog.color);
    this.renderer.shadowMap.enabled = true;

    /** @private @const {!THREE.AnimationMixer} */
    this.mixer = new THREE.AnimationMixer(this.scene);
    // mixer.clipAction( sceneAnimationClip ).play();

    /** @private @const {!THREE.StereoEffect} */
    //this.effect = new THREE.StereoEffect(this.renderer);
    this.effect = this.renderer;

    /** @private {!THREE.Controls} */
    this.controls = new THREE.OrbitControls(this.camera, this.element);
    this.controls.target.set(
      this.camera.position.x + 0.15,
      this.camera.position.y,
      /*this.camera.position.z*/ 0
    );
    this.controls.enablePan = false;
    this.controls.enableZoom = false;

    // this.mouseX = 0;
    // this.mouseY = 0;
    // this.doc.addEventListener( 'mousemove', e => {
    //   this.mouseX = (e.clientX - this.win.innerWidth / 2) * 10;
    //   this.mouseY = (e.clientY - this.win.innerHeight / 2) * 10;
    // }, false );

    /** @private @const {function(!Event)} */
    this.boundSetOrientationControls = this.setOrientationControls.bind(this);
    this.win.addEventListener('deviceorientation',
        this.boundSetOrientationControls, true);

    /** @private @const {function()} */
    this.boundAnimate = this.animate.bind(this);

    // Lighting
    /*
    const light = new THREE.PointLight(0x999999, 2, 100);
    light.position.set(50, 50, 50);
    this.scene.add(light);

    const lightScene = new THREE.PointLight(0x999999, 2, 100);
    lightScene.position.set(0, 5, 0);
    this.scene.add(lightScene);
    */
    var light = new THREE.DirectionalLight( 0xffffff );
    light.position.set( 0, 1, 1 ).normalize();
    this.scene.add(light);

    // Sample text and stuff
    const fontLoader = new THREE.FontLoader();
    // helvetiker_regular
    // optimer_regular
    // gentilis_regular
    const fontUrl = '../../node_modules/three/examples/fonts/gentilis_regular.typeface.json';
    const fontPromise = new Promise(resolve => {
      fontLoader.load(fontUrl, font => {
        log('font loaded: ', font);
        resolve(font);
      });
    });

    // Sample shape
    var sphereMaterial =
      new THREE.MeshLambertMaterial(
        {
          color: 0xCC0000
        });
    var sphere = new THREE.Mesh(
      new THREE.SphereGeometry(
        /*radius*/ 50,
        /*segments*/ 16,
        /*rings*/ 16),
      sphereMaterial);
    // XXX this.scene.add(sphere);

    const images = [
      '/93-b1dDH2pOW4e2HWxVlO5j_Ll1iHbLKjrDKUl4k8P2QZzwBMztxDWgWDn-GggxFgACb2P4h78rrM65uIeik9R3TYUIdHFuHTm-dxY0Bu864I2Qb20qLR9PHyPZmUhwfwUVzyC-35U_LqlCgY5pz-pUdUYGNA0UBt56cLoeJZTrueJJfDJTCqhoyOnDHeWOaB5R_9G7m9deWqV9CWY4lI6DzsQ2g8-piw8Z_Fo0n1T4lHtXExuAsHgqGe6v7g3CxKsG0j9A330asb1Xb-1XYDrRZNem5gEGXDu24dvG6plltGdDYQLFRoAjQ2RxbIvvb6BUws1TTSy0-qaaDKVYmTale2-S-cqYSTNHL915QSoXXkinNqP6Yet8YjmzOX9R8utDFJ1Y-9ubCGF89UnCR_grIKy1wkEs7LmljMpgyWHgX_u8p1573QGISi2I_Mr0rGZ6zNWGq2uw8CmiVQwNKYgwi7zGzUy3_u_SLrjzxoUqa5oRvmGKhBjrR-nl4P6UPvC3XHJ5ivru50faETu67AGDQfJsz0hTQFc5bmEe-x94DrR4Vm8JUopwfiYlQi1lYCSRZSnZC1Qd7DfEo4Hx2py2KXLA0g48',
      '/Nf0HFZgIKJRa8p9xNaWOteK6J7CZwxaDBZEo1Hr4HeB9yqVMoaA2c-kFWR5qvpglmj3eesObKr8c8q5FRUpaey5cRbvyO0NrFLA8B7A81PdS6PVjlblyzxFj4DIsxZ6XvyrnsJxI0VHqSOIuZKf5VuZ1udTNP5AdCtqmVYV8DGNysFiZ_LMybB8fQVFjGjVDvXIwQ-LXpJg2zXCjgPITfW2iAkM_ia8Pu8pxsLAlbjIMeIybSeWeyRBvoAKiJpPsHHq-8SiEZal1kDNxLgLJgpJHxgk6Id6qvZhieEnAX9rqmEBIIBaibNFwedrKYxiCBgsbC1rr5dY197xGlW6_2TTdshg8zaIe2K_BChjJZ0u_duQRhoind8fNKfa9B3zRkBRqEOzi0uNQnmDQ4IN5QKMRQD4ZpIdSyy1SKq5vJDWsgDJzy33cSQzpH-O6WYPpZCW4uIGIkuSWi6SgWmffuFKVXTxO3jBBUnG4OPt22mltKZBDbvoESUYzeR6vYJxD_7FeaK6gStigp3aO9cHoxMWUErwUOzpH0Sorcnm-zfPIZhzbbyDzT75c4NMRwUvYP2L1w7FgZYPTd2g7S5RquBW-5KLAND8',
      '/d4Qt7I8iBVgfVJPYBI_37bVIeNgDJ1HcKQhxhuNmCngeAEHiiFA4evjP3iegLKGb78OWGrsVlgT84mRxKsLdzQ-WRshmo-20moUvadMNFsOZ21uvjSXlNJtKiUQCvfl6xY6gT3GhkWGIY8RGWYAqXn9NS-J2zTGGuzCBjIeM73yT_OLdX6Jroo_zacQv4RwJGBWLUWxTZbHi42UOodlHI62n_X_CnuAo3r0DI2pIqLUGRjG3D1Ze2UIPsCD1lwPBHAKSn9BAm_YeN8-Ni3IN990BFA-xOXlbF-8V3x9B5SQauq-Kxg2ZLiVMUWSazA25RTBGXeZZcRmiGLngKE5ln_JJ6AWHA-1FusALC4Fn0ka8r6d4NHcBq7sqhdQfu3oWBxYg1UCtl4DvOILDeBC_EHSJD_jQ3apNYWYBGPZy-WF0ryQNagVselOcYPLYcDapMSlJPWn1-HaAKbv7pIUdUWHN0Y1nu8b9b9nDePq3qlh8oAUwnYg6JnoFglfYwg8gYbM9H9QwLJokIHUiTiU3LMXN_JD1UypQzFfH_hoEw1ek_Br9j2gi3bML8EeYNzdculw1E0Zy3hZDXpeni7s4AoWcaJf7hO8',
      '/-fdPJbu0f3MJ6OTuKr5Q7y9lGVbIX3ZI83TzuVMxzKmJghuYFzOlJ5pk3HhXet_ttEo8lJ9RhB2ixIZ_W1pApDxkA2Ntd3Y8HLhlDatLo_kIUwcdnsypiS8zHo_dx9PlgCp-vwdQxdW_7VNka3YFMjFDG1eZXDz8rfEEoZo_z8TM0NgHVxzWlOxxIU9xQuE_K9g944h3mQ1YKZZECapsGlYbEe6dMhQgLmaY_1maQDsX4w2eruL1uIcq3tEHTSvqpesQhY-CT66kvMBJ_NO8TnfbeRHRJy2fqS7isOK4M5m5TGUaYK5yQOn0UOM3stHq9OtSPDYKoL2xmOyZ_sly6n9J_fcpU0Qjg29qd_WJcWkgkNOeO1p0hDAYgt376iw_CvZPLry3ldNTVh8cXz-kAESAl1XmONyoWoSFH7dcGVM972jwlKHiyqXROjUwKkRBgtMaQVHdmFtfUFEjZ7Oo-HaW0wceB-Kapijk5ED2ENM-tdcESAWY3YtdFA2y1Tg1GzkH1Xay_eGFTpKYgNfJ_4A_XlXcRsEjoPyABFi8k4U2_qoUpi4V8e_N7mYKO2sAqZMQs4QUXwiAQaFNb2eHDPUNuKor2Oo',
      '/FaykW93Ao6WQ9DsGvbjosRyKmZ6W1MD9909T6GeZQH6Ve57qGjdjeZBTYjisYNEvDYR7Ixh2UL8mTc9ym1ymTer2RtHW1Y5HfhPxjW4JThH2Mu9cJrPZ3J3G4j09zAxvPEN_TmxYhYyF3_9W8Fmy03gHZvWKzlND-LRGqXh65_9XRJRdqIToQu1mPUzDXgvm6O3_4aj0WRg9gXFI03DMxVSZwEnOhOc7VkzL6DQWIx-bq3gIUMSIIYoF8Q654_VhgqU-Qr3YcomHNSuY5dYf__L-X4pP9qn9bE3-dEFLcHQs1d9nk377GvSjXk0dZsxQ3_06Te5s73PiRgIbmYknl_CKjztCfO8PwhtOHOStFFI6bPrxuSWEZ3Vu0wa8YzwTERlQ8Eba3VqWghZjg2_5AQ9gFyVFP_Udcb98KLZe4bBidwNp77MpO-qkHvwvImKHDQ0bZRQAyV2CR5RLezklukETekqVxA7EqD0cPsOpeeXjmmfvtZW6g__SuqvYR5K_dq6xnXmj4tZOm3G42Wuw3TEPMnGznNey-lptJLV5LcaHpXdN_40Rdv57fVOq78T2NdBwJISU7qoOHMqaNNsWkDAOxV8YFzo',
    ];
    const imageMesh = [];
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      const imageUrl = 'https://lh3.googleusercontent.com' + image + '=w200-h320-p';
      //log(imageUrl);

      const cubeGeometry = new THREE.CubeGeometry(200, 320, 50);
      // var cubeMaterial = new THREE.MeshPhongMaterial( { ambient: 0x050505, color: 0x0033ff, specular: 0x555555, shininess: 30 } );
      const cubeMaterial = new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture(imageUrl) } );

      const cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);

      const group = new THREE.Group();
      group.add(cubeMesh);

      group.position.x = i * 220 - 2 * 220;
      //cubeMesh.rotation.x += 10 * .04;
      //cubeMesh.rotation.y += 10 * .04;
      //cubeMesh.position.z = -50;
      this.scene.add(group);
      imageMesh[i] = group;

      fontPromise.then(font => {
        log('create text');
        const textGeom = new THREE.TextGeometry('Article ' + i, {
          font: font,
          size: 30,
          height: 30
        });
        const textMesh = new THREE.Mesh(textGeom, new THREE.MeshBasicMaterial({
          color: 0x00ffff, opacity: 1
        }));
        this.textMesh = textMesh;
        textMesh.castShadow = true;
        textMesh.receiveShadow = false;
        textMesh.position.x = -80;
        textMesh.position.y = -80;
        textMesh.position.z = 1;
        group.add(textMesh);
      });
    }

    // this.update(0);
    // this.render(0);

    document.addEventListener('click', () => {
      log('click');
      /*
      if (imageMesh[0].scale.x <= 1.01) {
        imageMesh[0].scale.x *= 1.15;
        imageMesh[0].scale.y *= 1.15;
      } else {
        imageMesh[0].scale.x = 1;
        imageMesh[0].scale.y = 1;
      }
      */
      //this.camera.position.x = -200;
      //this.camera.position.z = 500;

      // this.scene.position.z = 2000;
      //this.camera.lookAt(this.scene.position);

      /*
    if (this.deltaX === undefined) {
      this.deltaX = 0;
    }
    this.deltaX -= 10;
    this.camera.lookAt(new THREE.Vector3(this.deltaX, 0, 0));
      */
      // this.lookAt = new THREE.Vector3(-100, 0, 0);
      // return;

      var camera = this.camera;
      var controls = this.controls;

      function moveCamera(euler, zoom) {

        var cameraPos0 = camera.position.clone();
        var cameraUp0 = camera.up.clone();
        var cameraZoom = camera.position.z;
        var tweenValue = 0;

        // reset everything
        var endQ = new THREE.Quaternion();
        var iniQ = new THREE.Quaternion().copy(camera.quaternion);
        var curQ = new THREE.Quaternion();
        var vec3 = new THREE.Vector3();
        var tweenValue = 0;

        endQ.setFromEuler(euler);

        // TweenLite.to(this, 5, { tweenValue:1, cameraZoom:zoom, onUpdate:onSlerpUpdate })
        var tween = new TWEEN.Tween({t:0}).to({t:1}, 1000)
            .easing( TWEEN.Easing.Quadratic.InOut)
            .onUpdate(function() {
              log('step: ', this.t);
              /*
              THREE.Quaternion.slerp(iniQ, endQ, curQ, this.t);

              // apply new quaternion to camera position
              vec3.x = cameraPos0.x;
              vec3.y = cameraPos0.y;
              vec3.z = cameraZoom;
              vec3.applyQuaternion(curQ);
              camera.position.copy(vec3);

              vec3 = cameraUp0.clone();
              vec3.applyQuaternion(curQ);
              camera.up.copy(vec3);
              */

              var x = - 240 * this.t;
              var z = 2000 - (2000 - 500) * this.t;
              log('- ', x, z);
              var vec = new THREE.Vector3(x, 0, 0);
              camera.lookAt(vec);
              controls.target = vec;
              camera.position.x = x;
              camera.position.z = z;
            });

        tween.start();
      }

      moveCamera(new THREE.Euler(-100, 0, 0), 1000);

    });
  }

  start() {
    this.animate();
  }

  /**
   * @param {!Event} e
   * @private
   */
  setOrientationControls(e) {
    log('orientation event: ', e, e.alpha);
    if (!e.alpha) {
      return;
    }
    log('replace controls with DeviceOrientationControls');
    this.controls = new THREE.DeviceOrientationControls(this.camera, true);
    this.controls.connect();
    this.controls.update();
    this.element.addEventListener('click', this.toFullscreen.bind(this), false);
    this.win.removeEventListener('deviceorientation',
        this.boundSetOrientationControls, true);
  }

  toFullscreen() {
    const func =
        this.container.requestFullscreen ||
        this.container.webkitRequestFullscreen;
    if (func) {
      func.call(this.container);
    }
  }

  animate() {
    const elapsedSeconds = this.clock.getElapsedTime();
    /*
    const particleRotationDirection = this.particleRotationDeg <= 180 ? -1 : 1;
    particles.rotation.y = elapsedSeconds * particleRotationSpeed * particleRotationDirection;

    // We check if the color range has changed, if so, we'll change the colours
    if (lastColorRange[0] != currentColorRange[0] && lastColorRange[1] != currentColorRange[1]) {
      for (var i = 0; i < totalParticles; i++) {
        particles.children[i].material.color.setHSL(currentColorRange[0], currentColorRange[1], (Math.random() * (0.7 - 0.2) + 0.2));
      }
      lastColorRange = currentColorRange;
    }
    */

    requestAnimationFrame(this.boundAnimate);
    this.update(this.clock.getDelta());
    this.render(this.clock.getDelta());
  }

  resize() {
    const width = this.container.offsetWidth;
    const height = this.container.offsetHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    //this.renderer.setSize(width, height);
    this.effect.setSize(width, height);
  }

  update(dt) {
    this.resize();
    this.camera.updateProjectionMatrix();
    TWEEN.update();
    // XXX ???
    this.controls.update(dt);
    //log('camera pos: ', this.camera.position);
    // this.camera.position.x += (this.mouseX - this.camera.position.x) * .05;
    // this.camera.position.y += (- this.mouseY - this.camera.position.y) * .05;
    // this.camera.lookAt(this.scene.position);
  }

  render(dt) {
    /*
        var delta = 0.75 * clock.getDelta();
        camera.position.x += ( mouseX - camera.position.x ) * .05;
        camera.position.y = THREE.Math.clamp( camera.position.y + ( - mouseY - camera.position.y ) * .05, 0, 1000 );
        camera.lookAt( scene.position );
    */
    // this.camera.position.x += (500 - this.camera.position.x ) * .05;
    // this.camera.position.y = THREE.Math.clamp(this.camera.position.y + ( - 100 - this.camera.position.y ) * .05, 0, 5000);
    //this.camera.position.y -= 10;
    // this.camera.position.z -= 10;
    //this.camera.lookAt(this.scene.position);
    if (this.mixer && dt) {
      this.mixer.update(dt);
    }
    this.effect.render(this.scene, this.camera);
  }
}


var vrmode = new VRMode(window);
vrmode.start();


/*
var // Particles
    particles = new THREE.Object3D(),
    totalParticles = 200,
    maxParticleSize = 200,
    particleRotationSpeed = 0,
    lastColorRange = [0, 0.3],
    currentColorRange = [0, 0.3],
    // City and weather API set up
    cities = [['Sydney', '2147714'], ['New York', '5128638'], ['Tokyo', '1850147'], ['London', '2643743'], ['Mexico City', '3530597'], ['Miami', '4164138'], ['San Francisco', '5391959'], ['Rome', '3169070']],
    cityWeather = {},
    cityTimes = [],
    currentCity = 0,

function init() {

  var floorTexture = THREE.ImageUtils.loadTexture('textures/wood.jpg');
  floorTexture.wrapS = THREE.RepeatWrapping;
  floorTexture.wrapT = THREE.RepeatWrapping;
  floorTexture.repeat = new THREE.Vector2(50, 50);
  floorTexture.anisotropy = renderer.getMaxAnisotropy();
  var floorMaterial = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    specular: 0xffffff,
    shininess: 20,
    shading: THREE.FlatShading,
    map: floorTexture
  });
  var geometry = new THREE.PlaneBufferGeometry(1000, 1000);
  var floor = new THREE.Mesh(geometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);
  var particleTexture = THREE.ImageUtils.loadTexture('textures/particle.png'),
      spriteMaterial = new THREE.SpriteMaterial({
      map: particleTexture,
      color: 0xffffff
    });
  for (var i = 0; i < totalParticles; i++) {
    var sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(64, 64, 1.0);
    sprite.position.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.75);
    sprite.position.setLength(maxParticleSize * Math.random());
    sprite.material.blending = THREE.AdditiveBlending;

    particles.add(sprite);
  }
  particles.position.y = 70;
  scene.add(particles);
  adjustToWeatherConditions();
}

function adjustToWeatherConditions() {
  var cityIDs = '';
  for (var i = 0; i < cities.length; i++) {
    cityIDs += cities[i][1];
    if (i != cities.length - 1) cityIDs += ',';
  }
  getURL('http://api.openweathermap.org/data/2.5/group?id=' + cityIDs + '&APPID=b5c0b505a8746a1b2cc6b17cdab34535', function(info) {
    cityWeather = info.list;

    lookupTimezones(0, cityWeather.length);
  });
}

function lookupTimezones(t, len) {
  var tz = new TimeZoneDB;

  tz.getJSON({
      key: "GPH4A5Q6NGI1",
      lat: cityWeather[t].coord.lat,
      lng: cityWeather[t].coord.lon
  }, function(timeZone){
      cityTimes.push(new Date(timeZone.timestamp * 1000));
      t++;
      if (t < len) {
        setTimeout(function() {
          lookupTimezones(t, len);
        }, 1200);
      } else {
        applyWeatherConditions();
      }
  });
}

function applyWeatherConditions() {
  displayCurrentCityName(cities[currentCity][0]);
  var info = cityWeather[currentCity];
  particleRotationSpeed = info.wind.speed / 2; // dividing by 2 just to slow things down
  this.particleRotationDeg = info.wind.deg;
  var timeThere = cityTimes[currentCity] ? cityTimes[currentCity].getUTCHours() : 0,
      isDay = timeThere >= 6 && timeThere <= 18;
  if (isDay) {
    switch (info.weather[0].main) {
      case 'Clouds':
        currentColorRange = [0, 0.01];
        break;
      case 'Rain':
        currentColorRange = [0.7, 0.1];
        break;
      case 'Clear':
      default:
        currentColorRange = [0.6, 0.7];
        break;
    }
  } else {
    currentColorRange = [0.69, 0.6];
  }
  if (currentCity < cities.length-1) currentCity++;
  else currentCity = 0;
  setTimeout(applyWeatherConditions, 5000);
}
*/
