(self.AMP=self.AMP||[]).push({n:"amp-base-carousel",v:"2102260551000",m:0,f:(function(AMP,_){
'use strict';var h,aa="function"==typeof Object.create?Object.create:function(a){function b(){}b.prototype=a;return new b};function ba(a){for(var b=["object"==typeof globalThis&&globalThis,a,"object"==typeof window&&window,"object"==typeof self&&self,"object"==typeof global&&global],c=0;c<b.length;++c){var d=b[c];if(d&&d.Math==Math)return}(function(){throw Error("Cannot find global object");})()}ba(this);"function"===typeof Symbol&&Symbol("x");var p;
if("function"==typeof Object.setPrototypeOf)p=Object.setPrototypeOf;else{var q;a:{var ca={a:!0},da={};try{da.__proto__=ca;q=da.a;break a}catch(a){}q=!1}p=q?function(a,b){a.__proto__=b;if(a.__proto__!==b)throw new TypeError(a+" is not extensible");return a}:null}var ea=p,r;function t(a){return a?Array.prototype.slice.call(a):[]};var u=self.AMP_CONFIG||{},fa=("string"==typeof u.cdnProxyRegex?new RegExp(u.cdnProxyRegex):u.cdnProxyRegex)||/^https:\/\/([a-zA-Z0-9_-]+\.)?cdn\.ampproject\.org$/;function ha(a){if(self.document&&self.document.head&&(!self.location||!fa.test(self.location.origin))){var b=self.document.head.querySelector('meta[name="'+a+'"]');b&&b.getAttribute("content")}}u.cdnUrl||ha("runtime-host");u.geoApiUrl||ha("amp-geo-api");self.__AMP_LOG=self.__AMP_LOG||{user:null,dev:null,userForEmbed:null};var ia=self.__AMP_LOG;function v(a,b){return 0<a&&0<b?a%b:(a%b+b)%b};function w(a){return a||{}};var x,ja="Webkit webkit Moz moz ms O o".split(" ");function y(a,b,c){if(b.startsWith("--"))return b;x||(x=Object.create(null));var d=x[b];if(!d||c){d=b;if(void 0===a[b]){var e=b.charAt(0).toUpperCase()+b.slice(1);a:{for(var g=0;g<ja.length;g++){var f=ja[g]+e;if(void 0!==a[f]){e=f;break a}}e=""}var k=e;void 0!==a[k]&&(d=k)}c||(x[b]=d)}return d}function ka(a,b){a=a.style;for(var c in b)a.setProperty(y(a,c),b[c].toString(),"important")}
function z(a,b,c){(b=y(a.style,b,void 0))&&(b.startsWith("--")?a.style.setProperty(b,c):a.style[b]=c)};function A(a,b){var c=b.getBoundingClientRect();b=c.top;var d=c.bottom,e=c.height,g=c.left,f=c.right;c=c.width;return{start:0==a?g:b,end:0==a?f:d,length:0==a?c:e}}function B(a,b){a=A(a,b);return(a.start+a.end)/2}function C(a,b,c){return"start"==b?A(a,c).start:B(a,c)}function D(a,b,c){0==a?z(b,"width",c+"px"):z(b,"height",c+"px")}function E(a,b,c){a=A(a,b);b=a.end;return a.start<=c&&c<b}function la(a,b,c,d){var e=C(a,b,d),g=C(a,b,c),f=A(a,d).length;return(e-g)/f}
function ma(a,b,c,d,e){var g=C(a,b,c);if(E(a,d[e],g))return e;for(b=1;b<=d.length/2;b++){var f=v(e+b,d.length),k=v(e-b,d.length);if(E(a,d[f],g))return f;if(E(a,d[k],g))return k}};function na(a,b,c){function d(){e=0;var k=c-(a.Date.now()-g);if(0<k)e=a.setTimeout(d,k);else{var l=f;f=null;b.apply(null,l)}}var e=0,g=0,f=null;return function(k){for(var l=[],m=0;m<arguments.length;++m)l[m-0]=arguments[m];g=a.Date.now();f=l;e||(e=a.setTimeout(d,c))}};var F;function oa(a,b,c,d){var e=a,g=c;var f=function(m){try{return g(m)}catch(n){throw self.__AMP_REPORT_ERROR(n),n;}};var k=pa(),l=!1;d&&(l=d.capture);e.addEventListener(b,f,k?d:l);return function(){e&&e.removeEventListener(b,f,k?d:l);f=e=g=null}}function pa(){if(void 0!==F)return F;F=!1;try{var a={get capture(){F=!0}};self.addEventListener("test-options",null,a);self.removeEventListener("test-options",null,a)}catch(b){}return F};/*
 https://mths.be/cssescape v1.5.1 by @mathias | MIT license */
var G;function qa(a){return"> :not([slot])".replace(/^|,/g,"$&"+a+" ")};var ra={bubbles:!0,cancelable:!0};function H(a,b){for(var c=a.length,d=0;d<c;d++)b(a[d],d)}function I(a,b,c){var d=a.hasAttribute(b),e=void 0!==c?c:!d;e!==d&&(e?a.setAttribute(b,""):a.removeAttribute(b))};function J(a,b,c,d){var e={detail:c};Object.assign(e,d);if("function"==typeof a.CustomEvent)return new a.CustomEvent(b,e);a=a.document.createEvent("CustomEvent");a.initCustomEvent(b,!!e.bubbles,!!e.cancelable,c);return a}function K(a,b,c,d){oa(a,b,c,d)}function sa(a){var b=a,c=oa(window,"touchend",function(d){try{b(d)}finally{b=null,c()}},{capture:!0,passive:!0})};function ta(a){var b=this,c=a.element,d=a.scrollContainer,e=a.advanceable;this.M=a.win;this.h=d;this.Oa=e;this.ga=0;this.C=!1;this.ha=1;this.ia=1E3;this.Ma=this.ta=!1;this.ka=null;this.Ga=Number.POSITIVE_INFINITY;this.Pa=c.getAmpDoc();ua(this,this.ia);this.h.addEventListener("scroll",function(){return b.ma()},!0);K(this.h,"touchstart",function(){return b.na()},{capture:!0,passive:!0});K(c,"amp-carousel:indexchange",function(g){(g=g.detail.actionSource)&&4!==g&&b.stop()})}h=ta.prototype;
h.stop=function(){this.Ma=!0};h.pause=function(){this.ta=!0};h.resume=function(){this.ta=!1;L(this)};h.updateAutoAdvance=function(a){this.C=a;L(this)};h.updateAutoAdvanceCount=function(a){this.ha=a;L(this)};h.updateAutoAdvanceInterval=function(a){this.ia=Math.max(a,1E3);ua(this,this.ia);L(this)};h.updateMaxAdvances=function(a){this.Ga=a};function ua(a,b){var c=na(a.M,function(){c==a.ka&&wa(a)&&(a.Oa.advance(a.ha,{actionSource:4,allowWrap:!0}),a.ga+=a.ha)},b);a.ka=c}
h.na=function(){var a=this;this.pause();sa(function(){a.resume()})};function wa(a){return a.C&&a.Pa.isVisible()&&!a.ta&&!a.Ma&&a.ga<a.Ga}h.ma=function(){L(this)};function L(a){wa(a)&&a.ka()};function ya(a){var b=this,c=a.element,d=a.scrollContainer,e=a.runMutate,g=a.stoppable;this.M=a.win;this.h=d;this.K=e;this.l=[];this.B=1;this.L=this.P=!1;this.Da=0;c.addEventListener("focus",function(){g.stop()},!0);c.addEventListener("amp-carousel:indexchange",function(f){b.ra(f)})}h=ya.prototype;h.updateMixedLength=function(a){this.P=a};h.updateUi=function(){var a=this;this.L||(this.L=!0,this.K(function(){a.L=!1;za(a);Aa(a)}))};h.updateSlides=function(a){this.l=a;this.updateUi()};
h.updateVisibleCount=function(a){this.B=a;this.updateUi()};function za(a){a.P||2<=a.B?(a.h.removeAttribute("aria-live"),a.h.setAttribute("role","list"),a.l.forEach(function(b){b.setAttribute("role","listitem")})):(a.h.setAttribute("aria-live","polite"),a.h.removeAttribute("role"),a.l.forEach(function(b){b.removeAttribute("role")}))}function Aa(a){a.l.forEach(function(b,c){b.setAttribute("aria-hidden",!(a.P||2<=a.B)&&c!==a.Da)})}h.ra=function(a){var b=this;this.Da=a.detail.index;this.K(function(){Aa(b)})};function Ba(a,b){var c=(c=y(a.style,"scrollBehavior",void 0))?c.startsWith("--")?a.style.getPropertyValue(c):a.style[c]:void 0;z(a,"scrollBehavior","auto");b();z(a,"scrollBehavior",c)}function M(a){return a.reduce(function(b,c){return b+c},0)}
function Ca(a){var b=this,c=a.win,d=a.element,e=a.scrollContainer;a=a.runMutate;this.M=c;this.K=a;this.U=d;this.h=e;this.C=new ta({win:c,element:d,scrollContainer:e,advanceable:this});this.ja=new ya({win:c,element:d,scrollContainer:e,runMutate:a,stoppable:this.C});this.Aa=na(c,function(){return N(b)},200);this.fa=1;this.ya=Number.POSITIVE_INFINITY;this.P=!1;this.l=[];this.Na=!0;this.L=!1;this.S=[];this.ca=[];this.R=[];this.xa=[];this.O=this.qa=!1;this.X=0;this.D=null;this.da=NaN;this.ua=this.ea=!1;
this.I=void 0;this.F="start";this.G=0;this.Ca=this.J=!0;this.A=0;this.Fa=!1;this.La=!0;this.B=this.Ka=1;this.h.addEventListener("scroll",function(){return b.ma()},!0);this.h.addEventListener("scrollend",function(){null===b.D&&N(b)},!0);K(this.h,"touchstart",function(){return b.na()},{capture:!0,passive:!0});K(this.h,"wheel",function(){b.I=2;b.D=null;b.O=!1},{capture:!0,passive:!0})}h=Ca.prototype;h.next=function(a){this.advance(this.fa,{actionSource:a})};h.prev=function(a){this.advance(-this.fa,{actionSource:a})};
h.advance=function(a,b){b=void 0===b?{}:b;var c=this.A,d=this.D,e=b;b=e.actionSource;var g=void 0===e.allowWrap?!1:e.allowWrap;c=null!==d?d:c;var f=c+a,k=this.l.length-1,l=0===c,m=c===k,n=0>f,va=f>k,xa=0<a&&Da(this,c)&&Da(this,f);a=this.isLooping()?v(f,k+1):g?xa?0:n&&l||va&&!m?k:n&&!l||va&&m?0:f:xa?c:Math.min(Math.max(f,0),k);this.goToSlide(a,{actionSource:b})};h.pauseLayout=function(){this.qa=!0;this.C.pause()};h.resumeLayout=function(){this.qa=!1;this.updateUi();this.C.resume()};
h.getCurrentIndex=function(){return this.A};h.getVisibleCount=function(){return this.B};h.isLooping=function(){return this.Fa&&3<=this.l.length/this.B};h.goToSlide=function(a,b){b=void 0===b?{}:b;var c=void 0===b.smoothScroll?!0:b.smoothScroll;b=b.actionSource;0>a||a>this.l.length-1||isNaN(a)||a===this.A||this.ea||this.ua&&(3===this.I||2===this.I)||(this.O=!1,this.D=a,this.I=b,Ea(this,this.l[a],{smoothScroll:c}))};h.updateAdvanceCount=function(a){this.fa=a};
h.updateAlignment=function(a){this.F="start"===a?"start":"center";this.updateUi()};h.updateAutoAdvance=function(a){this.C.updateAutoAdvance(a)};h.updateAutoAdvanceCount=function(a){this.C.updateAutoAdvanceCount(a)};h.updateAutoAdvanceInterval=function(a){this.C.updateAutoAdvanceInterval(a)};h.updateAutoAdvanceLoops=function(a){this.ya=a;this.updateUi()};h.updateForwards=function(a){this.J=a;this.updateUi()};h.updateHideScrollbar=function(a){this.Ca=a;this.updateUi()};
h.updateHorizontal=function(a){this.G=a?0:1;this.updateUi()};h.updateLoop=function(a){this.Fa=a;this.updateUi()};h.updateMixedLength=function(a){this.P=a;this.ja.updateMixedLength(a);this.updateUi()};h.updateSlides=function(a){if(!a.length){var b=this.U.tagName.toUpperCase();if(ia.dev)var c=ia.dev;else throw Error("failed to call initLogConstructor");c.warn(b,"No slides were found.")}this.l=a;this.ja.updateSlides(a)};h.updateSnap=function(a){this.La=a;this.updateUi()};
h.updateSnapBy=function(a){this.Ka=Math.max(1,a);this.updateUi()};h.updateUserScrollable=function(a){this.Na=a;this.updateUi()};
h.updateUi=function(){var a=this;this.L||this.qa||(this.L=!0,this.K(function(){a.L=!1;a.h.setAttribute("mixed-length",a.P);a.h.setAttribute("user-scrollable",a.Na);a.h.setAttribute("hide-scrollbar",a.Ca);a.h.setAttribute("horizontal",0===a.G);a.h.setAttribute("loop",a.isLooping());a.h.setAttribute("snap",a.La);ka(a.h,{"--visible-count":a.B});a.l.length&&(a.C.updateMaxAdvances(a.ya*a.l.length-1),Fa(a),Ga(a),Ha(a),N(a,!0))}))};
h.updateVisibleCount=function(a){this.B=Math.max(1,a);this.ja.updateVisibleCount(a);this.updateUi()};function Ia(a,b,c){a.A=b;a.X=c;a.U.dispatchEvent(J(a.M,"amp-carousel:offsetchange",w({index:b,total:a.l.length,offset:a.J?-c:c,slides:a.l}),{bubbles:!0}))}h.notifyScrollStart=function(){this.U.dispatchEvent(J(this.M,"amp-carousel:scrollstart",null))};h.na=function(){var a=this;this.ea=!0;this.I=3;this.D=null;this.O=!1;sa(function(){a.ea=!1;a.Aa()})};
h.ma=function(){this.O?this.O=!1:(this.ua=!0,Ja(this),this.notifyScrollStart(),this.Aa())};function O(a,b,c,d){var e=a.G,g=c*d*(a.J?1:-1);a=0==e?g:0;e=0==e?0:g;z(b,"transform","translate("+a+"px, "+e+"px)");ka(b,{"--content-transform":"translate("+a+"px, "+e+"px)"});b._revolutions=c}function Ka(a,b){a.l.forEach(function(c){O(a,c,0,b)})}function P(a){return a.l.map(function(b){return A(a.G,b).length})}
h.isAtEnd=function(){if(this.isLooping())var a=!1;else{a=this.h;var b=a.getBoundingClientRect().width*(this.J?1:-1);b=a.scrollLeft+(this.J?Math.ceil(b):Math.floor(b));a=a.scrollWidth;a=this.J?b>=a:b<=-a}return a};h.isAtStart=function(){if(this.isLooping())var a=!1;else a=this.h.scrollLeft,a=this.J?0>=a:0<=a;return a};function Q(a){for(var b=[],c=0;c<a;c++){var d=document.createElement("div");d.className="i-amphtml-carousel-spacer";b.push(d)}return b}
function Fa(a){var b=a.G,c=a.l,d=P(a),e=M(d),g=a.isLooping()?c.length:0;a.S.forEach(function(f){a.h.removeChild(f)});a.S=Q(g);a.S.forEach(function(f,k){D(b,f,d[k]);a.h.insertBefore(f,c[0])});a.ca.forEach(function(f){a.h.removeChild(f)});a.ca=Q(g);a.ca.forEach(function(f,k){D(b,f,d[k]);O(a,f,-1,e);a.h.appendChild(f)});a.R.forEach(function(f){a.h.removeChild(f)});a.R=Q(g);a.R.forEach(function(f,k){D(b,f,d[k]);O(a,f,-1,e);a.h.appendChild(f)});a.xa=a.S.concat(a.ca,a.R)}
function Ga(a){var b=a.l.length,c="start"===a.F,d=1===v(a.B,2),e=c||d?"0%":"50%";H(a.h.children,function(g,f){f=v(f,b);var k=0===v(f,a.Ka);if(g.classList.contains("i-amphtml-carousel-spacer")||!a.isLooping()){f={"scroll-snap-align":k?a.F:"none","scroll-snap-coordinate":k?e:"none"};for(var l in f)z(g,l,f[l])}})}
function Ha(a){var b=a.R,c=a.S,d=a.A,e=a.l,g=Math.max(0,e.length-d-1),f=Math.max(0,d-1);c.forEach(function(k,l){var m=c.length;m=d===l?m:v(d-l,m);k.hidden=m>e.length-1||l<e.length-g});b.forEach(function(k,l){var m=b.length;m=d===l?m:v(l-d,m);k.hidden=m>e.length-1||l>f})}function Ja(a){var b=a.xa,c=a.F,d=a.G,e=a.A,g=a.h,f=a.l,k=M(P(a)),l=!!b.length,m=l?b:f,n=ma(d,c,g,m,l?e+f.length:e);void 0!==n&&(b=n%f.length,c=la(d,c,g,m[n]),Ia(a,b,c),b!==e&&a.K(function(){La(a,k)}))}
function N(a,b){var c=void 0===b?!1:b,d=a.I;if(!a.ea&&(a.I=void 0,a.ua=!1,a.K(function(){a.U.dispatchEvent(J(a.M,"amp-carousel:scrollpositionchange",null))}),a.da!==a.A||null!==a.D||c)){null!==a.D&&(a.A=a.D,a.D=null,a.X=0);var e=M(P(a));a.K(function(){var g=a.A;a.da!==g&&(a.da=g,a.U.dispatchEvent(J(a.M,"amp-carousel:indexchange",w({index:g,total:a.l.length,actionSource:d,slides:a.l}),{bubbles:!0})));Ia(a,a.A,a.X);Ka(a,e);Ha(a);La(a,e);Ma(a)})}}
function Ma(a){var b=a.G,c=a.X,d=a.h,e=a.l[a.A],g=la(b,a.F,d,e)-c;c=A(b,e).length;var f=g*c;f&&(a.O=!0,Ba(d,function(){var k=(0==b?d.scrollLeft:d.scrollTop)+f;0==b?d.scrollLeft=k:d.scrollTop=k}))}function Ea(a,b,c){(c.smoothScroll?function(d,e){return e()}:Ba)(a.h,function(){var d=a.G,e=a.h,g="start"==a.F,f=A(d,b).length,k=g?A(d,b).start:B(d,b);g=g?A(d,e).start:B(d,e);f=(0==d?e.scrollLeft:e.scrollTop)+(k-g-0*f);0==d?e.scrollLeft=f:e.scrollTop=f})}
function Na(a,b,c,d){for(var e=a.A,g=a.da,f=a.l,k=f[e]._revolutions||0,l=d?1:-1,m=1;m<=c;m++){var n=v(e+m*l,f.length);if(n===g&&e!==g)break;O(a,f[n],n>e!==d?k+l:k,b)}}function La(a,b){if(a.isLooping()){var c=a.l,d=a.B,e="start"===a.F?d-1:0,g=(c.length-1+e)/2;Na(a,b,Math.round((c.length-1-e)/2),!1);Na(a,b,Math.round(g),!0)}}function Da(a,b){var c=a.B;return b>=a.l.length-("start"===a.F?c:c/2)};function Oa(a,b){a=a.__AMP_TOP||(a.__AMP_TOP=a);return R(a,b)}function Pa(a){var b=S(a);b=Qa(b);return R(b,"owners")}function Ra(a){a=S(a);a=Qa(a);return Sa(a,"action")?R(a,"action"):null}function S(a){return a.nodeType?Oa((a.ownerDocument||a).defaultView,"ampdoc").getAmpDoc(a):a}function Qa(a){a=S(a);return a.isSingleDoc()?a.win:a}
function R(a,b){Sa(a,b);var c=a.__AMP_SERVICES;c||(c=a.__AMP_SERVICES={});a=c[b];a.obj||(a.obj=new a.ctor(a.context),a.ctor=null,a.context=null,a.resolve&&a.resolve(a.obj));return a.obj}function Sa(a,b){a=a.__AMP_SERVICES&&a.__AMP_SERVICES[b];return!(!a||!a.ctor&&!a.obj)};function Ta(a){var b=a.ampElement,c=a.intersectionElement,d=void 0===a.intersectionThreshold?.01:a.intersectionThreshold,e=void 0===a.nearbyMarginInPercent?100:a.nearbyMarginInPercent,g=void 0===a.viewportIntersectionThreshold?d:a.viewportIntersectionThreshold,f=void 0===a.viewportIntersectionCallback?function(){}:a.viewportIntersectionCallback;this.N=b;this.sa=Pa(b.element);this.oa=c;this.Ea=d;this.Ia=e;this.Qa=g;this.va=f;this.ba=!1;this.o=[];this.Y=this.W=this.Z=null;this.V=!1}h=Ta.prototype;
h.setQueueChanges=function(a){this.ba=a};function T(a,b,c){c?a.sa.scheduleLayout(a.N.element,b):a.sa.scheduleUnlayout(a.N.element,b)}
function Ua(a){if(!(a.Z&&a.W&&a.Y)){var b=a.N.win;a.Z=new b.IntersectionObserver(function(c){return Va(a,c)},{root:a.oa,rootMargin:a.Ia+"%",threshold:a.Ea});a.W=new b.IntersectionObserver(function(c){return Wa(a,c)},{root:a.oa,rootMargin:a.Ia+10+"%",threshold:a.Ea});a.Y=new b.IntersectionObserver(function(c){return Xa(a,c)},{root:a.oa,rootMargin:"0%",threshold:a.Qa})}}
function Va(a,b){b.filter(function(c){return c.isIntersecting}).forEach(function(c){c.target.__AMP_CAROUSEL_NEAR_VIEWPORT=0});a.ba||Ya(a)}function Wa(a,b){b.filter(function(c){return!c.isIntersecting}).forEach(function(c){c.target.__AMP_CAROUSEL_NEAR_VIEWPORT=1});a.ba||Za(a)}function Xa(a,b){b.forEach(function(c){c.target.__AMP_CAROUSEL_IN_VIEWPORT=c.isIntersecting?0:1});a.ba||$a(a)}h.flushChanges=function(){Ya(this);Za(this);$a(this)};
function Ya(a){for(var b=0;b<a.o.length;b++){var c=a.o[b];0==c.__AMP_CAROUSEL_NEAR_VIEWPORT&&(T(a,c,!0),c.__AMP_CAROUSEL_NEAR_VIEWPORT=null)}}function Za(a){for(var b=0;b<a.o.length;b++){var c=a.o[b];1==c.__AMP_CAROUSEL_NEAR_VIEWPORT&&(T(a,c,!1),c.__AMP_CAROUSEL_NEAR_VIEWPORT=null)}}function $a(a){for(var b=0;b<a.o.length;b++){var c=a.o[b];0==c.__AMP_CAROUSEL_IN_VIEWPORT?(T(a,c,!0),a.va(c,!0)):1==c.__AMP_CAROUSEL_IN_VIEWPORT&&a.va(c,!1);c.__AMP_CAROUSEL_IN_VIEWPORT=null}}
function U(a,b){if("IntersectionObserver"in a.N.win)if(Ua(a),b)for(var c=0;c<a.o.length;c++)a.Z.observe(a.o[c]),a.W.observe(a.o[c]),a.Y.observe(a.o[c]);else a.Z.disconnect(),a.W.disconnect(),a.Y.disconnect()}h.updateChildren=function(a){this.o=a;if("IntersectionObserver"in this.N.win){for(a=0;a<this.o.length;a++)this.sa.setOwner(this.o[a],this.N.element);U(this,!1);U(this,this.V)}};h.wasLaidOut=function(){this.V=!0;U(this,this.V)};
h.wasUnlaidOut=function(){this.V=!1;U(this,this.V);for(var a=0;a<this.o.length;a++)T(this,this.o[a],!1),this.va(this.o[a],!1)};function ab(a){return a.split(",").map(function(b){var c=/[a-z0-9.]+$/.exec(b);if(c){c=c.index;var d=b.slice(c),e=b.slice(0,c).trim();return{mediaQueryList:window.matchMedia(e),value:d}}}).filter(function(b){return b})}function bb(a){for(var b=0;b<a.length;b++){var c=a[b],d=c.value;if(c.mediaQueryList.matches)return d}return""}function cb(a){this.za=a;this.Ba={};this.Ha={}}
cb.prototype.updateAttribute=function(a,b){var c=this;if(this.za[a]){var d=this.Ha[a];d&&db(d,null);var e=ab(b),g=function(){var f=bb(e);if(c.Ba[a]!==f){var k=c.za[a];k&&k(f);c.Ba[a]=f}};db(e,g);g();this.Ha[a]=e}};function db(a,b){a.forEach(function(c){c.mediaQueryList.onchange=b})};var V;function eb(a){a=a.ownerDocument||a;V&&V.ownerDocument===a||(V=a.createElement("div"));return fb}function fb(a){var b=V;b.innerHTML=a[0];a=b.firstElementChild;b.removeChild(a);return a};w({c:!0,v:!0,a:!0,ad:!0});var gb=["<div class=i-amphtml-carousel-content><div class=i-amphtml-carousel-scroll tabindex=-1></div><div class=i-amphtml-base-carousel-arrows><div class=i-amphtml-base-carousel-arrow-prev-slot></div><div class=i-amphtml-base-carousel-arrow-next-slot></div></div></div>"],hb=['<button class=i-amphtml-base-carousel-arrow aria-label="Next item in carousel"><div class=i-amphtml-base-carousel-arrow-frosting></div><div class=i-amphtml-base-carousel-arrow-backdrop></div><div class=i-amphtml-base-carousel-arrow-background></div><svg class=i-amphtml-base-carousel-arrow-icon viewBox="0 0 24 24"><path d="M10,7.4 L14.6,12 L10,16.6" fill=none stroke-width=2px stroke-linejoin=round stroke-linecap=round /></svg></button>'],
ib=['<button class=i-amphtml-base-carousel-arrow aria-label="Previous item in carousel"><div class=i-amphtml-base-carousel-arrow-frosting></div><div class=i-amphtml-base-carousel-arrow-backdrop></div><div class=i-amphtml-base-carousel-arrow-background></div><svg class=i-amphtml-base-carousel-arrow-icon viewBox="0 0 24 24"><path d="M14,7.4 L9.4,12 L14,16.6" fill=none stroke-width=2px stroke-linejoin=round stroke-linecap=round /></svg></button>'];
function W(a){a=AMP.BaseElement.call(this,a)||this;a.Ja=jb(a);a.pa=Oa(a.win,"platform").isIos();a.h=null;a.j=null;a.l=[];a.$=null;a.aa=null;a.la=!1;a.wa=null;a.H=null;a.T=2;return a}var X=AMP.BaseElement;W.prototype=aa(X.prototype);W.prototype.constructor=W;if(ea)ea(W,X);else for(var Y in X)if("prototype"!=Y)if(Object.defineProperties){var kb=Object.getOwnPropertyDescriptor(X,Y);kb&&Object.defineProperty(W,Y,kb)}else W[Y]=X[Y];W.Ra=X.prototype;W.prerenderAllowed=function(){return!0};
function jb(a){return new cb({"advance-count":function(b){a.j.updateAdvanceCount(Number(b)||0)},"auto-advance":function(b){a.j.updateAutoAdvance("true"===b)},"auto-advance-count":function(b){a.j.updateAutoAdvanceCount(Number(b)||0)},"auto-advance-interval":function(b){a.j.updateAutoAdvanceInterval(Number(b)||0)},"auto-advance-loops":function(b){a.j.updateAutoAdvanceLoops(Number(b)||0)},controls:function(b){switch(b){case "always":a.T=0;break;case "never":a.T=1;break;default:a.T=2}Z(a)},dir:function(b){a.j.updateForwards("rtl"!=
b)},horizontal:function(b){a.j.updateHorizontal("true"===b)},loop:function(b){a.j.updateLoop("true"===b)},"mixed-length":function(b){a.j.updateMixedLength("true"===b)},slide:function(b){a.j.goToSlide(Number(b))},snap:function(b){a.j.updateSnap("true"===b)},"snap-align":function(b){a.j.updateAlignment(b)},"snap-by":function(b){a.j.updateSnapBy(Number(b)||0)},"visible-count":function(b){a.j.updateVisibleCount(Number(b)||0)}})}h=W.prototype;
h.isLayoutSupported=function(a){return"fixed"==a||"fixed-height"==a||"responsive"==a||"fill"==a||"flex-item"==a||"fluid"==a||"intrinsic"==a};h.buildCallback=function(){var a=this;this.wa=Ra(this.element);lb(this);this.j=new Ca({win:this.win,element:this.element,scrollContainer:this.h,initialIndex:mb(this),runMutate:function(b){return a.mutateElement(b)}});t(this.element.attributes).forEach(function(b){a.Ja.updateAttribute(b.name,b.value)});this.j.updateSlides(this.l);nb(this);ob(this);pb(this);Z(this)};
h.isRelayoutNeeded=function(){return!0};h.pauseCallback=function(){this.j.pauseLayout()};h.resumeCallback=function(){this.j.resumeLayout()};h.layoutCallback=function(){this.j.updateUi();this.H.wasLaidOut();r||(r=Promise.resolve(void 0));var a=r;return a};h.unlayoutCallback=function(){this.H.wasUnlaidOut();return!0};h.mutatedAttributesCallback=function(a){for(var b in a)this.Ja.updateAttribute(b,String(a[b]))};h.getSlides=function(){return this.l};
h.goToSlide=function(a,b){b=void 0===b?{}:b;this.j.goToSlide(a,{smoothScroll:void 0===b.smoothScroll?!1:b.smoothScroll,actionSource:b.actionSource})};h.interactionNext=function(){this.j.next(0)};h.interactionPrev=function(){this.j.prev(0)};
function lb(a){var b=a.element,c,d;t(b.children).forEach(function(e){var g=e.getAttribute("slot");"prev-arrow"===g?c=e:"next-arrow"===g?d=e:"I-AMPHTML-SIZER"===e.tagName||a.l.push(e)});b.appendChild(eb(a.element)(gb));a.h=b.querySelector(".i-amphtml-carousel-scroll");a.aa=a.element.querySelector(".i-amphtml-base-carousel-arrow-prev-slot");a.$=a.element.querySelector(".i-amphtml-base-carousel-arrow-next-slot");a.l.forEach(function(e){e.classList.add("i-amphtml-carousel-slotted");a.h.appendChild(e)});
a.aa.appendChild(c||eb(a.element)(ib));a.$.appendChild(d||eb(a.element)(hb))}
function nb(a){var b=Pa(a.element);a.H=new Ta({ampElement:a,intersectionElement:a.h,nearbyMarginInPercent:a.pa?200:100,viewportIntersectionCallback:function(d,e){e?b.scheduleResume(a.element,d):b.schedulePause(a.element,d)}});a.H.setQueueChanges(a.pa);var c=a.l.map(function(d){if("amp-inline-gallery-slide"===d.localName){if(void 0!==G)var e=G;else{try{var g=d.ownerDocument,f=g.createElement("div"),k=g.createElement("div");f.appendChild(k);e=f.querySelector(":scope div")===k}catch(l){e=!1}e=G=e}e?
d=d.querySelectorAll(qa(":scope")):(d.classList.add("i-amphtml-scoped"),e=qa(".i-amphtml-scoped"),e=d.querySelectorAll(e),d.classList.remove("i-amphtml-scoped"),d=e);d=t(d)}return d}).reduce(function(d,e){return d.concat(e)},[]);a.H.updateChildren(c)}
function ob(a){a.registerAction("prev",function(b){a.j.prev(2<=b.trust?0:1)},1);a.registerAction("next",function(b){a.j.next(2<=b.trust?0:1)},1);a.registerAction("goToSlide",function(b){var c=b.trust,d;a.j.goToSlide(null!=(d=b.args.index)?d:-1,{actionSource:2<=c?0:1})},1)}
function pb(a){a.element.addEventListener("amp-carousel:indexchange",function(b){a.ra(b)});a.element.addEventListener("amp-carousel:scrollstart",function(){a.H.setQueueChanges(a.pa)});a.element.addEventListener("amp-carousel:scrollpositionchange",function(){a.H.flushChanges();a.H.setQueueChanges(!1);Z(a)});a.element.addEventListener("goToSlide",function(b){a.j.goToSlide(b.detail.index)});a.element.addEventListener("keydown",function(b){var c="ArrowRight"===b.key,d="ArrowLeft"===b.key;if(c||d){var e=
a.element.ownerDocument;e="rtl"==(e.body.getAttribute("dir")||e.documentElement.getAttribute("dir")||"ltr");c&&!e||d&&e?a.j.next():a.j.prev();b.preventDefault()}});a.aa.addEventListener("click",function(b){b.target!=b.currentTarget&&a.j.prev(0)});a.$.addEventListener("click",function(b){b.target!=b.currentTarget&&a.j.next(0)})}
function Z(a){var b=a.j.getCurrentIndex(),c=a.j.isLooping(),d=a.j.getVisibleCount(),e=a.j.isAtEnd(),g=a.j.isAtStart();H(a.aa.children,function(f){I(f,"disabled",!c&&0===b||g)});H(a.$.children,function(f){I(f,"disabled",!c&&b>=a.l.length-d||e)});I(a.element,"i-amphtml-base-carousel-hide-buttons",1===a.T?!0:0===a.T?!1:a.la)}function mb(a){a=a.element.getAttribute("slide")||"0";return Number(bb(ab(a)))}
h.ra=function(a){var b=a.detail;a=b.actionSource;var c=w({index:b.index});b=2===a||3===a||0===a?3:1;var d=J(this.win,"slidescroll.slideChange",c);this.wa.trigger(this.element,"slideChange",d,b);b=this.element;c=c||{};var e=b.ownerDocument.createEvent("Event");e.data=c;e.initEvent("slideChange",ra.bubbles,ra.cancelable);b.dispatchEvent(e);this.la=this.la||3===a;Z(this)};(function(a){a.registerElement("amp-base-carousel",W,".i-amphtml-carousel-content{position:absolute;top:0;left:0;bottom:0;right:0}.i-amphtml-carousel-scroll{display:-ms-flexbox;display:flex;width:100%;height:100%;-ms-flex-align:center;align-items:center;outline:none;scroll-behavior:smooth;-webkit-overflow-scrolling:touch!important;--visible-count:1}.i-amphtml-carousel-scroll[hide-scrollbar=true]{scrollbar-width:none}.i-amphtml-carousel-scroll[hide-scrollbar=true]::-webkit-scrollbar{display:none;box-sizing:content-box!important}.i-amphtml-carousel-scroll[horizontal=true]{-ms-flex-direction:row;flex-direction:row;scroll-snap-type-x:mandatory;scroll-snap-type:x mandatory;padding-bottom:20px!important;overflow-y:hidden}.i-amphtml-carousel-scroll[horizontal=false]{-ms-flex-direction:column;flex-direction:column;scroll-snap-type-y:mandatory;scroll-snap-type:y mandatory;padding-right:20px!important;overflow-x:hidden}.i-amphtml-carousel-scroll[snap=false]{scroll-snap-type:none}.i-amphtml-carousel-scroll[user-scrollable=false]{overflow:hidden}.i-amphtml-carousel-spacer{z-index:-1}.i-amphtml-carousel-slotted,.i-amphtml-carousel-spacer{box-sizing:border-box!important;margin:0!important;-ms-flex-negative:0!important;flex-shrink:0!important;width:100%;height:100%;scroll-snap-stop:always}.i-amphtml-carousel-scroll[horizontal=true][mixed-length=false]>.i-amphtml-carousel-slotted,.i-amphtml-carousel-scroll[horizontal=true][mixed-length=false]>.i-amphtml-carousel-spacer{width:calc(100%/var(--visible-count))!important;min-width:auto!important;max-width:none!important}.i-amphtml-carousel-scroll[horizontal=false][mixed-length=false]>.i-amphtml-carousel-slotted,.i-amphtml-carousel-scroll[horizontal=false][mixed-length=false]>.i-amphtml-carousel-spacer{height:calc(100%/var(--visible-count))!important;min-height:auto!important;max-height:none!important}.i-amphtml-carousel-scroll[horizontal=true][snap=true][mixed-length=true]>.i-amphtml-carousel-slotted,.i-amphtml-carousel-scroll[horizontal=true][snap=true][mixed-length=true]>.i-amphtml-carousel-spacer{max-width:100%!important}.i-amphtml-carousel-scroll[horizontal=false][snap=true][mixed-length=true]>.i-amphtml-carousel-slotted,.i-amphtml-carousel-scroll[horizontal=false][snap=true][mixed-length=true]>.i-amphtml-carousel-spacer{max-height:100%!important}.i-amphtml-carousel-scroll>.i-amphtml-carousel-slotted{will-change:transform}amp-base-carousel{display:block;overflow:hidden}.i-amphtml-base-carousel-arrows{position:absolute;top:0;bottom:0;left:0;right:0;z-index:1;display:-ms-flexbox;display:flex;-ms-flex-direction:row;flex-direction:row;-ms-flex-pack:justify;justify-content:space-between;pointer-events:none}.i-amphtml-base-carousel-arrow-next-slot,.i-amphtml-base-carousel-arrow-prev-slot{position:relative;z-index:1;display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center}.i-amphtml-base-carousel-arrow-next-slot>*,.i-amphtml-base-carousel-arrow-prev-slot>*{pointer-events:all}amp-base-carousel[dir=rtl] .i-amphtml-base-carousel-arrow-next-slot,amp-base-carousel[dir=rtl] .i-amphtml-base-carousel-arrow-prev-slot{transform:scaleX(-1)}amp-base-carousel .i-amphtml-carousel-scroll[loop=false]+.i-amphtml-base-carousel-arrows>.i-amphtml-base-carousel-arrow-next-slot>[disabled],amp-base-carousel .i-amphtml-carousel-scroll[loop=false]+.i-amphtml-base-carousel-arrows>.i-amphtml-base-carousel-arrow-prev-slot>[disabled],amp-base-carousel[i-amphtml-base-carousel-hide-buttons] .i-amphtml-base-carousel-arrow-next-slot>*,amp-base-carousel[i-amphtml-base-carousel-hide-buttons] .i-amphtml-base-carousel-arrow-prev-slot>*{opacity:0;pointer-events:none}.i-amphtml-base-carousel-arrow-backdrop,.i-amphtml-base-carousel-arrow-background,.i-amphtml-base-carousel-arrow-frosting{position:absolute;top:0;left:0;width:100%;height:100%;border-radius:50%}.i-amphtml-base-carousel-arrow-frosting{-webkit-backdrop-filter:blur(3px);backdrop-filter:blur(3px)}.i-amphtml-base-carousel-arrow-backdrop{-webkit-backdrop-filter:blur(12px) invert(1) grayscale(0.6) brightness(0.8);backdrop-filter:blur(12px) invert(1) grayscale(0.6) brightness(0.8);opacity:0.5}.i-amphtml-base-carousel-arrow-background{background-color:rgba(0,0,0,0.3);box-shadow:inset 0 0 0px 1px rgba(0,0,0,0.08),0 1px 4px 1px rgba(0,0,0,0.2);transition:background-color 200ms}@media (hover:hover){.i-amphtml-base-carousel-arrow:hover .i-amphtml-base-carousel-arrow-background{background-color:hsla(0,0%,100%,0.8)}}.i-amphtml-base-carousel-arrow:active .i-amphtml-base-carousel-arrow-background{background-color:#fff;transition-duration:0ms}.i-amphtml-base-carousel-arrow{position:relative;display:-ms-flexbox;display:flex;-ms-flex-pack:center;justify-content:center;-ms-flex-align:center;align-items:center;width:36px;height:36px;padding:0;margin:12px;background-color:transparent;border:none;outline:none;stroke:#fff;transition:stroke 200ms}@media (hover:hover){.i-amphtml-base-carousel-arrow:hover{stroke:#222}}.i-amphtml-base-carousel-arrow:active{stroke:#222;transition-duration:0ms}.i-amphtml-base-carousel-arrow-icon{position:relative;z-index:1;width:24px;height:24px}.i-amphtml-base-carousel-arrow-background,.i-amphtml-base-carousel-arrow-icon{transform:translateZ(1px)}amp-base-carousel .i-amphtml-carousel-slotted>.i-amphtml-replaced-content{-o-object-fit:contain;object-fit:contain}\n/*# sourceURL=/extensions/amp-base-carousel/0.1/amp-base-carousel.css*/")})(self.AMP);
})});

//# sourceMappingURL=amp-base-carousel-0.1.js.map
