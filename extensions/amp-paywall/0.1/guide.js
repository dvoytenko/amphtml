/**
 * Copyright 2015 The AMP HTML Authors. All Rights Reserved.
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


/**
 * @typedef {{
 * }}
 */
let GuideSceneDef;


/**
 */
export class Guide {

  /**
   * @param {!Window} win
   */
  constructor(win) {
    /** @private @const */
    this.win = win;

    /** @private @const */
    this.pane_ = win.document.createElement('div');
    this.pane_.classList.add('amp-guide');
    this.pane_.style.display = 'none';
    win.document.body.appendChild(this.pane_);

    this.svgPane_ = win.document.createElementNS(
        'http://www.w3.org/2000/svg', 'svg');
    this.svgPane_.setAttribute('width', '100%');
    this.svgPane_.setAttribute('height', '100%');
    this.svgPane_.style.pointerEvents = 'none';
    this.svgPane_.style.position = 'absolute';
    this.svgPane_.style.top = '0';
    this.svgPane_.style.left = '0';
    this.svgPane_.style.right = '0';
    this.svgPane_.style.bottom = '0';
    this.svgPane_.style.zIndex = 1000;
    this.pane_.appendChild(this.svgPane_);

    /** @private {?GuideSceneDef} */
    this.currentScene_ = null;

    /** @private {?Element} */
    this.currentSceneEl_ = null;

    /** @private {!Object<string, function(!GuideActionDef)>} */
    this.handlers_ = {};
  }

  /**
   * @param {string} verb
   * @param {function(!GuideActionDef)} handler
   */
  onAction(verb, handler) {
    if (this.handlers_[verb]) {
      throw new Error('duplicate handler for ' + verb);
    }
    this.handlers_[verb] = handler;
  }

  /**
   * @param {!GuideSceneDef} scene
   * @return {!Promise}
   */
  show(scene) {
    if (!scene) {
      throw new Error('no scene');
    }
    this.pane_.style.display = '';

    this.closeCurrentScene_();
    this.currentSceneEl_ = this.renderScene_(scene);
    this.pane_.appendChild(this.currentSceneEl_);

    // Pointers
    setTimeout(() => {
      // Pointers.
      scene.sections.forEach((section, index) => {
        if (section.pointTo) {
          const sectionEl = this.currentSceneEl_.querySelector(
              `[index="${index}"]`);
          const pointer = this.renderPointTo_(section, sectionEl);
          this.svgPane_.appendChild(pointer);
        }
      });
    }, 50);

    return new Promise(resolve => {
      this.sceneResolver_ = resolve;
    });
  }

  /** @private */
  closeCurrentScene_() {
    if (this.currentSceneEl_) {
      this.pane_.removeChild(this.currentSceneEl_);
      this.currentSceneEl_ = null;
      this.svgPane_.textContent = '';
    }
  }

  /**
   * @param {!GuideActionDef} scene
   * @private
   */
  triggerAction_(action) {
    console.log('QQQ: action: ', action);
    if (this.currentSceneEl_) {
      this.pane_.style.display = 'none';
      this.closeCurrentScene_();
    }
    if (action.verb != 'close') {
      this.handlers_[action.verb](action);
    }
    if (this.sceneResolver_) {
      this.sceneResolver_(action);
    }
  }

  /**
   * @param {!GuideSceneDef} scene
   * @private
   */
  renderScene_(scene) {
    const sceneEl = this.win.document.createElement('div');
    sceneEl.classList.add('amp-guide-scene');
    if (scene.title) {
      const titleEl = this.win.document.createElement('header');
      titleEl.textContent = scene.title;
      sceneEl.appendChild(titleEl);
    }
    if (scene.sections) {
      scene.sections.forEach((section, index) => {
        const sectionEl = this.renderSection_(section, index);
        sceneEl.appendChild(sectionEl);
      });
    }
    return sceneEl;
  }

  /**
   * @private
   */
  renderSection_(section, index) {
    const sectionEl = this.win.document.createElement('section');
    sectionEl.setAttribute('index', index);
    if (section.class) {
      sectionEl.classList.add(section.class);
    }
    if (section.buttonBar) {
      sectionEl.classList.add('amp-guide-button-bar');
      section.buttonBar.forEach(button => {
        const buttonEl = this.renderButton_(button);
        sectionEl.appendChild(buttonEl);
      });
    } else if (section.optionList) {
      sectionEl.classList.add('amp-guide-option-list');
      section.optionList.forEach(option => {
        const optionEl = this.renderOption_(option);
        sectionEl.appendChild(optionEl);
      });
    } else if (section.text) {
      sectionEl.textContent = section.text;
    } else {
      throw new Error('unknown type of section');
    }
    return sectionEl;
  }

  /**
   * @private
   */
  renderButton_(button) {
    const buttonEl = this.win.document.createElement('button');
    buttonEl.textContent = button.buttonText;
    buttonEl.onclick = () => {
      this.triggerAction_(button.action);
    };
    return buttonEl;
  }

  /**
   * @private
   */
  renderOption_(option) {
    const optionEl = this.win.document.createElement('a');
    optionEl.textContent = option.optionText;
    optionEl.onclick = () => {
      this.triggerAction_(option.action);
    };
    return optionEl;
  }

  /**
   * @private
   */
  renderPointTo_(section, sectionEl) {
    const midPos = {
      left: this.pane_.offsetWidth / 2,
      top: this.pane_.offsetHeight / 2,
    };
    const fromPos = sectionEl.getBoundingClientRect();
    const b = this.win.document.querySelector(section.pointTo)
        .getBoundingClientRect();
    const toPos = {left: b.left + 10, top: b.top};
    const angle = Math.atan2(
        (toPos.top - midPos.top),
        (toPos.left - midPos.left)) *
        360 / (Math.PI * 2) - 180;
    const path = this.win.document.createElementNS(
        'http://www.w3.org/2000/svg', 'path');
    this.svgPane_.appendChild(path);
    path.classList.add('amp-guide-pointer');
    path.setAttribute('d',
        `M 0,0 L 70,0 M 0,0 L 6,-4 M 0,0 L 6,4`);
    path.setAttribute('transform',
        `translate(${toPos.left} ${toPos.top}) rotate(${angle})`);
    return path;
  }
}
