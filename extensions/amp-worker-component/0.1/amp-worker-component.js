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

import {urlReplacementsFor} from '../../../src/url-replacements';
import {assertHttpsUrl} from '../../../src/url';
import {isLayoutSizeDefined} from '../../../src/layout';
import {parseUrl} from '../../../src/url';
import {removeChildren} from '../../../src/dom';
import {templatesFor} from '../../../src/template';
import {xhrFor} from '../../../src/xhr';


/** @const {string} */
const NODE_ID = 'i-amp-id';

/** @const {string} */
const EVENT_PREFIX = 'i-amp-event-';

/** @const {!Function} */
const assert = AMP.assert;


/**
 */
class AmpWorkerComponent extends AMP.BaseElement {

  /** @override */
  isLayoutSupported(layout) {
    return isLayoutSizeDefined(layout);
  }

  /** @override */
  buildCallback() {
    /** @private @const {string} */
    this.src_ = parseUrl(assert(this.element.getAttribute('src'))).href;
    this.preconnect.url(this.src_);

    /** @private @const {!Element} */
    this.container_ = this.getWin().document.createElement('div');
    this.applyFillContent(this.container_);
    this.element.appendChild(this.container_);

    /** @private @const {!Worker|undefined} */
    this.worker_;
  }

  /** @override */
  layoutCallback() {
    // TODO(dvoytenko): do this via a non-allow-same-origin IFRAME to enable
    // CORS workers via proxy?
    return new Promise((resolve, reject) => {
      this.worker_ = new Worker(this.src_);
      this.worker_.addEventListener('message', e => {
        console.log('WORKER SAID: ', e.data);
        if (!e.data) {
          return;
        }
        if (e.data.type == 'mount-dom') {
          this.mountDom_(e.data.data);
          resolve();
        } else if (e.data.type == 'update-dom') {
          this.updateDom_(e.data.data);
        } else {
          console.error('Unknown message: ', e.data.type);
        }
      }, false);
      this.send_('start');
    });
  }

  /**
   * @param {!JSONObject} dom
   * @private
   */
  mountDom_(dom) {
    removeChildren(this.container_);
    this.container_.appendChild(this.buildElem_(dom));
  }

  /**
   * @param {!JSONObject} struct
   * @private
   */
  buildElem_(struct) {
    const el = document.createElement(struct.tag);

    if (struct.nodeId) {
      el.setAttribute(NODE_ID, struct.nodeId);
    }
    if (struct.className) {
      el.className = struct.className;
    }
    if (struct.attrs) {
      for (const k in struct.attrs) {
        el.setAttribute(k, struct.attrs[k]);
      }
    }
    // DO NOT SUBMIT: instead parse/sanitize in the worker and pass as DOM
    // nodes.
    if (struct.html) {
      el.innerHTML = struct.html;
    }
    if (struct.text) {
      el.textContent = struct.text;
    }
    if (struct.children) {
      struct.children.forEach(child => {
        el.appendChild(this.buildElem_(child));
      });
    }

    if (struct.events) {
      struct.events.forEach(eventType => {
        this.addEvent_(el, struct.nodeId, eventType);
      });
    }

    return el;
  }

  /**
   * @param {!JSONObject} update
   * @private
   */
  updateDom_(update) {
    console.log('update dom: ', update);
    // TODO(dvoytenko): surely, there's a faster way to find the node.
    const el = this.container_.querySelector(
        '[' + NODE_ID + '="' + update.nodeId + '"]');
    if (!el) {
      console.error('Node not found!', update.nodeId);
      return;
    }

    if (update.className !== undefined) {
      el.className = update.className;
    }
    if (update.deleteEvents) {
      update.deleteEvents.forEach(eventType => {
        this.removeEvent_(el, eventType);
      });
    }
    if (update.addEvents) {
      update.addEvents.forEach(eventType => {
        this.addEvent_(el, update.nodeId, eventType);
      });
    }
    if (update.deleteAttrs) {
      update.deleteAttrs.forEach(attr => {
        el.removeAttribute(attr);
      });
    }
    if (update.setAttrs) {
      for (const k in update.setAttrs) {
        el.setAttribute(k, update.setAttrs[k]);
      }
    }
    if (update.setText !== undefined) {
      el.textContent = update.setText;
    }
    // DO NOT SUBMIT: instead parse/sanitize in the worker and pass as DOM
    // nodes.
    if (update.setHtml !== undefined) {
      el.innerHTML = update.setHtml;
    }
  }

  /**
   * @param {!Element} element
   * @param {string} nodeId
   * @param {string} eventType
   * @private
   */
  addEvent_(element, nodeId, eventType) {
    const handler = this.nodeEventHandler_.bind(this, nodeId, eventType);
    element.addEventListener(eventType, handler);
    element[EVENT_PREFIX + eventType] = handler;
  }

  /**
   * @param {!Element} element
   * @param {string} eventType
   * @private
   */
  removeEvent_(element, eventType) {
    const handler = element[EVENT_PREFIX + eventType];
    if (handler) {
      element.removeEventListener(eventType, handler);
      delete element[EVENT_PREFIX + eventType];
    }
  }

  /**
   * @param {string} nodeId
   * @param {string} eventType
   * @private
   */
  nodeEventHandler_(nodeId, eventType) {
    console.log('handle event: ', nodeId, eventType);
    this.send_('event', {
      type: eventType,
      target: nodeId
    });
  }

  /**
   * @param {string} type
   * @param {*=} opt_data
   * @private
   */
  send_(type, opt_data) {
    this.worker_.postMessage({
      type: type,
      data: opt_data
    });
  }
}

AMP.registerElement('amp-worker-component', AmpWorkerComponent);
