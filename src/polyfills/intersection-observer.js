/**
 * Copyright 2020 The AMP HTML Authors. All Rights Reserved.
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
 * @fileoverview
 * See https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver.
 */

const UPGRADERS = '_upgraders';

/**
 * @param {!Window} win
 */
export function install(win) {
  // DO NOT SUBMIT: remove, testing.
  delete win.IntersectionObserver;
  delete win.IntersectionObserverEntry;

  if (!win.IntersectionObserver) {
    win.IntersectionObserver = /** @type {typeof IntersectionObserver} */ (IntersectionObserverStub);
  }

  /* DO NOT SUBMIT: examples */
  (() => {
    const inob1 = new win.IntersectionObserver((records) => {
      console.log('inob1: ', records);
    });
    inob1.observe(win.document.body);

    const iframe = win.document.createElement('iframe');
    iframe.srcdoc = '<!doctype html><html><head><body>';
    iframe.onload = () => {
      const childWin = iframe.contentWindow;
      installForChildWin(win, childWin);
      const inob2 = new childWin.IntersectionObserver((records) => {
        console.log('inob2: ', records);
      });
      inob2.observe(childWin.document.body);

      IntersectionObserverStub[UPGRADERS].push(() => {
        setTimeout(() => {
          const inob3 = new IntersectionObserverStub((records) => {
            console.log('inob3: ', records);
          });
          inob3.observe(childWin.document.body);
        }, 1000);
      });
    };
    win.document.body.appendChild(iframe);
  })();
}

/**
 * @param {!Window} parentWin
 * @param {!Window} childWin
 */
export function installForChildWin(parentWin, childWin) {
  // DO NOT SUBMIT: remove, testing.
  delete childWin.IntersectionObserver;
  delete childWin.IntersectionObserverEntry;

  if (!childWin.IntersectionObserver && parentWin.IntersectionObserver) {
    childWin.IntersectionObserver = parentWin.IntersectionObserver;
    childWin.IntersectionObserverEntry = parentWin.IntersectionObserverEntry;
    if (parentWin.IntersectionObserver === IntersectionObserverStub) {
      // Wait until new polyfill is available and override with the upgraded
      // classes.
      IntersectionObserverStub[UPGRADERS].push(() => {
        childWin.IntersectionObserver = parentWin.IntersectionObserver;
        childWin.IntersectionObserverEntry =
          parentWin.IntersectionObserverEntry;
      });
    }
  }
}

/**
 * @param {!Window} win
 * @return {boolean}
 */
export function shouldLoadPolyfill(win) {
  return (
    !win.IntersectionObserver ||
    win.IntersectionObserver === IntersectionObserverStub ||
    !win.IntersectionObserverEntry ||
    // Some browsers implement `intersectionRatio`, but not `isIntersecting`.
    // Polyfill smooths this out.
    !('isIntersecting' in win.IntersectionObserverEntry.prototype)
  );
}

/**
 * @param {!Window} win
 * @param {function()} installer
 */
export function upgradePolyfill(win, installer) {
  // Can't use the IntersectionObserverStub here directly since it's a separate
  // instance deployed in v0.js vs the polyfill extension.
  const Stub = /** @type {typeof IntersectionObserverStub} */ (win.IntersectionObserver);
  if (Stub && UPGRADERS in Stub) {
    delete win.IntersectionObserver;
    delete win.IntersectionObserverEntry;
    installer();
    const Impl = win.IntersectionObserver;
    const upgraders = Stub[UPGRADERS].slice(0);
    const microtask = Promise.resolve();
    const upgrade = (upgrader) => {
      microtask.then(() => upgrader(Impl));
    };
    if (upgraders.length > 0) {
      upgraders.forEach(upgrade);
    }
    Stub[
      UPGRADERS
    ] = /** @type {!Array<function(typeof IntersectionObserver)>} */ ({
      'push': upgrade,
    });
  } else {
    // Even if this is not the stub, we still may need to polyfill
    // `isIntersecting`. See `shouldLoadPolyfill` for more info.
    installer();
  }
}

/**
 * The stub for `IntersectionObserver`. Implements the same interface, but
 * keeps the tracked elements in memory until the actual polyfill arives.
 * This stub is necessary because the polyfill itself is significantly bigger.
 */
class IntersectionObserverStub {
  /**
   * @param {!IntersectionObserverCallback} callback
   * @param {!IntersectionObserverInit=} options
   */
  constructor(callback, options) {
    /** @private @const */
    this.callback_ = callback;

    /** @private @const {!IntersectionObserverInit} */
    this.options_ = {
      root: null,
      rootMargin: '0px 0px 0px 0px',
      ...options,
    };

    // Must fail on the document root to ensure that the polyfill is not
    // confused with the new spec that allows document as the root.
    const {root} = this.options_;
    if (root && root.nodeType !== /* ELEMENT */ 1) {
      throw new Error('root document is not supported');
    }

    /** @private {?Array<!Element>} */
    this.elements_ = [];

    /** @private {?IntersectionObserver} */
    this.inst_ = null;

    // Wait for the upgrade.
    IntersectionObserverStub[UPGRADERS].push(this.upgrade_.bind(this));
  }

  /**
   * @export
   * @return {?Element}
   */
  get root() {
    if (this.inst_) {
      return this.inst_.root;
    }
    return this.options_.root || null;
  }

  /**
   * @export
   * @return {*}
   */
  get rootMargin() {
    if (this.inst_) {
      return this.inst_.rootMargin;
    }
    return this.options_.rootMargin;
  }

  /**
   * @export
   * @return {*}
   */
  get thresholds() {
    if (this.inst_) {
      return this.inst_.thresholds;
    }
    return [].concat(this.options_.threshold || 0);
  }

  /**
   * @export
   */
  disconnect() {
    if (this.inst_) {
      this.inst_.disconnect();
    } else {
      this.elements_.length = 0;
    }
  }

  /**
   * @export
   * @return {!Array}
   */
  takeRecords() {
    if (this.inst_) {
      return this.inst_.takeRecords();
    }
    return [];
  }

  /**
   * @export
   * @param {!Element} target
   */
  observe(target) {
    if (this.inst_) {
      this.inst_.observe(target);
    } else {
      if (this.elements_.indexOf(target) == -1) {
        this.elements_.push(target);
      }
    }
  }

  /**
   * @export
   * @param {!Element} target
   */
  unobserve(target) {
    if (this.inst_) {
      this.inst_.unobserve(target);
    } else {
      const index = this.elements_.indexOf(target);
      if (index != -1) {
        this.elements_.splice(index, 1);
      }
    }
  }

  /**
   * @param {typeof IntersectionObserver} constr
   * @private
   */
  upgrade_(constr) {
    console.log('inob: upgraded');
    const inst = new constr(this.callback_, this.options_);
    this.inst_ = inst;
    this.elements_.forEach((e) => inst.observe(e));
    this.elements_ = null;
  }
}

/**
 * @type {!Array<function(typeof IntersectionObserver)>}
 */
IntersectionObserverStub[UPGRADERS] = [];
