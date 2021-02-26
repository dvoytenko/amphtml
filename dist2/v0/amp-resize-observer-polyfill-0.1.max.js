(self.AMP=self.AMP||[]).push({n:"amp-resize-observer-polyfill",v:"2102250055000",m:0,f:(function(AMP,_){

(() => {
  // third_party/resize-observer-polyfill/ResizeObserver.install.js
  function installResizeObserver(global) {
    (function(global2, factory) {
      global2.ResizeObserver = factory();
    })(global, function() {
      "use strict";
      var MapShim = function() {
        if (typeof Map !== "undefined") {
          return Map;
        }
        function getIndex(arr, key) {
          var result = -1;
          arr.some(function(entry, index2) {
            if (entry[0] === key) {
              result = index2;
              return true;
            }
            return false;
          });
          return result;
        }
        return function() {
          function class_1() {
            this.__entries__ = [];
          }
          Object.defineProperty(class_1.prototype, "size", {
            get: function get() {
              return this.__entries__.length;
            },
            enumerable: true,
            configurable: true
          });
          class_1.prototype.get = function(key) {
            var index2 = getIndex(this.__entries__, key);
            var entry = this.__entries__[index2];
            return entry && entry[1];
          };
          class_1.prototype.set = function(key, value) {
            var index2 = getIndex(this.__entries__, key);
            if (~index2) {
              this.__entries__[index2][1] = value;
            } else {
              this.__entries__.push([key, value]);
            }
          };
          class_1.prototype.delete = function(key) {
            var entries = this.__entries__;
            var index2 = getIndex(entries, key);
            if (~index2) {
              entries.splice(index2, 1);
            }
          };
          class_1.prototype.has = function(key) {
            return !!~getIndex(this.__entries__, key);
          };
          class_1.prototype.clear = function() {
            this.__entries__.splice(0);
          };
          class_1.prototype.forEach = function(callback, ctx) {
            if (ctx === void 0) {
              ctx = null;
            }
            for (var _i = 0, _a = this.__entries__; _i < _a.length; _i++) {
              var entry = _a[_i];
              callback.call(ctx, entry[1], entry[0]);
            }
          };
          return class_1;
        }();
      }();
      var defineConfigurable = function defineConfigurable2(target, props) {
        for (var _i = 0, _a = Object.keys(props); _i < _a.length; _i++) {
          var key = _a[_i];
          Object.defineProperty(target, key, {
            value: props[key],
            enumerable: false,
            writable: false,
            configurable: true
          });
        }
        return target;
      };
      var global$1 = function() {
        if (typeof global !== "undefined" && global.Math === Math) {
          return global;
        }
        if (typeof self !== "undefined" && self.Math === Math) {
          return self;
        }
        if (typeof window !== "undefined" && window.Math === Math) {
          return window;
        }
        return Function("return this")();
      }();
      var getWindowOf = function getWindowOf2(target) {
        var ownerGlobal = target && target.ownerDocument && target.ownerDocument.defaultView;
        return ownerGlobal || global$1;
      };
      var isBrowser = typeof window !== "undefined" && typeof document !== "undefined" && window.document === document;
      var emptyRect = createRectInit(0, 0, 0, 0);
      function toFloat(value) {
        return parseFloat(value) || 0;
      }
      function getBordersSize(styles) {
        var positions = [];
        for (var _i = 1; _i < arguments.length; _i++) {
          positions[_i - 1] = arguments[_i];
        }
        return positions.reduce(function(size, position) {
          var value = styles["border-" + position + "-width"];
          return size + toFloat(value);
        }, 0);
      }
      function getPaddings(styles) {
        var positions = ["top", "right", "bottom", "left"];
        var paddings = {};
        for (var _i = 0, positions_1 = positions; _i < positions_1.length; _i++) {
          var position = positions_1[_i];
          var value = styles["padding-" + position];
          paddings[position] = toFloat(value);
        }
        return paddings;
      }
      function getSVGContentRect(target) {
        var bbox = target.getBBox();
        return createRectInit(0, 0, bbox.width, bbox.height);
      }
      function getHTMLElementContentRect(target) {
        var clientWidth = target.clientWidth, clientHeight = target.clientHeight;
        if (!clientWidth && !clientHeight) {
          return emptyRect;
        }
        var styles = getWindowOf(target).getComputedStyle(target);
        var paddings = getPaddings(styles);
        var horizPad = paddings.left + paddings.right;
        var vertPad = paddings.top + paddings.bottom;
        var width = toFloat(styles.width), height = toFloat(styles.height);
        if (styles.boxSizing === "border-box") {
          if (Math.round(width + horizPad) !== clientWidth) {
            width -= getBordersSize(styles, "left", "right") + horizPad;
          }
          if (Math.round(height + vertPad) !== clientHeight) {
            height -= getBordersSize(styles, "top", "bottom") + vertPad;
          }
        }
        if (!isDocumentElement(target)) {
          var vertScrollbar = Math.round(width + horizPad) - clientWidth;
          var horizScrollbar = Math.round(height + vertPad) - clientHeight;
          if (Math.abs(vertScrollbar) !== 1) {
            width -= vertScrollbar;
          }
          if (Math.abs(horizScrollbar) !== 1) {
            height -= horizScrollbar;
          }
        }
        return createRectInit(paddings.left, paddings.top, width, height);
      }
      var isSVGGraphicsElement = function() {
        if (typeof SVGGraphicsElement !== "undefined") {
          return function(target) {
            return target instanceof getWindowOf(target).SVGGraphicsElement;
          };
        }
        return function(target) {
          return target instanceof getWindowOf(target).SVGElement && typeof target.getBBox === "function";
        };
      }();
      function isDocumentElement(target) {
        return target === getWindowOf(target).document.documentElement;
      }
      function getContentRect(target) {
        if (!isBrowser) {
          return emptyRect;
        }
        if (isSVGGraphicsElement(target)) {
          return getSVGContentRect(target);
        }
        return getHTMLElementContentRect(target);
      }
      function createReadOnlyRect(_a) {
        var x = _a.x, y = _a.y, width = _a.width, height = _a.height;
        var Constr = typeof DOMRectReadOnly !== "undefined" ? DOMRectReadOnly : Object;
        var rect = Object.create(Constr.prototype);
        defineConfigurable(rect, {
          x,
          y,
          width,
          height,
          top: y,
          right: x + width,
          bottom: height + y,
          left: x
        });
        return rect;
      }
      function createRectInit(x, y, width, height) {
        return {
          x,
          y,
          width,
          height
        };
      }
      var ResizeObservation = function() {
        function ResizeObservation2(target, rootNode) {
          this.broadcastWidth = 0;
          this.broadcastHeight = 0;
          this.contentRect_ = createRectInit(0, 0, 0, 0);
          this.target = target;
          this.rootNode = rootNode;
        }
        ResizeObservation2.prototype.isActive = function() {
          var rect = getContentRect(this.target);
          this.contentRect_ = rect;
          return rect.width !== this.broadcastWidth || rect.height !== this.broadcastHeight;
        };
        ResizeObservation2.prototype.broadcastRect = function() {
          var rect = this.contentRect_;
          this.broadcastWidth = rect.width;
          this.broadcastHeight = rect.height;
          return rect;
        };
        return ResizeObservation2;
      }();
      var ResizeObserverEntry = function() {
        function ResizeObserverEntry2(target, rectInit) {
          var contentRect = createReadOnlyRect(rectInit);
          defineConfigurable(this, {
            target,
            contentRect
          });
        }
        return ResizeObserverEntry2;
      }();
      function getRootNode(node) {
        if (typeof node.getRootNode === "function") {
          return node.getRootNode();
        }
        var n;
        for (n = node; n.parentNode; n = n.parentNode) {
        }
        return n;
      }
      var intersectionObserverSupported = typeof IntersectionObserver !== "undefined";
      var ResizeObserverSPI = function() {
        function ResizeObserverSPI2(callback, controller, callbackCtx) {
          var _this = this;
          this.activeObservations_ = [];
          this.observations_ = new MapShim();
          this.rootNodes_ = new MapShim();
          this.intersectionObserver_ = null;
          if (typeof callback !== "function") {
            throw new TypeError("The callback provided as parameter 1 is not a function.");
          }
          this.callback_ = callback;
          this.controller_ = controller;
          this.callbackCtx_ = callbackCtx;
          if (intersectionObserverSupported) {
            this.intersectionObserver_ = new IntersectionObserver(function() {
              return _this.checkRootChanges_();
            });
          }
        }
        ResizeObserverSPI2.prototype.observe = function(target) {
          if (!arguments.length) {
            throw new TypeError("1 argument required, but only 0 present.");
          }
          if (typeof Element === "undefined" || !(Element instanceof Object)) {
            return;
          }
          if (!(target instanceof getWindowOf(target).Element)) {
            throw new TypeError('parameter 1 is not of type "Element".');
          }
          var observations = this.observations_;
          if (observations.has(target)) {
            return;
          }
          var rootNode = getControlledRootNode(target, target.ownerDocument);
          observations.set(target, new ResizeObservation(target, rootNode));
          var rootNodeTargets = this.rootNodes_.get(rootNode);
          if (!rootNodeTargets) {
            rootNodeTargets = [];
            this.rootNodes_.set(rootNode, rootNodeTargets);
            this.controller_.addObserver(rootNode, this);
          }
          rootNodeTargets.push(target);
          if (this.intersectionObserver_) {
            this.intersectionObserver_.observe(target);
          }
          this.controller_.refresh(rootNode);
        };
        ResizeObserverSPI2.prototype.unobserve = function(target) {
          if (!arguments.length) {
            throw new TypeError("1 argument required, but only 0 present.");
          }
          if (typeof Element === "undefined" || !(Element instanceof Object)) {
            return;
          }
          if (!(target instanceof getWindowOf(target).Element)) {
            throw new TypeError('parameter 1 is not of type "Element".');
          }
          var observations = this.observations_;
          var observation = observations.get(target);
          if (!observation) {
            return;
          }
          observations.delete(target);
          if (this.intersectionObserver_) {
            this.intersectionObserver_.unobserve(target);
          }
          var rootNode = observation.rootNode;
          var rootNodeTargets = this.rootNodes_.get(rootNode);
          if (rootNodeTargets) {
            var index2 = rootNodeTargets.indexOf(target);
            if (~index2) {
              rootNodeTargets.splice(index2, 1);
            }
            if (rootNodeTargets.length === 0) {
              this.rootNodes_.delete(rootNode);
              this.controller_.removeObserver(rootNode, this);
            }
          }
        };
        ResizeObserverSPI2.prototype.disconnect = function() {
          var _this = this;
          this.clearActive();
          this.observations_.clear();
          this.rootNodes_.forEach(function(_, rootNode) {
            _this.controller_.removeObserver(rootNode, _this);
          });
          this.rootNodes_.clear();
          if (this.intersectionObserver_) {
            this.intersectionObserver_.disconnect();
            this.intersectionObserver_ = null;
          }
        };
        ResizeObserverSPI2.prototype.gatherActive = function() {
          var _this = this;
          this.checkRootChanges_();
          this.clearActive();
          this.observations_.forEach(function(observation) {
            if (observation.isActive()) {
              _this.activeObservations_.push(observation);
            }
          });
        };
        ResizeObserverSPI2.prototype.broadcastActive = function() {
          if (!this.hasActive()) {
            return;
          }
          var ctx = this.callbackCtx_;
          var entries = this.activeObservations_.map(function(observation) {
            return new ResizeObserverEntry(observation.target, observation.broadcastRect());
          });
          this.callback_.call(ctx, entries, ctx);
          this.clearActive();
        };
        ResizeObserverSPI2.prototype.clearActive = function() {
          this.activeObservations_.splice(0);
        };
        ResizeObserverSPI2.prototype.hasActive = function() {
          return this.activeObservations_.length > 0;
        };
        ResizeObserverSPI2.prototype.checkRootChanges_ = function() {
          var _this = this;
          var changedRootTargets = null;
          this.observations_.forEach(function(observation) {
            var target = observation.target, oldRootNode = observation.rootNode;
            var rootNode = getControlledRootNode(target, oldRootNode);
            if (rootNode !== oldRootNode) {
              if (!changedRootTargets) {
                changedRootTargets = [];
              }
              changedRootTargets.push(target);
            }
          });
          if (changedRootTargets) {
            changedRootTargets.forEach(function(target) {
              _this.unobserve(target);
              _this.observe(target);
            });
          }
        };
        return ResizeObserverSPI2;
      }();
      function getControlledRootNode(target, def) {
        var rootNode = getRootNode(target);
        if (rootNode.nodeType === 9 || rootNode.nodeType === 11) {
          return rootNode;
        }
        return def;
      }
      var requestAnimationFrame$1 = function() {
        if (typeof requestAnimationFrame === "function") {
          return requestAnimationFrame.bind(global$1);
        }
        return function(callback) {
          return setTimeout(function() {
            return callback(Date.now());
          }, 1e3 / 60);
        };
      }();
      var trailingTimeout = 2;
      function throttle(callback, delay) {
        var leadingCall = false, trailingCall = false, lastCallTime = 0;
        function resolvePending() {
          if (leadingCall) {
            leadingCall = false;
            callback();
          }
          if (trailingCall) {
            proxy();
          }
        }
        function timeoutCallback() {
          requestAnimationFrame$1(resolvePending);
        }
        function proxy() {
          var timeStamp = Date.now();
          if (leadingCall) {
            if (timeStamp - lastCallTime < trailingTimeout) {
              return;
            }
            trailingCall = true;
          } else {
            leadingCall = true;
            trailingCall = false;
            setTimeout(timeoutCallback, delay);
          }
          lastCallTime = timeStamp;
        }
        return proxy;
      }
      var REFRESH_DELAY = 20;
      var transitionKeys = ["top", "right", "bottom", "left", "width", "height", "size", "weight"];
      var mutationObserverSupported = typeof MutationObserver !== "undefined";
      var ResizeObserverController = function() {
        function ResizeObserverController2(rootNode, globalController) {
          this.rootNode_ = null;
          this.globalController_ = null;
          this.connected_ = false;
          this.mutationEventsAdded_ = false;
          this.mutationsObserver_ = null;
          this.hostObserver_ = null;
          this.observers_ = [];
          this.rootNode_ = rootNode;
          this.globalController_ = globalController;
          this.onTransitionEnd_ = this.onTransitionEnd_.bind(this);
          this.refresh = throttle(this.refresh.bind(this), REFRESH_DELAY);
        }
        ResizeObserverController2.prototype.addObserver = function(observer) {
          if (!~this.observers_.indexOf(observer)) {
            this.observers_.push(observer);
          }
          if (!this.connected_) {
            this.connect_();
          }
        };
        ResizeObserverController2.prototype.removeObserver = function(observer) {
          var observers2 = this.observers_;
          var index2 = observers2.indexOf(observer);
          if (~index2) {
            observers2.splice(index2, 1);
          }
          if (!observers2.length && this.connected_) {
            this.disconnect_();
          }
        };
        ResizeObserverController2.prototype.refresh = function() {
          var changesDetected = this.updateObservers_();
          if (changesDetected) {
            this.refresh();
          }
        };
        ResizeObserverController2.prototype.updateObservers_ = function() {
          var activeObservers = this.observers_.filter(function(observer) {
            return observer.gatherActive(), observer.hasActive();
          });
          activeObservers.forEach(function(observer) {
            return observer.broadcastActive();
          });
          return activeObservers.length > 0;
        };
        ResizeObserverController2.prototype.connect_ = function() {
          if (!isBrowser || this.connected_) {
            return;
          }
          var rootNode = this.rootNode_;
          var doc = rootNode.ownerDocument || rootNode;
          var win = doc.defaultView;
          rootNode.addEventListener("transitionend", this.onTransitionEnd_, true);
          if (win) {
            win.addEventListener("resize", this.refresh, true);
          }
          if (mutationObserverSupported) {
            this.mutationsObserver_ = new MutationObserver(this.refresh);
            this.mutationsObserver_.observe(rootNode, {
              attributes: true,
              childList: true,
              characterData: true,
              subtree: true
            });
          } else {
            rootNode.addEventListener("DOMSubtreeModified", this.refresh, true);
            this.mutationEventsAdded_ = true;
          }
          if (this.rootNode_.host) {
            this.hostObserver_ = new ResizeObserverSPI(this.refresh, this.globalController_, this);
            this.hostObserver_.observe(this.rootNode_.host);
          }
          this.connected_ = true;
        };
        ResizeObserverController2.prototype.disconnect_ = function() {
          if (!isBrowser || !this.connected_) {
            return;
          }
          var rootNode = this.rootNode_;
          var doc = rootNode.ownerDocument || rootNode;
          var win = doc.defaultView;
          rootNode.removeEventListener("transitionend", this.onTransitionEnd_, true);
          if (win) {
            win.removeEventListener("resize", this.refresh, true);
          }
          if (this.mutationsObserver_) {
            this.mutationsObserver_.disconnect();
          }
          if (this.mutationEventsAdded_) {
            rootNode.removeEventListener("DOMSubtreeModified", this.refresh, true);
          }
          if (this.hostObserver_) {
            this.hostObserver_.disconnect();
          }
          this.hostObserver_ = null;
          this.mutationsObserver_ = null;
          this.mutationEventsAdded_ = false;
          this.connected_ = false;
        };
        ResizeObserverController2.prototype.onTransitionEnd_ = function(_a) {
          var _b = _a.propertyName, propertyName = _b === void 0 ? "" : _b;
          var isReflowProperty = transitionKeys.some(function(key) {
            return !!~propertyName.indexOf(key);
          });
          if (isReflowProperty) {
            this.refresh();
          }
        };
        return ResizeObserverController2;
      }();
      var GlobalResizeObserverController = function() {
        function GlobalResizeObserverController2() {
          this.rootNodeControllers_ = typeof WeakMap !== "undefined" ? new WeakMap() : new Map();
        }
        GlobalResizeObserverController2.prototype.addObserver = function(rootNode, observer) {
          var rootNodeController = this.rootNodeControllers_.get(rootNode);
          if (!rootNodeController) {
            rootNodeController = new ResizeObserverController(rootNode, this);
            this.rootNodeControllers_.set(rootNode, rootNodeController);
          }
          rootNodeController.addObserver(observer);
        };
        GlobalResizeObserverController2.prototype.removeObserver = function(rootNode, observer) {
          var rootNodeController = this.rootNodeControllers_.get(rootNode);
          if (rootNodeController) {
            rootNodeController.removeObserver(observer);
          }
        };
        GlobalResizeObserverController2.prototype.refresh = function(rootNode) {
          var rootNodeController = this.rootNodeControllers_.get(rootNode);
          if (rootNodeController) {
            rootNodeController.refresh();
          }
        };
        GlobalResizeObserverController2.getInstance = function() {
          if (!this.instance_) {
            this.instance_ = new GlobalResizeObserverController2();
          }
          return this.instance_;
        };
        GlobalResizeObserverController2.instance_ = null;
        return GlobalResizeObserverController2;
      }();
      var observers = typeof WeakMap !== "undefined" ? new WeakMap() : new MapShim();
      var ResizeObserver = function() {
        function ResizeObserver2(callback) {
          if (!(this instanceof ResizeObserver2)) {
            throw new TypeError("Cannot call a class as a function.");
          }
          if (!arguments.length) {
            throw new TypeError("1 argument required, but only 0 present.");
          }
          var controller = GlobalResizeObserverController.getInstance();
          var observer = new ResizeObserverSPI(callback, controller, this);
          observers.set(this, observer);
        }
        return ResizeObserver2;
      }();
      ["observe", "unobserve", "disconnect"].forEach(function(method) {
        ResizeObserver.prototype[method] = function() {
          var _a;
          return (_a = observers.get(this))[method].apply(_a, arguments);
        };
      });
      var index = function() {
        if (typeof global$1.ResizeObserver !== "undefined") {
          return global$1.ResizeObserver;
        }
        return ResizeObserver;
      }();
      return index;
    });
  }

  // src/assert.js
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {constructor: {value: subClass, writable: true, configurable: true}});
    if (superClass)
      _setPrototypeOf(subClass, superClass);
  }
  function _createSuper(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct();
    return function _createSuperInternal() {
      var Super = _getPrototypeOf(Derived), result;
      if (hasNativeReflectConstruct) {
        var NewTarget = _getPrototypeOf(this).constructor;
        result = Reflect.construct(Super, arguments, NewTarget);
      } else {
        result = Super.apply(this, arguments);
      }
      return _possibleConstructorReturn(this, result);
    };
  }
  function _possibleConstructorReturn(self2, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }
    return _assertThisInitialized(self2);
  }
  function _assertThisInitialized(self2) {
    if (self2 === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return self2;
  }
  function _wrapNativeSuper(Class) {
    var _cache = typeof Map === "function" ? new Map() : void 0;
    _wrapNativeSuper = function _wrapNativeSuper2(Class2) {
      if (Class2 === null || !_isNativeFunction(Class2))
        return Class2;
      if (typeof Class2 !== "function") {
        throw new TypeError("Super expression must either be null or a function");
      }
      if (typeof _cache !== "undefined") {
        if (_cache.has(Class2))
          return _cache.get(Class2);
        _cache.set(Class2, Wrapper);
      }
      function Wrapper() {
        return _construct(Class2, arguments, _getPrototypeOf(this).constructor);
      }
      Wrapper.prototype = Object.create(Class2.prototype, {constructor: {value: Wrapper, enumerable: false, writable: true, configurable: true}});
      return _setPrototypeOf(Wrapper, Class2);
    };
    return _wrapNativeSuper(Class);
  }
  function _construct(Parent, args, Class) {
    if (_isNativeReflectConstruct()) {
      _construct = Reflect.construct;
    } else {
      _construct = function _construct2(Parent2, args2, Class2) {
        var a = [null];
        a.push.apply(a, args2);
        var Constructor = Function.bind.apply(Parent2, a);
        var instance = new Constructor();
        if (Class2)
          _setPrototypeOf(instance, Class2.prototype);
        return instance;
      };
    }
    return _construct.apply(null, arguments);
  }
  function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct)
      return false;
    if (Reflect.construct.sham)
      return false;
    if (typeof Proxy === "function")
      return true;
    try {
      Date.prototype.toString.call(Reflect.construct(Date, [], function() {
      }));
      return true;
    } catch (e) {
      return false;
    }
  }
  function _isNativeFunction(fn) {
    return Function.toString.call(fn).indexOf("[native code]") !== -1;
  }
  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf2(o2, p2) {
      o2.__proto__ = p2;
      return o2;
    };
    return _setPrototypeOf(o, p);
  }
  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf2(o2) {
      return o2.__proto__ || Object.getPrototypeOf(o2);
    };
    return _getPrototypeOf(o);
  }
  var USER_ERROR_SENTINEL = "\u200B\u200B\u200B";
  var UserError = /* @__PURE__ */ function(_Error) {
    _inherits(UserError2, _Error);
    var _super = _createSuper(UserError2);
    function UserError2(message) {
      _classCallCheck(this, UserError2);
      if (!message) {
        message = USER_ERROR_SENTINEL;
      } else if (message.indexOf(USER_ERROR_SENTINEL) == -1) {
        message += USER_ERROR_SENTINEL;
      }
      return _super.call(this, message);
    }
    return UserError2;
  }(/* @__PURE__ */ _wrapNativeSuper(Error));

  // src/internal-version.js
  function internalRuntimeVersion() {
    return "2102250055000";
  }

  // src/url-try-decode-uri-component.js
  function tryDecodeUriComponent_(component, fallback) {
    if (fallback === void 0) {
      fallback = "";
    }
    try {
      return decodeURIComponent(component);
    } catch (e) {
      return fallback;
    }
  }

  // src/url-parse-query-string.js
  var regex = /(?:^[#?]?|&)([^=&]+)(?:=([^&]*))?/g;
  function parseQueryString_(queryString) {
    var params = Object.create(null);
    if (!queryString) {
      return params;
    }
    var match;
    while (match = regex.exec(queryString)) {
      var name = tryDecodeUriComponent_(match[1], match[1]);
      var value = match[2] ? tryDecodeUriComponent_(match[2].replace(/\+/g, " "), match[2]) : "";
      params[name] = value;
    }
    return params;
  }

  // src/mode.js
  var rtvVersion = "";
  function getMode(opt_win) {
    var win = opt_win || self;
    if (win.__AMP_MODE) {
      return win.__AMP_MODE;
    }
    return win.__AMP_MODE = getMode_(win);
  }
  function getMode_(win) {
    var AMP_CONFIG = self.AMP_CONFIG || {};
    var IS_DEV = true;
    var IS_MINIFIED = false;
    var runningTests = IS_DEV && !!(AMP_CONFIG.test || win.__AMP_TEST || win.__karma__);
    var isLocalDev = IS_DEV && (!!AMP_CONFIG.localDev || runningTests);
    var hashQuery = parseQueryString_(win.location.originalHash || win.location.hash);
    var searchQuery = parseQueryString_(win.location.search);
    if (!rtvVersion) {
      rtvVersion = getRtvVersion(win);
    }
    return {
      localDev: isLocalDev,
      development: !!(["1", "actions", "amp", "amp4ads", "amp4email"].indexOf(hashQuery["development"]) >= 0 || win.AMP_DEV_MODE),
      examiner: hashQuery["development"] == "2",
      esm: false,
      geoOverride: hashQuery["amp-geo"],
      minified: IS_MINIFIED,
      lite: searchQuery["amp_lite"] != void 0,
      test: runningTests,
      log: hashQuery["log"],
      version: internalRuntimeVersion(),
      rtvVersion
    };
  }
  function getRtvVersion(win) {
    if (win.AMP_CONFIG && win.AMP_CONFIG.v) {
      return win.AMP_CONFIG.v;
    }
    return "01" + internalRuntimeVersion();
  }

  // src/config.js
  var env = self.AMP_CONFIG || {};
  var thirdPartyFrameRegex = (typeof env["thirdPartyFrameRegex"] == "string" ? new RegExp(env["thirdPartyFrameRegex"]) : env["thirdPartyFrameRegex"]) || /^d-\d+\.ampproject\.net$/;
  var cdnProxyRegex = (typeof env["cdnProxyRegex"] == "string" ? new RegExp(env["cdnProxyRegex"]) : env["cdnProxyRegex"]) || /^https:\/\/([a-zA-Z0-9_-]+\.)?cdn\.ampproject\.org$/;
  function getMetaUrl(name) {
    if (!self.document || !self.document.head) {
      return null;
    }
    if (self.location && cdnProxyRegex.test(self.location.origin)) {
      return null;
    }
    var metaEl = self.document.head.querySelector('meta[name="' + name + '"]');
    return metaEl && metaEl.getAttribute("content") || null;
  }
  var urls = {
    thirdParty: env["thirdPartyUrl"] || "https://3p.ampproject.net",
    thirdPartyFrameHost: env["thirdPartyFrameHost"] || "ampproject.net",
    thirdPartyFrameRegex,
    cdn: env["cdnUrl"] || getMetaUrl("runtime-host") || "https://cdn.ampproject.org",
    cdnProxyRegex,
    localhostRegex: /^https?:\/\/localhost(:\d+)?$/,
    errorReporting: env["errorReportingUrl"] || "https://us-central1-amp-error-reporting.cloudfunctions.net/r",
    betaErrorReporting: env["betaErrorReportingUrl"] || "https://us-central1-amp-error-reporting.cloudfunctions.net/r-beta",
    localDev: env["localDev"] || false,
    trustedViewerHosts: [/(^|\.)google\.(com?|[a-z]{2}|com?\.[a-z]{2}|cat)$/, /(^|\.)gmail\.(com|dev)$/],
    geoApi: env["geoApiUrl"] || getMetaUrl("amp-geo-api")
  };

  // src/log.js
  var LogLevel = {
    OFF: 0,
    ERROR: 1,
    WARN: 2,
    INFO: 3,
    FINE: 4
  };
  self.__AMP_LOG = self.__AMP_LOG || {
    user: null,
    dev: null,
    userForEmbed: null
  };
  var logs = self.__AMP_LOG;
  var logConstructor = null;
  function dev() {
    if (logs.dev) {
      return logs.dev;
    }
    if (!logConstructor) {
      throw new Error("failed to call initLogConstructor");
    }
    return logs.dev = new logConstructor(self, function(logNum) {
      if (logNum >= 3) {
        return LogLevel.FINE;
      }
      if (logNum >= 2) {
        return LogLevel.INFO;
      }
      return LogLevel.OFF;
    });
  }
  function devAssert(shouldBeTrueish, opt_message, opt_1, opt_2, opt_3, opt_4, opt_5, opt_6, opt_7, opt_8, opt_9) {
    if (getMode().minified) {
      return shouldBeTrueish;
    }
    return dev().assert(shouldBeTrueish, opt_message, opt_1, opt_2, opt_3, opt_4, opt_5, opt_6, opt_7, opt_8, opt_9);
  }

  // src/service.js
  function registerServiceBuilder(win, id, constructor, opt_instantiate) {
    win = getTopWindow(win);
    registerServiceInternal(win, win, id, constructor);
    if (opt_instantiate) {
      getServiceInternal(win, id);
    }
  }
  function getTopWindow(win) {
    return win.__AMP_TOP || (win.__AMP_TOP = win);
  }
  function getServiceInternal(holder, id) {
    devAssert(isServiceRegistered(holder, id), "Expected service " + id + " to be registered");
    var services = getServices(holder);
    var s = services[id];
    if (!s.obj) {
      devAssert(s.ctor, "Service " + id + " registered without ctor nor impl.");
      devAssert(s.context, "Service " + id + " registered without context.");
      s.obj = new s.ctor(s.context);
      devAssert(s.obj, "Service " + id + " constructed to null.");
      s.ctor = null;
      s.context = null;
      if (s.resolve) {
        s.resolve(s.obj);
      }
    }
    return s.obj;
  }
  function registerServiceInternal(holder, context, id, ctor, opt_override, opt_adopted) {
    var services = getServices(holder);
    var s = services[id];
    if (!s) {
      s = services[id] = {
        obj: null,
        promise: null,
        resolve: null,
        reject: null,
        context: null,
        ctor: null,
        adopted: opt_adopted || false
      };
    }
    if (!opt_override && (s.ctor || s.obj)) {
      return;
    }
    s.ctor = ctor;
    s.context = context;
    s.adopted = opt_adopted || false;
    if (s.resolve) {
      getServiceInternal(holder, id);
    }
  }
  function getServices(holder) {
    var services = holder.__AMP_SERVICES;
    if (!services) {
      services = holder.__AMP_SERVICES = {};
    }
    return services;
  }
  function isServiceRegistered(holder, id) {
    var service = holder.__AMP_SERVICES && holder.__AMP_SERVICES[id];
    return !!(service && (service.ctor || service.obj));
  }

  // src/resolved-promise.js
  var resolved;
  function resolvedPromise() {
    if (resolved) {
      return resolved;
    }
    resolved = Promise.resolve(void 0);
    return resolved;
  }

  // third_party/css-escape/css-escape.js
  /*! https://mths.be/cssescape v1.5.1 by @mathias | MIT license */

  // src/polyfillstub/resize-observer-stub.js
  function _classCallCheck2(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor)
        descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps)
      _defineProperties(Constructor.prototype, protoProps);
    if (staticProps)
      _defineProperties(Constructor, staticProps);
    return Constructor;
  }
  var UPGRADERS = "_upgraders";
  var STUB = "_stub";
  function upgradePolyfill(win, installer) {
    var Stub = win.ResizeObserver[STUB];
    if (Stub) {
      delete win.ResizeObserver;
      delete win.ResizeObserverEntry;
      installer();
      var Polyfill = win.ResizeObserver;
      var upgraders = Stub[UPGRADERS].slice(0);
      var microtask = resolvedPromise();
      var upgrade2 = function upgrade3(upgrader) {
        microtask.then(function() {
          return upgrader(Polyfill);
        });
      };
      if (upgraders.length > 0) {
        upgraders.forEach(upgrade2);
      }
      Stub[UPGRADERS] = {
        push: upgrade2
      };
    } else {
      installer();
    }
  }
  var ResizeObserverStub = /* @__PURE__ */ function() {
    function ResizeObserverStub2(callback) {
      _classCallCheck2(this, ResizeObserverStub2);
      this.callback_ = callback;
      this.elements_ = [];
      this.inst_ = null;
      ResizeObserverStub2[UPGRADERS].push(this.upgrade_.bind(this));
    }
    _createClass(ResizeObserverStub2, [{
      key: "disconnect",
      value: function disconnect() {
        if (this.inst_) {
          this.inst_.disconnect();
        } else {
          this.elements_.length = 0;
        }
      }
    }, {
      key: "observe",
      value: function observe(target) {
        if (this.inst_) {
          this.inst_.observe(target);
        } else {
          if (this.elements_.indexOf(target) == -1) {
            this.elements_.push(target);
          }
        }
      }
    }, {
      key: "unobserve",
      value: function unobserve(target) {
        if (this.inst_) {
          this.inst_.unobserve(target);
        } else {
          var index = this.elements_.indexOf(target);
          if (index != -1) {
            this.elements_.splice(index, 1);
          }
        }
      }
    }, {
      key: "upgrade_",
      value: function upgrade_(constr) {
        var inst = new constr(this.callback_, this.options_);
        this.inst_ = inst;
        this.elements_.forEach(function(e) {
          return inst.observe(e);
        });
        this.elements_ = null;
      }
    }]);
    return ResizeObserverStub2;
  }();
  ResizeObserverStub[UPGRADERS] = [];

  // extensions/amp-resize-observer-polyfill/0.1/amp-resize-observer-polyfill.js
  var TAG = "amp-resize-observer-polyfill";
  function upgrade(win) {
    upgradePolyfill(win, function() {
      installResizeObserver(win);
    });
    return {};
  }
  function upgradeResizeObserverPolyfill(win) {
    registerServiceBuilder(win, TAG, upgrade, true);
  }
  AMP.extension(TAG, "0.1", function(AMP2) {
    upgradeResizeObserverPolyfill(window);
  });
})();

})});
//# sourceMappingURL=amp-resize-observer-polyfill-0.1.max.js.map
