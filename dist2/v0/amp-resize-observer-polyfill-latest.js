(self.AMP=self.AMP||[]).push({n:"amp-resize-observer-polyfill",v:"2102260626000",m:0,f:(function(AMP,_){
'use strict';function r(f){for(var g=["object"==typeof globalThis&&globalThis,f,"object"==typeof window&&window,"object"==typeof self&&self,"object"==typeof global&&global],k=0;k<g.length;++k){var m=g[k];if(m&&m.Math==Math)return}(function(){throw Error("Cannot find global object");})()}r(this);"function"===typeof Symbol&&Symbol("x");
function A(f){(function(g,k){g.ResizeObserver=k()})(f,function(){function g(b){return b&&b.ownerDocument&&b.ownerDocument.defaultView||t}function k(b,a){for(var c=0,d=Object.keys(a);c<d.length;c++){var e=d[c];Object.defineProperty(b,e,{value:a[e],enumerable:!1,writable:!1,configurable:!0})}return b}function m(b){return parseFloat(b)||0}function l(b){for(var a=[],c=1;c<arguments.length;c++)a[c-1]=arguments[c];return a.reduce(function(d,e){return d+m(b["border-"+e+"-width"])},0)}function w(b){for(var a=
{},c=0,d=["top","right","bottom","left"];c<d.length;c++){var e=d[c];a[e]=m(b["padding-"+e])}return a}function u(b){var a=b.getBBox();return v(0,0,a.width,a.height)}function x(b){var a=b.clientWidth,c=b.clientHeight;if(!a&&!c)return B;var d=g(b).getComputedStyle(b),e=w(d),h=e.left+e.right,n=e.top+e.bottom,p=m(d.width),q=m(d.height);"border-box"===d.boxSizing&&(Math.round(p+h)!==a&&(p-=l(d,"left","right")+h),Math.round(q+n)!==c&&(q-=l(d,"top","bottom")+n));if(!N(b)){var C=Math.round(p+h)-a,D=Math.round(q+
n)-c;1!==Math.abs(C)&&(p-=C);1!==Math.abs(D)&&(q-=D)}return v(e.left,e.top,p,q)}function N(b){return b===g(b).document.documentElement}function O(b){return y?P(b)?u(b):x(b):B}function Q(b){var a=b.x,c=b.y,d=b.width;b=b.height;var e=Object.create(("undefined"!==typeof DOMRectReadOnly?DOMRectReadOnly:Object).prototype);k(e,{x:a,y:c,width:d,height:b,top:c,right:a+d,bottom:b+c,left:a});return e}function v(b,a,c,d){return{x:b,y:a,width:c,height:d}}function R(b){if("function"===typeof b.getRootNode)return b.getRootNode();
for(;b.parentNode;b=b.parentNode);return b}function E(b,a){b=R(b);return 9===b.nodeType||11===b.nodeType?b:a}function S(b,a){function c(){h&&(h=!1,b());n&&e()}function d(){T(c)}function e(){var q=Date.now();if(h){if(2>q-p)return;n=!0}else h=!0,n=!1,setTimeout(d,a);p=q}var h=!1,n=!1,p=0;return e}var z=function(){function b(a,c){var d=-1;a.some(function(e,h){return e[0]===c?(d=h,!0):!1});return d}return"undefined"!==typeof Map?Map:function(){function a(){this.__entries__=[]}Object.defineProperty(a.prototype,
"size",{get:function(){return this.__entries__.length},enumerable:!0,configurable:!0});a.prototype.get=function(c){c=b(this.__entries__,c);return(c=this.__entries__[c])&&c[1]};a.prototype.set=function(c,d){var e=b(this.__entries__,c);~e?this.__entries__[e][1]=d:this.__entries__.push([c,d])};a.prototype.delete=function(c){var d=this.__entries__;c=b(d,c);~c&&d.splice(c,1)};a.prototype.has=function(c){return!!~b(this.__entries__,c)};a.prototype.clear=function(){this.__entries__.splice(0)};a.prototype.forEach=
function(c,d){void 0===d&&(d=null);for(var e=0,h=this.__entries__;e<h.length;e++){var n=h[e];c.call(d,n[1],n[0])}};return a}()}(),t=function(){return"undefined"!==typeof f&&f.Math===Math?f:"undefined"!==typeof self&&self.Math===Math?self:"undefined"!==typeof window&&Math===Math?window:Function("return this")()}(),y="undefined"!==typeof window&&"undefined"!==typeof document&&window.document===document,B=v(0,0,0,0),P=function(){return"undefined"!==typeof SVGGraphicsElement?function(b){return b instanceof
g(b).SVGGraphicsElement}:function(b){return b instanceof g(b).SVGElement&&"function"===typeof b.getBBox}}(),U=function(){function b(a,c){this.broadcastHeight=this.broadcastWidth=0;this.M=v(0,0,0,0);this.target=a;this.rootNode=c}b.prototype.isActive=function(){var a=O(this.target);this.M=a;return a.width!==this.broadcastWidth||a.height!==this.broadcastHeight};b.prototype.broadcastRect=function(){var a=this.M;this.broadcastWidth=a.width;this.broadcastHeight=a.height;return a};return b}(),V=function(){return function(b,
a){var c=Q(a);k(this,{target:b,contentRect:c})}}(),W="undefined"!==typeof IntersectionObserver,F=function(){function b(a,c,d){var e=this;this.C=[];this.B=new z;this.l=new z;this.h=null;if("function"!==typeof a)throw new TypeError("The callback provided as parameter 1 is not a function.");this.O=a;this.D=c;this.N=d;W&&(this.h=new IntersectionObserver(function(){return e.L()}))}b.prototype.observe=function(a){console.log("QQQ: resizeobserver observe: 1");if(!arguments.length)throw new TypeError("1 argument required, but only 0 present.");
console.log("QQQ: resizeobserver observe: 2");if("undefined"!==typeof Element&&Element instanceof Object){console.log("QQQ: resizeobserver observe: 3");if(!(a instanceof g(a).Element))throw new TypeError('parameter 1 is not of type "Element".');console.log("QQQ: resizeobserver observe: 4");var c=this.B;if(!c.has(a)){console.log("QQQ: resizeobserver observe: 5");var d=E(a,a.ownerDocument);console.log("QQQ: resizeobserver observe: 6");c.set(a,new U(a,d));console.log("QQQ: resizeobserver observe: 7");
var e=this.l.get(d);console.log("QQQ: resizeobserver observe: 8");e||(e=[],console.log("QQQ: resizeobserver observe: 8.1"),this.l.set(d,e),console.log("QQQ: resizeobserver observe: 8.2"),this.D.addObserver(d,this),console.log("QQQ: resizeobserver observe: 8.3"));console.log("QQQ: resizeobserver observe: 9");e.push(a);console.log("QQQ: resizeobserver observe: 10");this.h&&(console.log("QQQ: resizeobserver observe: 10.1"),this.h.observe(a),console.log("QQQ: resizeobserver observe: 10.2"));console.log("QQQ: resizeobserver observe: 11");
this.D.refresh(d);console.log("QQQ: resizeobserver observe: 12")}}};b.prototype.unobserve=function(a){if(!arguments.length)throw new TypeError("1 argument required, but only 0 present.");if("undefined"!==typeof Element&&Element instanceof Object){if(!(a instanceof g(a).Element))throw new TypeError('parameter 1 is not of type "Element".');var c=this.B,d=c.get(a);if(d){c.delete(a);this.h&&this.h.unobserve(a);c=d.rootNode;var e=this.l.get(c);if(e){var h=e.indexOf(a);~h&&e.splice(h,1);0===e.length&&(this.l.delete(c),
this.D.removeObserver(c,this))}}}};b.prototype.disconnect=function(){var a=this;this.clearActive();this.B.clear();this.l.forEach(function(c,d){a.D.removeObserver(d,a)});this.l.clear();this.h&&(this.h.disconnect(),this.h=null)};b.prototype.gatherActive=function(){var a=this;this.L();this.clearActive();this.B.forEach(function(c){c.isActive()&&a.C.push(c)})};b.prototype.broadcastActive=function(){if(this.hasActive()){var a=this.N,c=this.C.map(function(d){return new V(d.target,d.broadcastRect())});this.O.call(a,
c,a);this.clearActive()}};b.prototype.clearActive=function(){this.C.splice(0)};b.prototype.hasActive=function(){return 0<this.C.length};b.prototype.L=function(){var a=this,c=null;this.B.forEach(function(d){var e=d.target,h=d.rootNode;E(e,h)!==h&&(c||(c=[]),c.push(e))});c&&c.forEach(function(d){a.unobserve(d);a.observe(d)})};return b}(),T=function(){return"function"===typeof requestAnimationFrame?requestAnimationFrame.bind(t):function(b){return setTimeout(function(){return b(Date.now())},1E3/60)}}(),
X="top right bottom left width height size weight".split(" "),Y="undefined"!==typeof MutationObserver,Z=function(){function b(a,c){this.K=this.j=!1;this.o=this.A=null;this.F=[];this.I=a;this.S=c;this.G=this.G.bind(this);this.refresh=S(this.refresh.bind(this),20)}b.prototype.addObserver=function(a){console.log("QQQ: resizeobserver addObserver: 8.2.1");~this.F.indexOf(a)||this.F.push(a);console.log("QQQ: resizeobserver addObserver: 8.2.2");this.j||this.P();console.log("QQQ: resizeobserver addObserver: 8.2.3")};
b.prototype.removeObserver=function(a){var c=this.F;a=c.indexOf(a);~a&&c.splice(a,1);!c.length&&this.j&&this.R()};b.prototype.refresh=function(){this.T()&&this.refresh()};b.prototype.T=function(){var a=this.F.filter(function(c){return c.gatherActive(),c.hasActive()});a.forEach(function(c){return c.broadcastActive()});return 0<a.length};b.prototype.P=function(){console.log("QQQ: resizeobserver connect: 8.2.2.1");if(y&&!this.j){console.log("QQQ: resizeobserver connect: 8.2.2.2");var a=this.I,c=(a.ownerDocument||
a).defaultView;console.log("QQQ: resizeobserver connect: 8.2.2.3");a.addEventListener("transitionend",this.G,!0);console.log("QQQ: resizeobserver connect: 8.2.2.4");c&&c.addEventListener("resize",this.refresh,!0);console.log("QQQ: resizeobserver connect: 8.2.2.5");Y?(this.A=new MutationObserver(this.refresh),console.log("QQQ: resizeobserver connect: 8.2.2.6"),this.A.observe(a,{attributes:!0,childList:!0,characterData:!0,subtree:!0}),console.log("QQQ: resizeobserver connect: 8.2.2.7")):(console.log("QQQ: resizeobserver connect: 8.2.2.8"),
a.addEventListener("DOMSubtreeModified",this.refresh,!0),this.K=!0,console.log("QQQ: resizeobserver connect: 8.2.2.9"));console.log("QQQ: resizeobserver connect: 8.2.2.10");this.I.host&&(console.log("QQQ: resizeobserver connect: 8.2.2.10.1"),this.o=new F(this.refresh,this.S,this),console.log("QQQ: resizeobserver connect: 8.2.2.10.2"),this.o.observe(this.I.host),console.log("QQQ: resizeobserver connect: 8.2.2.10.3"));this.j=!0;console.log("QQQ: resizeobserver connect: 8.2.2.11")}};b.prototype.R=function(){if(y&&
this.j){var a=this.I,c=(a.ownerDocument||a).defaultView;a.removeEventListener("transitionend",this.G,!0);c&&c.removeEventListener("resize",this.refresh,!0);this.A&&this.A.disconnect();this.K&&a.removeEventListener("DOMSubtreeModified",this.refresh,!0);this.o&&this.o.disconnect();this.A=this.o=null;this.j=this.K=!1}};b.prototype.G=function(a){var c=a.propertyName,d=void 0===c?"":c;X.some(function(e){return!!~d.indexOf(e)})&&this.refresh()};return b}(),aa=function(){function b(){this.H="undefined"!==
typeof WeakMap?new WeakMap:new Map}b.prototype.addObserver=function(a,c){var d=this.H.get(a);d||(d=new Z(a,this),this.H.set(a,d));d.addObserver(c)};b.prototype.removeObserver=function(a,c){(a=this.H.get(a))&&a.removeObserver(c)};b.prototype.refresh=function(a){(a=this.H.get(a))&&a.refresh()};b.getInstance=function(){this.J||(this.J=new b);return this.J};b.J=null;return b}(),G="undefined"!==typeof WeakMap?new WeakMap:new z,H=function(){function b(a){if(!(this instanceof b))throw new TypeError("Cannot call a class as a function.");
if(!arguments.length)throw new TypeError("1 argument required, but only 0 present.");var c=aa.getInstance();c=new F(a,c,this);G.set(this,c)}return b}();["observe","unobserve","disconnect"].forEach(function(b){H.prototype[b]=function(){var a;return(a=G.get(this))[b].apply(a,arguments)}});return function(){return"undefined"!==typeof t.ResizeObserver?t.ResizeObserver:H}()})};var I=self.AMP_CONFIG||{},ba=("string"==typeof I.cdnProxyRegex?new RegExp(I.cdnProxyRegex):I.cdnProxyRegex)||/^https:\/\/([a-zA-Z0-9_-]+\.)?cdn\.ampproject\.org$/;function J(f){if(self.document&&self.document.head&&(!self.location||!ba.test(self.location.origin))){var g=self.document.head.querySelector('meta[name="'+f+'"]');g&&g.getAttribute("content")}}I.cdnUrl||J("runtime-host");I.geoApiUrl||J("amp-geo-api");self.__AMP_LOG=self.__AMP_LOG||{user:null,dev:null,userForEmbed:null};function K(f){f=L(f)["amp-resize-observer-polyfill"];f.obj||(f.obj=new f.ctor(f.context),f.ctor=null,f.context=null,f.resolve&&f.resolve(f.obj))}function L(f){var g=f.__AMP_SERVICES;g||(g=f.__AMP_SERVICES={});return g};var M;/*
 https://mths.be/cssescape v1.5.1 by @mathias | MIT license */
function ca(f,g){var k=f.ResizeObserver._stub;if(k){delete f.ResizeObserver;delete f.ResizeObserverEntry;g();var m=f.ResizeObserver,l=k._upgraders.slice(0);M||(M=Promise.resolve(void 0));var w=M;var u=function(x){w.then(function(){return x(m)})};0<l.length&&l.forEach(u);k._upgraders={push:u}}else g()};function da(f){ca(f,function(){A(f)});return{}}(function(){var f=window,g=f=f.__AMP_TOP||(f.__AMP_TOP=f),k=f,m=L(g),l=m["amp-resize-observer-polyfill"];l||(l=m["amp-resize-observer-polyfill"]={obj:null,promise:null,resolve:null,reject:null,context:null,ctor:null,adopted:!1});l.ctor||l.obj||(l.ctor=da,l.context=k,l.adopted=!1,l.resolve&&K(g));K(f)})(self.AMP);
})});

//# sourceMappingURL=amp-resize-observer-polyfill-0.1.js.map
