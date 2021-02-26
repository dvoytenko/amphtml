(self.AMP=self.AMP||[]).push({n:"amp-base-carousel",v:"2102250055000",m:0,f:(function(AMP,_){

(() => {
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
        _cache.set(Class2, Wrapper2);
      }
      function Wrapper2() {
        return _construct(Class2, arguments, _getPrototypeOf(this).constructor);
      }
      Wrapper2.prototype = Object.create(Class2.prototype, {constructor: {value: Wrapper2, enumerable: false, writable: true, configurable: true}});
      return _setPrototypeOf(Wrapper2, Class2);
    };
    return _wrapNativeSuper(Class);
  }
  function _construct(Parent, args, Class) {
    if (_isNativeReflectConstruct()) {
      _construct = Reflect.construct;
    } else {
      _construct = function _construct2(Parent2, args2, Class2) {
        var a3 = [null];
        a3.push.apply(a3, args2);
        var Constructor = Function.bind.apply(Parent2, a3);
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
    } catch (e3) {
      return false;
    }
  }
  function _isNativeFunction(fn) {
    return Function.toString.call(fn).indexOf("[native code]") !== -1;
  }
  function _setPrototypeOf(o3, p3) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf4(o4, p4) {
      o4.__proto__ = p4;
      return o4;
    };
    return _setPrototypeOf(o3, p3);
  }
  function _getPrototypeOf(o3) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf4(o4) {
      return o4.__proto__ || Object.getPrototypeOf(o4);
    };
    return _getPrototypeOf(o3);
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
    } catch (e3) {
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

  // src/types.js
  function isArray(value) {
    return Array.isArray(value);
  }
  function arrayOrSingleItemToArray(arrayOrSingleItem) {
    return isArray(arrayOrSingleItem) ? arrayOrSingleItem : [arrayOrSingleItem];
  }
  function toWin(winOrNull) {
    return winOrNull;
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
  var USER_ERROR_EMBED_SENTINEL = "\u200B\u200B\u200B\u200B";
  var LogLevel = {
    OFF: 0,
    ERROR: 1,
    WARN: 2,
    INFO: 3,
    FINE: 4
  };
  function duplicateErrorIfNecessary(error) {
    var messageProperty = Object.getOwnPropertyDescriptor(error, "message");
    if (messageProperty && messageProperty.writable) {
      return error;
    }
    var message = error.message, stack = error.stack;
    var e3 = new Error(message);
    for (var prop in error) {
      e3[prop] = error[prop];
    }
    e3.stack = stack;
    return e3;
  }
  function createErrorVargs(var_args) {
    var error = null;
    var message = "";
    for (var i3 = 0; i3 < arguments.length; i3++) {
      var arg = arguments[i3];
      if (arg instanceof Error && !error) {
        error = duplicateErrorIfNecessary(arg);
      } else {
        if (message) {
          message += " ";
        }
        message += arg;
      }
    }
    if (!error) {
      error = new Error(message);
    } else if (message) {
      error.message = message + ": " + error.message;
    }
    return error;
  }
  function rethrowAsync(var_args) {
    var error = createErrorVargs.apply(null, arguments);
    setTimeout(function() {
      self.__AMP_REPORT_ERROR(error);
      throw error;
    });
  }
  self.__AMP_LOG = self.__AMP_LOG || {
    user: null,
    dev: null,
    userForEmbed: null
  };
  var logs = self.__AMP_LOG;
  var logConstructor = null;
  function user(opt_element) {
    if (!logs.user) {
      logs.user = getUserLogger(USER_ERROR_SENTINEL);
    }
    if (!isFromEmbed(logs.user.win, opt_element)) {
      return logs.user;
    } else {
      if (logs.userForEmbed) {
        return logs.userForEmbed;
      }
      return logs.userForEmbed = getUserLogger(USER_ERROR_EMBED_SENTINEL);
    }
  }
  function getUserLogger(suffix) {
    if (!logConstructor) {
      throw new Error("failed to call initLogConstructor");
    }
    return new logConstructor(self, function(logNum, development) {
      if (development || logNum >= 1) {
        return LogLevel.FINE;
      }
      return LogLevel.WARN;
    }, suffix);
  }
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
  function isFromEmbed(win, opt_element) {
    if (!opt_element) {
      return false;
    }
    return opt_element.ownerDocument.defaultView != win;
  }
  function devAssert(shouldBeTrueish, opt_message, opt_1, opt_2, opt_3, opt_4, opt_5, opt_6, opt_7, opt_8, opt_9) {
    if (getMode().minified) {
      return shouldBeTrueish;
    }
    return dev().assert(shouldBeTrueish, opt_message, opt_1, opt_2, opt_3, opt_4, opt_5, opt_6, opt_7, opt_8, opt_9);
  }
  function userAssert(shouldBeTrueish, opt_message, opt_1, opt_2, opt_3, opt_4, opt_5, opt_6, opt_7, opt_8, opt_9) {
    return user().assert(shouldBeTrueish, opt_message, opt_1, opt_2, opt_3, opt_4, opt_5, opt_6, opt_7, opt_8, opt_9);
  }

  // src/action-constants.js
  var ActionTrust = {
    LOW: 1,
    DEFAULT: 2,
    HIGH: 3
  };

  // src/resolved-promise.js
  var resolved;
  function resolvedPromise() {
    if (resolved) {
      return resolved;
    }
    resolved = Promise.resolve(void 0);
    return resolved;
  }

  // node_modules/preact/dist/preact.module.js
  var n;
  var l;
  var u;
  var t;
  var i;
  var o;
  var r;
  var f = {};
  var e = [];
  var c = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord/i;
  function s(n2, l4) {
    for (var u3 in l4) {
      n2[u3] = l4[u3];
    }
    return n2;
  }
  function a(n2) {
    var l4 = n2.parentNode;
    l4 && l4.removeChild(n2);
  }
  function h(n2, l4, u3) {
    var t3, i3 = arguments, o3 = {};
    for (t3 in l4) {
      t3 !== "key" && t3 !== "ref" && (o3[t3] = l4[t3]);
    }
    if (arguments.length > 3)
      for (u3 = [u3], t3 = 3; t3 < arguments.length; t3++) {
        u3.push(i3[t3]);
      }
    if (u3 != null && (o3.children = u3), typeof n2 == "function" && n2.defaultProps != null)
      for (t3 in n2.defaultProps) {
        o3[t3] === void 0 && (o3[t3] = n2.defaultProps[t3]);
      }
    return v(n2, o3, l4 && l4.key, l4 && l4.ref);
  }
  function v(l4, u3, t3, i3) {
    var o3 = {
      type: l4,
      props: u3,
      key: t3,
      ref: i3,
      __k: null,
      __: null,
      __b: 0,
      __e: null,
      __d: null,
      __c: null,
      constructor: void 0
    };
    return n.vnode && n.vnode(o3), o3;
  }
  function y(n2) {
    return n2.children;
  }
  function d(n2, l4) {
    this.props = n2, this.context = l4;
  }
  function m(n2, l4) {
    if (l4 == null)
      return n2.__ ? m(n2.__, n2.__.__k.indexOf(n2) + 1) : null;
    for (var u3; l4 < n2.__k.length; l4++) {
      if ((u3 = n2.__k[l4]) != null && u3.__e != null)
        return u3.__e;
    }
    return typeof n2.type == "function" ? m(n2) : null;
  }
  function w(n2) {
    var l4, u3;
    if ((n2 = n2.__) != null && n2.__c != null) {
      for (n2.__e = n2.__c.base = null, l4 = 0; l4 < n2.__k.length; l4++) {
        if ((u3 = n2.__k[l4]) != null && u3.__e != null) {
          n2.__e = n2.__c.base = u3.__e;
          break;
        }
      }
      return w(n2);
    }
  }
  function g(l4) {
    (!l4.__d && (l4.__d = true) && u.push(l4) === 1 || i !== n.debounceRendering) && ((i = n.debounceRendering) || t)(k);
  }
  function k() {
    var n2, l4, t3, i3, o3, r3, f3;
    for (u.sort(function(n3, l5) {
      return l5.__v.__b - n3.__v.__b;
    }); n2 = u.pop(); ) {
      n2.__d && (t3 = void 0, i3 = void 0, r3 = (o3 = (l4 = n2).__v).__e, (f3 = l4.__P) && (t3 = [], i3 = T(f3, o3, s({}, o3), l4.__n, f3.ownerSVGElement !== void 0, null, t3, r3 == null ? m(o3) : r3), $(t3, o3), i3 != r3 && w(o3)));
    }
  }
  function _(n2, l4, u3, t3, i3, o3, r3, c3, s3) {
    var h2, v3, p3, y3, d3, w4, g3, k2 = u3 && u3.__k || e, _3 = k2.length;
    if (c3 == f && (c3 = o3 != null ? o3[0] : _3 ? m(u3, 0) : null), h2 = 0, l4.__k = b(l4.__k, function(u4) {
      if (u4 != null) {
        if (u4.__ = l4, u4.__b = l4.__b + 1, (p3 = k2[h2]) === null || p3 && u4.key == p3.key && u4.type === p3.type)
          k2[h2] = void 0;
        else
          for (v3 = 0; v3 < _3; v3++) {
            if ((p3 = k2[v3]) && u4.key == p3.key && u4.type === p3.type) {
              k2[v3] = void 0;
              break;
            }
            p3 = null;
          }
        if (y3 = T(n2, u4, p3 = p3 || f, t3, i3, o3, r3, c3, s3), (v3 = u4.ref) && p3.ref != v3 && (g3 || (g3 = []), p3.ref && g3.push(p3.ref, null, u4), g3.push(v3, u4.__c || y3, u4)), y3 != null) {
          if (w4 == null && (w4 = y3), u4.__d != null)
            y3 = u4.__d, u4.__d = null;
          else if (o3 == p3 || y3 != c3 || y3.parentNode == null) {
            n:
              if (c3 == null || c3.parentNode !== n2)
                n2.appendChild(y3);
              else {
                for (d3 = c3, v3 = 0; (d3 = d3.nextSibling) && v3 < _3; v3 += 2) {
                  if (d3 == y3)
                    break n;
                }
                n2.insertBefore(y3, c3);
              }
            l4.type == "option" && (n2.value = "");
          }
          c3 = y3.nextSibling, typeof l4.type == "function" && (l4.__d = y3);
        }
      }
      return h2++, u4;
    }), l4.__e = w4, o3 != null && typeof l4.type != "function")
      for (h2 = o3.length; h2--; ) {
        o3[h2] != null && a(o3[h2]);
      }
    for (h2 = _3; h2--; ) {
      k2[h2] != null && A(k2[h2], k2[h2]);
    }
    if (g3)
      for (h2 = 0; h2 < g3.length; h2++) {
        z(g3[h2], g3[++h2], g3[++h2]);
      }
  }
  function b(n2, l4, u3) {
    if (u3 == null && (u3 = []), n2 == null || typeof n2 == "boolean")
      l4 && u3.push(l4(null));
    else if (Array.isArray(n2))
      for (var t3 = 0; t3 < n2.length; t3++) {
        b(n2[t3], l4, u3);
      }
    else
      u3.push(l4 ? l4(typeof n2 == "string" || typeof n2 == "number" ? v(null, n2, null, null) : n2.__e != null || n2.__c != null ? v(n2.type, n2.props, n2.key, null) : n2) : n2);
    return u3;
  }
  function x(n2, l4, u3, t3, i3) {
    var o3;
    for (o3 in u3) {
      o3 in l4 || P(n2, o3, null, u3[o3], t3);
    }
    for (o3 in l4) {
      i3 && typeof l4[o3] != "function" || o3 === "value" || o3 === "checked" || u3[o3] === l4[o3] || P(n2, o3, l4[o3], u3[o3], t3);
    }
  }
  function C(n2, l4, u3) {
    l4[0] === "-" ? n2.setProperty(l4, u3) : n2[l4] = typeof u3 == "number" && c.test(l4) === false ? u3 + "px" : u3 == null ? "" : u3;
  }
  function P(n2, l4, u3, t3, i3) {
    var o3, r3, f3, e3, c3;
    if (i3 ? l4 === "className" && (l4 = "class") : l4 === "class" && (l4 = "className"), l4 === "key" || l4 === "children")
      ;
    else if (l4 === "style") {
      if (o3 = n2.style, typeof u3 == "string")
        o3.cssText = u3;
      else {
        if (typeof t3 == "string" && (o3.cssText = "", t3 = null), t3)
          for (r3 in t3) {
            u3 && r3 in u3 || C(o3, r3, "");
          }
        if (u3)
          for (f3 in u3) {
            t3 && u3[f3] === t3[f3] || C(o3, f3, u3[f3]);
          }
      }
    } else
      l4[0] === "o" && l4[1] === "n" ? (e3 = l4 !== (l4 = l4.replace(/Capture$/, "")), c3 = l4.toLowerCase(), l4 = (c3 in n2 ? c3 : l4).slice(2), u3 ? (t3 || n2.addEventListener(l4, N, e3), (n2.l || (n2.l = {}))[l4] = u3) : n2.removeEventListener(l4, N, e3)) : l4 !== "list" && l4 !== "tagName" && l4 !== "form" && l4 !== "type" && !i3 && l4 in n2 ? n2[l4] = u3 == null ? "" : u3 : typeof u3 != "function" && l4 !== "dangerouslySetInnerHTML" && (l4 !== (l4 = l4.replace(/^xlink:?/, "")) ? u3 == null || u3 === false ? n2.removeAttributeNS("http://www.w3.org/1999/xlink", l4.toLowerCase()) : n2.setAttributeNS("http://www.w3.org/1999/xlink", l4.toLowerCase(), u3) : u3 == null || u3 === false ? n2.removeAttribute(l4) : n2.setAttribute(l4, u3));
  }
  function N(l4) {
    this.l[l4.type](n.event ? n.event(l4) : l4);
  }
  function T(l4, u3, t3, i3, o3, r3, f3, e3, c3) {
    var a3, h2, v3, p3, m3, w4, g3, k2, x3, C3, P2 = u3.type;
    if (u3.constructor !== void 0)
      return null;
    (a3 = n.__b) && a3(u3);
    try {
      n:
        if (typeof P2 == "function") {
          if (k2 = u3.props, x3 = (a3 = P2.contextType) && i3[a3.__c], C3 = a3 ? x3 ? x3.props.value : a3.__ : i3, t3.__c ? g3 = (h2 = u3.__c = t3.__c).__ = h2.__E : ("prototype" in P2 && P2.prototype.render ? u3.__c = h2 = new P2(k2, C3) : (u3.__c = h2 = new d(k2, C3), h2.constructor = P2, h2.render = D), x3 && x3.sub(h2), h2.props = k2, h2.state || (h2.state = {}), h2.context = C3, h2.__n = i3, v3 = h2.__d = true, h2.__h = []), h2.__s == null && (h2.__s = h2.state), P2.getDerivedStateFromProps != null && (h2.__s == h2.state && (h2.__s = s({}, h2.__s)), s(h2.__s, P2.getDerivedStateFromProps(k2, h2.__s))), p3 = h2.props, m3 = h2.state, v3)
            P2.getDerivedStateFromProps == null && h2.componentWillMount != null && h2.componentWillMount(), h2.componentDidMount != null && h2.__h.push(h2.componentDidMount);
          else {
            if (P2.getDerivedStateFromProps == null && k2 !== p3 && h2.componentWillReceiveProps != null && h2.componentWillReceiveProps(k2, C3), !h2.__e && h2.shouldComponentUpdate != null && h2.shouldComponentUpdate(k2, h2.__s, C3) === false) {
              for (h2.props = k2, h2.state = h2.__s, h2.__d = false, h2.__v = u3, u3.__e = t3.__e, u3.__k = t3.__k, h2.__h.length && f3.push(h2), a3 = 0; a3 < u3.__k.length; a3++) {
                u3.__k[a3] && (u3.__k[a3].__ = u3);
              }
              break n;
            }
            h2.componentWillUpdate != null && h2.componentWillUpdate(k2, h2.__s, C3), h2.componentDidUpdate != null && h2.__h.push(function() {
              h2.componentDidUpdate(p3, m3, w4);
            });
          }
          h2.context = C3, h2.props = k2, h2.state = h2.__s, (a3 = n.__r) && a3(u3), h2.__d = false, h2.__v = u3, h2.__P = l4, a3 = h2.render(h2.props, h2.state, h2.context), u3.__k = b(a3 != null && a3.type == y && a3.key == null ? a3.props.children : a3), h2.getChildContext != null && (i3 = s(s({}, i3), h2.getChildContext())), v3 || h2.getSnapshotBeforeUpdate == null || (w4 = h2.getSnapshotBeforeUpdate(p3, m3)), _(l4, u3, t3, i3, o3, r3, f3, e3, c3), h2.base = u3.__e, h2.__h.length && f3.push(h2), g3 && (h2.__E = h2.__ = null), h2.__e = null;
        } else
          u3.__e = j(t3.__e, u3, t3, i3, o3, r3, f3, c3);
      (a3 = n.diffed) && a3(u3);
    } catch (l5) {
      n.__e(l5, u3, t3);
    }
    return u3.__e;
  }
  function $(l4, u3) {
    n.__c && n.__c(u3, l4), l4.some(function(u4) {
      try {
        l4 = u4.__h, u4.__h = [], l4.some(function(n2) {
          n2.call(u4);
        });
      } catch (l5) {
        n.__e(l5, u4.__v);
      }
    });
  }
  function j(n2, l4, u3, t3, i3, o3, r3, c3) {
    var s3, a3, h2, v3, p3, y3 = u3.props, d3 = l4.props;
    if (i3 = l4.type === "svg" || i3, n2 == null && o3 != null)
      for (s3 = 0; s3 < o3.length; s3++) {
        if ((a3 = o3[s3]) != null && (l4.type === null ? a3.nodeType === 3 : a3.localName === l4.type)) {
          n2 = a3, o3[s3] = null;
          break;
        }
      }
    if (n2 == null) {
      if (l4.type === null)
        return document.createTextNode(d3);
      n2 = i3 ? document.createElementNS("http://www.w3.org/2000/svg", l4.type) : document.createElement(l4.type), o3 = null;
    }
    if (l4.type === null)
      o3 != null && (o3[o3.indexOf(n2)] = null), y3 !== d3 && n2.data != d3 && (n2.data = d3);
    else if (l4 !== u3) {
      if (o3 != null && (o3 = e.slice.call(n2.childNodes)), h2 = (y3 = u3.props || f).dangerouslySetInnerHTML, v3 = d3.dangerouslySetInnerHTML, !c3) {
        if (y3 === f)
          for (y3 = {}, p3 = 0; p3 < n2.attributes.length; p3++) {
            y3[n2.attributes[p3].name] = n2.attributes[p3].value;
          }
        (v3 || h2) && (v3 && h2 && v3.__html == h2.__html || (n2.innerHTML = v3 && v3.__html || ""));
      }
      x(n2, d3, y3, i3, c3), l4.__k = l4.props.children, v3 || _(n2, l4, u3, t3, l4.type !== "foreignObject" && i3, o3, r3, f, c3), c3 || ("value" in d3 && d3.value !== void 0 && d3.value !== n2.value && (n2.value = d3.value == null ? "" : d3.value), "checked" in d3 && d3.checked !== void 0 && d3.checked !== n2.checked && (n2.checked = d3.checked));
    }
    return n2;
  }
  function z(l4, u3, t3) {
    try {
      typeof l4 == "function" ? l4(u3) : l4.current = u3;
    } catch (l5) {
      n.__e(l5, t3);
    }
  }
  function A(l4, u3, t3) {
    var i3, o3, r3;
    if (n.unmount && n.unmount(l4), (i3 = l4.ref) && (i3.current && i3.current !== l4.__e || z(i3, null, u3)), t3 || typeof l4.type == "function" || (t3 = (o3 = l4.__e) != null), l4.__e = l4.__d = null, (i3 = l4.__c) != null) {
      if (i3.componentWillUnmount)
        try {
          i3.componentWillUnmount();
        } catch (l5) {
          n.__e(l5, u3);
        }
      i3.base = i3.__P = null;
    }
    if (i3 = l4.__k)
      for (r3 = 0; r3 < i3.length; r3++) {
        i3[r3] && A(i3[r3], u3, t3);
      }
    o3 != null && a(o3);
  }
  function D(n2, l4, u3) {
    return this.constructor(n2, u3);
  }
  function E(l4, u3, t3) {
    var i3, r3, c3;
    n.__ && n.__(l4, u3), r3 = (i3 = t3 === o) ? null : t3 && t3.__k || u3.__k, l4 = h(y, null, [l4]), c3 = [], T(u3, (i3 ? u3 : t3 || u3).__k = l4, r3 || f, f, u3.ownerSVGElement !== void 0, t3 && !i3 ? [t3] : r3 ? null : e.slice.call(u3.childNodes), c3, t3 || f, i3), $(c3, l4);
  }
  function H(n2, l4) {
    E(n2, l4, o);
  }
  function I(n2, l4) {
    return l4 = s(s({}, n2.props), l4), arguments.length > 2 && (l4.children = e.slice.call(arguments, 2)), v(n2.type, l4, l4.key || n2.key, l4.ref || n2.ref);
  }
  function L(n2) {
    var l4 = {}, u3 = {
      __c: "__cC" + r++,
      __: n2,
      Consumer: function Consumer(n3, l5) {
        return n3.children(l5);
      },
      Provider: function Provider(n3) {
        var t3, i3 = this;
        return this.getChildContext || (t3 = [], this.getChildContext = function() {
          return l4[u3.__c] = i3, l4;
        }, this.shouldComponentUpdate = function(l5) {
          n3.value !== l5.value && t3.some(function(n4) {
            n4.context = l5.value, g(n4);
          });
        }, this.sub = function(n4) {
          t3.push(n4);
          var l5 = n4.componentWillUnmount;
          n4.componentWillUnmount = function() {
            t3.splice(t3.indexOf(n4), 1), l5 && l5.call(n4);
          };
        }), n3.children;
      }
    };
    return u3.Consumer.contextType = u3, u3;
  }
  n = {
    __e: function __e(n2, l4) {
      for (var u3, t3; l4 = l4.__; ) {
        if ((u3 = l4.__c) && !u3.__)
          try {
            if (u3.constructor && u3.constructor.getDerivedStateFromError != null && (t3 = true, u3.setState(u3.constructor.getDerivedStateFromError(n2))), u3.componentDidCatch != null && (t3 = true, u3.componentDidCatch(n2)), t3)
              return g(u3.__E = u3);
          } catch (l5) {
            n2 = l5;
          }
      }
      throw n2;
    }
  }, l = function l2(n2) {
    return n2 != null && n2.constructor === void 0;
  }, d.prototype.setState = function(n2, l4) {
    var u3;
    u3 = this.__s !== this.state ? this.__s : this.__s = s({}, this.state), typeof n2 == "function" && (n2 = n2(u3, this.props)), n2 && s(u3, n2), n2 != null && this.__v && (this.__e = false, l4 && this.__h.push(l4), g(this));
  }, d.prototype.forceUpdate = function(n2) {
    this.__v && (this.__e = true, n2 && this.__h.push(n2), g(this));
  }, d.prototype.render = y, u = [], t = typeof Promise == "function" ? Promise.prototype.then.bind(resolvedPromise()) : setTimeout, o = f, r = 0;

  // node_modules/preact/hooks/dist/hooks.module.js
  var t2;
  var u2;
  var r2;
  var i2 = [];
  var o2 = n.__r;
  var f2 = n.diffed;
  var c2 = n.__c;
  var e2 = n.unmount;
  function a2(t3) {
    n.__h && n.__h(u2);
    var r3 = u2.__H || (u2.__H = {
      t: [],
      u: []
    });
    return t3 >= r3.t.length && r3.t.push({}), r3.t[t3];
  }
  function v2(n2) {
    return m2(E2, n2);
  }
  function m2(n2, r3, i3) {
    var o3 = a2(t2++);
    return o3.__c || (o3.__c = u2, o3.i = [i3 ? i3(r3) : E2(void 0, r3), function(t3) {
      var u3 = n2(o3.i[0], t3);
      o3.i[0] !== u3 && (o3.i[0] = u3, o3.__c.setState({}));
    }]), o3.i;
  }
  function p(n2, r3) {
    var i3 = a2(t2++);
    x2(i3.o, r3) && (i3.i = n2, i3.o = r3, u2.__H.u.push(i3));
  }
  function l3(n2, r3) {
    var i3 = a2(t2++);
    x2(i3.o, r3) && (i3.i = n2, i3.o = r3, u2.__h.push(i3));
  }
  function d2(n2) {
    return y2(function() {
      return {
        current: n2
      };
    }, []);
  }
  function s2(n2, t3, u3) {
    l3(function() {
      typeof n2 == "function" ? n2(t3()) : n2 && (n2.current = t3());
    }, u3 == null ? u3 : u3.concat(n2));
  }
  function y2(n2, u3) {
    var r3 = a2(t2++);
    return x2(r3.o, u3) ? (r3.o = u3, r3.v = n2, r3.i = n2()) : r3.i;
  }
  function T2(n2, t3) {
    return y2(function() {
      return n2;
    }, t3);
  }
  function w2(n2) {
    var r3 = u2.context[n2.__c];
    if (!r3)
      return n2.__;
    var i3 = a2(t2++);
    return i3.i == null && (i3.i = true, r3.sub(u2)), r3.props.value;
  }
  function _2() {
    i2.some(function(n2) {
      n2.__P && (n2.__H.u.forEach(g2), n2.__H.u.forEach(q), n2.__H.u = []);
    }), i2 = [];
  }
  function g2(n2) {
    n2.m && n2.m();
  }
  function q(n2) {
    var t3 = n2.i();
    typeof t3 == "function" && (n2.m = t3);
  }
  function x2(n2, t3) {
    return !n2 || t3.some(function(t4, u3) {
      return t4 !== n2[u3];
    });
  }
  function E2(n2, t3) {
    return typeof t3 == "function" ? t3(n2) : t3;
  }
  n.__r = function(n2) {
    o2 && o2(n2), t2 = 0, (u2 = n2.__c).__H && (u2.__H.u.forEach(g2), u2.__H.u.forEach(q), u2.__H.u = []);
  }, n.diffed = function(t3) {
    f2 && f2(t3);
    var u3 = t3.__c;
    if (u3) {
      var o3 = u3.__H;
      o3 && o3.u.length && (i2.push(u3) !== 1 && r2 === n.requestAnimationFrame || ((r2 = n.requestAnimationFrame) || function(n2) {
        var t4, u4 = function u5() {
          clearTimeout(r3), cancelAnimationFrame(t4), setTimeout(n2);
        }, r3 = setTimeout(u4, 100);
        typeof window != "undefined" && (t4 = requestAnimationFrame(u4));
      })(_2));
    }
  }, n.__c = function(n2, t3) {
    t3.some(function(n3) {
      n3.__h.forEach(g2), n3.__h = n3.__h.filter(function(n4) {
        return !n4.i || q(n4);
      });
    }), c2 && c2(n2, t3);
  }, n.unmount = function(n2) {
    e2 && e2(n2);
    var t3 = n2.__c;
    if (t3) {
      var u3 = t3.__H;
      u3 && u3.t.forEach(function(n3) {
        return n3.m && n3.m();
      });
    }
  };

  // src/preact/index.js
  function createElement(unusedType, unusedProps, var_args) {
    return h.apply(void 0, arguments);
  }
  function cloneElement(unusedElement, unusedProps, unusedChildren) {
    return I.apply(void 0, arguments);
  }
  function render(vnode, container, opt_replaceNode) {
    E(vnode, container, opt_replaceNode);
  }
  function hydrate(vnode, container) {
    H(vnode, container);
  }
  function Fragment(props) {
    return y(props);
  }
  function createContext(value) {
    return L(value);
  }
  function useState(initial) {
    return v2(initial);
  }
  function useRef(initial) {
    return d2(initial);
  }
  function useEffect(effect, opt_deps) {
    p(effect, opt_deps);
  }
  function useLayoutEffect(effect, opt_deps) {
    l3(effect, opt_deps);
  }
  function useContext(context2) {
    return w2(context2);
  }
  function useMemo(cb, opt_deps) {
    return y2(cb, opt_deps);
  }
  function useCallback(cb, opt_deps) {
    return T2(cb, opt_deps);
  }
  function useImperativeHandle(ref, create, opt_deps) {
    return s2(ref, create, opt_deps);
  }
  function toChildArray(unusedChildren) {
    return b.apply(void 0, arguments);
  }

  // src/utils/math.js
  function mod(a3, b2) {
    return a3 > 0 && b2 > 0 ? a3 % b2 : (a3 % b2 + b2) % b2;
  }

  // extensions/amp-base-carousel/1.0/dimensions.js
  var Axis = {
    X: 0,
    Y: 1
  };
  var Alignment = {
    START: "start",
    CENTER: "center"
  };
  var Orientation = {
    HORIZONTAL: "horizontal",
    VERTICAL: "vertical"
  };
  function getDimension(axis, el) {
    var _el$getBoundingClient = el.getBoundingClientRect(), top = _el$getBoundingClient.top, bottom = _el$getBoundingClient.bottom, height = _el$getBoundingClient.height, left = _el$getBoundingClient.left, right = _el$getBoundingClient.right, width = _el$getBoundingClient.width;
    return {
      start: Math.round(axis == Axis.X ? left : top),
      end: Math.round(axis == Axis.X ? right : bottom),
      length: Math.round(axis == Axis.X ? width : height)
    };
  }
  function getCenter(axis, el) {
    var _getDimension = getDimension(axis, el), start = _getDimension.start, end = _getDimension.end;
    return (start + end) / 2;
  }
  function getStart(axis, el) {
    var _getDimension2 = getDimension(axis, el), start = _getDimension2.start;
    return start;
  }
  function getPosition(axis, alignment, el) {
    return alignment == Alignment.START ? getStart(axis, el) : getCenter(axis, el);
  }
  function overlaps(axis, el, position) {
    var _getDimension3 = getDimension(axis, el), start = _getDimension3.start, end = _getDimension3.end;
    return start <= position && position < end;
  }
  function getPercentageOffsetFromAlignment(axis, alignment, container, el) {
    var elPos = getPosition(axis, alignment, el);
    var containerPos = getPosition(axis, alignment, container);
    var _getDimension4 = getDimension(axis, el), elLength = _getDimension4.length;
    return (elPos - containerPos) / elLength;
  }
  function findOverlappingIndex(axis, alignment, container, children, startIndex) {
    var pos = getPosition(axis, alignment, container);
    if (overlaps(axis, children[startIndex], pos)) {
      return startIndex;
    }
    for (var i3 = 1; i3 <= children.length / 2; i3++) {
      var nextIndex = mod(startIndex + i3, children.length);
      var prevIndex = mod(startIndex - i3, children.length);
      if (overlaps(axis, children[nextIndex], pos)) {
        return nextIndex;
      }
      if (overlaps(axis, children[prevIndex], pos)) {
        return prevIndex;
      }
    }
  }
  function getScrollPosition(axis, el) {
    if (axis == Axis.X) {
      return el.scrollLeft;
    }
    return el.scrollTop;
  }
  function getScrollEnd(axis, el) {
    if (axis == Axis.X) {
      return el.scrollWidth;
    }
    return el.scrollHeight;
  }
  function getOffsetPosition(axis, el) {
    if (axis == Axis.X) {
      return el.offsetLeft;
    }
    return el.offetTop;
  }
  function setScrollPosition(axis, el, position) {
    if (axis == Axis.X) {
      el.scrollLeft = position;
    } else {
      el.scrollTop = position;
    }
  }
  function updateScrollPosition(axis, el, delta) {
    setScrollPosition(axis, el, getScrollPosition(axis, el) + delta);
  }
  function scrollContainerToElement(axis, alignment, container, el, offset) {
    if (offset === void 0) {
      offset = 0;
    }
    var startAligned = alignment == Alignment.START;
    var _getDimension5 = getDimension(axis, el), length = _getDimension5.length;
    var snapOffset = startAligned ? getStart(axis, el) : getCenter(axis, el);
    var scrollOffset = startAligned ? getStart(axis, container) : getCenter(axis, container);
    var delta = Math.round(snapOffset - scrollOffset - offset * length);
    updateScrollPosition(axis, container, delta);
    var _getDimension6 = getDimension(axis, container), containerLength = _getDimension6.length;
    var canScroll = containerLength + getScrollPosition(axis, container) + delta < getScrollEnd(axis, container);
    return !!delta && canScroll;
  }

  // extensions/amp-base-carousel/1.0/base-carousel.jss.js
  var _classes = {
    carousel: "carousel-34d526e",
    scrollContainer: "scroll-container-34d526e",
    hideScrollbar: "hide-scrollbar-34d526e",
    horizontalScroll: "horizontal-scroll-34d526e",
    verticalScroll: "vertical-scroll-34d526e",
    slideElement: "slide-element-34d526e",
    thumbnails: "thumbnails-34d526e",
    startAlign: "start-align-34d526e",
    centerAlign: "center-align-34d526e",
    enableSnap: "enable-snap-34d526e",
    disableSnap: "disable-snap-34d526e",
    slideSizing: "slide-sizing-34d526e",
    arrow: "arrow-34d526e",
    ltr: "ltr-34d526e",
    rtl: "rtl-34d526e",
    arrowPrev: "arrow-prev-34d526e",
    arrowNext: "arrow-next-34d526e",
    arrowDisabled: "arrow-disabled-34d526e",
    insetArrow: "inset-arrow-34d526e",
    outsetArrow: "outset-arrow-34d526e",
    defaultArrowButton: "default-arrow-button-34d526e",
    arrowBaseStyle: "arrow-base-style-34d526e",
    arrowFrosting: "arrow-frosting-34d526e",
    arrowBackdrop: "arrow-backdrop-34d526e",
    arrowBackground: "arrow-background-34d526e",
    arrowIcon: "arrow-icon-34d526e"
  };
  var useStyles = function useStyles2() {
    return _classes;
  };
  var CSS2 = ".carousel-34d526e{-ms-scroll-chaining:none;overscroll-behavior:contain}.scroll-container-34d526e{width:100%;height:100%;display:-ms-flexbox;display:flex;outline:none;position:relative;-ms-flex-positive:1;flex-grow:1;-ms-flex-wrap:nowrap;flex-wrap:nowrap;box-sizing:content-box!important;scroll-behavior:smooth;-webkit-overflow-scrolling:touch}.hide-scrollbar-34d526e{scrollbar-width:none}.hide-scrollbar-34d526e::-webkit-scrollbar{display:none;box-sizing:content-box!important}.horizontal-scroll-34d526e{overflow-x:auto;overflow-y:hidden;-ms-touch-action:pan-x pinch-zoom;touch-action:pan-x pinch-zoom;-ms-flex-direction:row;flex-direction:row;scroll-snap-type:x mandatory;scroll-snap-type-x:mandatory}.horizontal-scroll-34d526e.hide-scrollbar-34d526e{padding-bottom:20px}.vertical-scroll-34d526e{overflow-x:hidden;-ms-touch-action:pan-y pinch-zoom;touch-action:pan-y pinch-zoom;-ms-flex-direction:column;flex-direction:column;scroll-snap-type:y mandatory;scroll-snap-type-y:mandatory}.slide-element-34d526e{display:-ms-flexbox;display:flex;overflow:hidden;position:relative;-ms-flex-align:center;align-items:center;-ms-flex-direction:column;flex-direction:column;-ms-flex-pack:center;justify-content:center}.enable-snap-34d526e{scroll-snap-stop:always}.enable-snap-34d526e.start-align-34d526e{scroll-snap-align:start}.enable-snap-34d526e.center-align-34d526e{scroll-snap-align:center}.disable-snap-34d526e{scroll-snap-stop:none;scroll-snap-align:none;scroll-snap-coordinate:none}.slide-sizing-34d526e>::slotted(*),.slide-sizing-34d526e>:first-child{margin:0!important;max-width:100%;box-sizing:border-box!important;max-height:100%;-ms-flex-negative:0!important;flex-shrink:0!important}.slide-sizing-34d526e>::slotted(*){width:100%}.slide-sizing-34d526e.thumbnails-34d526e{padding:0px 4px}.arrow-34d526e{top:50%;display:-ms-flexbox;display:flex;z-index:1;-ms-flex-align:center;align-items:center;-ms-flex-direction:row;flex-direction:row;pointer-events:auto;-ms-flex-pack:justify;justify-content:space-between}.arrow-34d526e.ltr-34d526e{transform:translateY(-50%)}.arrow-34d526e.rtl-34d526e{transform:scaleX(-1) translateY(-50%)}.arrow-34d526e.arrow-next-34d526e.rtl-34d526e,.arrow-34d526e.arrow-prev-34d526e.ltr-34d526e{left:0}.arrow-34d526e.arrow-next-34d526e.ltr-34d526e,.arrow-34d526e.arrow-prev-34d526e.rtl-34d526e{right:0}.arrow-disabled-34d526e{pointer-events:none}.arrow-disabled-34d526e.inset-arrow-34d526e{opacity:0}.arrow-disabled-34d526e.outset-arrow-34d526e{opacity:0.5}.inset-arrow-34d526e{padding:12px;position:absolute}.outset-arrow-34d526e{top:50%;height:100%;position:relative;transform:translateY(-50%);-ms-flex-align:center;align-items:center;-ms-flex-negative:0;flex-shrink:0;border-radius:50%;pointer-events:auto;background-size:24px 24px}.outset-arrow-34d526e.arrow-prev-34d526e{margin-inline-end:10px;margin-inline-start:4px}.outset-arrow-34d526e.arrow-next-34d526e{margin-inline-end:4px;margin-inline-start:10px}.default-arrow-button-34d526e{color:#fff;width:36px;border:none;height:36px;stroke:currentColor;display:-ms-flexbox;display:flex;outline:none;padding:0;position:relative;transition:stroke 200ms;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;background-color:transparent}.default-arrow-button-34d526e:hover:not([disabled]){color:#222}.default-arrow-button-34d526e:active:not([disabled]){transition-duration:0ms}.default-arrow-button-34d526e:hover:not([disabled]) .arrow-background-34d526e{background-color:hsla(0,0%,100%,0.8)}.default-arrow-button-34d526e:active:not([disabled]) .arrow-background-34d526e{background-color:#fff;transition-duration:0ms}.default-arrow-button-34d526e:focus{border:1px solid #000;box-shadow:0 0 0 1pt #fff;border-radius:50%}.arrow-base-style-34d526e{top:0;left:0;width:100%;height:100%;position:absolute;border-radius:50%}.arrow-frosting-34d526e{-webkit-backdrop-filter:blur(3px);backdrop-filter:blur(3px)}.arrow-backdrop-34d526e{opacity:0.5;-webkit-backdrop-filter:blur(12px) invert(1) grayscale(0.6) brightness(0.8);backdrop-filter:blur(12px) invert(1) grayscale(0.6) brightness(0.8)}.arrow-background-34d526e{box-shadow:inset 0 0 0px 1px rgba(0,0,0,0.08),0 1px 4px 1px rgba(0,0,0,0.2);transition:background-color 200ms;background-color:rgba(0,0,0,0.3)}.arrow-icon-34d526e{width:24px;height:24px;position:relative}";

  // extensions/amp-base-carousel/1.0/arrow.js
  function _extends() {
    _extends = Object.assign || function(target) {
      for (var i3 = 1; i3 < arguments.length; i3++) {
        var source = arguments[i3];
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
  function _objectWithoutPropertiesLoose(source, excluded) {
    if (source == null)
      return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i3;
    for (i3 = 0; i3 < sourceKeys.length; i3++) {
      key = sourceKeys[i3];
      if (excluded.indexOf(key) >= 0)
        continue;
      target[key] = source[key];
    }
    return target;
  }
  function Arrow(_ref3) {
    var advance = _ref3.advance, by = _ref3.by, _ref$customArrow = _ref3.customArrow, customArrow = _ref$customArrow === void 0 ? createElement(DefaultArrow, {
      by
    }) : _ref$customArrow, disabled = _ref3.disabled, outsetArrows = _ref3.outsetArrows, rtl = _ref3.rtl;
    var _customArrow$props = customArrow.props, customDisabled = _customArrow$props["disabled"], onCustomClick = _customArrow$props["onClick"];
    var isDisabled = disabled || customDisabled;
    var onClick = function onClick2(e3) {
      if (isDisabled) {
        return;
      }
      if (onCustomClick) {
        onCustomClick(e3);
      }
      advance();
    };
    var classes = useStyles();
    var classNames = classes.arrow + " " + (by < 0 ? classes.arrowPrev : classes.arrowNext) + " " + (isDisabled ? classes.arrowDisabled : "") + " " + (outsetArrows ? classes.outsetArrow : classes.insetArrow) + " " + (rtl ? classes.rtl : classes.ltr);
    return createElement("div", {
      class: classNames
    }, cloneElement(customArrow, {
      onClick,
      disabled: isDisabled,
      "aria-disabled": String(!!isDisabled)
    }));
  }
  function DefaultArrow(_ref22) {
    var by = _ref22.by, rest = _objectWithoutPropertiesLoose(_ref22, ["by"]);
    var classes = useStyles();
    return createElement("button", _extends({
      class: classes.defaultArrowButton,
      "aria-label": by < 0 ? "Previous item in carousel" : "Next item in carousel"
    }, rest), createElement("div", {
      class: classes.arrowBaseStyle + " " + classes.arrowFrosting
    }), createElement("div", {
      class: classes.arrowBaseStyle + " " + classes.arrowBackdrop
    }), createElement("div", {
      class: classes.arrowBaseStyle + " " + classes.arrowBackground
    }), createElement("svg", {
      class: classes.arrowIcon,
      viewBox: "0 0 24 24"
    }, createElement("path", {
      d: by < 0 ? "M14,7.4 L9.4,12 L14,16.6" : "M10,7.4 L14.6,12 L10,16.6",
      fill: "none",
      "stroke-width": "2px",
      "stroke-linejoin": "round",
      "stroke-linecap": "round"
    })));
  }

  // extensions/amp-base-carousel/1.0/carousel-context.js
  var CarouselContext = createContext({
    slides: [],
    setSlides: function setSlides(unusedSlides) {
    }
  });

  // node_modules/preact/compat/dist/compat.module.js
  function E3(n2, t3) {
    for (var e3 in t3) {
      n2[e3] = t3[e3];
    }
    return n2;
  }
  function w3(n2, t3) {
    for (var e3 in n2) {
      if (e3 !== "__source" && !(e3 in t3))
        return true;
    }
    for (var r3 in t3) {
      if (r3 !== "__source" && n2[r3] !== t3[r3])
        return true;
    }
    return false;
  }
  var C2 = function(n2) {
    var t3, e3;
    function r3(t4) {
      var e4;
      return (e4 = n2.call(this, t4) || this).isPureReactComponent = true, e4;
    }
    return e3 = n2, (t3 = r3).prototype = Object.create(e3.prototype), t3.prototype.constructor = t3, t3.__proto__ = e3, r3.prototype.shouldComponentUpdate = function(n3, t4) {
      return w3(this.props, n3) || w3(this.state, t4);
    }, r3;
  }(d);
  var A3 = n.vnode;
  function S(n2) {
    function t3(t4) {
      var e3 = E3({}, t4);
      return delete e3.ref, n2(e3, t4.ref);
    }
    return t3.prototype.isReactComponent = true, t3.t = true, t3.displayName = "ForwardRef(" + (n2.displayName || n2.name) + ")", t3;
  }
  n.vnode = function(n2) {
    n2.type && n2.type.t && n2.ref && (n2.props.ref = n2.ref, n2.ref = null), A3 && A3(n2);
  };
  var N2 = n.__e;
  function R(n2) {
    return n2 && ((n2 = E3({}, n2)).__c = null, n2.__k = n2.__k && n2.__k.map(R)), n2;
  }
  function M(n2) {
    this.__u = 0, this.__b = null;
  }
  function U(n2) {
    var t3 = n2.__.__c;
    return t3 && t3.o && t3.o(n2);
  }
  function j2() {
    this.u = null, this.i = null;
  }
  n.__e = function(n2, t3, e3) {
    if (n2.then)
      for (var r3, o3 = t3; o3 = o3.__; ) {
        if ((r3 = o3.__c) && r3.l)
          return r3.l(n2, t3.__c);
      }
    N2(n2, t3, e3);
  }, (M.prototype = new d()).l = function(n2, t3) {
    var e3 = this, r3 = U(e3.__v), o3 = false, u3 = function u4() {
      o3 || (o3 = true, r3 ? r3(i3) : i3());
    };
    t3.__c = t3.componentWillUnmount, t3.componentWillUnmount = function() {
      u3(), t3.__c && t3.__c();
    };
    var i3 = function i4() {
      --e3.__u || (e3.__v.__k[0] = e3.state.o, e3.setState({
        o: e3.__b = null
      }));
    };
    e3.__u++ || e3.setState({
      o: e3.__b = e3.__v.__k[0]
    }), n2.then(u3, u3);
  }, M.prototype.render = function(n2, t3) {
    return this.__b && (this.__v.__k[0] = R(this.__b), this.__b = null), [h(d, null, t3.o ? null : n2.children), t3.o && n2.fallback];
  };
  var z2 = function z3(n2, t3, e3) {
    if (++e3[1] === e3[0] && n2.i.delete(t3), n2.props.revealOrder && (n2.props.revealOrder[0] !== "t" || !n2.i.size))
      for (e3 = n2.u; e3; ) {
        for (; e3.length > 3; ) {
          e3.pop()();
        }
        if (e3[1] < e3[0])
          break;
        n2.u = e3 = e3[2];
      }
  };
  (j2.prototype = new d()).o = function(n2) {
    var t3 = this, e3 = U(t3.__v), r3 = t3.i.get(n2);
    return r3[0]++, function(o3) {
      var u3 = function u4() {
        t3.props.revealOrder ? (r3.push(o3), z2(t3, n2, r3)) : o3();
      };
      e3 ? e3(u3) : u3();
    };
  }, j2.prototype.render = function(n2) {
    this.u = null, this.i = new Map();
    var t3 = b(n2.children);
    n2.revealOrder && n2.revealOrder[0] === "b" && t3.reverse();
    for (var e3 = t3.length; e3--; ) {
      this.i.set(t3[e3], this.u = [1, 0, this.u]);
    }
    return n2.children;
  }, j2.prototype.componentDidUpdate = j2.prototype.componentDidMount = function() {
    var n2 = this;
    n2.i.forEach(function(t3, e3) {
      z2(n2, e3, t3);
    });
  };
  var L2 = function() {
    function n2() {
    }
    var t3 = n2.prototype;
    return t3.getChildContext = function() {
      return this.props.context;
    }, t3.render = function(n3) {
      return n3.children;
    }, n2;
  }();
  var D2 = /^(?:accent|alignment|arabic|baseline|cap|clip|color|fill|flood|font|glyph|horiz|marker|overline|paint|stop|strikethrough|stroke|text|underline|unicode|units|v|vector|vert|word|writing|x)[A-Z]/;
  d.prototype.isReactComponent = {};
  var T3 = typeof Symbol != "undefined" && Symbol.for && Symbol.for("react.element") || 60103;
  var H2 = n.event;
  function I2(n2, t3) {
    n2["UNSAFE_" + t3] && !n2[t3] && Object.defineProperty(n2, t3, {
      configurable: false,
      get: function get2() {
        return this["UNSAFE_" + t3];
      },
      set: function set(n3) {
        this["UNSAFE_" + t3] = n3;
      }
    });
  }
  n.event = function(n2) {
    return H2 && (n2 = H2(n2)), n2.persist = function() {
    }, n2.nativeEvent = n2;
  };
  var $2 = {
    configurable: true,
    get: function get() {
      return this.class;
    }
  };
  var q2 = n.vnode;
  n.vnode = function(n2) {
    n2.$$typeof = T3;
    var t3 = n2.type, e3 = n2.props;
    if (typeof t3 != "function") {
      var r3, o3, u3;
      for (u3 in e3.defaultValue && (e3.value || e3.value === 0 || (e3.value = e3.defaultValue), delete e3.defaultValue), Array.isArray(e3.value) && e3.multiple && t3 === "select" && (b(e3.children).forEach(function(n3) {
        e3.value.indexOf(n3.props.value) != -1 && (n3.props.selected = true);
      }), delete e3.value), e3) {
        if (r3 = D2.test(u3))
          break;
      }
      if (r3)
        for (u3 in o3 = n2.props = {}, e3) {
          o3[D2.test(u3) ? u3.replace(/([A-Z0-9])/, "-$1").toLowerCase() : u3] = e3[u3];
        }
    }
    (e3.class || e3.className) && ($2.enumerable = "className" in e3, e3.className && (e3.class = e3.className), Object.defineProperty(e3, "className", $2)), function(t4) {
      var e4 = n2.type, r4 = n2.props;
      if (r4 && typeof e4 == "string") {
        var o4 = {};
        for (var u4 in r4) {
          /^on(Ani|Tra|Tou)/.test(u4) && (r4[u4.toLowerCase()] = r4[u4], delete r4[u4]), o4[u4.toLowerCase()] = u4;
        }
        if (o4.ondoubleclick && (r4.ondblclick = r4[o4.ondoubleclick], delete r4[o4.ondoubleclick]), o4.onbeforeinput && (r4.onbeforeinput = r4[o4.onbeforeinput], delete r4[o4.onbeforeinput]), o4.onchange && (e4 === "textarea" || e4.toLowerCase() === "input" && !/^fil|che|ra/i.test(r4.type))) {
          var i3 = o4.oninput || "oninput";
          r4[i3] || (r4[i3] = r4[o4.onchange], delete r4[o4.onchange]);
        }
      }
    }(), typeof t3 == "function" && !t3.m && t3.prototype && (I2(t3.prototype, "componentWillMount"), I2(t3.prototype, "componentWillReceiveProps"), I2(t3.prototype, "componentWillUpdate"), t3.m = true), q2 && q2(n2);
  };

  // src/preact/compat.js
  function forwardRef(fn) {
    return S(fn);
  }

  // src/preact/component/contain.js
  function _extends2() {
    _extends2 = Object.assign || function(target) {
      for (var i3 = 1; i3 < arguments.length; i3++) {
        var source = arguments[i3];
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
      return target;
    };
    return _extends2.apply(this, arguments);
  }
  function _objectWithoutPropertiesLoose2(source, excluded) {
    if (source == null)
      return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i3;
    for (i3 = 0; i3 < sourceKeys.length; i3++) {
      key = sourceKeys[i3];
      if (excluded.indexOf(key) >= 0)
        continue;
      target[key] = source[key];
    }
    return target;
  }
  var CONTAIN = [
    null,
    "paint",
    "layout",
    "content",
    "size",
    "size paint",
    "size layout",
    "strict"
  ];
  var SIZE_CONTENT_STYLE = {
    position: "relative",
    width: "100%",
    height: "100%"
  };
  function ContainWrapperWithRef(_ref3, ref) {
    var _ref$as = _ref3.as, Comp = _ref$as === void 0 ? "div" : _ref$as, _ref$size = _ref3.size, size = _ref$size === void 0 ? false : _ref$size, _ref$layout = _ref3.layout, layout = _ref$layout === void 0 ? false : _ref$layout, _ref$paint = _ref3.paint, paint = _ref$paint === void 0 ? false : _ref$paint, wrapperClassName = _ref3.wrapperClassName, wrapperStyle = _ref3.wrapperStyle, _ref$contentAs = _ref3.contentAs, ContentComp = _ref$contentAs === void 0 ? "div" : _ref$contentAs, contentRef = _ref3.contentRef, contentClassName = _ref3.contentClassName, contentProps = _ref3.contentProps, contentStyle = _ref3.contentStyle, children = _ref3.children, className = _ref3["className"], style = _ref3["style"], rest = _objectWithoutPropertiesLoose2(_ref3, ["as", "size", "layout", "paint", "wrapperClassName", "wrapperStyle", "contentAs", "contentRef", "contentClassName", "contentProps", "contentStyle", "children", "className", "style"]);
    var containIndex = (size ? 4 : 0) + (layout ? 2 : 0) + (paint ? 1 : 0);
    return createElement(Comp, _extends2({}, rest, {
      ref,
      className: ((className || "") + " " + (wrapperClassName || "")).trim() || null,
      style: _extends2({}, style, wrapperStyle, {
        contain: CONTAIN[containIndex]
      })
    }), createElement(ContentComp, _extends2({}, contentProps, {
      ref: contentRef,
      className: contentClassName,
      style: _extends2({}, size && SIZE_CONTENT_STYLE, {
        overflow: paint ? "hidden" : "visible"
      }, contentStyle)
    }), children));
  }
  var ContainWrapper = forwardRef(ContainWrapperWithRef);

  // src/preact/component/wrapper.js
  function _extends3() {
    _extends3 = Object.assign || function(target) {
      for (var i3 = 1; i3 < arguments.length; i3++) {
        var source = arguments[i3];
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
      return target;
    };
    return _extends3.apply(this, arguments);
  }
  function _objectWithoutPropertiesLoose3(source, excluded) {
    if (source == null)
      return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i3;
    for (i3 = 0; i3 < sourceKeys.length; i3++) {
      key = sourceKeys[i3];
      if (excluded.indexOf(key) >= 0)
        continue;
      target[key] = source[key];
    }
    return target;
  }
  function WrapperWithRef(_ref3, ref) {
    var _ref$as = _ref3.as, Comp = _ref$as === void 0 ? "div" : _ref$as, wrapperClassName = _ref3.wrapperClassName, wrapperStyle = _ref3.wrapperStyle, children = _ref3.children, className = _ref3["className"], style = _ref3["style"], rest = _objectWithoutPropertiesLoose3(_ref3, ["as", "wrapperClassName", "wrapperStyle", "children", "className", "style"]);
    return createElement(Comp, _extends3({}, rest, {
      ref,
      className: ((className || "") + " " + (wrapperClassName || "")).trim() || null,
      style: _extends3({}, style, wrapperStyle)
    }), children);
  }
  var Wrapper = forwardRef(WrapperWithRef);

  // src/preact/component/value-ref.js
  function useValueRef(current) {
    var valueRef = useRef(null);
    valueRef.current = current;
    return valueRef;
  }

  // extensions/amp-lightbox-gallery/1.0/context.js
  var LightboxGalleryContext = createContext({
    deregister: function deregister() {
    },
    register: function register() {
    },
    open: function open() {
    }
  });

  // src/utils/rate-limit.js
  function debounce(win, callback, minInterval) {
    var locker = 0;
    var timestamp = 0;
    var nextCallArgs = null;
    function fire(args) {
      nextCallArgs = null;
      callback.apply(null, args);
    }
    function waiter() {
      locker = 0;
      var remaining = minInterval - (win.Date.now() - timestamp);
      if (remaining > 0) {
        locker = win.setTimeout(waiter, remaining);
      } else {
        fire(nextCallArgs);
      }
    }
    return function() {
      timestamp = win.Date.now();
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }
      nextCallArgs = args;
      if (!locker) {
        locker = win.setTimeout(waiter, minInterval);
      }
    };
  }

  // src/utils/object.js
  var hasOwn_ = Object.prototype.hasOwnProperty;
  function map(opt_initial) {
    var obj = Object.create(null);
    if (opt_initial) {
      Object.assign(obj, opt_initial);
    }
    return obj;
  }
  function dict(opt_initial) {
    return opt_initial || {};
  }
  function hasOwn(obj, key) {
    return hasOwn_.call(obj, key);
  }

  // src/style.js
  var propertyNameCache;
  var vendorPrefixes = ["Webkit", "webkit", "Moz", "moz", "ms", "O", "o"];
  function camelCaseToTitleCase(camelCase) {
    return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
  }
  function getVendorJsPropertyName_(style, titleCase) {
    for (var i3 = 0; i3 < vendorPrefixes.length; i3++) {
      var propertyName = vendorPrefixes[i3] + titleCase;
      if (style[propertyName] !== void 0) {
        return propertyName;
      }
    }
    return "";
  }
  function getVendorJsPropertyName(style, camelCase, opt_bypassCache) {
    if (isVar(camelCase)) {
      return camelCase;
    }
    if (!propertyNameCache) {
      propertyNameCache = map();
    }
    var propertyName = propertyNameCache[camelCase];
    if (!propertyName || opt_bypassCache) {
      propertyName = camelCase;
      if (style[camelCase] === void 0) {
        var titleCase = camelCaseToTitleCase(camelCase);
        var prefixedPropertyName = getVendorJsPropertyName_(style, titleCase);
        if (style[prefixedPropertyName] !== void 0) {
          propertyName = prefixedPropertyName;
        }
      }
      if (!opt_bypassCache) {
        propertyNameCache[camelCase] = propertyName;
      }
    }
    return propertyName;
  }
  function setStyle(element, property, value, opt_units, opt_bypassCache) {
    var propertyName = getVendorJsPropertyName(element.style, property, opt_bypassCache);
    if (!propertyName) {
      return;
    }
    var styleValue = opt_units ? value + opt_units : value;
    if (isVar(propertyName)) {
      element.style.setProperty(propertyName, styleValue);
    } else {
      element.style[propertyName] = styleValue;
    }
  }
  function isVar(property) {
    return property.startsWith("--");
  }

  // extensions/amp-base-carousel/1.0/scroller.js
  function _extends4() {
    _extends4 = Object.assign || function(target) {
      for (var i3 = 1; i3 < arguments.length; i3++) {
        var source = arguments[i3];
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
      return target;
    };
    return _extends4.apply(this, arguments);
  }
  function _objectWithoutPropertiesLoose4(source, excluded) {
    if (source == null)
      return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i3;
    for (i3 = 0; i3 < sourceKeys.length; i3++) {
      key = sourceKeys[i3];
      if (excluded.indexOf(key) >= 0)
        continue;
      target[key] = source[key];
    }
    return target;
  }
  var RESET_SCROLL_REFERENCE_POINT_WAIT_MS = 200;
  function ScrollerWithRef(_ref3, ref) {
    var advanceCount = _ref3.advanceCount, alignment = _ref3.alignment, autoAdvanceCount = _ref3.autoAdvanceCount, axis = _ref3.axis, children = _ref3.children, lightbox = _ref3.lightbox, loop = _ref3.loop, mixedLength = _ref3.mixedLength, restingIndex = _ref3.restingIndex, setRestingIndex = _ref3.setRestingIndex, snap = _ref3.snap, _ref$snapBy = _ref3.snapBy, snapBy = _ref$snapBy === void 0 ? 1 : _ref$snapBy, visibleCount = _ref3.visibleCount, _thumbnails = _ref3._thumbnails, rest = _objectWithoutPropertiesLoose4(_ref3, ["advanceCount", "alignment", "autoAdvanceCount", "axis", "children", "lightbox", "loop", "mixedLength", "restingIndex", "setRestingIndex", "snap", "snapBy", "visibleCount", "_thumbnails"]);
    var containerRef = useRef(null);
    var pivotIndex = loop ? Math.floor(children.length / 2) : restingIndex;
    var ignoreProgrammaticScrollRef = useRef(false);
    var advance = useCallback(function(by) {
      var container = containerRef.current;
      if (!container) {
        return;
      }
      currentIndex.current = mod(currentIndex.current + by, children.length);
      scrollOffset.current = 0;
      var didScroll = scrollContainerToElement(axis, alignment, container, container.children[mod(pivotIndex + by, container.children.length)], scrollOffset.current);
      if (!didScroll) {
        setRestingIndex(currentIndex.current);
      }
    }, [alignment, axis, children.length, pivotIndex, setRestingIndex]);
    useImperativeHandle(ref, function() {
      return {
        advance,
        next: function next() {
          return advance(advanceCount);
        },
        prev: function prev() {
          return advance(-advanceCount);
        },
        get node() {
          return containerRef.current;
        }
      };
    }, [advance, advanceCount]);
    var classes = useStyles();
    var offsetRef = useRef(restingIndex);
    var scrollOffset = useRef(0);
    var _useContext = useContext(LightboxGalleryContext), openLightbox = _useContext.open;
    var slides = renderSlides({
      alignment,
      children,
      loop,
      mixedLength,
      offsetRef,
      openLightbox: lightbox && openLightbox,
      pivotIndex,
      restingIndex,
      snap,
      snapBy,
      visibleCount,
      _thumbnails
    }, classes);
    var currentIndex = useRef(restingIndex);
    var scrollToActiveSlide = useCallback(function() {
      if (!containerRef.current || !containerRef.current.children.length) {
        return;
      }
      var container = containerRef.current;
      setStyle(container, "scrollBehavior", "auto");
      ignoreProgrammaticScrollRef.current = true;
      scrollContainerToElement(axis, alignment, container, container.children[pivotIndex], scrollOffset.current);
      setStyle(container, "scrollBehavior", "smooth");
    }, [alignment, axis, pivotIndex]);
    useLayoutEffect(function() {
      if (!containerRef.current || !loop) {
        return;
      }
      var container = containerRef.current;
      if (!container.children.length) {
        return;
      }
      scrollToActiveSlide();
    }, [loop, restingIndex, scrollToActiveSlide]);
    useLayoutEffect(function() {
      if (!containerRef.current) {
        return;
      }
      var node = containerRef.current;
      if (!node) {
        return;
      }
      var win = toWin(node.ownerDocument.defaultView);
      if (!win) {
        return void 0;
      }
      var observer = new win.ResizeObserver(scrollToActiveSlide);
      observer.observe(node);
      return function() {
        return observer.disconnect();
      };
    }, [scrollToActiveSlide]);
    var debouncedResetScrollReferencePoint = useMemo(function() {
      var win = containerRef.current ? toWin(containerRef.current.ownerDocument.defaultView) : window;
      return debounce(win, function() {
        if (currentIndex.current === null || currentIndex.current === restingIndex) {
          return;
        }
        setRestingIndex(currentIndex.current);
      }, RESET_SCROLL_REFERENCE_POINT_WAIT_MS);
    }, [restingIndex, setRestingIndex]);
    var updateCurrentIndex = function updateCurrentIndex2() {
      var container = containerRef.current;
      if (!container) {
        return;
      }
      var overlappingIndex = findOverlappingIndex(axis, alignment, container, container.children, pivotIndex);
      if (!snap) {
        scrollOffset.current = getPercentageOffsetFromAlignment(axis, alignment, container, container.children[overlappingIndex]);
      }
      currentIndex.current = mod(overlappingIndex - offsetRef.current, children.length);
    };
    var handleScroll = function handleScroll2() {
      if (ignoreProgrammaticScrollRef.current) {
        ignoreProgrammaticScrollRef.current = false;
        return;
      }
      updateCurrentIndex();
      debouncedResetScrollReferencePoint();
    };
    var incrementCount = Math.max(advanceCount, autoAdvanceCount);
    var needMoreSlidesToScroll = loop && incrementCount > 1 && children.length - pivotIndex - visibleCount < incrementCount;
    return createElement("div", _extends4({
      ref: containerRef,
      onScroll: handleScroll,
      class: classes.scrollContainer + " " + classes.hideScrollbar + " " + (axis === Axis.X ? classes.horizontalScroll : classes.verticalScroll),
      tabindex: 0
    }, rest), slides, needMoreSlidesToScroll && slides);
  }
  var Scroller = forwardRef(ScrollerWithRef);
  Scroller.displayName = "Scroller";
  function renderSlides(_ref22, classes) {
    var alignment = _ref22.alignment, children = _ref22.children, loop = _ref22.loop, mixedLength = _ref22.mixedLength, restingIndex = _ref22.restingIndex, offsetRef = _ref22.offsetRef, openLightbox = _ref22.openLightbox, pivotIndex = _ref22.pivotIndex, snap = _ref22.snap, snapBy = _ref22.snapBy, visibleCount = _ref22.visibleCount, _thumbnails = _ref22._thumbnails;
    var length = children.length;
    var lightboxProps = openLightbox && {
      role: "button",
      tabindex: "0",
      onClick: function onClick() {
        return openLightbox();
      }
    };
    var slides = children.map(function(child, index) {
      var key = "slide-" + (child.key || index);
      return createElement("div", _extends4({
        key,
        "data-slide": index,
        class: classes.slideSizing + " " + classes.slideElement + " " + (snap && mod(index, snapBy) === 0 ? classes.enableSnap : classes.disableSnap) + " " + (alignment === Alignment.CENTER ? classes.centerAlign : classes.startAlign) + " " + (_thumbnails ? classes.thumbnails : "") + " ",
        part: "slide",
        style: {
          flex: mixedLength ? "0 0 auto" : "0 0 " + 100 / visibleCount + "%"
        }
      }, lightboxProps), child);
    });
    if (!loop) {
      return slides;
    }
    var before = [];
    var after = [];
    var shift = mod(length - restingIndex + pivotIndex, length);
    if (restingIndex <= pivotIndex) {
      for (var i3 = 0; i3 < shift; i3++) {
        before.unshift(slides.pop());
      }
    } else {
      for (var _i = 0; _i < length - shift; _i++) {
        after.push(slides.shift());
      }
    }
    offsetRef.current = before.length ? before.length : -after.length;
    return createElement(Fragment, null, before, slides, after);
  }

  // src/loading.js
  var _MAP;
  var Loading = {
    AUTO: "auto",
    LAZY: "lazy",
    EAGER: "eager",
    UNLOAD: "unload"
  };
  var ORDER = [Loading.AUTO, Loading.LAZY, Loading.EAGER, Loading.UNLOAD];
  var MAP = (_MAP = {}, _MAP[Loading.AUTO] = 0, _MAP[Loading.LAZY] = 1, _MAP[Loading.EAGER] = 2, _MAP[Loading.UNLOAD] = 3, _MAP);
  function reducer(v1, v22) {
    var ordinal1 = MAP[v1] || 0;
    var ordinal2 = MAP[v22] || 0;
    var ordinal = Math.max(ordinal1, ordinal2);
    return ORDER[ordinal];
  }

  // src/preact/context.js
  var context;
  function getAmpContext() {
    return context || (context = createContext({
      renderable: true,
      playable: true,
      loading: Loading.AUTO
    }));
  }
  function WithAmpContext(_ref3) {
    var _ref$renderable = _ref3.renderable, renderableProp = _ref$renderable === void 0 ? true : _ref$renderable, _ref$playable = _ref3.playable, playableProp = _ref$playable === void 0 ? true : _ref$playable, _ref$loading = _ref3.loading, loadingProp = _ref$loading === void 0 ? "auto" : _ref$loading, notifyProp = _ref3.notify, children = _ref3.children;
    var parent = useAmpContext();
    var renderable = renderableProp && parent.renderable;
    var playable = renderable && playableProp && parent.playable;
    var loading = reducer(renderable ? Loading.AUTO : Loading.LAZY, reducer(loadingProp, parent.loading));
    var notify = notifyProp || parent.notify;
    var current = useMemo(function() {
      return {
        renderable,
        playable,
        loading,
        notify
      };
    }, [renderable, playable, loading, notify]);
    var AmpContext = getAmpContext();
    return createElement(AmpContext.Provider, {
      children,
      value: current
    });
  }
  function useAmpContext() {
    var AmpContext = getAmpContext();
    return useContext(AmpContext);
  }

  // extensions/amp-lightbox/1.0/component.jss.js
  var _classes2 = {
    closeButton: "close-button-88b9dee",
    wrapper: "wrapper-88b9dee",
    defaultStyles: "default-styles-88b9dee",
    containScroll: "contain-scroll-88b9dee"
  };
  var useStyles3 = function useStyles4() {
    return _classes2;
  };

  // extensions/amp-lightbox/1.0/component.js
  function _extends5() {
    _extends5 = Object.assign || function(target) {
      for (var i3 = 1; i3 < arguments.length; i3++) {
        var source = arguments[i3];
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
      return target;
    };
    return _extends5.apply(this, arguments);
  }
  function _objectWithoutPropertiesLoose5(source, excluded) {
    if (source == null)
      return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i3;
    for (i3 = 0; i3 < sourceKeys.length; i3++) {
      key = sourceKeys[i3];
      if (excluded.indexOf(key) >= 0)
        continue;
      target[key] = source[key];
    }
    return target;
  }
  var ANIMATION_DURATION = 200;
  var ANIMATION_PRESETS = {
    "fade-in": [{
      opacity: 0,
      visibility: "visible"
    }, {
      opacity: 1,
      visibility: "visible"
    }],
    "fly-in-top": [{
      opacity: 0,
      transform: "translate(0,-100%)",
      visibility: "visible"
    }, {
      opacity: 1,
      transform: "translate(0, 0)",
      visibility: "visible"
    }],
    "fly-in-bottom": [{
      opacity: 0,
      transform: "translate(0, 100%)",
      visibility: "visible"
    }, {
      opacity: 1,
      transform: "translate(0, 0)",
      visibility: "visible"
    }]
  };
  var DEFAULT_CLOSE_LABEL = "Close the modal";
  function LightboxWithRef(_ref3, ref) {
    var _ref$animation = _ref3.animation, animation = _ref$animation === void 0 ? "fade-in" : _ref$animation, children = _ref3.children, onBeforeOpen = _ref3.onBeforeOpen, onAfterClose = _ref3.onAfterClose, _ref$scrollable = _ref3.scrollable, scrollable = _ref$scrollable === void 0 ? false : _ref$scrollable, rest = _objectWithoutPropertiesLoose5(_ref3, ["animation", "children", "onBeforeOpen", "onAfterClose", "scrollable"]);
    var _useState = useState(false), mounted = _useState[0], setMounted = _useState[1];
    var _useState2 = useState(false), visible = _useState2[0], setVisible = _useState2[1];
    var classes = useStyles3();
    var lightboxRef = useRef();
    var animationRef = useValueRef(animation);
    var onBeforeOpenRef = useValueRef(onBeforeOpen);
    var onAfterCloseRef = useValueRef(onAfterClose);
    useImperativeHandle(ref, function() {
      return {
        open: function open2() {
          if (onBeforeOpenRef.current) {
            onBeforeOpenRef.current();
          }
          setMounted(true);
          setVisible(true);
        },
        close: function close() {
          setVisible(false);
        }
      };
    }, [onBeforeOpenRef]);
    useLayoutEffect(function() {
      var element = lightboxRef.current;
      if (!element) {
        return;
      }
      var animation2;
      setStyle(element, "visibility", visible ? "hidden" : "visible");
      if (visible) {
        var postVisibleAnim = function postVisibleAnim2() {
          setStyle(element, "opacity", 1);
          setStyle(element, "visibility", "visible");
          element.focus();
        };
        if (!element.animate) {
          postVisibleAnim();
          return;
        }
        animation2 = element.animate(ANIMATION_PRESETS[animationRef.current], {
          duration: ANIMATION_DURATION,
          fill: "both",
          easing: "ease-in"
        });
        animation2.onfinish = postVisibleAnim;
      } else {
        var postInvisibleAnim = function postInvisibleAnim2() {
          setStyle(element, "opacity", 0);
          setStyle(element, "visibility", "hidden");
          if (onAfterCloseRef.current) {
            onAfterCloseRef.current();
          }
          animation2 = null;
          setMounted(false);
        };
        if (!element.animate) {
          postInvisibleAnim();
          return;
        }
        animation2 = element.animate(ANIMATION_PRESETS[animationRef.current], {
          duration: ANIMATION_DURATION,
          direction: "reverse",
          fill: "both",
          easing: "ease-in"
        });
        animation2.onfinish = postInvisibleAnim;
      }
      return function() {
        if (animation2) {
          animation2.cancel();
        }
      };
    }, [visible, animationRef, onAfterCloseRef]);
    return mounted && createElement(ContainWrapper, _extends5({
      ref: function ref2(r3) {
        lightboxRef.current = r3;
      },
      size: true,
      layout: true,
      paint: true,
      part: "lightbox",
      contentStyle: scrollable && {
        overflow: "scroll",
        overscrollBehavior: "none"
      },
      wrapperClassName: classes.defaultStyles + " " + classes.wrapper + " " + (scrollable ? "" : classes.containScroll),
      role: "dialog",
      tabindex: "0",
      onKeyDown: function onKeyDown(event) {
        if (event.key === "Escape") {
          setVisible(false);
        }
      }
    }, rest), children, createElement("button", {
      ariaLabel: DEFAULT_CLOSE_LABEL,
      tabIndex: -1,
      className: classes.closeButton,
      onClick: function onClick() {
        setVisible(false);
      }
    }));
  }
  var Lightbox = forwardRef(LightboxWithRef);
  Lightbox.displayName = "Lightbox";

  // src/utils/id-generator.js
  function sequentialIdGenerator() {
    var counter = 0;
    return function() {
      return String(++counter);
    };
  }

  // extensions/amp-lightbox-gallery/1.0/consumer.js
  function _extends6() {
    _extends6 = Object.assign || function(target) {
      for (var i3 = 1; i3 < arguments.length; i3++) {
        var source = arguments[i3];
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
      return target;
    };
    return _extends6.apply(this, arguments);
  }
  function _objectWithoutPropertiesLoose6(source, excluded) {
    if (source == null)
      return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i3;
    for (i3 = 0; i3 < sourceKeys.length; i3++) {
      key = sourceKeys[i3];
      if (excluded.indexOf(key) >= 0)
        continue;
      target[key] = source[key];
    }
    return target;
  }
  var generateLightboxItemKey = sequentialIdGenerator();
  var DEFAULT_ARIA_LABEL = "Open content in a lightbox view.";
  var DEFAULT_ACTIVATION_PROPS = {
    "aria-label": DEFAULT_ARIA_LABEL,
    role: "button",
    tabIndex: "0"
  };
  function WithLightbox(_ref3) {
    var _ref$as = _ref3.as, Comp = _ref$as === void 0 ? "div" : _ref$as, children = _ref3.children, _ref$enableActivation = _ref3.enableActivation, enableActivation = _ref$enableActivation === void 0 ? true : _ref$enableActivation, customOnClick = _ref3.onClick, _ref$render = _ref3.render, render2 = _ref$render === void 0 ? function() {
      return children;
    } : _ref$render, rest = _objectWithoutPropertiesLoose6(_ref3, ["as", "children", "enableActivation", "onClick", "render"]);
    var _useState = useState(generateLightboxItemKey), genKey = _useState[0];
    var _useContext = useContext(LightboxGalleryContext), open2 = _useContext.open, register2 = _useContext.register, deregister2 = _useContext.deregister;
    useLayoutEffect(function() {
      register2(genKey, render2);
      return function() {
        return deregister2(genKey);
      };
    }, [genKey, deregister2, register2, render2]);
    var activationProps = useMemo(function() {
      return enableActivation && _extends6({}, DEFAULT_ACTIVATION_PROPS, {
        onClick: function onClick() {
          if (customOnClick) {
            customOnClick();
          }
          open2();
        }
      });
    }, [customOnClick, enableActivation, open2]);
    return createElement(Comp, _extends6({}, activationProps, rest), children);
  }

  // src/utils/promise.js
  function _classCallCheck2(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  var Deferred = function Deferred2() {
    _classCallCheck2(this, Deferred2);
    var resolve, reject;
    this.promise = new Promise(function(res, rej) {
      resolve = res;
      reject = rej;
    });
    this.resolve = resolve;
    this.reject = reject;
  };

  // third_party/css-escape/css-escape.js
  /*! https://mths.be/cssescape v1.5.1 by @mathias | MIT license */

  // src/css.js
  function assertIsName(name) {
    devAssert(/^[\w-]+$/.test(name));
  }
  var scopeSelectorSupported;
  function isScopeSelectorSupported(el) {
    if (scopeSelectorSupported !== void 0) {
      return scopeSelectorSupported;
    }
    return scopeSelectorSupported = testScopeSelector(el);
  }
  function testScopeSelector(el) {
    try {
      var doc = el.ownerDocument;
      var testElement = doc.createElement("div");
      var testChild = doc.createElement("div");
      testElement.appendChild(testChild);
      return testElement.querySelector(":scope div") === testChild;
    } catch (e3) {
      return false;
    }
  }
  function prependSelectorsWith(selector, distribute) {
    return selector.replace(/^|,/g, "$&" + distribute + " ");
  }

  // src/string.js
  function toUpperCase(_match, character) {
    return character.toUpperCase();
  }
  function dashToCamelCase(name) {
    return name.replace(/-([a-z])/g, toUpperCase);
  }

  // src/dom.js
  var DEFAULT_CUSTOM_EVENT_OPTIONS = {
    bubbles: true,
    cancelable: true
  };
  function waitForChild(parent, checkFunc, callback) {
    if (checkFunc(parent)) {
      callback();
      return;
    }
    var win = toWin(parent.ownerDocument.defaultView);
    if (win.MutationObserver) {
      var observer = new win.MutationObserver(function() {
        if (checkFunc(parent)) {
          observer.disconnect();
          callback();
        }
      });
      observer.observe(parent, {
        childList: true
      });
    } else {
      var interval = win.setInterval(function() {
        if (checkFunc(parent)) {
          win.clearInterval(interval);
          callback();
        }
      }, 5);
    }
  }
  function waitForBodyOpen(doc, callback) {
    waitForChild(doc.documentElement, function() {
      return !!doc.body;
    }, callback);
  }
  function waitForBodyOpenPromise(doc) {
    return new Promise(function(resolve) {
      return waitForBodyOpen(doc, resolve);
    });
  }
  function addAttributesToElement(element, attributes) {
    for (var attr in attributes) {
      element.setAttribute(attr, attributes[attr]);
    }
    return element;
  }
  function createElementWithAttributes(doc, tagName, attributes) {
    var element = doc.createElement(tagName);
    return addAttributesToElement(element, attributes);
  }
  function childElementByTag(parent, tagName) {
    assertIsName(tagName);
    return scopedQuerySelector(parent, "> " + tagName);
  }
  function matches(el, selector) {
    var matcher = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector || el.oMatchesSelector;
    if (matcher) {
      return matcher.call(el, selector);
    }
    return false;
  }
  function scopedQuerySelectionFallback(root, selector) {
    var unique = "i-amphtml-scoped";
    root.classList.add(unique);
    var scopedSelector = prependSelectorsWith(selector, "." + unique);
    var elements = root.querySelectorAll(scopedSelector);
    root.classList.remove(unique);
    return elements;
  }
  function scopedQuerySelector(root, selector) {
    if (isScopeSelectorSupported(root)) {
      return root.querySelector(prependSelectorsWith(selector, ":scope"));
    }
    var fallbackResult = scopedQuerySelectionFallback(root, selector);
    return fallbackResult[0] === void 0 ? null : fallbackResult[0];
  }
  function isRTL(doc) {
    var dir = doc.body.getAttribute("dir") || doc.documentElement.getAttribute("dir") || "ltr";
    return dir == "rtl";
  }
  function parseBooleanAttribute(s3) {
    return s3 == null ? void 0 : s3 !== "false";
  }
  function dispatchCustomEvent(node, name, opt_data, opt_options) {
    var data = opt_data || {};
    var event = node.ownerDocument.createEvent("Event");
    event.data = data;
    var _ref3 = opt_options || DEFAULT_CUSTOM_EVENT_OPTIONS, bubbles = _ref3.bubbles, cancelable = _ref3.cancelable;
    event.initEvent(name, bubbles, cancelable);
    node.dispatchEvent(event);
  }

  // extensions/amp-base-carousel/1.0/base-carousel.js
  function _extends7() {
    _extends7 = Object.assign || function(target) {
      for (var i3 = 1; i3 < arguments.length; i3++) {
        var source = arguments[i3];
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
      return target;
    };
    return _extends7.apply(this, arguments);
  }
  function _objectWithoutPropertiesLoose7(source, excluded) {
    if (source == null)
      return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i3;
    for (i3 = 0; i3 < sourceKeys.length; i3++) {
      key = sourceKeys[i3];
      if (excluded.indexOf(key) >= 0)
        continue;
      target[key] = source[key];
    }
    return target;
  }
  var Controls = {
    ALWAYS: "always",
    NEVER: "never",
    AUTO: "auto"
  };
  var Interaction = {
    GENERIC: 0,
    FOCUS: 1,
    MOUSE: 2,
    TOUCH: 3,
    NONE: 4
  };
  var Direction = {
    LTR: "ltr",
    RTL: "rtl",
    AUTO: "auto"
  };
  var MIN_AUTO_ADVANCE_INTERVAL = 1e3;
  function BaseCarouselWithRef(_ref3, ref) {
    var _carouselContext$curr, _carouselContext$setC;
    var _ref$advanceCount = _ref3.advanceCount, advanceCount = _ref$advanceCount === void 0 ? 1 : _ref$advanceCount, arrowPrev = _ref3.arrowPrev, arrowNext = _ref3.arrowNext, _ref$autoAdvance = _ref3.autoAdvance, shouldAutoAdvance = _ref$autoAdvance === void 0 ? false : _ref$autoAdvance, _ref$autoAdvanceCount = _ref3.autoAdvanceCount, autoAdvanceCount = _ref$autoAdvanceCount === void 0 ? 1 : _ref$autoAdvanceCount, _ref$autoAdvanceInter = _ref3.autoAdvanceInterval, customAutoAdvanceInterval = _ref$autoAdvanceInter === void 0 ? MIN_AUTO_ADVANCE_INTERVAL : _ref$autoAdvanceInter, _ref$autoAdvanceLoops = _ref3.autoAdvanceLoops, autoAdvanceLoops = _ref$autoAdvanceLoops === void 0 ? Number.POSITIVE_INFINITY : _ref$autoAdvanceLoops, children = _ref3.children, _ref$controls = _ref3.controls, controls = _ref$controls === void 0 ? Controls.AUTO : _ref$controls, _ref$defaultSlide = _ref3.defaultSlide, defaultSlide = _ref$defaultSlide === void 0 ? 0 : _ref$defaultSlide, _ref$dir = _ref3.dir, dir = _ref$dir === void 0 ? Direction.AUTO : _ref$dir, _ref$lightbox = _ref3.lightbox, lightbox = _ref$lightbox === void 0 ? false : _ref$lightbox, loop = _ref3.loop, _ref$mixedLength = _ref3.mixedLength, mixedLength = _ref$mixedLength === void 0 ? false : _ref$mixedLength, _onFocus = _ref3.onFocus, _onMouseEnter = _ref3.onMouseEnter, onSlideChange = _ref3.onSlideChange, _onTouchStart = _ref3.onTouchStart, _ref$orientation = _ref3.orientation, orientation = _ref$orientation === void 0 ? Orientation.HORIZONTAL : _ref$orientation, outsetArrows = _ref3.outsetArrows, _ref$snap = _ref3.snap, snap = _ref$snap === void 0 ? true : _ref$snap, _ref$snapAlign = _ref3.snapAlign, snapAlign = _ref$snapAlign === void 0 ? Alignment.START : _ref$snapAlign, _ref$snapBy = _ref3.snapBy, snapBy = _ref$snapBy === void 0 ? 1 : _ref$snapBy, _ref$visibleCount = _ref3.visibleCount, visibleCount = _ref$visibleCount === void 0 ? 1 : _ref$visibleCount, _ref$_thumbnails = _ref3._thumbnails, _thumbnails = _ref$_thumbnails === void 0 ? false : _ref$_thumbnails, rest = _objectWithoutPropertiesLoose7(_ref3, ["advanceCount", "arrowPrev", "arrowNext", "autoAdvance", "autoAdvanceCount", "autoAdvanceInterval", "autoAdvanceLoops", "children", "controls", "defaultSlide", "dir", "lightbox", "loop", "mixedLength", "onFocus", "onMouseEnter", "onSlideChange", "onTouchStart", "orientation", "outsetArrows", "snap", "snapAlign", "snapBy", "visibleCount", "_thumbnails"]);
    var classes = useStyles();
    var childrenArray = useMemo(function() {
      return toChildArray(children);
    }, [children]);
    var length = childrenArray.length;
    var carouselContext = useContext(CarouselContext);
    var _useState = useState(Math.min(Math.max(defaultSlide, 0), length)), currentSlideState = _useState[0], setCurrentSlideState = _useState[1];
    var globalCurrentSlide = (_carouselContext$curr = carouselContext.currentSlide) != null ? _carouselContext$curr : currentSlideState;
    var setGlobalCurrentSlide = (_carouselContext$setC = carouselContext.setCurrentSlide) != null ? _carouselContext$setC : setCurrentSlideState;
    var currentSlide = _thumbnails ? currentSlideState : globalCurrentSlide;
    var setCurrentSlide = _thumbnails ? setCurrentSlideState : setGlobalCurrentSlide;
    var currentSlideRef = useRef(currentSlide);
    var axis = orientation == Orientation.HORIZONTAL ? Axis.X : Axis.Y;
    useLayoutEffect(function() {
      setCurrentSlide(globalCurrentSlide);
    }, [globalCurrentSlide, setCurrentSlide]);
    var slides = carouselContext.slides, setSlides2 = carouselContext.setSlides;
    var scrollRef = useRef(null);
    var containRef = useRef(null);
    var contentRef = useRef(null);
    var autoAdvanceTimesRef = useRef(0);
    var autoAdvanceInterval = useMemo(function() {
      return Math.max(customAutoAdvanceInterval, MIN_AUTO_ADVANCE_INTERVAL);
    }, [customAutoAdvanceInterval]);
    var autoAdvance = useCallback(function() {
      if (autoAdvanceTimesRef.current + visibleCount / length >= autoAdvanceLoops || interaction.current !== Interaction.NONE) {
        return false;
      }
      if (loop || currentSlideRef.current + visibleCount < length) {
        scrollRef.current.advance(autoAdvanceCount);
        autoAdvanceTimesRef.current += autoAdvanceCount / length;
      } else {
        scrollRef.current.advance(-currentSlideRef.current);
        autoAdvanceTimesRef.current = Math.ceil(autoAdvanceTimesRef.current);
      }
      return true;
    }, [autoAdvanceCount, autoAdvanceLoops, length, loop, visibleCount]);
    var _next = useCallback(function() {
      return scrollRef.current.next();
    }, []);
    var _prev = useCallback(function() {
      return scrollRef.current.prev();
    }, []);
    useEffect(function() {
      if (!shouldAutoAdvance || !containRef.current) {
        return;
      }
      var win = toWin(containRef.current.ownerDocument.defaultView);
      var interval = win.setInterval(function() {
        var autoAdvanced = autoAdvance();
        if (!autoAdvanced) {
          win.clearInterval(interval);
        }
      }, autoAdvanceInterval);
      return function() {
        return win.clearInterval(interval);
      };
    }, [autoAdvance, autoAdvanceInterval, shouldAutoAdvance]);
    var setRestingIndex = useCallback(function(index) {
      if (length <= 0 || isNaN(index)) {
        return;
      }
      index = Math.min(Math.max(index, 0), length - 1);
      setCurrentSlide(index);
      if (currentSlideRef.current !== index) {
        currentSlideRef.current = index;
        if (onSlideChange) {
          onSlideChange(index);
        }
      }
    }, [length, setCurrentSlide, onSlideChange]);
    useImperativeHandle(ref, function() {
      return {
        goToSlide: function goToSlide(index) {
          interaction.current = Interaction.GENERIC;
          setRestingIndex(index);
        },
        next: function next() {
          interaction.current = Interaction.GENERIC;
          _next();
        },
        prev: function prev() {
          interaction.current = Interaction.GENERIC;
          _prev();
        },
        get root() {
          return containRef.current;
        },
        get node() {
          return contentRef.current;
        }
      };
    }, [_next, _prev, setRestingIndex]);
    useEffect(function() {
      if (!_thumbnails && slides && slides.length !== childrenArray.length) {
        setSlides2(childrenArray);
      }
    }, [_thumbnails, childrenArray, setSlides2, slides]);
    var disableForDir = function disableForDir2(dir2) {
      if (loop) {
        return false;
      }
      if (currentSlide + dir2 < 0) {
        return true;
      }
      if (currentSlide + visibleCount + dir2 > length) {
        return true;
      }
      if (mixedLength && dir2 > 0) {
        if (!scrollRef.current) {
          return false;
        }
        var container = scrollRef.current.node;
        if (!container || !container.children.length) {
          return false;
        }
        var scrollEnd = getScrollEnd(axis, container);
        var scrollStart = getOffsetPosition(axis, container.children[currentSlide]);
        var _getDimension = getDimension(axis, container), _length = _getDimension.length;
        if (_length !== scrollEnd && _length + scrollStart >= scrollEnd) {
          return true;
        }
      }
      return false;
    };
    var interaction = useRef(Interaction.NONE);
    var hideControls = useMemo(function() {
      if (controls === Controls.ALWAYS || outsetArrows) {
        return false;
      }
      if (controls === Controls.NEVER) {
        return true;
      }
      return interaction.current === Interaction.TOUCH;
    }, [controls, outsetArrows]);
    var _useState2 = useState(dir === Direction.RTL), rtl = _useState2[0], setRtl = _useState2[1];
    useLayoutEffect(function() {
      if (!containRef.current || dir !== Direction.AUTO) {
        return;
      }
      var doc = containRef.current.ownerDocument;
      if (!doc) {
        return;
      }
      setRtl(isRTL(doc));
    }, [dir, setRtl]);
    return createElement(ContainWrapper, _extends7({
      size: true,
      layout: true,
      paint: true,
      contentStyle: {
        display: "flex",
        direction: rtl ? Direction.RTL : Direction.LTR
      },
      ref: containRef,
      onFocus: function onFocus(e3) {
        if (_onFocus) {
          _onFocus(e3);
        }
        interaction.current = Interaction.FOCUS;
      },
      onMouseEnter: function onMouseEnter(e3) {
        if (_onMouseEnter) {
          _onMouseEnter(e3);
        }
        interaction.current = Interaction.MOUSE;
      },
      onTouchStart: function onTouchStart(e3) {
        if (_onTouchStart) {
          _onTouchStart(e3);
        }
        interaction.current = Interaction.TOUCH;
      },
      tabIndex: "0",
      wrapperClassName: classes.carousel,
      contentAs: lightbox ? WithLightbox : "div",
      contentRef,
      contentProps: {
        enableActivation: false,
        render: function render2() {
          return children;
        }
      }
    }, rest), !hideControls && createElement(Arrow, {
      advance: _prev,
      by: -advanceCount,
      customArrow: arrowPrev,
      disabled: disableForDir(-1),
      outsetArrows,
      rtl
    }), createElement(Scroller, {
      advanceCount,
      alignment: snapAlign,
      autoAdvanceCount,
      axis,
      lightbox,
      loop,
      mixedLength,
      restingIndex: currentSlide,
      setRestingIndex,
      snap,
      snapBy,
      ref: scrollRef,
      visibleCount: mixedLength ? 1 : visibleCount,
      _thumbnails
    }, childrenArray.map(function(child, index) {
      return Math.min(Math.abs(index - currentSlide), loop ? mod(length + currentSlide - index, length) : length) < Math.ceil(visibleCount * 3) || mixedLength ? createElement(WithAmpContext, {
        key: index,
        renderable: index == currentSlide,
        playable: index == currentSlide
      }, child) : createElement(Fragment, null);
    })), !hideControls && createElement(Arrow, {
      advance: _next,
      by: advanceCount,
      customArrow: arrowNext,
      disabled: disableForDir(1),
      outsetArrows,
      rtl
    }));
  }
  var BaseCarousel = forwardRef(BaseCarouselWithRef);
  BaseCarousel.displayName = "BaseCarousel";

  // build/amp-base-carousel-1.0.css.js
  var CSS3 = "amp-base-carousel{display:block;overflow:hidden;position:relative}amp-base-carousel:not(.i-amphtml-built)>:not([placeholder]):not(.i-amphtml-svc){display:none;content-visibility:hidden}\n/*# sourceURL=/extensions/amp-base-carousel/1.0/amp-base-carousel.css*/";

  // src/context/scan.js
  function findParent(startNode, predicate, arg, includeSelf) {
    if (arg === void 0) {
      arg = void 0;
    }
    if (includeSelf === void 0) {
      includeSelf = true;
    }
    for (var n2 = includeSelf ? startNode : startNode.parent; n2; n2 = n2.parent) {
      if (predicate(n2, arg)) {
        return n2;
      }
    }
    return null;
  }
  function deepScan(startNode, callback, arg, state, includeSelf) {
    if (arg === void 0) {
      arg = void 0;
    }
    if (state === void 0) {
      state = true;
    }
    if (includeSelf === void 0) {
      includeSelf = true;
    }
    if (includeSelf) {
      var newState = callback(startNode, arg, state);
      if (newState) {
        deepScan(startNode, callback, arg, newState, false);
      }
    } else if (startNode.children) {
      for (var i3 = 0; i3 < startNode.children.length; i3++) {
        deepScan(startNode.children[i3], callback, arg, state, true);
      }
    }
  }

  // src/utils/array.js
  function pushIfNotExist(array, item) {
    if (array.indexOf(item) < 0) {
      array.push(item);
      return true;
    }
    return false;
  }
  function removeItem(array, item) {
    var index = array.indexOf(item);
    if (index == -1) {
      return false;
    }
    array.splice(index, 1);
    return true;
  }

  // src/context/scheduler.js
  function throttleTail(handler, defaultScheduler) {
    if (defaultScheduler === void 0) {
      defaultScheduler = null;
    }
    var scheduled = false;
    var handleAndUnschedule = function handleAndUnschedule2() {
      scheduled = false;
      handler();
    };
    var scheduleIfNotScheduled = function scheduleIfNotScheduled2(opt_scheduler) {
      if (!scheduled) {
        scheduled = true;
        var scheduler = opt_scheduler || defaultScheduler;
        scheduler(handleAndUnschedule);
      }
    };
    return scheduleIfNotScheduled;
  }
  function tryCallback(callback) {
    try {
      return callback();
    } catch (e3) {
      rethrowAsync(e3);
    }
  }

  // src/context/values.js
  function _classCallCheck3(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function _defineProperties(target, props) {
    for (var i3 = 0; i3 < props.length; i3++) {
      var descriptor = props[i3];
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
  var EMPTY_ARRAY = [];
  var EMPTY_FUNC = function EMPTY_FUNC2() {
  };
  var Pending = {
    NOT_PENDING: 0,
    PENDING: 1,
    PENDING_REFRESH_PARENT: 2
  };
  var Values = /* @__PURE__ */ function() {
    function Values2(contextNode) {
      _classCallCheck3(this, Values2);
      this.contextNode_ = contextNode;
      this.inputsByKey_ = null;
      this.usedByKey_ = null;
      this.checkUpdates_ = throttleTail(this.checkUpdates_.bind(this), setTimeout);
    }
    _createClass(Values2, [{
      key: "set",
      value: function set(prop, setter, value) {
        devAssert(setter);
        devAssert(value !== void 0);
        var key = prop.key;
        var inputsByKey = this.inputsByKey_ || (this.inputsByKey_ = new Map());
        var inputs = inputsByKey.get(key);
        if (!inputs) {
          inputs = {
            values: [],
            setters: []
          };
          inputsByKey.set(key, inputs);
        }
        var index = inputs.setters.indexOf(setter);
        var changed = index == -1 || inputs.values[index] !== value;
        if (index == -1) {
          inputs.setters.push(setter);
          inputs.values.push(value);
        } else if (changed) {
          inputs.values[index] = value;
        }
        if (changed) {
          this.ping(prop, false);
          if (isRecursive(prop)) {
            deepScan(this.contextNode_, scan, prop, true, false);
          }
        }
      }
    }, {
      key: "remove",
      value: function remove(prop, setter) {
        devAssert(setter);
        var key = prop.key;
        var inputsByKey = this.inputsByKey_;
        var inputs = inputsByKey && inputsByKey.get(key);
        if (inputs) {
          var index = inputs.setters.indexOf(setter);
          if (index != -1) {
            inputs.setters.splice(index, 1);
            inputs.values.splice(index, 1);
            if (inputs.setters.length == 0) {
              inputsByKey.delete(key);
            }
            deepScan(this.contextNode_, scan, prop);
          }
        }
      }
    }, {
      key: "has",
      value: function has(prop) {
        var inputsByKey = this.inputsByKey_;
        return !!inputsByKey && inputsByKey.has(prop.key);
      }
    }, {
      key: "subscribe",
      value: function subscribe2(prop, handler) {
        var used = this.startUsed_(prop);
        if (!pushIfNotExist(used.subscribers, handler)) {
          return;
        }
        var existingValue = used.value;
        if (isDefined(existingValue) && this.isConnected_()) {
          handler(existingValue);
        }
      }
    }, {
      key: "unsubscribe",
      value: function unsubscribe2(prop, handler) {
        var key = prop.key;
        var usedByKey = this.usedByKey_;
        var used = usedByKey && usedByKey.get(key);
        if (!used || !removeItem(used.subscribers, handler)) {
          return;
        }
        this.stopUsed_(used);
      }
    }, {
      key: "ping",
      value: function ping(prop, refreshParent) {
        var key = prop.key;
        var usedByKey = this.usedByKey_;
        var used = usedByKey && usedByKey.get(key);
        if (used) {
          used.ping(refreshParent);
        }
      }
    }, {
      key: "parentUpdated",
      value: function parentUpdated() {
        if (this.isConnected_()) {
          deepScan(this.contextNode_, scanAll, void 0, EMPTY_ARRAY);
        }
      }
    }, {
      key: "rootUpdated",
      value: function rootUpdated() {
        var _this = this;
        var usedByKey = this.usedByKey_;
        if (!usedByKey) {
          return;
        }
        if (this.isConnected_()) {
          usedByKey.forEach(function(used) {
            var prop = used.prop;
            _this.ping(prop, true);
          });
        } else {
          usedByKey.forEach(function(used) {
            var prop = used.prop;
            if (isRecursive(prop)) {
              _this.updateParentContextNode_(used, null);
            }
          });
        }
      }
    }, {
      key: "scan",
      value: function scan2(prop) {
        this.ping(prop, true);
        if (!isRecursive(prop)) {
          return false;
        }
        if (this.has(prop)) {
          return false;
        }
        return true;
      }
    }, {
      key: "scanAll",
      value: function scanAll2(scheduled) {
        var _this2 = this;
        var newScheduled = null;
        var usedByKey = this.usedByKey_;
        if (usedByKey) {
          usedByKey.forEach(function(used) {
            var prop = used.prop;
            if ((newScheduled || scheduled).indexOf(prop.key) == -1) {
              _this2.ping(prop, true);
              if (_this2.contextNode_.children && _this2.has(prop)) {
                if (!newScheduled) {
                  newScheduled = scheduled.slice(0);
                }
                newScheduled.push(prop.key);
              }
            }
          });
        }
        return newScheduled || scheduled;
      }
    }, {
      key: "isConnected_",
      value: function isConnected_() {
        return !!this.contextNode_.root;
      }
    }, {
      key: "startUsed_",
      value: function startUsed_(prop) {
        var _this3 = this;
        var key = prop.key, deps = prop.deps;
        var usedByKey = this.usedByKey_ || (this.usedByKey_ = new Map());
        var used = usedByKey.get(key);
        if (!used) {
          used = {
            prop,
            subscribers: [],
            value: void 0,
            pending: Pending.NOT_PENDING,
            counter: 0,
            depValues: deps.length > 0 ? deps.map(EMPTY_FUNC) : EMPTY_ARRAY,
            parentValue: void 0,
            parentContextNode: null,
            ping: function ping(refreshParent) {
              if (_this3.isConnected_()) {
                var pending = refreshParent ? Pending.PENDING_REFRESH_PARENT : Pending.PENDING;
                used.pending = Math.max(used.pending, pending);
                _this3.checkUpdates_();
              }
            },
            pingDep: deps.length > 0 ? deps.map(function(dep, index) {
              return function(value) {
                used.depValues[index] = value;
                used.ping();
              };
            }) : EMPTY_ARRAY,
            pingParent: isRecursive(prop) ? function(parentValue) {
              used.parentValue = parentValue;
              used.ping();
            } : null
          };
          usedByKey.set(key, used);
          deps.forEach(function(dep, index) {
            return _this3.subscribe(dep, used.pingDep[index]);
          });
          used.ping(false);
        }
        return used;
      }
    }, {
      key: "stopUsed_",
      value: function stopUsed_(used) {
        var _this4 = this;
        if (used.subscribers.length > 0) {
          return;
        }
        var prop = used.prop, pingDep = used.pingDep;
        var key = prop.key, deps = prop.deps;
        this.usedByKey_.delete(key);
        this.updateParentContextNode_(used, null);
        if (deps.length > 0) {
          deps.forEach(function(dep, index) {
            _this4.unsubscribe(dep, pingDep[index]);
          });
        }
      }
    }, {
      key: "checkUpdates_",
      value: function checkUpdates_() {
        var _this5 = this;
        if (!this.isConnected_()) {
          return;
        }
        var usedByKey = this.usedByKey_;
        if (!usedByKey) {
          return;
        }
        usedByKey.forEach(function(used) {
          used.counter = 0;
        });
        var updated;
        do {
          updated = 0;
          usedByKey.forEach(function(used) {
            if (used.pending != Pending.NOT_PENDING) {
              var key = used.prop.key;
              used.counter++;
              if (used.counter > 5) {
                rethrowAsync(new Error("cyclical prop: " + key));
                used.pending = Pending.NOT_PENDING;
                return;
              }
              updated++;
              _this5.tryUpdate_(used);
            }
          });
        } while (updated > 0);
      }
    }, {
      key: "tryUpdate_",
      value: function tryUpdate_(used) {
        var refreshParent = used.pending == Pending.PENDING_REFRESH_PARENT;
        var newValue;
        try {
          newValue = this.calc_(used, refreshParent);
        } catch (e3) {
          rethrowAsync(e3);
        }
        used.pending = Pending.NOT_PENDING;
        this.maybeUpdated_(used, newValue);
      }
    }, {
      key: "maybeUpdated_",
      value: function maybeUpdated_(used, value) {
        var prop = used.prop, oldValue = used.value;
        var key = prop.key;
        var usedByKey = this.usedByKey_;
        if (oldValue === value || used !== (usedByKey && usedByKey.get(key)) || !this.isConnected_()) {
          return;
        }
        used.value = value;
        var subscribers = used.subscribers;
        subscribers.forEach(function(handler) {
          handler(value);
        });
      }
    }, {
      key: "calc_",
      value: function calc_(used, refreshParent) {
        devAssert(this.isConnected_());
        var prop = used.prop, depValues = used.depValues;
        var key = prop.key, compute4 = prop.compute, defaultValue = prop.defaultValue;
        var inputsByKey = this.inputsByKey_;
        var inputs = inputsByKey && inputsByKey.get(key);
        var inputValues = inputs && inputs.values;
        var recursive3 = calcRecursive(prop, inputValues);
        if (refreshParent || recursive3 != Boolean(used.parentContextNode)) {
          var newParentContextNode = recursive3 ? findParent(this.contextNode_, hasInput, prop, false) : null;
          this.updateParentContextNode_(used, newParentContextNode);
        }
        var parentValue = isDefined(used.parentValue) ? used.parentValue : recursive3 && !used.parentContextNode ? defaultValue : void 0;
        var newValue = void 0;
        var ready = depValues.every(isDefined) && (!recursive3 || isDefined(parentValue));
        if (ready) {
          var node = this.contextNode_.node;
          if (inputValues && !compute4) {
            newValue = inputValues[0];
          } else if (isRecursive(prop)) {
            if (inputValues || depValues.length > 0) {
              newValue = callRecursiveCompute(compute4, node, inputValues || EMPTY_ARRAY, parentValue, depValues);
            } else if (isDefined(parentValue)) {
              newValue = parentValue;
            }
          } else if (compute4) {
            newValue = callCompute(compute4, node, inputValues || EMPTY_ARRAY, depValues);
          }
        }
        return newValue;
      }
    }, {
      key: "updateParentContextNode_",
      value: function updateParentContextNode_(used, newParentContextNode) {
        var prop = used.prop, oldParentContextNode = used.parentContextNode, pingParent = used.pingParent;
        if (newParentContextNode != oldParentContextNode) {
          used.parentContextNode = newParentContextNode;
          used.parentValue = void 0;
          if (oldParentContextNode) {
            oldParentContextNode.values.unsubscribe(prop, devAssert(pingParent));
          }
          if (newParentContextNode) {
            newParentContextNode.values.subscribe(prop, devAssert(pingParent));
          }
        }
      }
    }]);
    return Values2;
  }();
  function scan(contextNode, prop) {
    return contextNode.values.scan(prop);
  }
  function scanAll(contextNode, unusedArg, state) {
    return contextNode.values.scanAll(state);
  }
  function hasInput(contextNode, prop) {
    return contextNode.values.has(prop);
  }
  function isRecursive(prop) {
    return !!prop.recursive;
  }
  function calcRecursive(prop, inputs) {
    var recursive3 = prop.recursive, compute4 = prop.compute;
    if (typeof recursive3 == "function") {
      return inputs ? recursive3(inputs) : true;
    }
    if (recursive3 && inputs && !compute4) {
      return false;
    }
    return recursive3;
  }
  function callCompute(compute4, node, inputValues, deps) {
    switch (deps.length) {
      case 0:
        return compute4(node, inputValues);
      case 1:
        return compute4(node, inputValues, deps[0]);
      case 2:
        return compute4(node, inputValues, deps[0], deps[1]);
      case 3:
        return compute4(node, inputValues, deps[0], deps[1], deps[2]);
      default:
        return compute4.apply(null, [node, inputValues].concat(deps));
    }
  }
  function callRecursiveCompute(compute4, node, inputValues, parentValue, deps) {
    switch (deps.length) {
      case 0:
        return compute4(node, inputValues, parentValue);
      case 1:
        return compute4(node, inputValues, parentValue, deps[0]);
      case 2:
        return compute4(node, inputValues, parentValue, deps[0], deps[1]);
      case 3:
        return compute4(node, inputValues, parentValue, deps[0], deps[1], deps[2]);
      default:
        return compute4.apply(null, [node, inputValues, parentValue].concat(deps));
    }
  }
  function isDefined(v3) {
    return v3 !== void 0;
  }

  // src/context/node.js
  function _classCallCheck4(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function _defineProperties2(target, props) {
    for (var i3 = 0; i3 < props.length; i3++) {
      var descriptor = props[i3];
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
  var NODE_PROP = "__AMP_NODE";
  var ASSIGNED_SLOT_PROP = "__AMP_ASSIGNED_SLOT";
  var AMP_PREFIX = "AMP-";
  var ELEMENT_NODE = 1;
  var DOCUMENT_NODE = 9;
  var FRAGMENT_NODE = 11;
  var ContextNode = /* @__PURE__ */ function() {
    function ContextNode2(node, name) {
      _classCallCheck4(this, ContextNode2);
      this.node = node;
      this.name = name;
      this.isRoot = node.nodeType == DOCUMENT_NODE;
      this.root = this.isRoot ? this : null;
      this.parent = null;
      this.children = null;
      this.groups = null;
      this.values = new Values(this);
      this.components_ = null;
      this.parentOverridden_ = false;
      this.cleanups_ = null;
      this.scheduleDiscover_ = throttleTail(this.discover_.bind(this), setTimeout);
      if (node.nodeType == FRAGMENT_NODE) {
        node.addEventListener("slotchange", function(e3) {
          var slot = e3.target;
          var assignedNodes = slot.assignedNodes();
          assignedNodes.forEach(discoverContained);
          var closest = ContextNode2.closest(slot);
          var closestChildren = closest && closest.children;
          if (closestChildren) {
            closestChildren.forEach(discoverContextNode);
          }
        });
      }
      this.discover();
    }
    _createClass2(ContextNode2, [{
      key: "discover",
      value: function discover2() {
        if (this.isDiscoverable()) {
          this.scheduleDiscover_();
        } else if (this.name && this.children) {
          this.children.forEach(discoverContextNode);
        }
      }
    }, {
      key: "isDiscoverable",
      value: function isDiscoverable() {
        return !this.isRoot && !this.parentOverridden_;
      }
    }, {
      key: "setParent",
      value: function setParent2(parent) {
        var parentContext = parent && parent.nodeType ? ContextNode2.get(parent) : parent;
        this.updateTree_(parentContext, parent != null);
      }
    }, {
      key: "setIsRoot",
      value: function setIsRoot(isRoot) {
        this.isRoot = isRoot;
        var newRoot = isRoot ? this : this.parent ? this.parent.root : null;
        this.updateRoot(newRoot);
      }
    }, {
      key: "updateRoot",
      value: function updateRoot(root) {
        var _this = this;
        devAssert(!root || root.isRoot);
        var oldRoot = this.root;
        if (root != oldRoot) {
          var cleanups = this.cleanups_;
          if (cleanups) {
            cleanups.forEach(function(cleanup) {
              return cleanup(_this);
            });
            this.cleanups_ = null;
          }
          this.root = root;
          this.values.rootUpdated();
          var components = this.components_;
          if (components) {
            components.forEach(function(comp) {
              comp.rootUpdated();
            });
          }
          if (this.children) {
            this.children.forEach(function(child) {
              return child.updateRoot(root);
            });
          }
        }
      }
    }, {
      key: "addGroup",
      value: function addGroup2(name, match, weight) {
        var groups = this.groups || (this.groups = new Map());
        var node = this.node, children = this.children;
        var cn = new ContextNode2(node, name);
        groups.set(name, {
          cn,
          match,
          weight
        });
        cn.setParent(this);
        if (children) {
          children.forEach(discoverContextNode);
        }
        return cn;
      }
    }, {
      key: "group",
      value: function group(name) {
        var groups = this.groups;
        var group2 = groups && groups.get(name);
        return group2 && group2.cn || null;
      }
    }, {
      key: "findGroup",
      value: function findGroup(node) {
        var _this2 = this;
        var groups = this.groups;
        if (!groups) {
          return null;
        }
        var found = null;
        var maxWeight = Number.NEGATIVE_INFINITY;
        groups.forEach(function(_ref3) {
          var cn = _ref3.cn, match = _ref3.match, weight = _ref3.weight;
          if (match(node, _this2.node) && weight > maxWeight) {
            found = cn;
            maxWeight = weight;
          }
        });
        return found;
      }
    }, {
      key: "mountComponent",
      value: function mountComponent2(id, factory, func, deps, input) {
        var components = this.components_ || (this.components_ = new Map());
        var comp = components.get(id);
        if (!comp) {
          comp = factory(id, this, func, deps);
          components.set(id, comp);
        }
        comp.set(input);
      }
    }, {
      key: "unmountComponent",
      value: function unmountComponent2(id) {
        var components = this.components_;
        var comp = components && components.get(id);
        if (comp) {
          comp.dispose();
          components.delete(id);
        }
      }
    }, {
      key: "pushCleanup",
      value: function pushCleanup(cleanup) {
        var cleanups = this.cleanups_ || (this.cleanups_ = []);
        pushIfNotExist(cleanups, cleanup);
      }
    }, {
      key: "popCleanup",
      value: function popCleanup(cleanup) {
        var cleanups = this.cleanups_;
        if (cleanups) {
          removeItem(cleanups, cleanup);
        }
      }
    }, {
      key: "discover_",
      value: function discover_() {
        if (!this.isDiscoverable()) {
          return;
        }
        var closestNode = ContextNode2.closest(this.node, false);
        var parent = closestNode && closestNode.findGroup(this.node) || closestNode;
        this.updateTree_(parent, false);
      }
    }, {
      key: "updateTree_",
      value: function updateTree_(parent, parentOverridden) {
        this.parentOverridden_ = parentOverridden;
        var oldParent = this.parent;
        if (parent != oldParent) {
          this.parent = parent;
          if (oldParent && oldParent.children) {
            removeItem(oldParent.children, this);
          }
          if (parent) {
            var parentChildren = parent.children || (parent.children = []);
            pushIfNotExist(parentChildren, this);
            for (var i3 = 0; i3 < parentChildren.length; i3++) {
              var child = parentChildren[i3];
              if (child != this && child.isDiscoverable()) {
                child.discover();
              }
            }
          }
          this.values.parentUpdated();
        }
        this.updateRoot(parent ? parent.root : null);
      }
    }], [{
      key: "get",
      value: function get2(node) {
        var contextNode = node[NODE_PROP];
        if (!contextNode) {
          contextNode = new ContextNode2(node, null);
          if (getMode().localDev || getMode().test) {
            Object.defineProperty(node, NODE_PROP, {
              value: contextNode,
              writable: false,
              enumerable: false,
              configurable: false
            });
          } else {
            node[NODE_PROP] = contextNode;
          }
        }
        return contextNode;
      }
    }, {
      key: "closest",
      value: function closest(node, includeSelf) {
        if (includeSelf === void 0) {
          includeSelf = true;
        }
        var n2 = node;
        while (n2) {
          if (n2 != node || includeSelf) {
            if (n2[NODE_PROP]) {
              return n2[NODE_PROP];
            }
            var _n = n2, nodeType = _n.nodeType;
            if (nodeType == DOCUMENT_NODE || nodeType == FRAGMENT_NODE) {
              return ContextNode2.get(n2);
            }
            if (nodeType == ELEMENT_NODE && n2.tagName.startsWith(AMP_PREFIX)) {
              return ContextNode2.get(n2);
            }
          }
          var assignedSlot = n2[ASSIGNED_SLOT_PROP] || n2.assignedSlot;
          if (assignedSlot) {
            n2 = assignedSlot;
          } else {
            n2 = n2.parentNode;
          }
        }
        return null;
      }
    }, {
      key: "assignSlot",
      value: function assignSlot(node, slot) {
        if (node[ASSIGNED_SLOT_PROP] == slot) {
          return;
        }
        node[ASSIGNED_SLOT_PROP] = slot;
        discoverContained(node);
      }
    }, {
      key: "unassignSlot",
      value: function unassignSlot(node, slot) {
        if (node[ASSIGNED_SLOT_PROP] != slot) {
          return;
        }
        node[ASSIGNED_SLOT_PROP] = void 0;
        discoverContained(node);
      }
    }, {
      key: "rediscoverChildren",
      value: function rediscoverChildren2(node) {
        var contextNode = node[NODE_PROP];
        var children = contextNode && contextNode.children;
        if (children) {
          children.forEach(discoverContextNode);
        }
      }
    }]);
    return ContextNode2;
  }();
  function forEachContained(node, callback, includeSelf) {
    if (includeSelf === void 0) {
      includeSelf = true;
    }
    var closest = ContextNode.closest(node, includeSelf);
    if (!closest) {
      return;
    }
    if (closest.node == node) {
      callback(closest);
    } else if (closest.children) {
      closest.children.forEach(function(child) {
        if (node.contains(child.node)) {
          callback(child);
        }
      });
    }
  }
  function discoverContained(node) {
    forEachContained(node, discoverContextNode);
  }
  function discoverContextNode(cn) {
    cn.discover();
  }

  // src/context/prop.js
  function _extends8() {
    _extends8 = Object.assign || function(target) {
      for (var i3 = 1; i3 < arguments.length; i3++) {
        var source = arguments[i3];
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
      return target;
    };
    return _extends8.apply(this, arguments);
  }
  var EMPTY_DEPS = [];
  function contextProp(key, opt_spec) {
    var prop = _extends8({
      key,
      type: null,
      deps: EMPTY_DEPS,
      recursive: false,
      compute: null,
      defaultValue: void 0
    }, opt_spec);
    devAssert(prop.deps.length == 0 || prop.compute);
    return prop;
  }

  // src/context/component-meta.js
  function getId(func) {
    return func["key"] || func;
  }

  // src/context/component-hooks.js
  var currentComponent;
  function withComponent(component, callback) {
    currentComponent = component;
    try {
      callback();
    } finally {
      currentComponent = void 0;
    }
  }

  // src/context/component.js
  function _classCallCheck5(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function _defineProperties3(target, props) {
    for (var i3 = 0; i3 < props.length; i3++) {
      var descriptor = props[i3];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor)
        descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  function _createClass3(Constructor, protoProps, staticProps) {
    if (protoProps)
      _defineProperties3(Constructor.prototype, protoProps);
    if (staticProps)
      _defineProperties3(Constructor, staticProps);
    return Constructor;
  }
  var EMPTY_ARRAY2 = [];
  var EMPTY_FUNC3 = function EMPTY_FUNC4() {
  };
  var Component = /* @__PURE__ */ function() {
    function Component2(id, contextNode, func, deps) {
      var _this = this;
      _classCallCheck5(this, Component2);
      this.id = id;
      this.contextNode = contextNode;
      this.func_ = func;
      this.deps_ = deps;
      this.depValues_ = deps.length > 0 ? deps.map(EMPTY_FUNC3) : EMPTY_ARRAY2;
      this.depSubscribers_ = deps.length > 0 ? deps.map(function(unusedDep, index) {
        return function(value) {
          _this.depValues_[index] = value;
          _this.update_();
        };
      }) : EMPTY_ARRAY2;
      this.input_ = void 0;
      this.running_ = false;
      this.refs_ = null;
      this.refPointer_ = -1;
      this.runCleanup_ = null;
      this.cleanups_ = null;
      this.childProps_ = null;
      this.childComps_ = null;
      this.update_ = throttleTail(this.update_.bind(this), setTimeout);
      this.run_ = this.run_.bind(this);
      this.cleanupChild_ = this.cleanupChild_.bind(this);
      if (deps.length > 0) {
        var values = this.contextNode.values;
        deps.forEach(function(dep, index) {
          return values.subscribe(dep, _this.depSubscribers_[index]);
        });
      }
      if (this.isConnected_()) {
        this.update_();
      }
    }
    _createClass3(Component2, [{
      key: "dispose",
      value: function dispose() {
        var _this2 = this;
        if (this.deps_.length > 0) {
          var values = this.contextNode.values;
          this.deps_.forEach(function(dep, index) {
            return values.unsubscribe(dep, _this2.depSubscribers_[index]);
          });
        }
        this.cleanup_(true);
      }
    }, {
      key: "rootUpdated",
      value: function rootUpdated() {
        var isConnected = this.isConnected_();
        this.cleanup_(!isConnected);
        if (isConnected) {
          this.update_();
        }
      }
    }, {
      key: "set",
      value: function set(input) {
        if (this.input_ !== input) {
          this.input_ = input;
          if (this.isConnected_()) {
            this.update_();
          }
        }
      }
    }, {
      key: "allocRef",
      value: function allocRef(def) {
        if (def === void 0) {
          def = void 0;
        }
        var refs = this.refs_ || (this.refs_ = []);
        var pointer = ++this.refPointer_;
        return refs[pointer] || (refs[pointer] = {
          current: def
        });
      }
    }, {
      key: "pushCleanup",
      value: function pushCleanup(cleanup) {
        var cleanups = this.cleanups_ || (this.cleanups_ = []);
        pushIfNotExist(cleanups, cleanup);
      }
    }, {
      key: "popCleanup",
      value: function popCleanup(cleanup) {
        var cleanups = this.cleanups_;
        if (cleanups) {
          removeItem(cleanups, cleanup);
        }
      }
    }, {
      key: "setProp",
      value: function setProp2(prop, value, node) {
        if (node === void 0) {
          node = void 0;
        }
        var contextNode = node ? ContextNode.get(node) : this.contextNode;
        contextNode.values.set(prop, this, value);
        var childProps = this.childProps_ || (this.childProps_ = new Map());
        var props = childProps && childProps.get(contextNode);
        if (!props) {
          if (contextNode != this.contextNode) {
            this.maybeRegisterChildCleanup_(contextNode);
          }
          props = [];
          childProps.set(contextNode, props);
        }
        pushIfNotExist(props, prop);
      }
    }, {
      key: "removeProp",
      value: function removeProp2(prop, node) {
        if (node === void 0) {
          node = void 0;
        }
        var contextNode = node ? ContextNode.get(node) : this.contextNode;
        contextNode.values.remove(prop, this);
        var childProps = this.childProps_;
        var props = childProps && childProps.get(contextNode);
        if (props) {
          removeItem(props, prop);
          if (props.length == 0 && contextNode != this.contextNode) {
            childProps.delete(contextNode);
            this.maybeUnregisterChildCleanup_(contextNode);
          }
        }
      }
    }, {
      key: "mountComponent",
      value: function mountComponent2(id, factory, func, deps, input, node) {
        if (node === void 0) {
          node = void 0;
        }
        var contextNode = node ? ContextNode.get(node) : this.contextNode;
        contextNode.mountComponent(id, factory, func, deps, input);
        var childComps = this.childComps_ || (this.childComps_ = new Map());
        var comps = childComps && childComps.get(contextNode);
        if (!comps) {
          if (contextNode != this.contextNode) {
            this.maybeRegisterChildCleanup_(contextNode);
          }
          comps = [];
          childComps.set(contextNode, comps);
        }
        pushIfNotExist(comps, id);
      }
    }, {
      key: "unmountComponent",
      value: function unmountComponent2(id, node) {
        if (node === void 0) {
          node = void 0;
        }
        var contextNode = node ? ContextNode.get(node) : this.contextNode;
        contextNode.unmountComponent(id);
        var childComps = this.childComps_;
        var comps = childComps && childComps.get(contextNode);
        if (comps) {
          removeItem(comps, id);
          if (comps.length == 0 && contextNode != this.contextNode) {
            childComps.delete(contextNode);
            this.maybeUnregisterChildCleanup_(contextNode);
          }
        }
      }
    }, {
      key: "isConnected_",
      value: function isConnected_() {
        return !!this.contextNode.root;
      }
    }, {
      key: "update_",
      value: function update_() {
        if (!this.isConnected_()) {
          return;
        }
        var running = this.depValues_.every(isDefined2);
        if (running) {
          this.running_ = true;
          this.refPointer_ = -1;
          withComponent(this, this.run_);
        } else if (this.running_) {
          this.running_ = false;
          this.cleanup_(false);
        }
      }
    }, {
      key: "run_",
      value: function run_() {
        if (this.runCleanup_) {
          tryCallback(this.runCleanup_);
          this.runCleanup_ = null;
        }
        var func = this.func_;
        this.runCleanup_ = func(this, this.input_, this.depValues_);
      }
    }, {
      key: "cleanup_",
      value: function cleanup_(cleanupChildren) {
        var _this3 = this;
        if (cleanupChildren) {
          var childProps = this.childProps_;
          if (childProps) {
            this.childProps_ = null;
            childProps.forEach(function(props, contextNode) {
              props.forEach(function(prop) {
                contextNode.values.remove(prop, _this3);
              });
            });
          }
          var childComps = this.childComps_;
          if (childComps) {
            this.childComps_ = null;
            childComps.forEach(function(comps, contextNode) {
              comps.forEach(function(id) {
                contextNode.unmountComponent(id);
              });
            });
          }
        }
        if (this.runCleanup_) {
          tryCallback(this.runCleanup_);
          this.runCleanup_ = null;
        }
        var cleanups = this.cleanups_;
        if (cleanups) {
          for (var i3 = 0; i3 < cleanups.length; i3++) {
            tryCallback(cleanups[i3]);
          }
          this.cleanups_.length = 0;
        }
      }
    }, {
      key: "maybeRegisterChildCleanup_",
      value: function maybeRegisterChildCleanup_(child) {
        var childProps = this.childProps_, childComps = this.childComps_;
        if ((!childProps || !childProps.has(child)) && (!childComps || !childComps.has(child))) {
          child.pushCleanup(this.cleanupChild_);
        }
      }
    }, {
      key: "maybeUnregisterChildCleanup_",
      value: function maybeUnregisterChildCleanup_(child) {
        var childProps = this.childProps_, childComps = this.childComps_;
        if ((!childProps || !childProps.has(child)) && (!childComps || !childComps.has(child))) {
          child.popCleanup(this.cleanupChild_);
        }
      }
    }, {
      key: "cleanupChild_",
      value: function cleanupChild_(child) {
        var _this4 = this;
        var childProps = this.childProps_;
        var props = childProps && childProps.get(child);
        if (props) {
          childProps.delete(child);
          props.forEach(function(prop) {
            return child.values.remove(prop, _this4);
          });
        }
        var childComps = this.childComps_;
        var comps = childComps && childComps.get(child);
        if (comps) {
          childComps.delete(child);
          comps.forEach(function(id) {
            return child.unmountComponent(id);
          });
        }
      }
    }]);
    return Component2;
  }();
  function isDefined2(v3) {
    return v3 !== void 0;
  }

  // src/context/component-install.js
  var NO_INPUT = void 0;
  function subscribe(node, deps, callback) {
    deps = arrayOrSingleItemToArray(deps);
    var id = getId(callback);
    var contextNode = ContextNode.get(node);
    contextNode.mountComponent(id, subscriberFactory, callback, deps, NO_INPUT);
  }
  function subscriberFactory(id, contextNode, callback, deps) {
    var comp = function comp2(component, unusedInput, deps2) {
      switch (deps2.length) {
        case 0:
          return callback();
        case 1:
          return callback(deps2[0]);
        case 2:
          return callback(deps2[0], deps2[1]);
        case 3:
          return callback(deps2[0], deps2[1], deps2[2]);
        default:
          return callback.apply(null, deps2);
      }
    };
    return new Component(id, contextNode, comp, deps);
  }

  // src/context/index.js
  function setParent(node, parent) {
    ContextNode.get(node).setParent(parent);
  }
  function discover(node) {
    ContextNode.get(node).discover();
  }
  function rediscoverChildren(node) {
    ContextNode.rediscoverChildren(node);
  }
  function setProp(node, prop, setter, value) {
    ContextNode.get(node).values.set(prop, setter, value);
  }
  function removeProp(node, prop, setter) {
    ContextNode.get(node).values.remove(prop, setter);
  }
  function addGroup(node, name, match, weight) {
    if (weight === void 0) {
      weight = 0;
    }
    ContextNode.get(node).addGroup(name, match, weight);
  }
  function setGroupProp(node, groupName, prop, setter, value) {
    ContextNode.get(node).group(groupName).values.set(prop, setter, value);
  }

  // extensions/amp-base-carousel/1.0/carousel-props.js
  var CarouselContextProp = contextProp("base-carousel:1.0:context", {
    type: CarouselContext,
    recursive: true,
    defaultValue: null
  });

  // src/amp-events.js
  var AmpEvents = {
    DOM_UPDATE: "amp:dom-update",
    FORM_DIRTINESS_CHANGE: "amp:form-dirtiness-change",
    FORM_VALUE_CHANGE: "amp:form-value-change",
    VISIBILITY_CHANGE: "amp:visibilitychange",
    ATTACHED: "amp:attached",
    STUBBED: "amp:stubbed",
    LOAD_START: "amp:load-start",
    LOAD_END: "amp:load-end",
    ERROR: "amp:error",
    SIZE_CHANGED: "amp:size-changed",
    UNLOAD: "amp:unload"
  };

  // src/contextprops/index.js
  var CanRender = contextProp("CanRender", {
    defaultValue: true,
    recursive: function recursive(inputs) {
      return inputs.reduce(andReducer);
    },
    compute: function compute(contextNode, inputs, parentValue) {
      return parentValue && inputs.reduce(andReducer, true) || false;
    }
  });
  var CanPlay = contextProp("CanPlay", {
    defaultValue: true,
    recursive: function recursive2(inputs) {
      return inputs.reduce(andReducer);
    },
    deps: [CanRender],
    compute: function compute2(contextNode, inputs, parentValue, canRender) {
      return canRender && parentValue && inputs.reduce(andReducer, true) || false;
    }
  });
  var LoadingProp = contextProp("Loading", {
    defaultValue: Loading.AUTO,
    recursive: true,
    deps: [CanRender],
    compute: function compute3(contextNode, inputs, parentValue, canRender) {
      return reducer(canRender ? Loading.AUTO : Loading.LAZY, reducer(parentValue || Loading.AUTO, inputs.reduce(reducer, Loading.AUTO)));
    }
  });
  var andReducer = function andReducer2(acc, value) {
    return acc && value;
  };

  // src/service.js
  function getService(win, id) {
    win = getTopWindow(win);
    return getServiceInternal(win, id);
  }
  function getServiceInEmbedWin(win, id) {
    return getServiceInternal(win, id);
  }
  function getServicePromise(win, id) {
    return getServicePromiseInternal(win, id);
  }
  function getExistingServiceOrNull(win, id) {
    win = getTopWindow(win);
    if (isServiceRegistered(win, id)) {
      return getServiceInternal(win, id);
    } else {
      return null;
    }
  }
  function getServicePromiseOrNull(win, id) {
    return getServicePromiseOrNullInternal(win, id);
  }
  function getServiceForDoc(elementOrAmpDoc, id) {
    var ampdoc = getAmpdoc(elementOrAmpDoc);
    var holder = getAmpdocServiceHolder(ampdoc);
    return getServiceInternal(holder, id);
  }
  function getServiceForDocOrNull(elementOrAmpDoc, id) {
    var ampdoc = getAmpdoc(elementOrAmpDoc);
    var holder = getAmpdocServiceHolder(ampdoc);
    if (isServiceRegistered(holder, id)) {
      return getServiceInternal(holder, id);
    } else {
      return null;
    }
  }
  function getServicePromiseForDoc(elementOrAmpDoc, id) {
    return getServicePromiseInternal(getAmpdocServiceHolder(elementOrAmpDoc), id);
  }
  function getServicePromiseOrNullForDoc(elementOrAmpDoc, id) {
    return getServicePromiseOrNullInternal(getAmpdocServiceHolder(elementOrAmpDoc), id);
  }
  function getTopWindow(win) {
    return win.__AMP_TOP || (win.__AMP_TOP = win);
  }
  function getAmpdoc(nodeOrDoc) {
    if (nodeOrDoc.nodeType) {
      var win = toWin((nodeOrDoc.ownerDocument || nodeOrDoc).defaultView);
      return getAmpdocService(win).getAmpDoc(nodeOrDoc);
    }
    return nodeOrDoc;
  }
  function getAmpdocServiceHolder(nodeOrDoc) {
    var ampdoc = getAmpdoc(nodeOrDoc);
    return ampdoc.isSingleDoc() ? ampdoc.win : ampdoc;
  }
  function getAmpdocService(win) {
    return getService(win, "ampdoc");
  }
  function getServiceInternal(holder, id) {
    devAssert(isServiceRegistered(holder, id), "Expected service " + id + " to be registered");
    var services = getServices(holder);
    var s3 = services[id];
    if (!s3.obj) {
      devAssert(s3.ctor, "Service " + id + " registered without ctor nor impl.");
      devAssert(s3.context, "Service " + id + " registered without context.");
      s3.obj = new s3.ctor(s3.context);
      devAssert(s3.obj, "Service " + id + " constructed to null.");
      s3.ctor = null;
      s3.context = null;
      if (s3.resolve) {
        s3.resolve(s3.obj);
      }
    }
    return s3.obj;
  }
  function getServicePromiseInternal(holder, id) {
    var cached = getServicePromiseOrNullInternal(holder, id);
    if (cached) {
      return cached;
    }
    var services = getServices(holder);
    services[id] = emptyServiceHolderWithPromise();
    return services[id].promise;
  }
  function getServicePromiseOrNullInternal(holder, id) {
    var services = getServices(holder);
    var s3 = services[id];
    if (s3) {
      if (s3.promise) {
        return s3.promise;
      } else {
        getServiceInternal(holder, id);
        return s3.promise = Promise.resolve(s3.obj);
      }
    }
    return null;
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
  function emptyServiceHolderWithPromise() {
    var deferred = new Deferred();
    var promise = deferred.promise, resolve = deferred.resolve, reject = deferred.reject;
    promise.catch(function() {
    });
    return {
      obj: null,
      promise,
      resolve,
      reject,
      context: null,
      ctor: null
    };
  }

  // src/url.js
  var SERVING_TYPE_PREFIX = dict({
    c: true,
    v: true,
    a: true,
    ad: true
  });
  function parseQueryString(queryString) {
    return parseQueryString_(queryString);
  }

  // src/experiments.js
  var TAG = "EXPERIMENTS";
  var LOCAL_STORAGE_KEY = "amp-experiment-toggles";
  var TOGGLES_WINDOW_PROPERTY = "__AMP__EXPERIMENT_TOGGLES";
  function isExperimentOn(win, experimentId) {
    var toggles = experimentToggles(win);
    return !!toggles[experimentId];
  }
  function experimentToggles(win) {
    if (win[TOGGLES_WINDOW_PROPERTY]) {
      return win[TOGGLES_WINDOW_PROPERTY];
    }
    win[TOGGLES_WINDOW_PROPERTY] = Object.create(null);
    var toggles = win[TOGGLES_WINDOW_PROPERTY];
    if (win.AMP_CONFIG) {
      for (var experimentId in win.AMP_CONFIG) {
        var frequency = win.AMP_CONFIG[experimentId];
        if (typeof frequency === "number" && frequency >= 0 && frequency <= 1) {
          toggles[experimentId] = Math.random() < frequency;
        }
      }
    }
    if (win.AMP_CONFIG && Array.isArray(win.AMP_CONFIG["allow-doc-opt-in"]) && win.AMP_CONFIG["allow-doc-opt-in"].length > 0) {
      var allowed = win.AMP_CONFIG["allow-doc-opt-in"];
      var meta = win.document.head.querySelector('meta[name="amp-experiments-opt-in"]');
      if (meta) {
        var optedInExperiments = meta.getAttribute("content").split(",");
        for (var i3 = 0; i3 < optedInExperiments.length; i3++) {
          if (allowed.indexOf(optedInExperiments[i3]) != -1) {
            toggles[optedInExperiments[i3]] = true;
          }
        }
      }
    }
    Object.assign(toggles, getExperimentToggles(win));
    if (win.AMP_CONFIG && Array.isArray(win.AMP_CONFIG["allow-url-opt-in"]) && win.AMP_CONFIG["allow-url-opt-in"].length > 0) {
      var _allowed = win.AMP_CONFIG["allow-url-opt-in"];
      var hash = win.location.originalHash || win.location.hash;
      var params = parseQueryString(hash);
      for (var _i = 0; _i < _allowed.length; _i++) {
        var param = params["e-" + _allowed[_i]];
        if (param == "1") {
          toggles[_allowed[_i]] = true;
        }
        if (param == "0") {
          toggles[_allowed[_i]] = false;
        }
      }
    }
    return toggles;
  }
  function getExperimentToggles(win) {
    var experimentsString = "";
    try {
      if ("localStorage" in win) {
        experimentsString = win.localStorage.getItem(LOCAL_STORAGE_KEY);
      }
    } catch (e3) {
      dev().warn(TAG, "Failed to retrieve experiments from localStorage.");
    }
    var tokens = experimentsString ? experimentsString.split(/\s*,\s*/g) : [];
    var toggles = Object.create(null);
    for (var i3 = 0; i3 < tokens.length; i3++) {
      if (tokens[i3].length == 0) {
        continue;
      }
      if (tokens[i3][0] == "-") {
        toggles[tokens[i3].substr(1)] = false;
      } else {
        toggles[tokens[i3]] = true;
      }
    }
    return toggles;
  }

  // src/layout.js
  var Layout = {
    NODISPLAY: "nodisplay",
    FIXED: "fixed",
    FIXED_HEIGHT: "fixed-height",
    RESPONSIVE: "responsive",
    CONTAINER: "container",
    FILL: "fill",
    FLEX_ITEM: "flex-item",
    FLUID: "fluid",
    INTRINSIC: "intrinsic"
  };
  function isLayoutSizeDefined(layout) {
    return layout == Layout.FIXED || layout == Layout.FIXED_HEIGHT || layout == Layout.RESPONSIVE || layout == Layout.FILL || layout == Layout.FLEX_ITEM || layout == Layout.FLUID || layout == Layout.INTRINSIC;
  }

  // src/utils/media-query-props.js
  function _classCallCheck6(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function _defineProperties4(target, props) {
    for (var i3 = 0; i3 < props.length; i3++) {
      var descriptor = props[i3];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor)
        descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  function _createClass4(Constructor, protoProps, staticProps) {
    if (protoProps)
      _defineProperties4(Constructor.prototype, protoProps);
    if (staticProps)
      _defineProperties4(Constructor, staticProps);
    return Constructor;
  }
  var TRUE_VALUE = "1";
  var MediaQueryProps = /* @__PURE__ */ function() {
    function MediaQueryProps2(win, callback) {
      _classCallCheck6(this, MediaQueryProps2);
      this.win_ = win;
      this.callback_ = callback;
      this.exprMap_ = {};
      this.prevExprMap_ = null;
    }
    _createClass4(MediaQueryProps2, [{
      key: "start",
      value: function start() {
        this.prevExprMap_ = this.exprMap_;
        this.exprMap_ = {};
      }
    }, {
      key: "resolveMatchQuery",
      value: function resolveMatchQuery(queryString) {
        return this.resolve_(queryString, parseMediaQueryMatchExpr, TRUE_VALUE) === TRUE_VALUE;
      }
    }, {
      key: "resolveListQuery",
      value: function resolveListQuery(exprString) {
        return this.resolve_(exprString, parseMediaQueryListExpr, "");
      }
    }, {
      key: "complete",
      value: function complete() {
        for (var k2 in this.prevExprMap_) {
          if (!(k2 in this.exprMap_)) {
            toggleOnChange(this.prevExprMap_[k2], this.callback_, false);
          }
        }
        this.prevExprMap_ = null;
      }
    }, {
      key: "dispose",
      value: function dispose() {
        for (var k2 in this.exprMap_) {
          toggleOnChange(this.exprMap_[k2], this.callback_, false);
        }
        this.exprMap_ = {};
      }
    }, {
      key: "resolve_",
      value: function resolve_(exprString, parser, emptyExprValue) {
        if (!exprString || !exprString.trim()) {
          return emptyExprValue;
        }
        var expr = this.exprMap_[exprString] || this.prevExprMap_[exprString];
        if (!expr) {
          expr = parser(this.win_, exprString);
          toggleOnChange(expr, this.callback_, true);
        }
        this.exprMap_[exprString] = expr;
        return resolveMediaQueryListExpr(expr);
      }
    }]);
    return MediaQueryProps2;
  }();
  function parseMediaQueryMatchExpr(win, queryString) {
    var query = win.matchMedia(queryString);
    return [{
      query,
      value: TRUE_VALUE
    }, {
      query: null,
      value: ""
    }];
  }
  function parseMediaQueryListExpr(win, exprString) {
    return exprString.split(",").map(function(part) {
      part = part.replace(/\s+/g, " ").trim();
      if (part.length == 0) {
        return;
      }
      var queryString;
      var value;
      var lastChar = part.charAt(part.length - 1);
      var div;
      if (lastChar == ")") {
        var parens = 1;
        div = part.length - 2;
        for (; div >= 0; div--) {
          var c3 = part.charAt(div);
          if (c3 == "(") {
            parens--;
          } else if (c3 == ")") {
            parens++;
          }
          if (parens == 0) {
            break;
          }
        }
        var funcEnd = div - 1;
        if (div > 0) {
          div--;
          for (; div >= 0; div--) {
            var _c = part.charAt(div);
            if (!(_c == "%" || _c == "-" || _c == "_" || _c >= "a" && _c <= "z" || _c >= "A" && _c <= "Z" || _c >= "0" && _c <= "9")) {
              break;
            }
          }
        }
        if (div >= funcEnd) {
          return null;
        }
      } else {
        div = part.length - 2;
        for (; div >= 0; div--) {
          var _c2 = part.charAt(div);
          if (!(_c2 == "%" || _c2 == "." || _c2 >= "a" && _c2 <= "z" || _c2 >= "A" && _c2 <= "Z" || _c2 >= "0" && _c2 <= "9")) {
            break;
          }
        }
      }
      if (div >= 0) {
        queryString = part.substring(0, div + 1).trim();
        value = part.substring(div + 1).trim();
      } else {
        value = part;
        queryString = void 0;
      }
      if (!value) {
        return null;
      }
      var query = queryString ? win.matchMedia(queryString) : null;
      return {
        query,
        value
      };
    }).filter(function(item) {
      return item;
    });
  }
  function resolveMediaQueryListExpr(expr) {
    for (var i3 = 0; i3 < expr.length; i3++) {
      var _expr$i = expr[i3], query = _expr$i.query, value = _expr$i.value;
      if (!query || query.matches) {
        return value;
      }
    }
    return "";
  }
  function toggleOnChange(expr, callback, on) {
    for (var i3 = 0; i3 < expr.length; i3++) {
      var query = expr[i3].query;
      if (query) {
        if (query.onchange !== void 0) {
          query.onchange = on ? callback : null;
        } else {
          if (on) {
            query.addListener(callback);
          } else {
            query.removeListener(callback);
          }
        }
      }
    }
  }

  // src/preact/slot.js
  function _extends9() {
    _extends9 = Object.assign || function(target) {
      for (var i3 = 1; i3 < arguments.length; i3++) {
        var source = arguments[i3];
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
      return target;
    };
    return _extends9.apply(this, arguments);
  }
  function createSlot(element, name, props) {
    element.setAttribute("slot", name);
    return createElement(Slot, _extends9({}, props || {}, {
      name
    }));
  }
  function Slot(props) {
    var ref = useRef(null);
    useSlotContext(ref);
    useEffect(function() {
      if (props["postRender"]) {
        props["postRender"]();
      }
    });
    return createElement("slot", _extends9({}, props, {
      ref
    }));
  }
  function useSlotContext(ref) {
    var context2 = useAmpContext();
    useLayoutEffect(function() {
      var slot = dev().assertElement(ref.current);
      setProp(slot, CanRender, Slot, context2.renderable);
      setProp(slot, CanPlay, Slot, context2.playable);
      setProp(slot, LoadingProp, Slot, context2.loading);
      return function() {
        removeProp(slot, CanRender, Slot);
        removeProp(slot, CanPlay, Slot);
        removeProp(slot, LoadingProp, Slot);
        rediscoverChildren(slot);
      };
    }, [ref, context2]);
  }

  // src/element-service.js
  function getElementServiceIfAvailable(win, id, extension, opt_element) {
    var s3 = getServicePromiseOrNull(win, id);
    if (s3) {
      return s3;
    }
    return getElementServicePromiseOrNull(win, id, extension, opt_element);
  }
  function isElementScheduled(win, elementName) {
    if (!win.__AMP_EXTENDED_ELEMENTS) {
      return false;
    }
    return !!win.__AMP_EXTENDED_ELEMENTS[elementName];
  }
  function getElementServiceForDoc(element, id, extension, opt_element) {
    return getElementServiceIfAvailableForDoc(element, id, extension, opt_element).then(function(service) {
      return assertService(service, id, extension);
    });
  }
  function getElementServiceIfAvailableForDoc(element, id, extension, opt_element) {
    var s3 = getServicePromiseOrNullForDoc(element, id);
    if (s3) {
      return s3;
    }
    var ampdoc = getAmpdoc(element);
    return ampdoc.waitForBodyOpen().then(function() {
      return waitForExtensionIfPresent(ampdoc.win, extension, ampdoc.win.document.head);
    }).then(function() {
      if (opt_element) {
        return getServicePromiseOrNullForDoc(element, id);
      } else if (isElementScheduled(ampdoc.win, extension)) {
        return getServicePromiseForDoc(element, id);
      }
      return null;
    });
  }
  function getElementServiceIfAvailableForDocInEmbedScope(element, id, extension) {
    var s3 = getServiceForDocOrNull(element, id);
    if (s3) {
      return Promise.resolve(s3);
    }
    return getElementServiceIfAvailableForDoc(element, id, extension);
  }
  function assertService(service, id, extension) {
    return userAssert(service, "Service %s was requested to be provided through %s, but %s is not loaded in the current page. To fix this problem load the JavaScript file for %s in this page.", id, extension, extension, extension);
  }
  function extensionScriptsInNode(head) {
    if (!head) {
      return [];
    }
    var scripts = {};
    var list = head.querySelectorAll("script[custom-element],script[custom-template]");
    for (var i3 = 0; i3 < list.length; i3++) {
      var script = list[i3];
      var name = script.getAttribute("custom-element") || script.getAttribute("custom-template");
      scripts[name] = true;
    }
    return Object.keys(scripts);
  }
  function extensionScriptInNode(head, extensionId) {
    return extensionScriptsInNode(head).includes(extensionId);
  }
  function waitForExtensionIfPresent(win, extension, head) {
    if (!extensionScriptInNode(head, extension)) {
      return resolvedPromise();
    }
    var extensions = getService(win, "extensions");
    return extensions.waitForExtension(win, extension);
  }
  function getElementServicePromiseOrNull(win, id, extension, opt_element) {
    return waitForBodyOpenPromise(win.document).then(function() {
      return waitForExtensionIfPresent(win, extension, win.document.head);
    }).then(function() {
      if (opt_element) {
        return getServicePromiseOrNull(win, id);
      } else if (isElementScheduled(win, extension)) {
        return getServicePromise(win, id);
      }
      return null;
    });
  }

  // src/services.js
  function _classCallCheck7(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function _defineProperties5(target, props) {
    for (var i3 = 0; i3 < props.length; i3++) {
      var descriptor = props[i3];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor)
        descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  function _createClass5(Constructor, protoProps, staticProps) {
    if (protoProps)
      _defineProperties5(Constructor.prototype, protoProps);
    if (staticProps)
      _defineProperties5(Constructor, staticProps);
    return Constructor;
  }
  var Services = /* @__PURE__ */ function() {
    function Services2() {
      _classCallCheck7(this, Services2);
    }
    _createClass5(Services2, null, [{
      key: "accessServiceForDoc",
      value: function accessServiceForDoc(element) {
        return getElementServiceForDoc(element, "access", "amp-access");
      }
    }, {
      key: "accessServiceForDocOrNull",
      value: function accessServiceForDocOrNull(element) {
        return getElementServiceIfAvailableForDoc(element, "access", "amp-access");
      }
    }, {
      key: "subscriptionsServiceForDoc",
      value: function subscriptionsServiceForDoc(element) {
        return getElementServiceForDoc(element, "subscriptions", "amp-subscriptions");
      }
    }, {
      key: "subscriptionsServiceForDocOrNull",
      value: function subscriptionsServiceForDocOrNull(element) {
        return getElementServiceIfAvailableForDoc(element, "subscriptions", "amp-subscriptions");
      }
    }, {
      key: "actionServiceForDoc",
      value: function actionServiceForDoc(element) {
        return getServiceForDocOrNull(element, "action");
      }
    }, {
      key: "standardActionsForDoc",
      value: function standardActionsForDoc(element) {
        return getServiceForDocOrNull(element, "standard-actions");
      }
    }, {
      key: "activityForDoc",
      value: function activityForDoc(element) {
        return getElementServiceForDoc(element, "activity", "amp-analytics");
      }
    }, {
      key: "ampdocServiceFor",
      value: function ampdocServiceFor(window2) {
        return getService(window2, "ampdoc");
      }
    }, {
      key: "ampdoc",
      value: function ampdoc(nodeOrAmpDoc) {
        return getAmpdoc(nodeOrAmpDoc);
      }
    }, {
      key: "analyticsForDoc",
      value: function analyticsForDoc(element, loadAnalytics) {
        if (loadAnalytics === void 0) {
          loadAnalytics = false;
        }
        if (loadAnalytics) {
          var ampdoc = getAmpdoc(element);
          Services2.extensionsFor(ampdoc.win).installExtensionForDoc(ampdoc, "amp-analytics");
        }
        return getElementServiceForDoc(element, "amp-analytics-instrumentation", "amp-analytics");
      }
    }, {
      key: "analyticsForDocOrNull",
      value: function analyticsForDocOrNull(element) {
        return getElementServiceIfAvailableForDoc(element, "amp-analytics-instrumentation", "amp-analytics");
      }
    }, {
      key: "batchedXhrFor",
      value: function batchedXhrFor(window2) {
        return getService(window2, "batched-xhr");
      }
    }, {
      key: "bindForDocOrNull",
      value: function bindForDocOrNull(element) {
        return getElementServiceIfAvailableForDocInEmbedScope(element, "bind", "amp-bind");
      }
    }, {
      key: "scriptForDocOrNull",
      value: function scriptForDocOrNull(element) {
        return getElementServiceIfAvailableForDocInEmbedScope(element, "amp-script", "amp-script");
      }
    }, {
      key: "cidForDoc",
      value: function cidForDoc(elementOrAmpDoc) {
        return getServicePromiseForDoc(elementOrAmpDoc, "cid");
      }
    }, {
      key: "navigationForDoc",
      value: function navigationForDoc(elementOrAmpDoc) {
        return getServiceForDoc(elementOrAmpDoc, "navigation");
      }
    }, {
      key: "loaderServiceForDoc",
      value: function loaderServiceForDoc(element) {
        return getElementServiceForDoc(element, "loader", "amp-loader");
      }
    }, {
      key: "standaloneServiceForDoc",
      value: function standaloneServiceForDoc(element) {
        return getElementServiceForDoc(element, "standalone", "amp-standalone");
      }
    }, {
      key: "cryptoFor",
      value: function cryptoFor(window2) {
        return getService(window2, "crypto");
      }
    }, {
      key: "documentInfoForDoc",
      value: function documentInfoForDoc(elementOrAmpDoc) {
        return getServiceForDoc(elementOrAmpDoc, "documentInfo").get();
      }
    }, {
      key: "extensionsFor",
      value: function extensionsFor(window2) {
        return getService(window2, "extensions");
      }
    }, {
      key: "formSubmitForDoc",
      value: function formSubmitForDoc(elementOrAmpDoc) {
        return getServicePromiseForDoc(elementOrAmpDoc, "form-submit-service");
      }
    }, {
      key: "hiddenObserverForDoc",
      value: function hiddenObserverForDoc(element) {
        return getServiceForDocOrNull(element, "hidden-observer");
      }
    }, {
      key: "historyForDoc",
      value: function historyForDoc(elementOrAmpDoc) {
        return getServiceForDoc(elementOrAmpDoc, "history");
      }
    }, {
      key: "inputFor",
      value: function inputFor(win) {
        return getService(win, "input");
      }
    }, {
      key: "inputmaskServiceForDocOrNull",
      value: function inputmaskServiceForDocOrNull(element) {
        return getElementServiceIfAvailableForDoc(element, "inputmask", "amp-inputmask");
      }
    }, {
      key: "loadingIndicatorOrNull",
      value: function loadingIndicatorOrNull(elementOrAmpDoc) {
        return getServiceForDocOrNull(elementOrAmpDoc, "loadingIndicator");
      }
    }, {
      key: "nextPageServiceForDoc",
      value: function nextPageServiceForDoc(elementOrAmpDoc) {
        return getServiceForDoc(elementOrAmpDoc, "next-page");
      }
    }, {
      key: "mutatorForDoc",
      value: function mutatorForDoc(elementOrAmpDoc) {
        return getServiceForDoc(elementOrAmpDoc, "mutator");
      }
    }, {
      key: "ownersForDoc",
      value: function ownersForDoc(elementOrAmpDoc) {
        return getServiceForDoc(elementOrAmpDoc, "owners");
      }
    }, {
      key: "performanceFor",
      value: function performanceFor(window2) {
        return getService(window2, "performance");
      }
    }, {
      key: "performanceForOrNull",
      value: function performanceForOrNull(window2) {
        return getExistingServiceOrNull(window2, "performance");
      }
    }, {
      key: "platformFor",
      value: function platformFor(window2) {
        return getService(window2, "platform");
      }
    }, {
      key: "positionObserverForDoc",
      value: function positionObserverForDoc(element) {
        return getServiceForDoc(element, "position-observer");
      }
    }, {
      key: "preconnectFor",
      value: function preconnectFor(window2) {
        return getService(window2, "preconnect");
      }
    }, {
      key: "resourcesForDoc",
      value: function resourcesForDoc(elementOrAmpDoc) {
        return getServiceForDoc(elementOrAmpDoc, "resources");
      }
    }, {
      key: "resourcesPromiseForDoc",
      value: function resourcesPromiseForDoc(elementOrAmpDoc) {
        return getServicePromiseForDoc(elementOrAmpDoc, "resources");
      }
    }, {
      key: "storyVariableServiceForOrNull",
      value: function storyVariableServiceForOrNull(win) {
        return getElementServiceIfAvailable(win, "story-variable", "amp-story");
      }
    }, {
      key: "storyVariableService",
      value: function storyVariableService(win) {
        return getExistingServiceOrNull(win, "story-variable");
      }
    }, {
      key: "storyStoreServiceForOrNull",
      value: function storyStoreServiceForOrNull(win) {
        return getElementServiceIfAvailable(win, "story-store", "amp-story");
      }
    }, {
      key: "storyStoreService",
      value: function storyStoreService(win) {
        return getExistingServiceOrNull(win, "story-store");
      }
    }, {
      key: "storyMediaQueryService",
      value: function storyMediaQueryService(win) {
        return getExistingServiceOrNull(win, "story-media-query");
      }
    }, {
      key: "storyRequestServiceForOrNull",
      value: function storyRequestServiceForOrNull(win) {
        return getElementServiceIfAvailable(win, "story-request", "amp-story");
      }
    }, {
      key: "storyRequestService",
      value: function storyRequestService(win) {
        return getExistingServiceOrNull(win, "story-request");
      }
    }, {
      key: "mediaPerformanceMetricsService",
      value: function mediaPerformanceMetricsService(win) {
        return getExistingServiceOrNull(win, "media-performance-metrics");
      }
    }, {
      key: "localizationServiceForOrNull",
      value: function localizationServiceForOrNull(el) {
        return getServicePromiseForDoc(el, "localization");
      }
    }, {
      key: "localizationForDoc",
      value: function localizationForDoc(element) {
        return getServiceForDocOrNull(element, "localization");
      }
    }, {
      key: "storyAnalyticsServiceForOrNull",
      value: function storyAnalyticsServiceForOrNull(win) {
        return getElementServiceIfAvailable(win, "story-analytics", "amp-story", true);
      }
    }, {
      key: "storyAnalyticsService",
      value: function storyAnalyticsService(win) {
        return getExistingServiceOrNull(win, "story-analytics");
      }
    }, {
      key: "webAnimationServiceFor",
      value: function webAnimationServiceFor(element) {
        return getElementServiceForDoc(element, "web-animation", "amp-animation");
      }
    }, {
      key: "realTimeConfigForDoc",
      value: function realTimeConfigForDoc(elementOrAmpDoc) {
        return getServicePromiseForDoc(elementOrAmpDoc, "real-time-config");
      }
    }, {
      key: "storageForDoc",
      value: function storageForDoc(elementOrAmpDoc) {
        return getServicePromiseForDoc(elementOrAmpDoc, "storage");
      }
    }, {
      key: "storageForTopLevelDoc",
      value: function storageForTopLevelDoc(elementOrAmpDoc) {
        var thisAmpdoc = Services2.ampdoc(elementOrAmpDoc);
        var ampdocService = Services2.ampdocServiceFor(thisAmpdoc.win);
        var topAmpdoc = ampdocService.isSingleDoc() ? ampdocService.getSingleDoc() : null;
        var ampdoc = topAmpdoc && topAmpdoc.win == thisAmpdoc.win ? topAmpdoc : thisAmpdoc;
        return getServicePromiseForDoc(ampdoc, "storage");
      }
    }, {
      key: "templatesForDoc",
      value: function templatesForDoc(elementOrAmpDoc) {
        return getServiceForDoc(elementOrAmpDoc, "templates");
      }
    }, {
      key: "timerFor",
      value: function timerFor(window2) {
        return getServiceInEmbedWin(window2, "timer");
      }
    }, {
      key: "urlReplacementsForDoc",
      value: function urlReplacementsForDoc(element) {
        return getServiceForDocOrNull(element, "url-replace");
      }
    }, {
      key: "userNotificationManagerForDoc",
      value: function userNotificationManagerForDoc(element) {
        return getElementServiceForDoc(element, "userNotificationManager", "amp-user-notification");
      }
    }, {
      key: "consentPolicyServiceForDocOrNull",
      value: function consentPolicyServiceForDocOrNull(element) {
        return getElementServiceIfAvailableForDoc(element, "consentPolicyManager", "amp-consent");
      }
    }, {
      key: "geoForDocOrNull",
      value: function geoForDocOrNull(element) {
        return getElementServiceIfAvailableForDoc(element, "geo", "amp-geo", true);
      }
    }, {
      key: "urlForDoc",
      value: function urlForDoc(element) {
        return getServiceForDocOrNull(element, "url");
      }
    }, {
      key: "variantsForDocOrNull",
      value: function variantsForDocOrNull(element) {
        return getElementServiceIfAvailableForDoc(element, "variant", "amp-experiment", true);
      }
    }, {
      key: "videoManagerForDoc",
      value: function videoManagerForDoc(elementOrAmpDoc) {
        return getServiceForDoc(elementOrAmpDoc, "video-manager");
      }
    }, {
      key: "viewerForDoc",
      value: function viewerForDoc(elementOrAmpDoc) {
        return getServiceForDoc(elementOrAmpDoc, "viewer");
      }
    }, {
      key: "viewerPromiseForDoc",
      value: function viewerPromiseForDoc(elementOrAmpDoc) {
        return getServicePromiseForDoc(elementOrAmpDoc, "viewer");
      }
    }, {
      key: "vsyncFor",
      value: function vsyncFor(window2) {
        return getService(window2, "vsync");
      }
    }, {
      key: "viewportForDoc",
      value: function viewportForDoc(elementOrAmpDoc) {
        return getServiceForDoc(elementOrAmpDoc, "viewport");
      }
    }, {
      key: "xhrFor",
      value: function xhrFor(window2) {
        return getService(window2, "xhr");
      }
    }, {
      key: "assistjsFrameServiceForDoc",
      value: function assistjsFrameServiceForDoc(elementOrAmpDoc) {
        return getServiceForDoc(elementOrAmpDoc, "assistjs-frame-service");
      }
    }, {
      key: "assistjsConfigServiceForDoc",
      value: function assistjsConfigServiceForDoc(elementOrAmpDoc) {
        return getServiceForDoc(elementOrAmpDoc, "assistjs-config-service");
      }
    }]);
    return Services2;
  }();

  // src/event-helper.js
  function createCustomEvent(win, type, detail, opt_eventInit) {
    var eventInit = {
      detail
    };
    Object.assign(eventInit, opt_eventInit);
    if (typeof win.CustomEvent == "function") {
      return new win.CustomEvent(type, eventInit);
    } else {
      var e3 = win.document.createEvent("CustomEvent");
      e3.initCustomEvent(type, !!eventInit.bubbles, !!eventInit.cancelable, detail);
      return e3;
    }
  }

  // src/error.js
  var CANCELLED = "CANCELLED";
  var accumulatedErrorMessages = self.__AMP_ERRORS || [];
  self.__AMP_ERRORS = accumulatedErrorMessages;
  function cancellation() {
    return new Error(CANCELLED);
  }

  // src/utils/date.js
  function parseDate(s3) {
    if (!s3) {
      return null;
    }
    if (s3.toLowerCase() === "now") {
      return Date.now();
    }
    var parsed = Date.parse(s3);
    return isNaN(parsed) ? null : parsed;
  }
  function getDate(value) {
    if (!value) {
      return null;
    }
    if (typeof value == "number") {
      return value;
    }
    if (typeof value == "string") {
      return parseDate(value);
    }
    return value.getTime();
  }

  // third_party/webcomponentsjs/ShadowCSS.js
  /**
  * @license
  * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
  * Use of this source code is governed by a BSD-style
  * license that can be found in the LICENSE file or at
  * https://developers.google.com/open-source/licenses/bsd */
  var polyfillHost = "-shadowcsshost";
  var polyfillHostContext = "-shadowcsscontext";
  var parenSuffix = ")(?:\\(((?:\\([^)(]*\\)|[^)(]*)+?)\\))?([^,{]*)";
  var cssColonHostRe = new RegExp("(" + polyfillHost + parenSuffix, "gim");
  var cssColonHostContextRe = new RegExp("(" + polyfillHostContext + parenSuffix, "gim");
  var polyfillHostNoCombinator = polyfillHost + "-no-combinator";
  var polyfillHostRe = new RegExp(polyfillHost, "gim");
  var polyfillHostContextRe = new RegExp(polyfillHostContext, "gim");

  // src/shadow-embed.js
  var SHADOW_CSS_CACHE = "__AMP_SHADOW_CSS";
  function installShadowStyle(shadowRoot, name, cssText) {
    var doc = shadowRoot.ownerDocument;
    var win = toWin(doc.defaultView);
    if (shadowRoot.adoptedStyleSheets !== void 0 && win.CSSStyleSheet.prototype.replaceSync !== void 0) {
      var cache = win[SHADOW_CSS_CACHE] || (win[SHADOW_CSS_CACHE] = {});
      var styleSheet = cache[name];
      if (!styleSheet) {
        styleSheet = new win.CSSStyleSheet();
        styleSheet.replaceSync(cssText);
        cache[name] = styleSheet;
      }
      shadowRoot.adoptedStyleSheets = shadowRoot.adoptedStyleSheets.concat(styleSheet);
    } else {
      var styleEl = doc.createElement("style");
      styleEl.setAttribute("data-name", name);
      styleEl.textContent = cssText;
      shadowRoot.appendChild(styleEl);
    }
  }

  // src/preact/base-element.js
  function _extends10() {
    _extends10 = Object.assign || function(target) {
      for (var i3 = 1; i3 < arguments.length; i3++) {
        var source = arguments[i3];
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
      return target;
    };
    return _extends10.apply(this, arguments);
  }
  function _classCallCheck8(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function _defineProperties6(target, props) {
    for (var i3 = 0; i3 < props.length; i3++) {
      var descriptor = props[i3];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor)
        descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  function _createClass6(Constructor, protoProps, staticProps) {
    if (protoProps)
      _defineProperties6(Constructor.prototype, protoProps);
    if (staticProps)
      _defineProperties6(Constructor, staticProps);
    return Constructor;
  }
  function _get(target, property, receiver) {
    if (typeof Reflect !== "undefined" && Reflect.get) {
      _get = Reflect.get;
    } else {
      _get = function _get3(target2, property2, receiver2) {
        var base = _superPropBase(target2, property2);
        if (!base)
          return;
        var desc = Object.getOwnPropertyDescriptor(base, property2);
        if (desc.get) {
          return desc.get.call(receiver2);
        }
        return desc.value;
      };
    }
    return _get(target, property, receiver || target);
  }
  function _superPropBase(object, property) {
    while (!Object.prototype.hasOwnProperty.call(object, property)) {
      object = _getPrototypeOf2(object);
      if (object === null)
        break;
    }
    return object;
  }
  function _inherits2(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {constructor: {value: subClass, writable: true, configurable: true}});
    if (superClass)
      _setPrototypeOf2(subClass, superClass);
  }
  function _setPrototypeOf2(o3, p3) {
    _setPrototypeOf2 = Object.setPrototypeOf || function _setPrototypeOf4(o4, p4) {
      o4.__proto__ = p4;
      return o4;
    };
    return _setPrototypeOf2(o3, p3);
  }
  function _createSuper2(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct2();
    return function _createSuperInternal() {
      var Super = _getPrototypeOf2(Derived), result;
      if (hasNativeReflectConstruct) {
        var NewTarget = _getPrototypeOf2(this).constructor;
        result = Reflect.construct(Super, arguments, NewTarget);
      } else {
        result = Super.apply(this, arguments);
      }
      return _possibleConstructorReturn2(this, result);
    };
  }
  function _possibleConstructorReturn2(self2, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }
    return _assertThisInitialized2(self2);
  }
  function _assertThisInitialized2(self2) {
    if (self2 === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return self2;
  }
  function _isNativeReflectConstruct2() {
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
    } catch (e3) {
      return false;
    }
  }
  function _getPrototypeOf2(o3) {
    _getPrototypeOf2 = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf4(o4) {
      return o4.__proto__ || Object.getPrototypeOf(o4);
    };
    return _getPrototypeOf2(o3);
  }
  var CHILDREN_MUTATION_INIT = {
    childList: true
  };
  var PASSTHROUGH_MUTATION_INIT = {
    childList: true,
    characterData: true
  };
  var TEMPLATES_MUTATION_INIT = {
    childList: true
  };
  var SHADOW_CONTAINER_ATTRS = dict({
    style: "display: contents; background: inherit;",
    part: "c"
  });
  var SERVICE_SLOT_ATTRS = dict({
    name: "i-amphtml-svc"
  });
  var SIZE_DEFINED_STYLE = {
    position: "absolute",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%"
  };
  var RENDERED_PROP = "__AMP_RENDERED";
  var UNSLOTTED_GROUP = "unslotted";
  var MATCH_ANY = function MATCH_ANY2() {
    return true;
  };
  var childIdGenerator = sequentialIdGenerator();
  var PreactBaseElement = /* @__PURE__ */ function(_AMP$BaseElement) {
    _inherits2(PreactBaseElement2, _AMP$BaseElement);
    var _super = _createSuper2(PreactBaseElement2);
    function PreactBaseElement2(element) {
      var _this;
      _classCallCheck8(this, PreactBaseElement2);
      _this = _super.call(this, element);
      _this.defaultProps_ = dict({
        loading: Loading.AUTO,
        onLoad: _this.onLoad_.bind(_assertThisInitialized2(_this)),
        onLoadError: _this.onLoadError_.bind(_assertThisInitialized2(_this))
      });
      _this.context_ = {
        renderable: false,
        playable: false,
        loading: Loading.LAZY,
        notify: function notify() {
          return _this.mutateElement(function() {
          });
        }
      };
      _this.apiWrapper_ = null;
      _this.currentRef_ = null;
      _this.refSetter_ = function(current) {
        if (current !== null) {
          if (_this.apiWrapper_) {
            _this.checkApiWrapper_(current);
          } else {
            _this.initApiWrapper_(current);
          }
        }
        _this.currentRef_ = current;
      };
      _this.deferredApi_ = null;
      _this.contextValues_ = null;
      _this.container_ = null;
      _this.scheduledRender_ = false;
      _this.renderDeferred_ = null;
      _this.boundRerender_ = function() {
        _this.scheduledRender_ = false;
        _this.rerender_();
      };
      _this.hydrationPending_ = false;
      _this.mounted_ = false;
      _this.loadDeferred_ = null;
      _this.observer = null;
      _this.mediaQueryProps_ = null;
      return _this;
    }
    _createClass6(PreactBaseElement2, [{
      key: "init",
      value: function init() {
      }
    }, {
      key: "isLayoutSupported",
      value: function isLayoutSupported(layout) {
        var Ctor = this.constructor;
        if (Ctor["layoutSizeDefined"]) {
          return isLayoutSizeDefined(layout) || layout == Layout.CONTAINER;
        }
        return _get(_getPrototypeOf2(PreactBaseElement2.prototype), "isLayoutSupported", this).call(this, layout);
      }
    }, {
      key: "buildCallback",
      value: function buildCallback() {
        var _this2 = this;
        var Ctor = this.constructor;
        this.observer = new MutationObserver(this.checkMutations_.bind(this));
        var childrenInit = Ctor["children"] ? CHILDREN_MUTATION_INIT : null;
        var passthroughInit = Ctor["passthrough"] || Ctor["passthroughNonEmpty"] ? PASSTHROUGH_MUTATION_INIT : null;
        var templatesInit = Ctor["usesTemplate"] ? TEMPLATES_MUTATION_INIT : null;
        this.observer.observe(this.element, _extends10({
          attributes: true
        }, childrenInit, passthroughInit, templatesInit));
        this.mediaQueryProps_ = hasMediaQueryProps(Ctor) ? new MediaQueryProps(this.win, function() {
          return _this2.scheduleRender_();
        }) : null;
        var staticProps = Ctor["staticProps"];
        var initProps = this.init();
        Object.assign(this.defaultProps_, staticProps, initProps);
        this.checkPropsPostMutations();
        subscribe(this.element, [], function() {
          return function() {
            _this2.mounted_ = false;
            if (_this2.container_) {
              render(null, _this2.container_);
            }
          };
        });
        subscribe(this.element, [CanRender, CanPlay, LoadingProp], function(canRender, canPlay, loading) {
          _this2.context_.renderable = canRender;
          _this2.context_.playable = canPlay;
          _this2.context_.loading = loading == Loading.AUTO ? Loading.LAZY : loading;
          _this2.mounted_ = true;
          _this2.scheduleRender_();
        });
        var useContexts = Ctor["useContexts"];
        if (useContexts.length != 0) {
          subscribe(this.element, useContexts, function() {
            for (var _len = arguments.length, contexts = new Array(_len), _key = 0; _key < _len; _key++) {
              contexts[_key] = arguments[_key];
            }
            _this2.contextValues_ = contexts;
            _this2.scheduleRender_();
          });
        }
        this.renderDeferred_ = new Deferred();
        this.scheduleRender_();
        return this.renderDeferred_.promise;
      }
    }, {
      key: "layoutCallback",
      value: function layoutCallback() {
        var Ctor = this.constructor;
        if (!Ctor["loadable"]) {
          return _get(_getPrototypeOf2(PreactBaseElement2.prototype), "layoutCallback", this).call(this);
        }
        this.mutateProps(dict({
          loading: Loading.EAGER
        }));
        var api = this.currentRef_;
        if (api && api["complete"]) {
          return resolvedPromise();
        }
        this.loadDeferred_ = new Deferred();
        return this.loadDeferred_.promise;
      }
    }, {
      key: "unlayoutCallback",
      value: function unlayoutCallback() {
        if (this.mediaQueryProps_) {
          this.mediaQueryProps_.dispose();
        }
        var Ctor = this.constructor;
        if (!Ctor["loadable"]) {
          return _get(_getPrototypeOf2(PreactBaseElement2.prototype), "unlayoutCallback", this).call(this);
        }
        this.mutateProps(dict({
          loading: Loading.UNLOAD
        }));
        this.onLoadError_(cancellation());
        return true;
      }
    }, {
      key: "attachedCallback",
      value: function attachedCallback() {
        discover(this.element);
      }
    }, {
      key: "detachedCallback",
      value: function detachedCallback() {
        discover(this.element);
      }
    }, {
      key: "mutatedAttributesCallback",
      value: function mutatedAttributesCallback() {
        if (this.container_) {
          this.scheduleRender_();
        }
      }
    }, {
      key: "mutateProps",
      value: function mutateProps(props) {
        Object.assign(this.defaultProps_, props);
        this.scheduleRender_();
      }
    }, {
      key: "api",
      value: function api() {
        return devAssert(this.currentRef_);
      }
    }, {
      key: "registerApiAction",
      value: function registerApiAction(alias, handler, minTrust) {
        var _this3 = this;
        if (minTrust === void 0) {
          minTrust = ActionTrust.DEFAULT;
        }
        this.registerAction(alias, function(invocation) {
          return handler(_this3.api(), invocation);
        }, minTrust);
      }
    }, {
      key: "mutationObserverCallback",
      value: function mutationObserverCallback(unusedRecords) {
      }
    }, {
      key: "checkPropsPostMutations",
      value: function checkPropsPostMutations() {
      }
    }, {
      key: "updatePropsForRendering",
      value: function updatePropsForRendering(unusedProps) {
      }
    }, {
      key: "isReady",
      value: function isReady(unusedProps) {
        return true;
      }
    }, {
      key: "checkMutations_",
      value: function checkMutations_(records) {
        var Ctor = this.constructor;
        this.mutationObserverCallback(records);
        var rerender = records.some(function(m3) {
          return shouldMutationBeRerendered(Ctor, m3);
        });
        if (rerender) {
          this.checkPropsPostMutations();
          this.scheduleRender_();
        }
      }
    }, {
      key: "scheduleRender_",
      value: function scheduleRender_() {
        if (!this.scheduledRender_) {
          this.scheduledRender_ = true;
          this.mutateElement(this.boundRerender_);
        }
      }
    }, {
      key: "onLoad_",
      value: function onLoad_() {
        if (this.loadDeferred_) {
          this.loadDeferred_.resolve();
          this.loadDeferred_ = null;
          dispatchCustomEvent(this.element, "load", null, {
            bubbles: false
          });
        }
      }
    }, {
      key: "onLoadError_",
      value: function onLoadError_(opt_reason) {
        if (this.loadDeferred_) {
          this.loadDeferred_.reject(opt_reason || new Error("load error"));
          this.loadDeferred_ = null;
          dispatchCustomEvent(this.element, "error", null, {
            bubbles: false
          });
        }
      }
    }, {
      key: "rerender_",
      value: function rerender_() {
        var _this4 = this;
        if (!this.mounted_) {
          return;
        }
        var Ctor = this.constructor;
        var isShadow = usesShadowDom(Ctor);
        var lightDomTag = isShadow ? null : Ctor["lightDomTag"];
        var isDetached = Ctor["detached"];
        if (!this.container_) {
          var doc = this.win.document;
          if (isShadow) {
            devAssert(!isDetached, 'The AMP element cannot be rendered in detached mode when configured with "children", "passthrough", or "passthroughNonEmpty" properties.');
            var shadowRoot = this.element.shadowRoot;
            var container = shadowRoot && childElementByTag(shadowRoot, "c");
            if (container) {
              this.hydrationPending_ = true;
            } else {
              shadowRoot = this.element.attachShadow({
                mode: "open",
                delegatesFocus: Ctor["delegatesFocus"]
              });
              var shadowCss = Ctor["shadowCss"];
              if (shadowCss) {
                installShadowStyle(shadowRoot, this.element.tagName, shadowCss);
              }
              container = createElementWithAttributes(doc, "c", SHADOW_CONTAINER_ATTRS);
              shadowRoot.appendChild(container);
              var serviceSlot = createElementWithAttributes(doc, "slot", SERVICE_SLOT_ATTRS);
              shadowRoot.appendChild(serviceSlot);
            }
            this.container_ = container;
            setParent(shadowRoot, this.element);
            addGroup(this.element, UNSLOTTED_GROUP, MATCH_ANY, -1);
            setGroupProp(this.element, UNSLOTTED_GROUP, CanRender, this, false);
          } else if (lightDomTag) {
            this.container_ = this.element;
            var replacement = childElementByTag(this.container_, lightDomTag) || doc.createElement(lightDomTag);
            replacement[RENDERED_PROP] = true;
            if (Ctor["layoutSizeDefined"]) {
              replacement.classList.add("i-amphtml-fill-content");
            }
            this.container_.appendChild(replacement);
          } else {
            var _container = doc.createElement("i-amphtml-c");
            this.container_ = _container;
            this.applyFillContent(_container);
            if (!isDetached) {
              this.element.appendChild(_container);
            }
          }
        }
        var useContexts = Ctor["useContexts"];
        var contextValues = this.contextValues_;
        var isContextReady = useContexts.length == 0 || contextValues != null;
        if (!isContextReady) {
          return;
        }
        var props = collectProps(Ctor, this.element, this.refSetter_, this.defaultProps_, this.mediaQueryProps_);
        this.updatePropsForRendering(props);
        if (!this.isReady(props)) {
          return;
        }
        var comp = createElement(Ctor["Component"], props);
        for (var i3 = 0; i3 < useContexts.length; i3++) {
          var Context = useContexts[i3].type;
          var value = contextValues[i3];
          if (value) {
            comp = createElement(Context.Provider, {
              value
            }, comp);
          }
        }
        var v3 = createElement(WithAmpContext, _extends10({}, this.context_), comp);
        if (this.hydrationPending_) {
          this.hydrationPending_ = false;
          hydrate(v3, this.container_);
        } else {
          var _replacement = lightDomTag ? childElementByTag(this.container_, lightDomTag) : null;
          if (_replacement) {
            _replacement[RENDERED_PROP] = true;
          }
          render(v3, this.container_, _replacement);
        }
        if (!isShadow && !isDetached) {
          this.mutateElement(function() {
            return dispatchCustomEvent(_this4.element, AmpEvents.DOM_UPDATE, null);
          });
        }
        if (this.renderDeferred_) {
          this.renderDeferred_.resolve();
          this.renderDeferred_ = null;
        }
      }
    }, {
      key: "getProp",
      value: function getProp(prop, opt_fallback) {
        if (!hasOwn(this.defaultProps_, prop)) {
          return opt_fallback;
        }
        return this.defaultProps_[prop];
      }
    }, {
      key: "getApi",
      value: function getApi() {
        var api = this.apiWrapper_;
        if (api) {
          return Promise.resolve(api);
        }
        if (!this.deferredApi_) {
          this.deferredApi_ = new Deferred();
        }
        return this.deferredApi_.promise;
      }
    }, {
      key: "initApiWrapper_",
      value: function initApiWrapper_(current) {
        var api = map();
        var keys = Object.keys(current);
        for (var i3 = 0; i3 < keys.length; i3++) {
          var key = keys[i3];
          wrapRefProperty(this, api, key);
        }
        this.apiWrapper_ = api;
        if (this.deferredApi_) {
          this.deferredApi_.resolve(api);
          this.deferredApi_ = null;
        }
      }
    }, {
      key: "checkApiWrapper_",
      value: function checkApiWrapper_(current) {
        if (!getMode().localDev) {
          return;
        }
        var api = this.apiWrapper_;
        var newKeys = Object.keys(current);
        for (var i3 = 0; i3 < newKeys.length; i3++) {
          var key = newKeys[i3];
          devAssert(hasOwn(api, key), 'Inconsistent Bento API shape: imperative API gained a "%s" key for %s', key, this.element);
        }
        var oldKeys = Object.keys(api);
        for (var _i = 0; _i < oldKeys.length; _i++) {
          var _key2 = oldKeys[_i];
          devAssert(hasOwn(current, _key2), 'Inconsistent Bento API shape: imperative API lost a "%s" key for %s', _key2, this.element);
        }
      }
    }, {
      key: "triggerEvent",
      value: function triggerEvent(element, eventName, detail) {
        dispatchCustomEvent(element, eventName, detail);
      }
    }], [{
      key: "reqiuresShadowDom",
      value: function reqiuresShadowDom() {
        return usesShadowDom(this);
      }
    }]);
    return PreactBaseElement2;
  }(AMP.BaseElement);
  function wrapRefProperty(baseElement, api, key) {
    Object.defineProperty(api, key, {
      configurable: true,
      get: function get2() {
        return baseElement.currentRef_[key];
      },
      set: function set(v3) {
        baseElement.currentRef_[key] = v3;
      }
    });
  }
  PreactBaseElement["Component"] = function() {
    devAssert(false, "Must provide Component");
  };
  PreactBaseElement["staticProps"] = void 0;
  PreactBaseElement["useContexts"] = getMode().localDev ? Object.freeze([]) : [];
  PreactBaseElement["loadable"] = false;
  PreactBaseElement["layoutSizeDefined"] = false;
  PreactBaseElement["lightDomTag"] = "";
  PreactBaseElement["className"] = "";
  PreactBaseElement["passthrough"] = false;
  PreactBaseElement["passthroughNonEmpty"] = false;
  PreactBaseElement["usesTemplate"] = false;
  PreactBaseElement["shadowCss"] = null;
  PreactBaseElement["detached"] = false;
  PreactBaseElement["delegatesFocus"] = false;
  PreactBaseElement["props"] = {};
  PreactBaseElement["children"] = null;
  function usesShadowDom(Ctor) {
    return !!(Ctor["children"] || Ctor["passthrough"] || Ctor["passthroughNonEmpty"]);
  }
  function matchesAttrPrefix(attributeName, attributePrefix) {
    return attributeName !== null && attributePrefix !== void 0 && attributeName.startsWith(attributePrefix) && attributeName !== attributePrefix;
  }
  var _ref = createElement(Slot, null);
  var _ref2 = createElement(Slot, null);
  function collectProps(Ctor, element, ref, defaultProps, mediaQueryProps) {
    var childrenDefs = Ctor["children"], className = Ctor["className"], layoutSizeDefined = Ctor["layoutSizeDefined"], lightDomTag = Ctor["lightDomTag"], passthrough = Ctor["passthrough"], passthroughNonEmpty = Ctor["passthroughNonEmpty"], propDefs = Ctor["props"];
    if (mediaQueryProps) {
      mediaQueryProps.start();
    }
    var props = _extends10({}, defaultProps, {
      ref
    });
    if (lightDomTag) {
      props[RENDERED_PROP] = true;
      props["as"] = lightDomTag;
    }
    if (className) {
      props["className"] = className;
    }
    if (layoutSizeDefined) {
      if (usesShadowDom(Ctor)) {
        props["style"] = SIZE_DEFINED_STYLE;
      } else {
        props["className"] = ("i-amphtml-fill-content " + (className || "")).trim() || null;
      }
    }
    parsePropDefs(props, propDefs, element, mediaQueryProps);
    var errorMessage = 'only one of "passthrough", "passthroughNonEmpty" or "children" may be given';
    if (passthrough) {
      devAssert(!childrenDefs && !passthroughNonEmpty, errorMessage);
      props["children"] = [_ref];
    } else if (passthroughNonEmpty) {
      devAssert(!childrenDefs, errorMessage);
      props["children"] = element.getRealChildNodes().every(function(node) {
        return node.nodeType === 3 && node.nodeValue.trim().length === 0;
      }) ? null : [_ref2];
    } else if (childrenDefs) {
      var children = [];
      props["children"] = children;
      var nodes = element.getRealChildNodes();
      for (var i3 = 0; i3 < nodes.length; i3++) {
        var childElement = nodes[i3];
        var def = matchChild(childElement, childrenDefs);
        if (!def) {
          continue;
        }
        var single = def.single, name = def.name, clone = def.clone, _def$props = def.props, slotProps = _def$props === void 0 ? {} : _def$props;
        var parsedSlotProps = {};
        parsePropDefs(parsedSlotProps, slotProps, childElement, mediaQueryProps);
        if (single) {
          props[name] = createSlot(childElement, childElement.getAttribute("slot") || "i-amphtml-" + name, parsedSlotProps);
        } else {
          var list = name == "children" ? children : props[name] || (props[name] = []);
          list.push(clone ? createShallowVNodeCopy(childElement) : createSlot(childElement, childElement.getAttribute("slot") || "i-amphtml-" + name + "-" + childIdGenerator(), parsedSlotProps));
        }
      }
    }
    if (mediaQueryProps) {
      mediaQueryProps.complete();
    }
    return props;
  }
  function parsePropDefs(props, propDefs, element, mediaQueryProps) {
    for (var name in propDefs) {
      var def = propDefs[name];
      var value = void 0;
      if (def.attr) {
        value = element.getAttribute(def.attr);
        if (def.media && value != null) {
          value = mediaQueryProps.resolveListQuery(String(value));
        }
      } else if (def.parseAttrs) {
        devAssert(def.attrs);
        value = def.parseAttrs(element);
      } else if (def.attrPrefix) {
        var currObj = {};
        var objContains = false;
        var attrs = element.attributes;
        for (var i3 = 0; i3 < attrs.length; i3++) {
          var attrib = attrs[i3];
          if (matchesAttrPrefix(attrib.name, def.attrPrefix)) {
            currObj[dashToCamelCase(attrib.name.slice(def.attrPrefix.length))] = attrib.value;
            objContains = true;
          }
        }
        if (objContains) {
          value = currObj;
        }
      }
      if (value == null) {
        if (def.default != null) {
          props[name] = def.default;
        }
      } else {
        var v3 = def.type == "number" ? parseFloat(value) : def.type == "boolean" ? parseBooleanAttribute(value) : def.type == "date" ? getDate(value) : value;
        props[name] = v3;
      }
    }
  }
  function createShallowVNodeCopy(element) {
    var props = {
      key: element
    };
    var attributes = element.attributes, localName = element.localName;
    var length = attributes.length;
    for (var i3 = 0; i3 < length; i3++) {
      var _attributes$i = attributes[i3], name = _attributes$i.name, value = _attributes$i.value;
      props[name] = value;
    }
    return createElement(localName, props);
  }
  function matchChild(element, defs) {
    for (var match in defs) {
      var def = defs[match];
      var selector = typeof def == "string" ? def : def.selector;
      if (matches(element, selector)) {
        return def;
      }
    }
    return null;
  }
  function shouldMutationForNodeListBeRerendered(nodeList) {
    for (var i3 = 0; i3 < nodeList.length; i3++) {
      var node = nodeList[i3];
      if (node.nodeType == 1) {
        if (node[RENDERED_PROP] || node.tagName.startsWith("I-") || node.getAttribute("slot") == "i-amphtml-svc") {
          continue;
        }
        return true;
      }
      if (node.nodeType == 3) {
        return true;
      }
    }
    return false;
  }
  function shouldMutationBeRerendered(Ctor, m3) {
    var type = m3.type;
    if (type == "attributes") {
      if (Ctor["usesTemplate"] && m3.attributeName == "template") {
        return true;
      }
      var props = Ctor["props"];
      for (var name in props) {
        var def = props[name];
        if (m3.attributeName == def.attr || def.attrs && def.attrs.includes(devAssert(m3.attributeName)) || matchesAttrPrefix(m3.attributeName, def.attrPrefix)) {
          return true;
        }
      }
      return false;
    }
    if (type == "childList") {
      return shouldMutationForNodeListBeRerendered(m3.addedNodes) || shouldMutationForNodeListBeRerendered(m3.removedNodes);
    }
    return false;
  }
  function hasMediaQueryProps(Ctor) {
    var props = Ctor["props"];
    if (props) {
      for (var name in props) {
        var def = props[name];
        if (def.media) {
          return true;
        }
      }
    }
    return false;
  }

  // extensions/amp-base-carousel/1.0/amp-base-carousel.js
  function _classCallCheck9(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function _defineProperties7(target, props) {
    for (var i3 = 0; i3 < props.length; i3++) {
      var descriptor = props[i3];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor)
        descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  function _createClass7(Constructor, protoProps, staticProps) {
    if (protoProps)
      _defineProperties7(Constructor.prototype, protoProps);
    if (staticProps)
      _defineProperties7(Constructor, staticProps);
    return Constructor;
  }
  function _get2(target, property, receiver) {
    if (typeof Reflect !== "undefined" && Reflect.get) {
      _get2 = Reflect.get;
    } else {
      _get2 = function _get3(target2, property2, receiver2) {
        var base = _superPropBase2(target2, property2);
        if (!base)
          return;
        var desc = Object.getOwnPropertyDescriptor(base, property2);
        if (desc.get) {
          return desc.get.call(receiver2);
        }
        return desc.value;
      };
    }
    return _get2(target, property, receiver || target);
  }
  function _superPropBase2(object, property) {
    while (!Object.prototype.hasOwnProperty.call(object, property)) {
      object = _getPrototypeOf3(object);
      if (object === null)
        break;
    }
    return object;
  }
  function _inherits3(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {constructor: {value: subClass, writable: true, configurable: true}});
    if (superClass)
      _setPrototypeOf3(subClass, superClass);
  }
  function _setPrototypeOf3(o3, p3) {
    _setPrototypeOf3 = Object.setPrototypeOf || function _setPrototypeOf4(o4, p4) {
      o4.__proto__ = p4;
      return o4;
    };
    return _setPrototypeOf3(o3, p3);
  }
  function _createSuper3(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct3();
    return function _createSuperInternal() {
      var Super = _getPrototypeOf3(Derived), result;
      if (hasNativeReflectConstruct) {
        var NewTarget = _getPrototypeOf3(this).constructor;
        result = Reflect.construct(Super, arguments, NewTarget);
      } else {
        result = Super.apply(this, arguments);
      }
      return _possibleConstructorReturn3(this, result);
    };
  }
  function _possibleConstructorReturn3(self2, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }
    return _assertThisInitialized3(self2);
  }
  function _assertThisInitialized3(self2) {
    if (self2 === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return self2;
  }
  function _isNativeReflectConstruct3() {
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
    } catch (e3) {
      return false;
    }
  }
  function _getPrototypeOf3(o3) {
    _getPrototypeOf3 = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf4(o4) {
      return o4.__proto__ || Object.getPrototypeOf(o4);
    };
    return _getPrototypeOf3(o3);
  }
  var TAG2 = "amp-base-carousel";
  var AmpBaseCarousel = /* @__PURE__ */ function(_PreactBaseElement) {
    _inherits3(AmpBaseCarousel2, _PreactBaseElement);
    var _super = _createSuper3(AmpBaseCarousel2);
    function AmpBaseCarousel2(element) {
      var _this;
      _classCallCheck9(this, AmpBaseCarousel2);
      _this = _super.call(this, element);
      _this.slide_ = null;
      return _this;
    }
    _createClass7(AmpBaseCarousel2, [{
      key: "init",
      value: function init() {
        var _this2 = this;
        var element = this.element;
        this.registerApiAction("prev", function(api) {
          return api.prev();
        }, ActionTrust.LOW);
        this.registerApiAction("next", function(api) {
          return api.next();
        }, ActionTrust.LOW);
        this.registerApiAction("goToSlide", function(api, invocation) {
          var args = invocation.args;
          api.goToSlide(args["index"] || -1);
        }, ActionTrust.LOW);
        this.slide_ = parseInt(element.getAttribute("slide"), 10);
        return dict({
          defaultSlide: this.slide_ || 0,
          onSlideChange: function onSlideChange(index) {
            fireSlideChangeEvent(_this2.win, element, index, ActionTrust.HIGH);
          }
        });
      }
    }, {
      key: "isLayoutSupported",
      value: function isLayoutSupported(layout) {
        userAssert(isExperimentOn(this.win, "bento") || isExperimentOn(this.win, "bento-carousel"), 'expected global "bento" or specific "bento-carousel" experiment to be enabled');
        return _get2(_getPrototypeOf3(AmpBaseCarousel2.prototype), "isLayoutSupported", this).call(this, layout);
      }
    }, {
      key: "mutationObserverCallback",
      value: function mutationObserverCallback() {
        var slide = parseInt(this.element.getAttribute("slide"), 10);
        if (slide === this.slide_) {
          return;
        }
        this.slide_ = slide;
        if (!isNaN(slide)) {
          this.api().goToSlide(slide);
        }
      }
    }]);
    return AmpBaseCarousel2;
  }(PreactBaseElement);
  AmpBaseCarousel["Component"] = BaseCarousel;
  AmpBaseCarousel["layoutSizeDefined"] = true;
  AmpBaseCarousel["children"] = {
    arrowPrev: {
      name: "arrowPrev",
      selector: '[slot="prev-arrow"]',
      single: true
    },
    arrowNext: {
      name: "arrowNext",
      selector: '[slot="next-arrow"]',
      single: true
    },
    children: {
      name: "children",
      props: {
        thumbnailSrc: {
          attr: "data-thumbnail-src"
        }
      },
      selector: "*",
      single: false
    }
  };
  AmpBaseCarousel["props"] = {
    advanceCount: {
      attr: "advance-count",
      type: "number",
      media: true
    },
    autoAdvance: {
      attr: "auto-advance",
      type: "boolean",
      media: true
    },
    autoAdvanceCount: {
      attr: "auto-advance-count",
      type: "number",
      media: true
    },
    autoAdvanceInterval: {
      attr: "auto-advance-interval",
      type: "number",
      media: true
    },
    autoAdvanceLoops: {
      attr: "auto-advance-loops",
      type: "number",
      media: true
    },
    controls: {
      attr: "controls",
      type: "string",
      media: true
    },
    orientation: {
      attr: "orientation",
      type: "string",
      media: true,
      default: "horizontal"
    },
    loop: {
      attr: "loop",
      type: "boolean",
      media: true
    },
    mixedLength: {
      attr: "mixed-length",
      type: "boolean",
      media: true
    },
    outsetArrows: {
      attr: "outset-arrows",
      type: "boolean",
      media: true
    },
    snap: {
      attr: "snap",
      type: "boolean",
      media: true,
      default: true
    },
    snapBy: {
      attr: "snap-by",
      type: "number",
      media: true
    },
    snapAlign: {
      attr: "snap-align",
      type: "string",
      media: true
    },
    visibleCount: {
      attr: "visible-count",
      type: "number",
      media: true
    }
  };
  AmpBaseCarousel["shadowCss"] = CSS2;
  AmpBaseCarousel["useContexts"] = [CarouselContextProp];
  function fireSlideChangeEvent(win, el, index, trust) {
    var eventName = "slideChange";
    var data = dict({
      index
    });
    var slideChangeEvent = createCustomEvent(win, "amp-base-carousel." + eventName, data);
    Services.actionServiceForDoc(el).trigger(el, eventName, slideChangeEvent, trust);
    dispatchCustomEvent(el, eventName, data);
  }
  AMP.extension(TAG2, "1.0", function(AMP2) {
    AMP2.registerElement(TAG2, AmpBaseCarousel, CSS3);
  });
})();

})});
//# sourceMappingURL=amp-base-carousel-1.0.max.js.map
