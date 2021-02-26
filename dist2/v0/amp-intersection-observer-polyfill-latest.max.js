(self.AMP=self.AMP||[]).push({n:"amp-intersection-observer-polyfill",v:"2102250055000",m:0,f:(function(AMP,_){

(() => {
  // node_modules/intersection-observer/intersection-observer.install.js
  function installIntersectionObserver() {
    (function() {
      "use strict";
      if (typeof window !== "object") {
        return;
      }
      if ("IntersectionObserver" in window && "IntersectionObserverEntry" in window && "intersectionRatio" in window.IntersectionObserverEntry.prototype) {
        if (!("isIntersecting" in window.IntersectionObserverEntry.prototype)) {
          Object.defineProperty(window.IntersectionObserverEntry.prototype, "isIntersecting", {
            get: function get() {
              return this.intersectionRatio > 0;
            }
          });
        }
        return;
      }
      function getFrameElement(doc) {
        try {
          return doc.defaultView && doc.defaultView.frameElement || null;
        } catch (e) {
          return null;
        }
      }
      var document = function(startDoc) {
        var doc = startDoc;
        var frame = getFrameElement(doc);
        while (frame) {
          doc = frame.ownerDocument;
          frame = getFrameElement(doc);
        }
        return doc;
      }(window.document);
      var registry = [];
      var crossOriginUpdater = null;
      var crossOriginRect = null;
      function IntersectionObserverEntry(entry) {
        this.time = entry.time;
        this.target = entry.target;
        this.rootBounds = ensureDOMRect(entry.rootBounds);
        this.boundingClientRect = ensureDOMRect(entry.boundingClientRect);
        this.intersectionRect = ensureDOMRect(entry.intersectionRect || getEmptyRect());
        this.isIntersecting = !!entry.intersectionRect;
        var targetRect = this.boundingClientRect;
        var targetArea = targetRect.width * targetRect.height;
        var intersectionRect = this.intersectionRect;
        var intersectionArea = intersectionRect.width * intersectionRect.height;
        if (targetArea) {
          this.intersectionRatio = Number((intersectionArea / targetArea).toFixed(4));
        } else {
          this.intersectionRatio = this.isIntersecting ? 1 : 0;
        }
      }
      function IntersectionObserver(callback, opt_options) {
        var options = opt_options || {};
        if (typeof callback != "function") {
          throw new Error("callback must be a function");
        }
        if (options.root && options.root.nodeType != 1 && options.root.nodeType != 9) {
          throw new Error("root must be a Document or Element");
        }
        this._checkForIntersections = throttle(this._checkForIntersections.bind(this), this.THROTTLE_TIMEOUT);
        this._callback = callback;
        this._observationTargets = [];
        this._queuedEntries = [];
        this._rootMarginValues = this._parseRootMargin(options.rootMargin);
        this.thresholds = this._initThresholds(options.threshold);
        this.root = options.root || null;
        this.rootMargin = this._rootMarginValues.map(function(margin) {
          return margin.value + margin.unit;
        }).join(" ");
        this._monitoringDocuments = [];
        this._monitoringUnsubscribes = [];
      }
      IntersectionObserver.prototype.THROTTLE_TIMEOUT = 100;
      IntersectionObserver.prototype.POLL_INTERVAL = null;
      IntersectionObserver.prototype.USE_MUTATION_OBSERVER = true;
      IntersectionObserver._setupCrossOriginUpdater = function() {
        if (!crossOriginUpdater) {
          crossOriginUpdater = function crossOriginUpdater2(boundingClientRect, intersectionRect) {
            if (!boundingClientRect || !intersectionRect) {
              crossOriginRect = getEmptyRect();
            } else {
              crossOriginRect = convertFromParentRect(boundingClientRect, intersectionRect);
            }
            registry.forEach(function(observer) {
              observer._checkForIntersections();
            });
          };
        }
        return crossOriginUpdater;
      };
      IntersectionObserver._resetCrossOriginUpdater = function() {
        crossOriginUpdater = null;
        crossOriginRect = null;
      };
      IntersectionObserver.prototype.observe = function(target) {
        var isTargetAlreadyObserved = this._observationTargets.some(function(item) {
          return item.element == target;
        });
        if (isTargetAlreadyObserved) {
          return;
        }
        if (!(target && target.nodeType == 1)) {
          throw new Error("target must be an Element");
        }
        this._registerInstance();
        this._observationTargets.push({
          element: target,
          entry: null
        });
        this._monitorIntersections(target.ownerDocument);
        this._checkForIntersections();
      };
      IntersectionObserver.prototype.unobserve = function(target) {
        this._observationTargets = this._observationTargets.filter(function(item) {
          return item.element != target;
        });
        this._unmonitorIntersections(target.ownerDocument);
        if (this._observationTargets.length == 0) {
          this._unregisterInstance();
        }
      };
      IntersectionObserver.prototype.disconnect = function() {
        this._observationTargets = [];
        this._unmonitorAllIntersections();
        this._unregisterInstance();
      };
      IntersectionObserver.prototype.takeRecords = function() {
        var records = this._queuedEntries.slice();
        this._queuedEntries = [];
        return records;
      };
      IntersectionObserver.prototype._initThresholds = function(opt_threshold) {
        var threshold = opt_threshold || [0];
        if (!Array.isArray(threshold))
          threshold = [threshold];
        return threshold.sort().filter(function(t, i, a) {
          if (typeof t != "number" || isNaN(t) || t < 0 || t > 1) {
            throw new Error("threshold must be a number between 0 and 1 inclusively");
          }
          return t !== a[i - 1];
        });
      };
      IntersectionObserver.prototype._parseRootMargin = function(opt_rootMargin) {
        var marginString = opt_rootMargin || "0px";
        var margins = marginString.split(/\s+/).map(function(margin) {
          var parts = /^(-?\d*\.?\d+)(px|%)$/.exec(margin);
          if (!parts) {
            throw new Error("rootMargin must be specified in pixels or percent");
          }
          return {
            value: parseFloat(parts[1]),
            unit: parts[2]
          };
        });
        margins[1] = margins[1] || margins[0];
        margins[2] = margins[2] || margins[0];
        margins[3] = margins[3] || margins[1];
        return margins;
      };
      IntersectionObserver.prototype._monitorIntersections = function(doc) {
        var win = doc.defaultView;
        if (!win) {
          return;
        }
        if (this._monitoringDocuments.indexOf(doc) != -1) {
          return;
        }
        var callback = this._checkForIntersections;
        var monitoringInterval = null;
        var domObserver = null;
        if (this.POLL_INTERVAL) {
          monitoringInterval = win.setInterval(callback, this.POLL_INTERVAL);
        } else {
          addEvent(win, "resize", callback, true);
          addEvent(doc, "scroll", callback, true);
          if (this.USE_MUTATION_OBSERVER && "MutationObserver" in win) {
            domObserver = new win.MutationObserver(callback);
            domObserver.observe(doc, {
              attributes: true,
              childList: true,
              characterData: true,
              subtree: true
            });
          }
        }
        this._monitoringDocuments.push(doc);
        this._monitoringUnsubscribes.push(function() {
          var win2 = doc.defaultView;
          if (win2) {
            if (monitoringInterval) {
              win2.clearInterval(monitoringInterval);
            }
            removeEvent(win2, "resize", callback, true);
          }
          removeEvent(doc, "scroll", callback, true);
          if (domObserver) {
            domObserver.disconnect();
          }
        });
        var rootDoc = this.root && (this.root.ownerDocument || this.root) || document;
        if (doc != rootDoc) {
          var frame = getFrameElement(doc);
          if (frame) {
            this._monitorIntersections(frame.ownerDocument);
          }
        }
      };
      IntersectionObserver.prototype._unmonitorIntersections = function(doc) {
        var index = this._monitoringDocuments.indexOf(doc);
        if (index == -1) {
          return;
        }
        var rootDoc = this.root && (this.root.ownerDocument || this.root) || document;
        var hasDependentTargets = this._observationTargets.some(function(item) {
          var itemDoc = item.element.ownerDocument;
          if (itemDoc == doc) {
            return true;
          }
          while (itemDoc && itemDoc != rootDoc) {
            var frame2 = getFrameElement(itemDoc);
            itemDoc = frame2 && frame2.ownerDocument;
            if (itemDoc == doc) {
              return true;
            }
          }
          return false;
        });
        if (hasDependentTargets) {
          return;
        }
        var unsubscribe = this._monitoringUnsubscribes[index];
        this._monitoringDocuments.splice(index, 1);
        this._monitoringUnsubscribes.splice(index, 1);
        unsubscribe();
        if (doc != rootDoc) {
          var frame = getFrameElement(doc);
          if (frame) {
            this._unmonitorIntersections(frame.ownerDocument);
          }
        }
      };
      IntersectionObserver.prototype._unmonitorAllIntersections = function() {
        var unsubscribes = this._monitoringUnsubscribes.slice(0);
        this._monitoringDocuments.length = 0;
        this._monitoringUnsubscribes.length = 0;
        for (var i = 0; i < unsubscribes.length; i++) {
          unsubscribes[i]();
        }
      };
      IntersectionObserver.prototype._checkForIntersections = function() {
        if (!this.root && crossOriginUpdater && !crossOriginRect) {
          return;
        }
        var rootIsInDom = this._rootIsInDom();
        var rootRect = rootIsInDom ? this._getRootRect() : getEmptyRect();
        this._observationTargets.forEach(function(item) {
          var target = item.element;
          var targetRect = getBoundingClientRect(target);
          var rootContainsTarget = this._rootContainsTarget(target);
          var oldEntry = item.entry;
          var intersectionRect = rootIsInDom && rootContainsTarget && this._computeTargetAndRootIntersection(target, targetRect, rootRect);
          var rootBounds = null;
          if (!this._rootContainsTarget(target)) {
            rootBounds = getEmptyRect();
          } else if (!crossOriginUpdater || this.root) {
            rootBounds = rootRect;
          }
          var newEntry = item.entry = new IntersectionObserverEntry({
            time: now(),
            target,
            boundingClientRect: targetRect,
            rootBounds,
            intersectionRect
          });
          if (!oldEntry) {
            this._queuedEntries.push(newEntry);
          } else if (rootIsInDom && rootContainsTarget) {
            if (this._hasCrossedThreshold(oldEntry, newEntry)) {
              this._queuedEntries.push(newEntry);
            }
          } else {
            if (oldEntry && oldEntry.isIntersecting) {
              this._queuedEntries.push(newEntry);
            }
          }
        }, this);
        if (this._queuedEntries.length) {
          this._callback(this.takeRecords(), this);
        }
      };
      IntersectionObserver.prototype._computeTargetAndRootIntersection = function(target, targetRect, rootRect) {
        if (window.getComputedStyle(target).display == "none")
          return;
        var intersectionRect = targetRect;
        var parent = getParentNode(target);
        var atRoot = false;
        while (!atRoot && parent) {
          var parentRect = null;
          var parentComputedStyle = parent.nodeType == 1 ? window.getComputedStyle(parent) : {};
          if (parentComputedStyle.display == "none")
            return null;
          if (parent == this.root || parent.nodeType == 9) {
            atRoot = true;
            if (parent == this.root || parent == document) {
              if (crossOriginUpdater && !this.root) {
                if (!crossOriginRect || crossOriginRect.width == 0 && crossOriginRect.height == 0) {
                  parent = null;
                  parentRect = null;
                  intersectionRect = null;
                } else {
                  parentRect = crossOriginRect;
                }
              } else {
                parentRect = rootRect;
              }
            } else {
              var frame = getParentNode(parent);
              var frameRect = frame && getBoundingClientRect(frame);
              var frameIntersect = frame && this._computeTargetAndRootIntersection(frame, frameRect, rootRect);
              if (frameRect && frameIntersect) {
                parent = frame;
                parentRect = convertFromParentRect(frameRect, frameIntersect);
              } else {
                parent = null;
                intersectionRect = null;
              }
            }
          } else {
            var doc = parent.ownerDocument;
            if (parent != doc.body && parent != doc.documentElement && parentComputedStyle.overflow != "visible") {
              parentRect = getBoundingClientRect(parent);
            }
          }
          if (parentRect) {
            intersectionRect = computeRectIntersection(parentRect, intersectionRect);
          }
          if (!intersectionRect)
            break;
          parent = parent && getParentNode(parent);
        }
        return intersectionRect;
      };
      IntersectionObserver.prototype._getRootRect = function() {
        var rootRect;
        if (this.root && !isDoc(this.root)) {
          rootRect = getBoundingClientRect(this.root);
        } else {
          var doc = isDoc(this.root) ? this.root : document;
          var html = doc.documentElement;
          var body = doc.body;
          rootRect = {
            top: 0,
            left: 0,
            right: html.clientWidth || body.clientWidth,
            width: html.clientWidth || body.clientWidth,
            bottom: html.clientHeight || body.clientHeight,
            height: html.clientHeight || body.clientHeight
          };
        }
        return this._expandRectByRootMargin(rootRect);
      };
      IntersectionObserver.prototype._expandRectByRootMargin = function(rect) {
        var margins = this._rootMarginValues.map(function(margin, i) {
          return margin.unit == "px" ? margin.value : margin.value * (i % 2 ? rect.width : rect.height) / 100;
        });
        var newRect = {
          top: rect.top - margins[0],
          right: rect.right + margins[1],
          bottom: rect.bottom + margins[2],
          left: rect.left - margins[3]
        };
        newRect.width = newRect.right - newRect.left;
        newRect.height = newRect.bottom - newRect.top;
        return newRect;
      };
      IntersectionObserver.prototype._hasCrossedThreshold = function(oldEntry, newEntry) {
        var oldRatio = oldEntry && oldEntry.isIntersecting ? oldEntry.intersectionRatio || 0 : -1;
        var newRatio = newEntry.isIntersecting ? newEntry.intersectionRatio || 0 : -1;
        if (oldRatio === newRatio)
          return;
        for (var i = 0; i < this.thresholds.length; i++) {
          var threshold = this.thresholds[i];
          if (threshold == oldRatio || threshold == newRatio || threshold < oldRatio !== threshold < newRatio) {
            return true;
          }
        }
      };
      IntersectionObserver.prototype._rootIsInDom = function() {
        return !this.root || containsDeep(document, this.root);
      };
      IntersectionObserver.prototype._rootContainsTarget = function(target) {
        var rootDoc = this.root && (this.root.ownerDocument || this.root) || document;
        return containsDeep(rootDoc, target) && (!this.root || rootDoc == target.ownerDocument);
      };
      IntersectionObserver.prototype._registerInstance = function() {
        if (registry.indexOf(this) < 0) {
          registry.push(this);
        }
      };
      IntersectionObserver.prototype._unregisterInstance = function() {
        var index = registry.indexOf(this);
        if (index != -1)
          registry.splice(index, 1);
      };
      function now() {
        return window.performance && performance.now && performance.now();
      }
      function throttle(fn, timeout) {
        var timer = null;
        return function() {
          if (!timer) {
            timer = setTimeout(function() {
              fn();
              timer = null;
            }, timeout);
          }
        };
      }
      function addEvent(node, event, fn, opt_useCapture) {
        if (typeof node.addEventListener == "function") {
          node.addEventListener(event, fn, opt_useCapture || false);
        } else if (typeof node.attachEvent == "function") {
          node.attachEvent("on" + event, fn);
        }
      }
      function removeEvent(node, event, fn, opt_useCapture) {
        if (typeof node.removeEventListener == "function") {
          node.removeEventListener(event, fn, opt_useCapture || false);
        } else if (typeof node.detatchEvent == "function") {
          node.detatchEvent("on" + event, fn);
        }
      }
      function computeRectIntersection(rect1, rect2) {
        var top = Math.max(rect1.top, rect2.top);
        var bottom = Math.min(rect1.bottom, rect2.bottom);
        var left = Math.max(rect1.left, rect2.left);
        var right = Math.min(rect1.right, rect2.right);
        var width = right - left;
        var height = bottom - top;
        return width >= 0 && height >= 0 && {
          top,
          bottom,
          left,
          right,
          width,
          height
        } || null;
      }
      function getBoundingClientRect(el) {
        var rect;
        try {
          rect = el.getBoundingClientRect();
        } catch (err) {
        }
        if (!rect)
          return getEmptyRect();
        if (!(rect.width && rect.height)) {
          rect = {
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
            left: rect.left,
            width: rect.right - rect.left,
            height: rect.bottom - rect.top
          };
        }
        return rect;
      }
      function getEmptyRect() {
        return {
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          width: 0,
          height: 0
        };
      }
      function ensureDOMRect(rect) {
        if (!rect || "x" in rect) {
          return rect;
        }
        return {
          top: rect.top,
          y: rect.top,
          bottom: rect.bottom,
          left: rect.left,
          x: rect.left,
          right: rect.right,
          width: rect.width,
          height: rect.height
        };
      }
      function convertFromParentRect(parentBoundingRect, parentIntersectionRect) {
        var top = parentIntersectionRect.top - parentBoundingRect.top;
        var left = parentIntersectionRect.left - parentBoundingRect.left;
        return {
          top,
          left,
          height: parentIntersectionRect.height,
          width: parentIntersectionRect.width,
          bottom: top + parentIntersectionRect.height,
          right: left + parentIntersectionRect.width
        };
      }
      function containsDeep(parent, child) {
        var node = child;
        while (node) {
          if (node == parent)
            return true;
          node = getParentNode(node);
        }
        return false;
      }
      function getParentNode(node) {
        var parent = node.parentNode;
        if (node.nodeType == 9 && node != document) {
          return getFrameElement(node);
        }
        if (parent && parent.assignedSlot) {
          parent = parent.assignedSlot.parentNode;
        }
        if (parent && parent.nodeType == 11 && parent.host) {
          return parent.host;
        }
        return parent;
      }
      function isDoc(node) {
        return node && node.nodeType === 9;
      }
      window.IntersectionObserver = IntersectionObserver;
      window.IntersectionObserverEntry = IntersectionObserverEntry;
    })();
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

  // src/utils/object.js
  function dict(opt_initial) {
    return opt_initial || {};
  }

  // third_party/css-escape/css-escape.js
  /*! https://mths.be/cssescape v1.5.1 by @mathias | MIT license */

  // src/3p-frame-messaging.js
  var MessageType = {
    SEND_EMBED_STATE: "send-embed-state",
    EMBED_STATE: "embed-state",
    SEND_EMBED_CONTEXT: "send-embed-context",
    EMBED_CONTEXT: "embed-context",
    SEND_INTERSECTIONS: "send-intersections",
    INTERSECTION: "intersection",
    EMBED_SIZE: "embed-size",
    EMBED_SIZE_CHANGED: "embed-size-changed",
    EMBED_SIZE_DENIED: "embed-size-denied",
    NO_CONTENT: "no-content",
    GET_HTML: "get-html",
    GET_CONSENT_STATE: "get-consent-state",
    SIGNAL_INTERACTIVE: "signal-interactive",
    FULL_OVERLAY_FRAME: "full-overlay-frame",
    FULL_OVERLAY_FRAME_RESPONSE: "full-overlay-frame-response",
    CANCEL_FULL_OVERLAY_FRAME: "cancel-full-overlay-frame",
    CANCEL_FULL_OVERLAY_FRAME_RESPONSE: "cancel-full-overlay-frame-response",
    SEND_POSITIONS: "send-positions",
    POSITION: "position",
    SEND_IFRAME_TRANSPORT_EVENTS: "send-iframe-transport-events",
    IFRAME_TRANSPORT_EVENTS: "iframe-transport-events",
    IFRAME_TRANSPORT_RESPONSE: "iframe-transport-response",
    USER_ERROR_IN_IFRAME: "user-error-in-iframe",
    SEND_CONSENT_DATA: "send-consent-data",
    CONSENT_DATA: "consent-data"
  };

  // src/window-interface.js
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
  var WindowInterface = /* @__PURE__ */ function() {
    function WindowInterface2() {
      _classCallCheck2(this, WindowInterface2);
    }
    _createClass(WindowInterface2, null, [{
      key: "getTop",
      value: function getTop(win) {
        return win.top;
      }
    }, {
      key: "getLocation",
      value: function getLocation(win) {
        return win.location;
      }
    }, {
      key: "getDocumentReferrer",
      value: function getDocumentReferrer(win) {
        return win.document.referrer;
      }
    }, {
      key: "getHostname",
      value: function getHostname(win) {
        return win.location.hostname;
      }
    }, {
      key: "getUserAgent",
      value: function getUserAgent(win) {
        return win.navigator.userAgent;
      }
    }, {
      key: "getUserLanguage",
      value: function getUserLanguage(win) {
        return win.navigator.userLanguage || win.navigator.language;
      }
    }, {
      key: "getDevicePixelRatio",
      value: function getDevicePixelRatio() {
        return self.devicePixelRatio || 1;
      }
    }, {
      key: "getSendBeacon",
      value: function getSendBeacon(win) {
        if (!win.navigator.sendBeacon) {
          return void 0;
        }
        return win.navigator.sendBeacon.bind(win.navigator);
      }
    }, {
      key: "getXMLHttpRequest",
      value: function getXMLHttpRequest(win) {
        return win.XMLHttpRequest;
      }
    }, {
      key: "getImage",
      value: function getImage(win) {
        return win.Image;
      }
    }]);
    return WindowInterface2;
  }();

  // src/url.js
  var SERVING_TYPE_PREFIX = dict({
    c: true,
    v: true,
    a: true,
    ad: true
  });

  // src/service.js
  function registerServiceBuilder(win, id, constructor, opt_instantiate) {
    win = getTopWindow(win);
    registerServiceInternal(win, win, id, constructor);
    if (opt_instantiate) {
      getServiceInternal(win, id);
    }
  }
  function getExistingServiceOrNull(win, id) {
    win = getTopWindow(win);
    if (isServiceRegistered(win, id)) {
      return getServiceInternal(win, id);
    } else {
      return null;
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

  // src/inabox/inabox-iframe-messaging-client.js
  function iframeMessagingClientFor(win) {
    return getExistingServiceOrNull(win, "iframeMessagingClient");
  }

  // src/layout-rect.js
  function layoutRectLtwh(left, top, width, height) {
    return {
      left,
      top,
      width,
      height,
      bottom: top + height,
      right: left + width,
      x: left,
      y: top
    };
  }

  // extensions/amp-intersection-observer-polyfill/0.1/cross-origin-observer.js
  function maybeSetupCrossOriginObserver(win) {
    if (win == WindowInterface.getTop(win) || getMode(win).runtime != "inabox") {
      return;
    }
    var iframeClient = iframeMessagingClientFor(win);
    var setupPolyfillUpdater = win.IntersectionObserver["_setupCrossOriginUpdater"];
    if (!iframeClient || !setupPolyfillUpdater) {
      return;
    }
    var updater = setupPolyfillUpdater();
    iframeClient.makeRequest(MessageType.SEND_POSITIONS, MessageType.POSITION, function(data) {
      var boundingClientRect = data["targetRect"];
      var viewportRect = data["viewportRect"];
      var intersectionRect = calculateIntersectionRect(viewportRect, boundingClientRect);
      updater(boundingClientRect, intersectionRect);
    });
  }
  function calculateIntersectionRect(viewportRect, targetRect) {
    var top = Math.max(targetRect.top, 0);
    var left = Math.max(targetRect.left, 0);
    var bottom = Math.min(targetRect.bottom, viewportRect.height);
    var right = Math.min(targetRect.right, viewportRect.width);
    if (top > bottom || left > right) {
      return layoutRectLtwh(0, 0, 0, 0);
    }
    return layoutRectLtwh(left, top, right - left, bottom - top);
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

  // src/polyfillstub/intersection-observer-stub.js
  function _extends() {
    _extends = Object.assign || function(target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
      return target;
    };
    return _extends.apply(this, arguments);
  }
  function _classCallCheck3(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function _defineProperties2(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor)
        descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  function _createClass2(Constructor, protoProps, staticProps) {
    if (protoProps)
      _defineProperties2(Constructor.prototype, protoProps);
    if (staticProps)
      _defineProperties2(Constructor, staticProps);
    return Constructor;
  }
  var UPGRADERS = "_upgraders";
  var NATIVE = "_native";
  var STUB = "_stub";
  function getIntersectionObserverDispatcher(Native, Polyfill) {
    return function(ioCallback, opts) {
      if (opts && opts.root && opts.root.nodeType === 9) {
        return new Polyfill(ioCallback, opts);
      } else {
        return new Native(ioCallback, opts);
      }
    };
  }
  function upgradePolyfill(win, installer) {
    var Stub = win.IntersectionObserver[STUB];
    if (Stub) {
      var Native = win.IntersectionObserver[NATIVE];
      delete win.IntersectionObserver;
      delete win.IntersectionObserverEntry;
      installer();
      var Polyfill = win.IntersectionObserver;
      if (Native) {
        win.IntersectionObserver = getIntersectionObserverDispatcher(Native, Polyfill);
      }
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
  var IntersectionObserverStub = /* @__PURE__ */ function() {
    function IntersectionObserverStub2(callback, options) {
      _classCallCheck3(this, IntersectionObserverStub2);
      this.callback_ = callback;
      this.options_ = _extends({
        root: null,
        rootMargin: "0px 0px 0px 0px"
      }, options);
      this.elements_ = [];
      this.inst_ = null;
      IntersectionObserverStub2[UPGRADERS].push(this.upgrade_.bind(this));
    }
    _createClass2(IntersectionObserverStub2, [{
      key: "root",
      get: function get() {
        if (this.inst_) {
          return this.inst_.root;
        }
        return this.options_.root || null;
      }
    }, {
      key: "rootMargin",
      get: function get() {
        if (this.inst_) {
          return this.inst_.rootMargin;
        }
        return this.options_.rootMargin;
      }
    }, {
      key: "thresholds",
      get: function get() {
        if (this.inst_) {
          return this.inst_.thresholds;
        }
        return [].concat(this.options_.threshold || 0);
      }
    }, {
      key: "disconnect",
      value: function disconnect() {
        if (this.inst_) {
          this.inst_.disconnect();
        } else {
          this.elements_.length = 0;
        }
      }
    }, {
      key: "takeRecords",
      value: function takeRecords() {
        if (this.inst_) {
          return this.inst_.takeRecords();
        }
        return [];
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
    return IntersectionObserverStub2;
  }();
  IntersectionObserverStub[UPGRADERS] = [];

  // extensions/amp-intersection-observer-polyfill/0.1/amp-intersection-observer-polyfill.js
  var TAG = "amp-intersection-observer-polyfill";
  function upgrade(win) {
    upgradePolyfill(win, function() {
      installIntersectionObserver();
      maybeSetupCrossOriginObserver(win);
    });
    return {};
  }
  function upgradeIntersectionObserverPolyfill(win) {
    registerServiceBuilder(win, TAG, upgrade, true);
  }
  AMP.extension(TAG, "0.1", function(AMP2) {
    upgradeIntersectionObserverPolyfill(window);
  });
})();

})});
//# sourceMappingURL=amp-intersection-observer-polyfill-0.1.max.js.map
