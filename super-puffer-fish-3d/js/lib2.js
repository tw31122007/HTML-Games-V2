/*! Hammer.JS - v2.0.7 - 2016-04-22
 * http://hammerjs.github.io/
 *
 * Copyright (c) 2016 Jorik Tangelder;
 * Licensed under the MIT license */
!function(a,b,c,d){"use strict";function e(a,b,c){return setTimeout(j(a,c),b)}function f(a,b,c){return Array.isArray(a)?(g(a,c[b],c),!0):!1}function g(a,b,c){var e;if(a)if(a.forEach)a.forEach(b,c);else if(a.length!==d)for(e=0;e<a.length;)b.call(c,a[e],e,a),e++;else for(e in a)a.hasOwnProperty(e)&&b.call(c,a[e],e,a)}function h(b,c,d){var e="DEPRECATED METHOD: "+c+"\n"+d+" AT \n";return function(){var c=new Error("get-stack-trace"),d=c&&c.stack?c.stack.replace(/^[^\(]+?[\n$]/gm,"").replace(/^\s+at\s+/gm,"").replace(/^Object.<anonymous>\s*\(/gm,"{anonymous}()@"):"Unknown Stack Trace",f=a.console&&(a.console.warn||a.console.log);return f&&f.call(a.console,e,d),b.apply(this,arguments)}}function i(a,b,c){var d,e=b.prototype;d=a.prototype=Object.create(e),d.constructor=a,d._super=e,c&&la(d,c)}function j(a,b){return function(){return a.apply(b,arguments)}}function k(a,b){return typeof a==oa?a.apply(b?b[0]||d:d,b):a}function l(a,b){return a===d?b:a}function m(a,b,c){g(q(b),function(b){a.addEventListener(b,c,!1)})}function n(a,b,c){g(q(b),function(b){a.removeEventListener(b,c,!1)})}function o(a,b){for(;a;){if(a==b)return!0;a=a.parentNode}return!1}function p(a,b){return a.indexOf(b)>-1}function q(a){return a.trim().split(/\s+/g)}function r(a,b,c){if(a.indexOf&&!c)return a.indexOf(b);for(var d=0;d<a.length;){if(c&&a[d][c]==b||!c&&a[d]===b)return d;d++}return-1}function s(a){return Array.prototype.slice.call(a,0)}function t(a,b,c){for(var d=[],e=[],f=0;f<a.length;){var g=b?a[f][b]:a[f];r(e,g)<0&&d.push(a[f]),e[f]=g,f++}return c&&(d=b?d.sort(function(a,c){return a[b]>c[b]}):d.sort()),d}function u(a,b){for(var c,e,f=b[0].toUpperCase()+b.slice(1),g=0;g<ma.length;){if(c=ma[g],e=c?c+f:b,e in a)return e;g++}return d}function v(){return ua++}function w(b){var c=b.ownerDocument||b;return c.defaultView||c.parentWindow||a}function x(a,b){var c=this;this.manager=a,this.callback=b,this.element=a.element,this.target=a.options.inputTarget,this.domHandler=function(b){k(a.options.enable,[a])&&c.handler(b)},this.init()}function y(a){var b,c=a.options.inputClass;return new(b=c?c:xa?M:ya?P:wa?R:L)(a,z)}function z(a,b,c){var d=c.pointers.length,e=c.changedPointers.length,f=b&Ea&&d-e===0,g=b&(Ga|Ha)&&d-e===0;c.isFirst=!!f,c.isFinal=!!g,f&&(a.session={}),c.eventType=b,A(a,c),a.emit("hammer.input",c),a.recognize(c),a.session.prevInput=c}function A(a,b){var c=a.session,d=b.pointers,e=d.length;c.firstInput||(c.firstInput=D(b)),e>1&&!c.firstMultiple?c.firstMultiple=D(b):1===e&&(c.firstMultiple=!1);var f=c.firstInput,g=c.firstMultiple,h=g?g.center:f.center,i=b.center=E(d);b.timeStamp=ra(),b.deltaTime=b.timeStamp-f.timeStamp,b.angle=I(h,i),b.distance=H(h,i),B(c,b),b.offsetDirection=G(b.deltaX,b.deltaY);var j=F(b.deltaTime,b.deltaX,b.deltaY);b.overallVelocityX=j.x,b.overallVelocityY=j.y,b.overallVelocity=qa(j.x)>qa(j.y)?j.x:j.y,b.scale=g?K(g.pointers,d):1,b.rotation=g?J(g.pointers,d):0,b.maxPointers=c.prevInput?b.pointers.length>c.prevInput.maxPointers?b.pointers.length:c.prevInput.maxPointers:b.pointers.length,C(c,b);var k=a.element;o(b.srcEvent.target,k)&&(k=b.srcEvent.target),b.target=k}function B(a,b){var c=b.center,d=a.offsetDelta||{},e=a.prevDelta||{},f=a.prevInput||{};b.eventType!==Ea&&f.eventType!==Ga||(e=a.prevDelta={x:f.deltaX||0,y:f.deltaY||0},d=a.offsetDelta={x:c.x,y:c.y}),b.deltaX=e.x+(c.x-d.x),b.deltaY=e.y+(c.y-d.y)}function C(a,b){var c,e,f,g,h=a.lastInterval||b,i=b.timeStamp-h.timeStamp;if(b.eventType!=Ha&&(i>Da||h.velocity===d)){var j=b.deltaX-h.deltaX,k=b.deltaY-h.deltaY,l=F(i,j,k);e=l.x,f=l.y,c=qa(l.x)>qa(l.y)?l.x:l.y,g=G(j,k),a.lastInterval=b}else c=h.velocity,e=h.velocityX,f=h.velocityY,g=h.direction;b.velocity=c,b.velocityX=e,b.velocityY=f,b.direction=g}function D(a){for(var b=[],c=0;c<a.pointers.length;)b[c]={clientX:pa(a.pointers[c].clientX),clientY:pa(a.pointers[c].clientY)},c++;return{timeStamp:ra(),pointers:b,center:E(b),deltaX:a.deltaX,deltaY:a.deltaY}}function E(a){var b=a.length;if(1===b)return{x:pa(a[0].clientX),y:pa(a[0].clientY)};for(var c=0,d=0,e=0;b>e;)c+=a[e].clientX,d+=a[e].clientY,e++;return{x:pa(c/b),y:pa(d/b)}}function F(a,b,c){return{x:b/a||0,y:c/a||0}}function G(a,b){return a===b?Ia:qa(a)>=qa(b)?0>a?Ja:Ka:0>b?La:Ma}function H(a,b,c){c||(c=Qa);var d=b[c[0]]-a[c[0]],e=b[c[1]]-a[c[1]];return Math.sqrt(d*d+e*e)}function I(a,b,c){c||(c=Qa);var d=b[c[0]]-a[c[0]],e=b[c[1]]-a[c[1]];return 180*Math.atan2(e,d)/Math.PI}function J(a,b){return I(b[1],b[0],Ra)+I(a[1],a[0],Ra)}function K(a,b){return H(b[0],b[1],Ra)/H(a[0],a[1],Ra)}function L(){this.evEl=Ta,this.evWin=Ua,this.pressed=!1,x.apply(this,arguments)}function M(){this.evEl=Xa,this.evWin=Ya,x.apply(this,arguments),this.store=this.manager.session.pointerEvents=[]}function N(){this.evTarget=$a,this.evWin=_a,this.started=!1,x.apply(this,arguments)}function O(a,b){var c=s(a.touches),d=s(a.changedTouches);return b&(Ga|Ha)&&(c=t(c.concat(d),"identifier",!0)),[c,d]}function P(){this.evTarget=bb,this.targetIds={},x.apply(this,arguments)}function Q(a,b){var c=s(a.touches),d=this.targetIds;if(b&(Ea|Fa)&&1===c.length)return d[c[0].identifier]=!0,[c,c];var e,f,g=s(a.changedTouches),h=[],i=this.target;if(f=c.filter(function(a){return o(a.target,i)}),b===Ea)for(e=0;e<f.length;)d[f[e].identifier]=!0,e++;for(e=0;e<g.length;)d[g[e].identifier]&&h.push(g[e]),b&(Ga|Ha)&&delete d[g[e].identifier],e++;return h.length?[t(f.concat(h),"identifier",!0),h]:void 0}function R(){x.apply(this,arguments);var a=j(this.handler,this);this.touch=new P(this.manager,a),this.mouse=new L(this.manager,a),this.primaryTouch=null,this.lastTouches=[]}function S(a,b){a&Ea?(this.primaryTouch=b.changedPointers[0].identifier,T.call(this,b)):a&(Ga|Ha)&&T.call(this,b)}function T(a){var b=a.changedPointers[0];if(b.identifier===this.primaryTouch){var c={x:b.clientX,y:b.clientY};this.lastTouches.push(c);var d=this.lastTouches,e=function(){var a=d.indexOf(c);a>-1&&d.splice(a,1)};setTimeout(e,cb)}}function U(a){for(var b=a.srcEvent.clientX,c=a.srcEvent.clientY,d=0;d<this.lastTouches.length;d++){var e=this.lastTouches[d],f=Math.abs(b-e.x),g=Math.abs(c-e.y);if(db>=f&&db>=g)return!0}return!1}function V(a,b){this.manager=a,this.set(b)}function W(a){if(p(a,jb))return jb;var b=p(a,kb),c=p(a,lb);return b&&c?jb:b||c?b?kb:lb:p(a,ib)?ib:hb}function X(){if(!fb)return!1;var b={},c=a.CSS&&a.CSS.supports;return["auto","manipulation","pan-y","pan-x","pan-x pan-y","none"].forEach(function(d){b[d]=c?a.CSS.supports("touch-action",d):!0}),b}function Y(a){this.options=la({},this.defaults,a||{}),this.id=v(),this.manager=null,this.options.enable=l(this.options.enable,!0),this.state=nb,this.simultaneous={},this.requireFail=[]}function Z(a){return a&sb?"cancel":a&qb?"end":a&pb?"move":a&ob?"start":""}function $(a){return a==Ma?"down":a==La?"up":a==Ja?"left":a==Ka?"right":""}function _(a,b){var c=b.manager;return c?c.get(a):a}function aa(){Y.apply(this,arguments)}function ba(){aa.apply(this,arguments),this.pX=null,this.pY=null}function ca(){aa.apply(this,arguments)}function da(){Y.apply(this,arguments),this._timer=null,this._input=null}function ea(){aa.apply(this,arguments)}function fa(){aa.apply(this,arguments)}function ga(){Y.apply(this,arguments),this.pTime=!1,this.pCenter=!1,this._timer=null,this._input=null,this.count=0}function ha(a,b){return b=b||{},b.recognizers=l(b.recognizers,ha.defaults.preset),new ia(a,b)}function ia(a,b){this.options=la({},ha.defaults,b||{}),this.options.inputTarget=this.options.inputTarget||a,this.handlers={},this.session={},this.recognizers=[],this.oldCssProps={},this.element=a,this.input=y(this),this.touchAction=new V(this,this.options.touchAction),ja(this,!0),g(this.options.recognizers,function(a){var b=this.add(new a[0](a[1]));a[2]&&b.recognizeWith(a[2]),a[3]&&b.requireFailure(a[3])},this)}function ja(a,b){var c=a.element;if(c.style){var d;g(a.options.cssProps,function(e,f){d=u(c.style,f),b?(a.oldCssProps[d]=c.style[d],c.style[d]=e):c.style[d]=a.oldCssProps[d]||""}),b||(a.oldCssProps={})}}function ka(a,c){var d=b.createEvent("Event");d.initEvent(a,!0,!0),d.gesture=c,c.target.dispatchEvent(d)}var la,ma=["","webkit","Moz","MS","ms","o"],na=b.createElement("div"),oa="function",pa=Math.round,qa=Math.abs,ra=Date.now;la="function"!=typeof Object.assign?function(a){if(a===d||null===a)throw new TypeError("Cannot convert undefined or null to object");for(var b=Object(a),c=1;c<arguments.length;c++){var e=arguments[c];if(e!==d&&null!==e)for(var f in e)e.hasOwnProperty(f)&&(b[f]=e[f])}return b}:Object.assign;var sa=h(function(a,b,c){for(var e=Object.keys(b),f=0;f<e.length;)(!c||c&&a[e[f]]===d)&&(a[e[f]]=b[e[f]]),f++;return a},"extend","Use `assign`."),ta=h(function(a,b){return sa(a,b,!0)},"merge","Use `assign`."),ua=1,va=/mobile|tablet|ip(ad|hone|od)|android/i,wa="ontouchstart"in a,xa=u(a,"PointerEvent")!==d,ya=wa&&va.test(navigator.userAgent),za="touch",Aa="pen",Ba="mouse",Ca="kinect",Da=25,Ea=1,Fa=2,Ga=4,Ha=8,Ia=1,Ja=2,Ka=4,La=8,Ma=16,Na=Ja|Ka,Oa=La|Ma,Pa=Na|Oa,Qa=["x","y"],Ra=["clientX","clientY"];x.prototype={handler:function(){},init:function(){this.evEl&&m(this.element,this.evEl,this.domHandler),this.evTarget&&m(this.target,this.evTarget,this.domHandler),this.evWin&&m(w(this.element),this.evWin,this.domHandler)},destroy:function(){this.evEl&&n(this.element,this.evEl,this.domHandler),this.evTarget&&n(this.target,this.evTarget,this.domHandler),this.evWin&&n(w(this.element),this.evWin,this.domHandler)}};var Sa={mousedown:Ea,mousemove:Fa,mouseup:Ga},Ta="mousedown",Ua="mousemove mouseup";i(L,x,{handler:function(a){var b=Sa[a.type];b&Ea&&0===a.button&&(this.pressed=!0),b&Fa&&1!==a.which&&(b=Ga),this.pressed&&(b&Ga&&(this.pressed=!1),this.callback(this.manager,b,{pointers:[a],changedPointers:[a],pointerType:Ba,srcEvent:a}))}});var Va={pointerdown:Ea,pointermove:Fa,pointerup:Ga,pointercancel:Ha,pointerout:Ha},Wa={2:za,3:Aa,4:Ba,5:Ca},Xa="pointerdown",Ya="pointermove pointerup pointercancel";a.MSPointerEvent&&!a.PointerEvent&&(Xa="MSPointerDown",Ya="MSPointerMove MSPointerUp MSPointerCancel"),i(M,x,{handler:function(a){var b=this.store,c=!1,d=a.type.toLowerCase().replace("ms",""),e=Va[d],f=Wa[a.pointerType]||a.pointerType,g=f==za,h=r(b,a.pointerId,"pointerId");e&Ea&&(0===a.button||g)?0>h&&(b.push(a),h=b.length-1):e&(Ga|Ha)&&(c=!0),0>h||(b[h]=a,this.callback(this.manager,e,{pointers:b,changedPointers:[a],pointerType:f,srcEvent:a}),c&&b.splice(h,1))}});var Za={touchstart:Ea,touchmove:Fa,touchend:Ga,touchcancel:Ha},$a="touchstart",_a="touchstart touchmove touchend touchcancel";i(N,x,{handler:function(a){var b=Za[a.type];if(b===Ea&&(this.started=!0),this.started){var c=O.call(this,a,b);b&(Ga|Ha)&&c[0].length-c[1].length===0&&(this.started=!1),this.callback(this.manager,b,{pointers:c[0],changedPointers:c[1],pointerType:za,srcEvent:a})}}});var ab={touchstart:Ea,touchmove:Fa,touchend:Ga,touchcancel:Ha},bb="touchstart touchmove touchend touchcancel";i(P,x,{handler:function(a){var b=ab[a.type],c=Q.call(this,a,b);c&&this.callback(this.manager,b,{pointers:c[0],changedPointers:c[1],pointerType:za,srcEvent:a})}});var cb=2500,db=25;i(R,x,{handler:function(a,b,c){var d=c.pointerType==za,e=c.pointerType==Ba;if(!(e&&c.sourceCapabilities&&c.sourceCapabilities.firesTouchEvents)){if(d)S.call(this,b,c);else if(e&&U.call(this,c))return;this.callback(a,b,c)}},destroy:function(){this.touch.destroy(),this.mouse.destroy()}});var eb=u(na.style,"touchAction"),fb=eb!==d,gb="compute",hb="auto",ib="manipulation",jb="none",kb="pan-x",lb="pan-y",mb=X();V.prototype={set:function(a){a==gb&&(a=this.compute()),fb&&this.manager.element.style&&mb[a]&&(this.manager.element.style[eb]=a),this.actions=a.toLowerCase().trim()},update:function(){this.set(this.manager.options.touchAction)},compute:function(){var a=[];return g(this.manager.recognizers,function(b){k(b.options.enable,[b])&&(a=a.concat(b.getTouchAction()))}),W(a.join(" "))},preventDefaults:function(a){var b=a.srcEvent,c=a.offsetDirection;if(this.manager.session.prevented)return void b.preventDefault();var d=this.actions,e=p(d,jb)&&!mb[jb],f=p(d,lb)&&!mb[lb],g=p(d,kb)&&!mb[kb];if(e){var h=1===a.pointers.length,i=a.distance<2,j=a.deltaTime<250;if(h&&i&&j)return}return g&&f?void 0:e||f&&c&Na||g&&c&Oa?this.preventSrc(b):void 0},preventSrc:function(a){this.manager.session.prevented=!0,a.preventDefault()}};var nb=1,ob=2,pb=4,qb=8,rb=qb,sb=16,tb=32;Y.prototype={defaults:{},set:function(a){return la(this.options,a),this.manager&&this.manager.touchAction.update(),this},recognizeWith:function(a){if(f(a,"recognizeWith",this))return this;var b=this.simultaneous;return a=_(a,this),b[a.id]||(b[a.id]=a,a.recognizeWith(this)),this},dropRecognizeWith:function(a){return f(a,"dropRecognizeWith",this)?this:(a=_(a,this),delete this.simultaneous[a.id],this)},requireFailure:function(a){if(f(a,"requireFailure",this))return this;var b=this.requireFail;return a=_(a,this),-1===r(b,a)&&(b.push(a),a.requireFailure(this)),this},dropRequireFailure:function(a){if(f(a,"dropRequireFailure",this))return this;a=_(a,this);var b=r(this.requireFail,a);return b>-1&&this.requireFail.splice(b,1),this},hasRequireFailures:function(){return this.requireFail.length>0},canRecognizeWith:function(a){return!!this.simultaneous[a.id]},emit:function(a){function b(b){c.manager.emit(b,a)}var c=this,d=this.state;qb>d&&b(c.options.event+Z(d)),b(c.options.event),a.additionalEvent&&b(a.additionalEvent),d>=qb&&b(c.options.event+Z(d))},tryEmit:function(a){return this.canEmit()?this.emit(a):void(this.state=tb)},canEmit:function(){for(var a=0;a<this.requireFail.length;){if(!(this.requireFail[a].state&(tb|nb)))return!1;a++}return!0},recognize:function(a){var b=la({},a);return k(this.options.enable,[this,b])?(this.state&(rb|sb|tb)&&(this.state=nb),this.state=this.process(b),void(this.state&(ob|pb|qb|sb)&&this.tryEmit(b))):(this.reset(),void(this.state=tb))},process:function(a){},getTouchAction:function(){},reset:function(){}},i(aa,Y,{defaults:{pointers:1},attrTest:function(a){var b=this.options.pointers;return 0===b||a.pointers.length===b},process:function(a){var b=this.state,c=a.eventType,d=b&(ob|pb),e=this.attrTest(a);return d&&(c&Ha||!e)?b|sb:d||e?c&Ga?b|qb:b&ob?b|pb:ob:tb}}),i(ba,aa,{defaults:{event:"pan",threshold:10,pointers:1,direction:Pa},getTouchAction:function(){var a=this.options.direction,b=[];return a&Na&&b.push(lb),a&Oa&&b.push(kb),b},directionTest:function(a){var b=this.options,c=!0,d=a.distance,e=a.direction,f=a.deltaX,g=a.deltaY;return e&b.direction||(b.direction&Na?(e=0===f?Ia:0>f?Ja:Ka,c=f!=this.pX,d=Math.abs(a.deltaX)):(e=0===g?Ia:0>g?La:Ma,c=g!=this.pY,d=Math.abs(a.deltaY))),a.direction=e,c&&d>b.threshold&&e&b.direction},attrTest:function(a){return aa.prototype.attrTest.call(this,a)&&(this.state&ob||!(this.state&ob)&&this.directionTest(a))},emit:function(a){this.pX=a.deltaX,this.pY=a.deltaY;var b=$(a.direction);b&&(a.additionalEvent=this.options.event+b),this._super.emit.call(this,a)}}),i(ca,aa,{defaults:{event:"pinch",threshold:0,pointers:2},getTouchAction:function(){return[jb]},attrTest:function(a){return this._super.attrTest.call(this,a)&&(Math.abs(a.scale-1)>this.options.threshold||this.state&ob)},emit:function(a){if(1!==a.scale){var b=a.scale<1?"in":"out";a.additionalEvent=this.options.event+b}this._super.emit.call(this,a)}}),i(da,Y,{defaults:{event:"press",pointers:1,time:251,threshold:9},getTouchAction:function(){return[hb]},process:function(a){var b=this.options,c=a.pointers.length===b.pointers,d=a.distance<b.threshold,f=a.deltaTime>b.time;if(this._input=a,!d||!c||a.eventType&(Ga|Ha)&&!f)this.reset();else if(a.eventType&Ea)this.reset(),this._timer=e(function(){this.state=rb,this.tryEmit()},b.time,this);else if(a.eventType&Ga)return rb;return tb},reset:function(){clearTimeout(this._timer)},emit:function(a){this.state===rb&&(a&&a.eventType&Ga?this.manager.emit(this.options.event+"up",a):(this._input.timeStamp=ra(),this.manager.emit(this.options.event,this._input)))}}),i(ea,aa,{defaults:{event:"rotate",threshold:0,pointers:2},getTouchAction:function(){return[jb]},attrTest:function(a){return this._super.attrTest.call(this,a)&&(Math.abs(a.rotation)>this.options.threshold||this.state&ob)}}),i(fa,aa,{defaults:{event:"swipe",threshold:10,velocity:.3,direction:Na|Oa,pointers:1},getTouchAction:function(){return ba.prototype.getTouchAction.call(this)},attrTest:function(a){var b,c=this.options.direction;return c&(Na|Oa)?b=a.overallVelocity:c&Na?b=a.overallVelocityX:c&Oa&&(b=a.overallVelocityY),this._super.attrTest.call(this,a)&&c&a.offsetDirection&&a.distance>this.options.threshold&&a.maxPointers==this.options.pointers&&qa(b)>this.options.velocity&&a.eventType&Ga},emit:function(a){var b=$(a.offsetDirection);b&&this.manager.emit(this.options.event+b,a),this.manager.emit(this.options.event,a)}}),i(ga,Y,{defaults:{event:"tap",pointers:1,taps:1,interval:300,time:250,threshold:9,posThreshold:10},getTouchAction:function(){return[ib]},process:function(a){var b=this.options,c=a.pointers.length===b.pointers,d=a.distance<b.threshold,f=a.deltaTime<b.time;if(this.reset(),a.eventType&Ea&&0===this.count)return this.failTimeout();if(d&&f&&c){if(a.eventType!=Ga)return this.failTimeout();var g=this.pTime?a.timeStamp-this.pTime<b.interval:!0,h=!this.pCenter||H(this.pCenter,a.center)<b.posThreshold;this.pTime=a.timeStamp,this.pCenter=a.center,h&&g?this.count+=1:this.count=1,this._input=a;var i=this.count%b.taps;if(0===i)return this.hasRequireFailures()?(this._timer=e(function(){this.state=rb,this.tryEmit()},b.interval,this),ob):rb}return tb},failTimeout:function(){return this._timer=e(function(){this.state=tb},this.options.interval,this),tb},reset:function(){clearTimeout(this._timer)},emit:function(){this.state==rb&&(this._input.tapCount=this.count,this.manager.emit(this.options.event,this._input))}}),ha.VERSION="2.0.7",ha.defaults={domEvents:!1,touchAction:gb,enable:!0,inputTarget:null,inputClass:null,preset:[[ea,{enable:!1}],[ca,{enable:!1},["rotate"]],[fa,{direction:Na}],[ba,{direction:Na},["swipe"]],[ga],[ga,{event:"doubletap",taps:2},["tap"]],[da]],cssProps:{userSelect:"none",touchSelect:"none",touchCallout:"none",contentZooming:"none",userDrag:"none",tapHighlightColor:"rgba(0,0,0,0)"}};var ub=1,vb=2;ia.prototype={set:function(a){return la(this.options,a),a.touchAction&&this.touchAction.update(),a.inputTarget&&(this.input.destroy(),this.input.target=a.inputTarget,this.input.init()),this},stop:function(a){this.session.stopped=a?vb:ub},recognize:function(a){var b=this.session;if(!b.stopped){this.touchAction.preventDefaults(a);var c,d=this.recognizers,e=b.curRecognizer;(!e||e&&e.state&rb)&&(e=b.curRecognizer=null);for(var f=0;f<d.length;)c=d[f],b.stopped===vb||e&&c!=e&&!c.canRecognizeWith(e)?c.reset():c.recognize(a),!e&&c.state&(ob|pb|qb)&&(e=b.curRecognizer=c),f++}},get:function(a){if(a instanceof Y)return a;for(var b=this.recognizers,c=0;c<b.length;c++)if(b[c].options.event==a)return b[c];return null},add:function(a){if(f(a,"add",this))return this;var b=this.get(a.options.event);return b&&this.remove(b),this.recognizers.push(a),a.manager=this,this.touchAction.update(),a},remove:function(a){if(f(a,"remove",this))return this;if(a=this.get(a)){var b=this.recognizers,c=r(b,a);-1!==c&&(b.splice(c,1),this.touchAction.update())}return this},on:function(a,b){if(a!==d&&b!==d){var c=this.handlers;return g(q(a),function(a){c[a]=c[a]||[],c[a].push(b)}),this}},off:function(a,b){if(a!==d){var c=this.handlers;return g(q(a),function(a){b?c[a]&&c[a].splice(r(c[a],b),1):delete c[a]}),this}},emit:function(a,b){this.options.domEvents&&ka(a,b);var c=this.handlers[a]&&this.handlers[a].slice();if(c&&c.length){b.type=a,b.preventDefault=function(){b.srcEvent.preventDefault()};for(var d=0;d<c.length;)c[d](b),d++}},destroy:function(){this.element&&ja(this,!1),this.handlers={},this.session={},this.input.destroy(),this.element=null}},la(ha,{INPUT_START:Ea,INPUT_MOVE:Fa,INPUT_END:Ga,INPUT_CANCEL:Ha,STATE_POSSIBLE:nb,STATE_BEGAN:ob,STATE_CHANGED:pb,STATE_ENDED:qb,STATE_RECOGNIZED:rb,STATE_CANCELLED:sb,STATE_FAILED:tb,DIRECTION_NONE:Ia,DIRECTION_LEFT:Ja,DIRECTION_RIGHT:Ka,DIRECTION_UP:La,DIRECTION_DOWN:Ma,DIRECTION_HORIZONTAL:Na,DIRECTION_VERTICAL:Oa,DIRECTION_ALL:Pa,Manager:ia,Input:x,TouchAction:V,TouchInput:P,MouseInput:L,PointerEventInput:M,TouchMouseInput:R,SingleTouchInput:N,Recognizer:Y,AttrRecognizer:aa,Tap:ga,Pan:ba,Swipe:fa,Pinch:ca,Rotate:ea,Press:da,on:m,off:n,each:g,merge:ta,extend:sa,assign:la,inherit:i,bindFn:j,prefixed:u});var wb="undefined"!=typeof a?a:"undefined"!=typeof self?self:{};wb.Hammer=ha,"function"==typeof define&&define.amd?define(function(){return ha}):"undefined"!=typeof module&&module.exports?module.exports=ha:a[c]=ha}(window,document,"Hammer");
//# sourceMappingURL=hammer.min.js.map
/*! howler.js v2.0.2 | (c) 2013-2016, James Simpson of GoldFire Studios | MIT License | howlerjs.com */
!function(){"use strict";var e=function(){this.init()};e.prototype={init:function(){var e=this||n;return e._codecs={},e._howls=[],e._muted=!1,e._volume=1,e._canPlayEvent="canplaythrough",e._navigator="undefined"!=typeof window&&window.navigator?window.navigator:null,e.masterGain=null,e.noAudio=!1,e.usingWebAudio=!0,e.autoSuspend=!0,e.ctx=null,e.mobileAutoEnable=!0,e._setup(),e},volume:function(e){var t=this||n;if(e=parseFloat(e),t.ctx||_(),"undefined"!=typeof e&&e>=0&&e<=1){if(t._volume=e,t._muted)return t;t.usingWebAudio&&(t.masterGain.gain.value=e);for(var o=0;o<t._howls.length;o++)if(!t._howls[o]._webAudio)for(var r=t._howls[o]._getSoundIds(),u=0;u<r.length;u++){var a=t._howls[o]._soundById(r[u]);a&&a._node&&(a._node.volume=a._volume*e)}return t}return t._volume},mute:function(e){var t=this||n;t.ctx||_(),t._muted=e,t.usingWebAudio&&(t.masterGain.gain.value=e?0:t._volume);for(var o=0;o<t._howls.length;o++)if(!t._howls[o]._webAudio)for(var r=t._howls[o]._getSoundIds(),u=0;u<r.length;u++){var a=t._howls[o]._soundById(r[u]);a&&a._node&&(a._node.muted=!!e||a._muted)}return t},unload:function(){for(var e=this||n,t=e._howls.length-1;t>=0;t--)e._howls[t].unload();return e.usingWebAudio&&e.ctx&&"undefined"!=typeof e.ctx.close&&(e.ctx.close(),e.ctx=null,_()),e},codecs:function(e){return(this||n)._codecs[e.replace(/^x-/,"")]},_setup:function(){var e=this||n;if(e.state=e.ctx?e.ctx.state||"running":"running",e._autoSuspend(),!e.usingWebAudio)if("undefined"!=typeof Audio)try{var t=new Audio;"undefined"==typeof t.oncanplaythrough&&(e._canPlayEvent="canplay")}catch(n){e.noAudio=!0}else e.noAudio=!0;try{var t=new Audio;t.muted&&(e.noAudio=!0)}catch(e){}return e.noAudio||e._setupCodecs(),e},_setupCodecs:function(){var e=this||n,t=null;try{t="undefined"!=typeof Audio?new Audio:null}catch(n){return e}if(!t||"function"!=typeof t.canPlayType)return e;var o=t.canPlayType("audio/mpeg;").replace(/^no$/,""),r=e._navigator&&e._navigator.userAgent.match(/OPR\/([0-6].)/g),u=r&&parseInt(r[0].split("/")[1],10)<33;return e._codecs={mp3:!(u||!o&&!t.canPlayType("audio/mp3;").replace(/^no$/,"")),mpeg:!!o,opus:!!t.canPlayType('audio/ogg; codecs="opus"').replace(/^no$/,""),ogg:!!t.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/,""),oga:!!t.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/,""),wav:!!t.canPlayType('audio/wav; codecs="1"').replace(/^no$/,""),aac:!!t.canPlayType("audio/aac;").replace(/^no$/,""),caf:!!t.canPlayType("audio/x-caf;").replace(/^no$/,""),m4a:!!(t.canPlayType("audio/x-m4a;")||t.canPlayType("audio/m4a;")||t.canPlayType("audio/aac;")).replace(/^no$/,""),mp4:!!(t.canPlayType("audio/x-mp4;")||t.canPlayType("audio/mp4;")||t.canPlayType("audio/aac;")).replace(/^no$/,""),weba:!!t.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/,""),webm:!!t.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/,""),dolby:!!t.canPlayType('audio/mp4; codecs="ec-3"').replace(/^no$/,""),flac:!!(t.canPlayType("audio/x-flac;")||t.canPlayType("audio/flac;")).replace(/^no$/,"")},e},_enableMobileAudio:function(){var e=this||n,t=/iPhone|iPad|iPod|Android|BlackBerry|BB10|Silk|Mobi/i.test(e._navigator&&e._navigator.userAgent),o=!!("ontouchend"in window||e._navigator&&e._navigator.maxTouchPoints>0||e._navigator&&e._navigator.msMaxTouchPoints>0);if(!e._mobileEnabled&&e.ctx&&(t||o)){e._mobileEnabled=!1,e._mobileUnloaded||44100===e.ctx.sampleRate||(e._mobileUnloaded=!0,e.unload()),e._scratchBuffer=e.ctx.createBuffer(1,1,22050);var r=function(){var n=e.ctx.createBufferSource();n.buffer=e._scratchBuffer,n.connect(e.ctx.destination),"undefined"==typeof n.start?n.noteOn(0):n.start(0),n.onended=function(){n.disconnect(0),e._mobileEnabled=!0,e.mobileAutoEnable=!1,document.removeEventListener("touchend",r,!0)}};return document.addEventListener("touchend",r,!0),e}},_autoSuspend:function(){var e=this;if(e.autoSuspend&&e.ctx&&"undefined"!=typeof e.ctx.suspend&&n.usingWebAudio){for(var t=0;t<e._howls.length;t++)if(e._howls[t]._webAudio)for(var o=0;o<e._howls[t]._sounds.length;o++)if(!e._howls[t]._sounds[o]._paused)return e;return e._suspendTimer&&clearTimeout(e._suspendTimer),e._suspendTimer=setTimeout(function(){e.autoSuspend&&(e._suspendTimer=null,e.state="suspending",e.ctx.suspend().then(function(){e.state="suspended",e._resumeAfterSuspend&&(delete e._resumeAfterSuspend,e._autoResume())}))},3e4),e}},_autoResume:function(){var e=this;if(e.ctx&&"undefined"!=typeof e.ctx.resume&&n.usingWebAudio)return"running"===e.state&&e._suspendTimer?(clearTimeout(e._suspendTimer),e._suspendTimer=null):"suspended"===e.state?(e.state="resuming",e.ctx.resume().then(function(){e.state="running";for(var n=0;n<e._howls.length;n++)e._howls[n]._emit("resume")}),e._suspendTimer&&(clearTimeout(e._suspendTimer),e._suspendTimer=null)):"suspending"===e.state&&(e._resumeAfterSuspend=!0),e}};var n=new e,t=function(e){var n=this;return e.src&&0!==e.src.length?void n.init(e):void console.error("An array of source files must be passed with any new Howl.")};t.prototype={init:function(e){var t=this;return n.ctx||_(),t._autoplay=e.autoplay||!1,t._format="string"!=typeof e.format?e.format:[e.format],t._html5=e.html5||!1,t._muted=e.mute||!1,t._loop=e.loop||!1,t._pool=e.pool||5,t._preload="boolean"!=typeof e.preload||e.preload,t._rate=e.rate||1,t._sprite=e.sprite||{},t._src="string"!=typeof e.src?e.src:[e.src],t._volume=void 0!==e.volume?e.volume:1,t._duration=0,t._state="unloaded",t._sounds=[],t._endTimers={},t._queue=[],t._onend=e.onend?[{fn:e.onend}]:[],t._onfade=e.onfade?[{fn:e.onfade}]:[],t._onload=e.onload?[{fn:e.onload}]:[],t._onloaderror=e.onloaderror?[{fn:e.onloaderror}]:[],t._onpause=e.onpause?[{fn:e.onpause}]:[],t._onplay=e.onplay?[{fn:e.onplay}]:[],t._onstop=e.onstop?[{fn:e.onstop}]:[],t._onmute=e.onmute?[{fn:e.onmute}]:[],t._onvolume=e.onvolume?[{fn:e.onvolume}]:[],t._onrate=e.onrate?[{fn:e.onrate}]:[],t._onseek=e.onseek?[{fn:e.onseek}]:[],t._onresume=[],t._webAudio=n.usingWebAudio&&!t._html5,"undefined"!=typeof n.ctx&&n.ctx&&n.mobileAutoEnable&&n._enableMobileAudio(),n._howls.push(t),t._autoplay&&t._queue.push({event:"play",action:function(){t.play()}}),t._preload&&t.load(),t},load:function(){var e=this,t=null;if(n.noAudio)return void e._emit("loaderror",null,"No audio support.");"string"==typeof e._src&&(e._src=[e._src]);for(var r=0;r<e._src.length;r++){var a,d;if(e._format&&e._format[r])a=e._format[r];else{if(d=e._src[r],"string"!=typeof d){e._emit("loaderror",null,"Non-string found in selected audio sources - ignoring.");continue}a=/^data:audio\/([^;,]+);/i.exec(d),a||(a=/\.([^.]+)$/.exec(d.split("?",1)[0])),a&&(a=a[1].toLowerCase())}if(n.codecs(a)){t=e._src[r];break}}return t?(e._src=t,e._state="loading","https:"===window.location.protocol&&"http:"===t.slice(0,5)&&(e._html5=!0,e._webAudio=!1),new o(e),e._webAudio&&u(e),e):void e._emit("loaderror",null,"No codec support for selected audio sources.")},play:function(e,t){var o=this,r=null;if("number"==typeof e)r=e,e=null;else{if("string"==typeof e&&"loaded"===o._state&&!o._sprite[e])return null;if("undefined"==typeof e){e="__default";for(var u=0,a=0;a<o._sounds.length;a++)o._sounds[a]._paused&&!o._sounds[a]._ended&&(u++,r=o._sounds[a]._id);1===u?e=null:r=null}}var d=r?o._soundById(r):o._inactiveSound();if(!d)return null;if(r&&!e&&(e=d._sprite||"__default"),"loaded"!==o._state&&!o._sprite[e])return o._queue.push({event:"play",action:function(){o.play(o._soundById(d._id)?d._id:void 0)}}),d._id;if(r&&!d._paused)return t||setTimeout(function(){o._emit("play",d._id)},0),d._id;o._webAudio&&n._autoResume();var i=Math.max(0,d._seek>0?d._seek:o._sprite[e][0]/1e3),_=Math.max(0,(o._sprite[e][0]+o._sprite[e][1])/1e3-i),s=1e3*_/Math.abs(d._rate);d._paused=!1,d._ended=!1,d._sprite=e,d._seek=i,d._start=o._sprite[e][0]/1e3,d._stop=(o._sprite[e][0]+o._sprite[e][1])/1e3,d._loop=!(!d._loop&&!o._sprite[e][2]);var l=d._node;if(o._webAudio){var f=function(){o._refreshBuffer(d);var e=d._muted||o._muted?0:d._volume;l.gain.setValueAtTime(e,n.ctx.currentTime),d._playStart=n.ctx.currentTime,"undefined"==typeof l.bufferSource.start?d._loop?l.bufferSource.noteGrainOn(0,i,86400):l.bufferSource.noteGrainOn(0,i,_):d._loop?l.bufferSource.start(0,i,86400):l.bufferSource.start(0,i,_),s!==1/0&&(o._endTimers[d._id]=setTimeout(o._ended.bind(o,d),s)),t||setTimeout(function(){o._emit("play",d._id)},0)},c="running"===n.state;"loaded"===o._state&&c?f():(o.once(c?"load":"resume",f,c?d._id:null),o._clearTimer(d._id))}else{var p=function(){l.currentTime=i,l.muted=d._muted||o._muted||n._muted||l.muted,l.volume=d._volume*n.volume(),l.playbackRate=d._rate,setTimeout(function(){l.play(),s!==1/0&&(o._endTimers[d._id]=setTimeout(o._ended.bind(o,d),s)),t||o._emit("play",d._id)},0)},m="loaded"===o._state&&(window&&window.ejecta||!l.readyState&&n._navigator.isCocoonJS);if(4===l.readyState||m)p();else{var v=function(){p(),l.removeEventListener(n._canPlayEvent,v,!1)};l.addEventListener(n._canPlayEvent,v,!1),o._clearTimer(d._id)}}return d._id},pause:function(e){var n=this;if("loaded"!==n._state)return n._queue.push({event:"pause",action:function(){n.pause(e)}}),n;for(var t=n._getSoundIds(e),o=0;o<t.length;o++){n._clearTimer(t[o]);var r=n._soundById(t[o]);if(r&&!r._paused&&(r._seek=n.seek(t[o]),r._rateSeek=0,r._paused=!0,n._stopFade(t[o]),r._node))if(n._webAudio){if(!r._node.bufferSource)return n;"undefined"==typeof r._node.bufferSource.stop?r._node.bufferSource.noteOff(0):r._node.bufferSource.stop(0),n._cleanBuffer(r._node)}else isNaN(r._node.duration)&&r._node.duration!==1/0||r._node.pause();arguments[1]||n._emit("pause",r?r._id:null)}return n},stop:function(e,n){var t=this;if("loaded"!==t._state)return t._queue.push({event:"stop",action:function(){t.stop(e)}}),t;for(var o=t._getSoundIds(e),r=0;r<o.length;r++){t._clearTimer(o[r]);var u=t._soundById(o[r]);if(u&&(u._seek=u._start||0,u._rateSeek=0,u._paused=!0,u._ended=!0,t._stopFade(o[r]),u._node))if(t._webAudio){if(!u._node.bufferSource)return n||t._emit("stop",u._id),t;"undefined"==typeof u._node.bufferSource.stop?u._node.bufferSource.noteOff(0):u._node.bufferSource.stop(0),t._cleanBuffer(u._node)}else isNaN(u._node.duration)&&u._node.duration!==1/0||(u._node.currentTime=u._start||0,u._node.pause());u&&!n&&t._emit("stop",u._id)}return t},mute:function(e,t){var o=this;if("loaded"!==o._state)return o._queue.push({event:"mute",action:function(){o.mute(e,t)}}),o;if("undefined"==typeof t){if("boolean"!=typeof e)return o._muted;o._muted=e}for(var r=o._getSoundIds(t),u=0;u<r.length;u++){var a=o._soundById(r[u]);a&&(a._muted=e,o._webAudio&&a._node?a._node.gain.setValueAtTime(e?0:a._volume,n.ctx.currentTime):a._node&&(a._node.muted=!!n._muted||e),o._emit("mute",a._id))}return o},volume:function(){var e,t,o=this,r=arguments;if(0===r.length)return o._volume;if(1===r.length||2===r.length&&"undefined"==typeof r[1]){var u=o._getSoundIds(),a=u.indexOf(r[0]);a>=0?t=parseInt(r[0],10):e=parseFloat(r[0])}else r.length>=2&&(e=parseFloat(r[0]),t=parseInt(r[1],10));var d;if(!("undefined"!=typeof e&&e>=0&&e<=1))return d=t?o._soundById(t):o._sounds[0],d?d._volume:0;if("loaded"!==o._state)return o._queue.push({event:"volume",action:function(){o.volume.apply(o,r)}}),o;"undefined"==typeof t&&(o._volume=e),t=o._getSoundIds(t);for(var i=0;i<t.length;i++)d=o._soundById(t[i]),d&&(d._volume=e,r[2]||o._stopFade(t[i]),o._webAudio&&d._node&&!d._muted?d._node.gain.setValueAtTime(e,n.ctx.currentTime):d._node&&!d._muted&&(d._node.volume=e*n.volume()),o._emit("volume",d._id));return o},fade:function(e,t,o,r){var u=this,a=Math.abs(e-t),d=e>t?"out":"in",i=a/.01,_=i>0?o/i:o;if(_<4&&(i=Math.ceil(i/(4/_)),_=4),"loaded"!==u._state)return u._queue.push({event:"fade",action:function(){u.fade(e,t,o,r)}}),u;u.volume(e,r);for(var s=u._getSoundIds(r),l=0;l<s.length;l++){var f=u._soundById(s[l]);if(f){if(r||u._stopFade(s[l]),u._webAudio&&!f._muted){var c=n.ctx.currentTime,p=c+o/1e3;f._volume=e,f._node.gain.setValueAtTime(e,c),f._node.gain.linearRampToValueAtTime(t,p)}var m=e;f._interval=setInterval(function(e,n){i>0&&(m+="in"===d?.01:-.01),m=Math.max(0,m),m=Math.min(1,m),m=Math.round(100*m)/100,u._webAudio?("undefined"==typeof r&&(u._volume=m),n._volume=m):u.volume(m,e,!0),m===t&&(clearInterval(n._interval),n._interval=null,u.volume(m,e),u._emit("fade",e))}.bind(u,s[l],f),_)}}return u},_stopFade:function(e){var t=this,o=t._soundById(e);return o&&o._interval&&(t._webAudio&&o._node.gain.cancelScheduledValues(n.ctx.currentTime),clearInterval(o._interval),o._interval=null,t._emit("fade",e)),t},loop:function(){var e,n,t,o=this,r=arguments;if(0===r.length)return o._loop;if(1===r.length){if("boolean"!=typeof r[0])return t=o._soundById(parseInt(r[0],10)),!!t&&t._loop;e=r[0],o._loop=e}else 2===r.length&&(e=r[0],n=parseInt(r[1],10));for(var u=o._getSoundIds(n),a=0;a<u.length;a++)t=o._soundById(u[a]),t&&(t._loop=e,o._webAudio&&t._node&&t._node.bufferSource&&(t._node.bufferSource.loop=e,e&&(t._node.bufferSource.loopStart=t._start||0,t._node.bufferSource.loopEnd=t._stop)));return o},rate:function(){var e,t,o=this,r=arguments;if(0===r.length)t=o._sounds[0]._id;else if(1===r.length){var u=o._getSoundIds(),a=u.indexOf(r[0]);a>=0?t=parseInt(r[0],10):e=parseFloat(r[0])}else 2===r.length&&(e=parseFloat(r[0]),t=parseInt(r[1],10));var d;if("number"!=typeof e)return d=o._soundById(t),d?d._rate:o._rate;if("loaded"!==o._state)return o._queue.push({event:"rate",action:function(){o.rate.apply(o,r)}}),o;"undefined"==typeof t&&(o._rate=e),t=o._getSoundIds(t);for(var i=0;i<t.length;i++)if(d=o._soundById(t[i])){d._rateSeek=o.seek(t[i]),d._playStart=o._webAudio?n.ctx.currentTime:d._playStart,d._rate=e,o._webAudio&&d._node&&d._node.bufferSource?d._node.bufferSource.playbackRate.value=e:d._node&&(d._node.playbackRate=e);var _=o.seek(t[i]),s=(o._sprite[d._sprite][0]+o._sprite[d._sprite][1])/1e3-_,l=1e3*s/Math.abs(d._rate);!o._endTimers[t[i]]&&d._paused||(o._clearTimer(t[i]),o._endTimers[t[i]]=setTimeout(o._ended.bind(o,d),l)),o._emit("rate",d._id)}return o},seek:function(){var e,t,o=this,r=arguments;if(0===r.length)t=o._sounds[0]._id;else if(1===r.length){var u=o._getSoundIds(),a=u.indexOf(r[0]);a>=0?t=parseInt(r[0],10):(t=o._sounds[0]._id,e=parseFloat(r[0]))}else 2===r.length&&(e=parseFloat(r[0]),t=parseInt(r[1],10));if("undefined"==typeof t)return o;if("loaded"!==o._state)return o._queue.push({event:"seek",action:function(){o.seek.apply(o,r)}}),o;var d=o._soundById(t);if(d){if(!("number"==typeof e&&e>=0)){if(o._webAudio){var i=o.playing(t)?n.ctx.currentTime-d._playStart:0,_=d._rateSeek?d._rateSeek-d._seek:0;return d._seek+(_+i*Math.abs(d._rate))}return d._node.currentTime}var s=o.playing(t);s&&o.pause(t,!0),d._seek=e,d._ended=!1,o._clearTimer(t),s&&o.play(t,!0),!o._webAudio&&d._node&&(d._node.currentTime=e),o._emit("seek",t)}return o},playing:function(e){var n=this;if("number"==typeof e){var t=n._soundById(e);return!!t&&!t._paused}for(var o=0;o<n._sounds.length;o++)if(!n._sounds[o]._paused)return!0;return!1},duration:function(e){var n=this,t=n._duration,o=n._soundById(e);return o&&(t=n._sprite[o._sprite][1]/1e3),t},state:function(){return this._state},unload:function(){for(var e=this,t=e._sounds,o=0;o<t.length;o++){t[o]._paused||(e.stop(t[o]._id),e._emit("end",t[o]._id)),e._webAudio||(t[o]._node.src="data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=",t[o]._node.removeEventListener("error",t[o]._errorFn,!1),t[o]._node.removeEventListener(n._canPlayEvent,t[o]._loadFn,!1)),delete t[o]._node,e._clearTimer(t[o]._id);var u=n._howls.indexOf(e);u>=0&&n._howls.splice(u,1)}var a=!0;for(o=0;o<n._howls.length;o++)if(n._howls[o]._src===e._src){a=!1;break}return r&&a&&delete r[e._src],n.noAudio=!1,e._state="unloaded",e._sounds=[],e=null,null},on:function(e,n,t,o){var r=this,u=r["_on"+e];return"function"==typeof n&&u.push(o?{id:t,fn:n,once:o}:{id:t,fn:n}),r},off:function(e,n,t){var o=this,r=o["_on"+e],u=0;if(n){for(u=0;u<r.length;u++)if(n===r[u].fn&&t===r[u].id){r.splice(u,1);break}}else if(e)o["_on"+e]=[];else{var a=Object.keys(o);for(u=0;u<a.length;u++)0===a[u].indexOf("_on")&&Array.isArray(o[a[u]])&&(o[a[u]]=[])}return o},once:function(e,n,t){var o=this;return o.on(e,n,t,1),o},_emit:function(e,n,t){for(var o=this,r=o["_on"+e],u=r.length-1;u>=0;u--)r[u].id&&r[u].id!==n&&"load"!==e||(setTimeout(function(e){e.call(this,n,t)}.bind(o,r[u].fn),0),r[u].once&&o.off(e,r[u].fn,r[u].id));return o},_loadQueue:function(){var e=this;if(e._queue.length>0){var n=e._queue[0];e.once(n.event,function(){e._queue.shift(),e._loadQueue()}),n.action()}return e},_ended:function(e){var t=this,o=e._sprite,r=!(!e._loop&&!t._sprite[o][2]);if(t._emit("end",e._id),!t._webAudio&&r&&t.stop(e._id,!0).play(e._id),t._webAudio&&r){t._emit("play",e._id),e._seek=e._start||0,e._rateSeek=0,e._playStart=n.ctx.currentTime;var u=1e3*(e._stop-e._start)/Math.abs(e._rate);t._endTimers[e._id]=setTimeout(t._ended.bind(t,e),u)}return t._webAudio&&!r&&(e._paused=!0,e._ended=!0,e._seek=e._start||0,e._rateSeek=0,t._clearTimer(e._id),t._cleanBuffer(e._node),n._autoSuspend()),t._webAudio||r||t.stop(e._id),t},_clearTimer:function(e){var n=this;return n._endTimers[e]&&(clearTimeout(n._endTimers[e]),delete n._endTimers[e]),n},_soundById:function(e){for(var n=this,t=0;t<n._sounds.length;t++)if(e===n._sounds[t]._id)return n._sounds[t];return null},_inactiveSound:function(){var e=this;e._drain();for(var n=0;n<e._sounds.length;n++)if(e._sounds[n]._ended)return e._sounds[n].reset();return new o(e)},_drain:function(){var e=this,n=e._pool,t=0,o=0;if(!(e._sounds.length<n)){for(o=0;o<e._sounds.length;o++)e._sounds[o]._ended&&t++;for(o=e._sounds.length-1;o>=0;o--){if(t<=n)return;e._sounds[o]._ended&&(e._webAudio&&e._sounds[o]._node&&e._sounds[o]._node.disconnect(0),e._sounds.splice(o,1),t--)}}},_getSoundIds:function(e){var n=this;if("undefined"==typeof e){for(var t=[],o=0;o<n._sounds.length;o++)t.push(n._sounds[o]._id);return t}return[e]},_refreshBuffer:function(e){var t=this;return e._node.bufferSource=n.ctx.createBufferSource(),e._node.bufferSource.buffer=r[t._src],e._panner?e._node.bufferSource.connect(e._panner):e._node.bufferSource.connect(e._node),e._node.bufferSource.loop=e._loop,e._loop&&(e._node.bufferSource.loopStart=e._start||0,e._node.bufferSource.loopEnd=e._stop),e._node.bufferSource.playbackRate.value=e._rate,t},_cleanBuffer:function(e){var n=this;if(n._scratchBuffer){e.bufferSource.onended=null,e.bufferSource.disconnect(0);try{e.bufferSource.buffer=n._scratchBuffer}catch(e){}}return e.bufferSource=null,n}};var o=function(e){this._parent=e,this.init()};o.prototype={init:function(){var e=this,n=e._parent;return e._muted=n._muted,e._loop=n._loop,e._volume=n._volume,e._muted=n._muted,e._rate=n._rate,e._seek=0,e._paused=!0,e._ended=!0,e._sprite="__default",e._id=Math.round(Date.now()*Math.random()),n._sounds.push(e),e.create(),e},create:function(){var e=this,t=e._parent,o=n._muted||e._muted||e._parent._muted?0:e._volume;return t._webAudio?(e._node="undefined"==typeof n.ctx.createGain?n.ctx.createGainNode():n.ctx.createGain(),e._node.gain.setValueAtTime(o,n.ctx.currentTime),e._node.paused=!0,e._node.connect(n.masterGain)):(e._node=new Audio,e._errorFn=e._errorListener.bind(e),e._node.addEventListener("error",e._errorFn,!1),e._loadFn=e._loadListener.bind(e),e._node.addEventListener(n._canPlayEvent,e._loadFn,!1),e._node.src=t._src,e._node.preload="auto",e._node.volume=o*n.volume(),e._node.load()),e},reset:function(){var e=this,n=e._parent;return e._muted=n._muted,e._loop=n._loop,e._volume=n._volume,e._muted=n._muted,e._rate=n._rate,e._seek=0,e._rateSeek=0,e._paused=!0,e._ended=!0,e._sprite="__default",e._id=Math.round(Date.now()*Math.random()),e},_errorListener:function(){var e=this;e._parent._emit("loaderror",e._id,e._node.error?e._node.error.code:0),e._node.removeEventListener("error",e._errorListener,!1)},_loadListener:function(){var e=this,t=e._parent;t._duration=Math.ceil(10*e._node.duration)/10,0===Object.keys(t._sprite).length&&(t._sprite={__default:[0,1e3*t._duration]}),"loaded"!==t._state&&(t._state="loaded",t._emit("load"),t._loadQueue()),e._node.removeEventListener(n._canPlayEvent,e._loadFn,!1)}};var r={},u=function(e){var n=e._src;if(r[n])return e._duration=r[n].duration,void i(e);if(/^data:[^;]+;base64,/.test(n)){for(var t=atob(n.split(",")[1]),o=new Uint8Array(t.length),u=0;u<t.length;++u)o[u]=t.charCodeAt(u);d(o.buffer,e)}else{var _=new XMLHttpRequest;_.open("GET",n,!0),_.responseType="arraybuffer",_.onload=function(){var n=(_.status+"")[0];return"0"!==n&&"2"!==n&&"3"!==n?void e._emit("loaderror",null,"Failed loading audio file with status: "+_.status+"."):void d(_.response,e)},_.onerror=function(){e._webAudio&&(e._html5=!0,e._webAudio=!1,e._sounds=[],delete r[n],e.load())},a(_)}},a=function(e){try{e.send()}catch(n){e.onerror()}},d=function(e,t){n.ctx.decodeAudioData(e,function(e){e&&t._sounds.length>0&&(r[t._src]=e,i(t,e))},function(){t._emit("loaderror",null,"Decoding audio data failed.")})},i=function(e,n){n&&!e._duration&&(e._duration=n.duration),0===Object.keys(e._sprite).length&&(e._sprite={__default:[0,1e3*e._duration]}),"loaded"!==e._state&&(e._state="loaded",e._emit("load"),e._loadQueue())},_=function(){try{"undefined"!=typeof AudioContext?n.ctx=new AudioContext:"undefined"!=typeof webkitAudioContext?n.ctx=new webkitAudioContext:n.usingWebAudio=!1}catch(e){n.usingWebAudio=!1}var e=/iP(hone|od|ad)/.test(n._navigator&&n._navigator.platform),t=n._navigator&&n._navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/),o=t?parseInt(t[1],10):null;if(e&&o&&o<9){var r=/safari/.test(n._navigator&&n._navigator.userAgent.toLowerCase());(n._navigator&&n._navigator.standalone&&!r||n._navigator&&!n._navigator.standalone&&!r)&&(n.usingWebAudio=!1)}n.usingWebAudio&&(n.masterGain="undefined"==typeof n.ctx.createGain?n.ctx.createGainNode():n.ctx.createGain(),n.masterGain.gain.value=1,n.masterGain.connect(n.ctx.destination)),n._setup()};"function"==typeof define&&define.amd&&define([],function(){return{Howler:n,Howl:t}}),"undefined"!=typeof exports&&(exports.Howler=n,exports.Howl=t),"undefined"!=typeof window?(window.HowlerGlobal=e,window.Howler=n,window.Howl=t,window.Sound=o):"undefined"!=typeof global&&(global.HowlerGlobal=e,global.Howler=n,global.Howl=t,global.Sound=o)}();
/*! Spatial Plugin */
!function(){"use strict";HowlerGlobal.prototype._pos=[0,0,0],HowlerGlobal.prototype._orientation=[0,0,-1,0,1,0],HowlerGlobal.prototype.stereo=function(e){var n=this;if(!n.ctx||!n.ctx.listener)return n;for(var t=n._howls.length-1;t>=0;t--)n._howls[t].stereo(e);return n},HowlerGlobal.prototype.pos=function(e,n,t){var o=this;return o.ctx&&o.ctx.listener?(n="number"!=typeof n?o._pos[1]:n,t="number"!=typeof t?o._pos[2]:t,"number"!=typeof e?o._pos:(o._pos=[e,n,t],o.ctx.listener.setPosition(o._pos[0],o._pos[1],o._pos[2]),o)):o},HowlerGlobal.prototype.orientation=function(e,n,t,o,r,i){var a=this;if(!a.ctx||!a.ctx.listener)return a;var p=a._orientation;return n="number"!=typeof n?p[1]:n,t="number"!=typeof t?p[2]:t,o="number"!=typeof o?p[3]:o,r="number"!=typeof r?p[4]:r,i="number"!=typeof i?p[5]:i,"number"!=typeof e?p:(a._orientation=[e,n,t,o,r,i],a.ctx.listener.setOrientation(e,n,t,o,r,i),a)},Howl.prototype.init=function(e){return function(n){var t=this;return t._orientation=n.orientation||[1,0,0],t._stereo=n.stereo||null,t._pos=n.pos||null,t._pannerAttr={coneInnerAngle:"undefined"!=typeof n.coneInnerAngle?n.coneInnerAngle:360,coneOuterAngle:"undefined"!=typeof n.coneOuterAngle?n.coneOuterAngle:360,coneOuterGain:"undefined"!=typeof n.coneOuterGain?n.coneOuterGain:0,distanceModel:"undefined"!=typeof n.distanceModel?n.distanceModel:"inverse",maxDistance:"undefined"!=typeof n.maxDistance?n.maxDistance:1e4,panningModel:"undefined"!=typeof n.panningModel?n.panningModel:"HRTF",refDistance:"undefined"!=typeof n.refDistance?n.refDistance:1,rolloffFactor:"undefined"!=typeof n.rolloffFactor?n.rolloffFactor:1},t._onstereo=n.onstereo?[{fn:n.onstereo}]:[],t._onpos=n.onpos?[{fn:n.onpos}]:[],t._onorientation=n.onorientation?[{fn:n.onorientation}]:[],e.call(this,n)}}(Howl.prototype.init),Howl.prototype.stereo=function(n,t){var o=this;if(!o._webAudio)return o;if("loaded"!==o._state)return o._queue.push({event:"stereo",action:function(){o.stereo(n,t)}}),o;var r="undefined"==typeof Howler.ctx.createStereoPanner?"spatial":"stereo";if("undefined"==typeof t){if("number"!=typeof n)return o._stereo;o._stereo=n,o._pos=[n,0,0]}for(var i=o._getSoundIds(t),a=0;a<i.length;a++){var p=o._soundById(i[a]);if(p){if("number"!=typeof n)return p._stereo;p._stereo=n,p._pos=[n,0,0],p._node&&(p._pannerAttr.panningModel="equalpower",p._panner&&p._panner.pan||e(p,r),"spatial"===r?p._panner.setPosition(n,0,0):p._panner.pan.value=n),o._emit("stereo",p._id)}}return o},Howl.prototype.pos=function(n,t,o,r){var i=this;if(!i._webAudio)return i;if("loaded"!==i._state)return i._queue.push({event:"pos",action:function(){i.pos(n,t,o,r)}}),i;if(t="number"!=typeof t?0:t,o="number"!=typeof o?-.5:o,"undefined"==typeof r){if("number"!=typeof n)return i._pos;i._pos=[n,t,o]}for(var a=i._getSoundIds(r),p=0;p<a.length;p++){var f=i._soundById(a[p]);if(f){if("number"!=typeof n)return f._pos;f._pos=[n,t,o],f._node&&(f._panner&&!f._panner.pan||e(f,"spatial"),f._panner.setPosition(n,t,o)),i._emit("pos",f._id)}}return i},Howl.prototype.orientation=function(n,t,o,r){var i=this;if(!i._webAudio)return i;if("loaded"!==i._state)return i._queue.push({event:"orientation",action:function(){i.orientation(n,t,o,r)}}),i;if(t="number"!=typeof t?i._orientation[1]:t,o="number"!=typeof o?i._orientation[2]:o,"undefined"==typeof r){if("number"!=typeof n)return i._orientation;i._orientation=[n,t,o]}for(var a=i._getSoundIds(r),p=0;p<a.length;p++){var f=i._soundById(a[p]);if(f){if("number"!=typeof n)return f._orientation;f._orientation=[n,t,o],f._node&&(f._panner||(f._pos||(f._pos=i._pos||[0,0,-.5]),e(f,"spatial")),f._panner.setOrientation(n,t,o)),i._emit("orientation",f._id)}}return i},Howl.prototype.pannerAttr=function(){var n,t,o,r=this,i=arguments;if(!r._webAudio)return r;if(0===i.length)return r._pannerAttr;if(1===i.length){if("object"!=typeof i[0])return o=r._soundById(parseInt(i[0],10)),o?o._pannerAttr:r._pannerAttr;n=i[0],"undefined"==typeof t&&(r._pannerAttr={coneInnerAngle:"undefined"!=typeof n.coneInnerAngle?n.coneInnerAngle:r._coneInnerAngle,coneOuterAngle:"undefined"!=typeof n.coneOuterAngle?n.coneOuterAngle:r._coneOuterAngle,coneOuterGain:"undefined"!=typeof n.coneOuterGain?n.coneOuterGain:r._coneOuterGain,distanceModel:"undefined"!=typeof n.distanceModel?n.distanceModel:r._distanceModel,maxDistance:"undefined"!=typeof n.maxDistance?n.maxDistance:r._maxDistance,panningModel:"undefined"!=typeof n.panningModel?n.panningModel:r._panningModel,refDistance:"undefined"!=typeof n.refDistance?n.refDistance:r._refDistance,rolloffFactor:"undefined"!=typeof n.rolloffFactor?n.rolloffFactor:r._rolloffFactor})}else 2===i.length&&(n=i[0],t=parseInt(i[1],10));for(var a=r._getSoundIds(t),p=0;p<a.length;p++)if(o=r._soundById(a[p])){var f=o._pannerAttr;f={coneInnerAngle:"undefined"!=typeof n.coneInnerAngle?n.coneInnerAngle:f.coneInnerAngle,coneOuterAngle:"undefined"!=typeof n.coneOuterAngle?n.coneOuterAngle:f.coneOuterAngle,coneOuterGain:"undefined"!=typeof n.coneOuterGain?n.coneOuterGain:f.coneOuterGain,distanceModel:"undefined"!=typeof n.distanceModel?n.distanceModel:f.distanceModel,maxDistance:"undefined"!=typeof n.maxDistance?n.maxDistance:f.maxDistance,panningModel:"undefined"!=typeof n.panningModel?n.panningModel:f.panningModel,refDistance:"undefined"!=typeof n.refDistance?n.refDistance:f.refDistance,rolloffFactor:"undefined"!=typeof n.rolloffFactor?n.rolloffFactor:f.rolloffFactor};var s=o._panner;s?(s.coneInnerAngle=f.coneInnerAngle,s.coneOuterAngle=f.coneOuterAngle,s.coneOuterGain=f.coneOuterGain,s.distanceModel=f.distanceModel,s.maxDistance=f.maxDistance,s.panningModel=f.panningModel,s.refDistance=f.refDistance,s.rolloffFactor=f.rolloffFactor):(o._pos||(o._pos=r._pos||[0,0,-.5]),e(o,"spatial"))}return r},Sound.prototype.init=function(e){return function(){var n=this,t=n._parent;n._orientation=t._orientation,n._stereo=t._stereo,n._pos=t._pos,n._pannerAttr=t._pannerAttr,e.call(this),n._stereo?t.stereo(n._stereo):n._pos&&t.pos(n._pos[0],n._pos[1],n._pos[2],n._id)}}(Sound.prototype.init),Sound.prototype.reset=function(e){return function(){var n=this,t=n._parent;return n._orientation=t._orientation,n._pos=t._pos,n._pannerAttr=t._pannerAttr,e.call(this)}}(Sound.prototype.reset);var e=function(e,n){n=n||"spatial","spatial"===n?(e._panner=Howler.ctx.createPanner(),e._panner.coneInnerAngle=e._pannerAttr.coneInnerAngle,e._panner.coneOuterAngle=e._pannerAttr.coneOuterAngle,e._panner.coneOuterGain=e._pannerAttr.coneOuterGain,e._panner.distanceModel=e._pannerAttr.distanceModel,e._panner.maxDistance=e._pannerAttr.maxDistance,e._panner.panningModel=e._pannerAttr.panningModel,e._panner.refDistance=e._pannerAttr.refDistance,e._panner.rolloffFactor=e._pannerAttr.rolloffFactor,e._panner.setPosition(e._pos[0],e._pos[1],e._pos[2]),e._panner.setOrientation(e._orientation[0],e._orientation[1],e._orientation[2])):(e._panner=Howler.ctx.createStereoPanner(),e._panner.pan.value=e._stereo),e._panner.connect(e._node),e._paused||e._parent.pause(e._id,!0).play(e._id)}}();
/*!
 * EventEmitter v4.2.7 - git.io/ee
 * Oliver Caldwell
 * MIT license
 * @preserve
 */
(function(){"use strict";function a(){}function b(a,b){for(var c=a.length;c--;)if(a[c].listener===b)return c;return-1}function c(a){return function(){return this[a].apply(this,arguments)}}var d=a.prototype,e=this,f=e.EventEmitter;d.getListeners=function(a){var b,c,d=this._getEvents();if(a instanceof RegExp){b={};for(c in d)d.hasOwnProperty(c)&&a.test(c)&&(b[c]=d[c])}else b=d[a]||(d[a]=[]);return b},d.flattenListeners=function(a){var b,c=[];for(b=0;b<a.length;b+=1)c.push(a[b].listener);return c},d.getListenersAsObject=function(a){var b,c=this.getListeners(a);return c instanceof Array&&(b={},b[a]=c),b||c},d.addListener=function(a,c){var d,e=this.getListenersAsObject(a),f="object"==typeof c;for(d in e)e.hasOwnProperty(d)&&-1===b(e[d],c)&&e[d].push(f?c:{listener:c,once:!1});return this},d.on=c("addListener"),d.addOnceListener=function(a,b){return this.addListener(a,{listener:b,once:!0})},d.once=c("addOnceListener"),d.defineEvent=function(a){return this.getListeners(a),this},d.defineEvents=function(a){for(var b=0;b<a.length;b+=1)this.defineEvent(a[b]);return this},d.removeListener=function(a,c){var d,e,f=this.getListenersAsObject(a);for(e in f)f.hasOwnProperty(e)&&(d=b(f[e],c),-1!==d&&f[e].splice(d,1));return this},d.off=c("removeListener"),d.addListeners=function(a,b){return this.manipulateListeners(!1,a,b)},d.removeListeners=function(a,b){return this.manipulateListeners(!0,a,b)},d.manipulateListeners=function(a,b,c){var d,e,f=a?this.removeListener:this.addListener,g=a?this.removeListeners:this.addListeners;if("object"!=typeof b||b instanceof RegExp)for(d=c.length;d--;)f.call(this,b,c[d]);else for(d in b)b.hasOwnProperty(d)&&(e=b[d])&&("function"==typeof e?f.call(this,d,e):g.call(this,d,e));return this},d.removeEvent=function(a){var b,c=typeof a,d=this._getEvents();if("string"===c)delete d[a];else if(a instanceof RegExp)for(b in d)d.hasOwnProperty(b)&&a.test(b)&&delete d[b];else delete this._events;return this},d.removeAllListeners=c("removeEvent"),d.emitEvent=function(a,b){var c,d,e,f,g=this.getListenersAsObject(a);for(e in g)if(g.hasOwnProperty(e))for(d=g[e].length;d--;)c=g[e][d],c.once===!0&&this.removeListener(a,c.listener),f=c.listener.apply(this,b||[]),f===this._getOnceReturnValue()&&this.removeListener(a,c.listener);return this},d.trigger=c("emitEvent"),d.emit=function(a){var b=Array.prototype.slice.call(arguments,1);return this.emitEvent(a,b)},d.setOnceReturnValue=function(a){return this._onceReturnValue=a,this},d._getOnceReturnValue=function(){return this.hasOwnProperty("_onceReturnValue")?this._onceReturnValue:!0},d._getEvents=function(){return this._events||(this._events={})},a.noConflict=function(){return e.EventEmitter=f,a},"function"==typeof define&&define.amd?define(function(){return a}):"object"==typeof module&&module.exports?module.exports=a:this.EventEmitter=a}).call(this),/*!
 * FSToggoApi v1.0.3
 * Copyright Flying Sheep Studios - flying-sheep.com
 * @preserve
 */
function(){var a=function(b){this.gameId=b||"test",this.scoresToPull=null,this.toggoApi=null,this.toggoTracking=null;try{"undefined"!=typeof top.Highscore&&(this.toggoApi=new top.Highscore,this.toggoApi.addEventListener(top.Event.ERROR,function(b){if("string"==typeof b.object)for(var c=b.object.split("&"),d=0;d<c.length;d++)if(""!=c[d]){var e=c[d].split("=");if("written"==e[0]&&0==e[1])return void this.emitEvent(a.event.ERROR_BADWORD)}this.emitEvent(a.event.ERROR)}.bind(this)),this.toggoApi.addEventListener(top.Event.ADDED,function(){this.emitEvent(a.event.ADDED)}.bind(this)),this.toggoApi.addEventListener(top.Event.LOADED,function(b){this.emitEvent(a.event.LOADED,[this._parseResult(b.object)])}.bind(this)))}catch(c){}this.toggoTracking=null;try{"undefined"!=typeof top.AssistToggo&&(this.toggoTracking=top.AssistToggo)}catch(c){}};a.prototype=EventEmitter.prototype,a.sortOrder={ASC:"ASC",DESC:"DESC"},a.event={ADDED:"added",LOADED:"loaded",ERROR:"error",ERROR_BADWORD:"error_badword"},a._fieldTranslationFsToEoa={position:"platz",score:"punkte",nickName:"nickname"},a._fieldTranslationEoaToFs={platz:"position",punkte:"score",nickname:"nickName"},a.prototype.track=function(a){this.toggoTracking?this.toggoTracking.sendIVWTag(a,window.location):console.log("toggoTracking",a)},a.prototype.pushScore=function(b,c){this.toggoApi?this.toggoApi.addHighscoreTableData(this.gameId,b,c):(console.log("highscorePush",this.gameId,b,c),this.emitEvent(a.event.ADDED))},a.prototype.pullScores=function(b,c){b=b||10,c=c||a.sortOrder.DESC,this.scoresToPull=b,this.toggoApi?this.toggoApi.getHighscoreTableData(this.gameId,b,c):(console.log("highscorePull",this.gameId,b,c),this.emitEvent(a.event.LOADED,[this._parseResult([])]))},a.prototype._parseResult=function(b){var c=[];for(var d in b){var e=d.split("_"),f=e[0],g=e[1]-1,h=b[d];f==a._fieldTranslationFsToEoa.position&&(h=h.replace(".","")),g in c||(c[g]={}),c[g][a._fieldTranslationEoaToFs[f]]=h}if(c.sort(function(a,b){return a.position-b.position}),this.scoresToPull&&c.length<this.scoresToPull){var i=c.length>0?c[c.length-1].position:0;do i++,c.push({position:i,score:0,nickName:"Player"});while(c.length<this.scoresToPull)}return c},"FSToggoApi"in this||(this.FSToggoApi=a)}.call(this);
/*
 * Copyright (c) 2015 cannon.js Authors
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use, copy,
 * modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&false)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.CANNON=e()}}(function(){return function e(f,n,o){function d(t,l){if(!n[t]){if(!f[t]){var u="function"==typeof require&&require;if(!l&&u)return u(t,!0);if(i)return i(t,!0);throw new Error("Cannot find module '"+t+"'")}var p=n[t]={exports:{}};f[t][0].call(p.exports,function(e){var n=f[t][1][e];return d(n?n:e)},p,p.exports,e,f,n,o)}return n[t].exports}for(var i="function"==typeof require&&require,t=0;t<o.length;t++)d(o[t]);return d}({1:[function(e,f){f.exports={name:"cannon",version:"0.6.2",description:"A lightweight 3D physics engine written in JavaScript.",homepage:"https://github.com/schteppe/cannon.js",author:"Stefan Hedman <schteppe@gmail.com> (http://steffe.se)",keywords:["cannon.js","cannon","physics","engine","3d"],main:"./build/cannon.js",engines:{node:"*"},repository:{type:"git",url:"https://github.com/schteppe/cannon.js.git"},bugs:{url:"https://github.com/schteppe/cannon.js/issues"},licenses:[{type:"MIT"}],devDependencies:{jshint:"latest","uglify-js":"latest",nodeunit:"^0.9.0",grunt:"~0.4.0","grunt-contrib-jshint":"~0.1.1","grunt-contrib-nodeunit":"^0.4.1","grunt-contrib-concat":"~0.1.3","grunt-contrib-uglify":"^0.5.1","grunt-browserify":"^2.1.4","grunt-contrib-yuidoc":"^0.5.2",browserify:"*"},dependencies:{}}},{}],2:[function(e,f){f.exports={version:e("../package.json").version,AABB:e("./collision/AABB"),ArrayCollisionMatrix:e("./collision/ArrayCollisionMatrix"),Body:e("./objects/Body"),Box:e("./shapes/Box"),Broadphase:e("./collision/Broadphase"),Constraint:e("./constraints/Constraint"),ContactEquation:e("./equations/ContactEquation"),Narrowphase:e("./world/Narrowphase"),ConeTwistConstraint:e("./constraints/ConeTwistConstraint"),ContactMaterial:e("./material/ContactMaterial"),ConvexPolyhedron:e("./shapes/ConvexPolyhedron"),Cylinder:e("./shapes/Cylinder"),DistanceConstraint:e("./constraints/DistanceConstraint"),Equation:e("./equations/Equation"),EventTarget:e("./utils/EventTarget"),FrictionEquation:e("./equations/FrictionEquation"),GSSolver:e("./solver/GSSolver"),GridBroadphase:e("./collision/GridBroadphase"),Heightfield:e("./shapes/Heightfield"),HingeConstraint:e("./constraints/HingeConstraint"),LockConstraint:e("./constraints/LockConstraint"),Mat3:e("./math/Mat3"),Material:e("./material/Material"),NaiveBroadphase:e("./collision/NaiveBroadphase"),ObjectCollisionMatrix:e("./collision/ObjectCollisionMatrix"),Pool:e("./utils/Pool"),Particle:e("./shapes/Particle"),Plane:e("./shapes/Plane"),PointToPointConstraint:e("./constraints/PointToPointConstraint"),Quaternion:e("./math/Quaternion"),Ray:e("./collision/Ray"),RaycastVehicle:e("./objects/RaycastVehicle"),RaycastResult:e("./collision/RaycastResult"),RigidVehicle:e("./objects/RigidVehicle"),RotationalEquation:e("./equations/RotationalEquation"),RotationalMotorEquation:e("./equations/RotationalMotorEquation"),SAPBroadphase:e("./collision/SAPBroadphase"),SPHSystem:e("./objects/SPHSystem"),Shape:e("./shapes/Shape"),Solver:e("./solver/Solver"),Sphere:e("./shapes/Sphere"),SplitSolver:e("./solver/SplitSolver"),Spring:e("./objects/Spring"),Trimesh:e("./shapes/Trimesh"),Vec3:e("./math/Vec3"),Vec3Pool:e("./utils/Vec3Pool"),World:e("./world/World")}},{"../package.json":1,"./collision/AABB":3,"./collision/ArrayCollisionMatrix":4,"./collision/Broadphase":5,"./collision/GridBroadphase":6,"./collision/NaiveBroadphase":7,"./collision/ObjectCollisionMatrix":8,"./collision/Ray":9,"./collision/RaycastResult":10,"./collision/SAPBroadphase":11,"./constraints/ConeTwistConstraint":12,"./constraints/Constraint":13,"./constraints/DistanceConstraint":14,"./constraints/HingeConstraint":15,"./constraints/LockConstraint":16,"./constraints/PointToPointConstraint":17,"./equations/ContactEquation":19,"./equations/Equation":20,"./equations/FrictionEquation":21,"./equations/RotationalEquation":22,"./equations/RotationalMotorEquation":23,"./material/ContactMaterial":24,"./material/Material":25,"./math/Mat3":27,"./math/Quaternion":28,"./math/Vec3":30,"./objects/Body":31,"./objects/RaycastVehicle":32,"./objects/RigidVehicle":33,"./objects/SPHSystem":34,"./objects/Spring":35,"./shapes/Box":37,"./shapes/ConvexPolyhedron":38,"./shapes/Cylinder":39,"./shapes/Heightfield":40,"./shapes/Particle":41,"./shapes/Plane":42,"./shapes/Shape":43,"./shapes/Sphere":44,"./shapes/Trimesh":45,"./solver/GSSolver":46,"./solver/Solver":47,"./solver/SplitSolver":48,"./utils/EventTarget":49,"./utils/Pool":51,"./utils/Vec3Pool":54,"./world/Narrowphase":55,"./world/World":56}],3:[function(e,f){function n(e){e=e||{},this.lowerBound=new o,e.lowerBound&&this.lowerBound.copy(e.lowerBound),this.upperBound=new o,e.upperBound&&this.upperBound.copy(e.upperBound)}{var o=e("../math/Vec3");e("../utils/Utils")}f.exports=n;var d=new o;n.prototype.setFromPoints=function(e,f,n,o){var i=this.lowerBound,t=this.upperBound,l=n;i.copy(e[0]),l&&l.vmult(i,i),t.copy(i);for(var u=1;u<e.length;u++){var p=e[u];l&&(l.vmult(p,d),p=d),p.x>t.x&&(t.x=p.x),p.x<i.x&&(i.x=p.x),p.y>t.y&&(t.y=p.y),p.y<i.y&&(i.y=p.y),p.z>t.z&&(t.z=p.z),p.z<i.z&&(i.z=p.z)}return f&&(f.vadd(i,i),f.vadd(t,t)),o&&(i.x-=o,i.y-=o,i.z-=o,t.x+=o,t.y+=o,t.z+=o),this},n.prototype.copy=function(e){return this.lowerBound.copy(e.lowerBound),this.upperBound.copy(e.upperBound),this},n.prototype.clone=function(){return(new n).copy(this)},n.prototype.extend=function(e){var f=e.lowerBound.x;this.lowerBound.x>f&&(this.lowerBound.x=f);var n=e.upperBound.x;this.upperBound.x<n&&(this.upperBound.x=n);var f=e.lowerBound.y;this.lowerBound.y>f&&(this.lowerBound.y=f);var n=e.upperBound.y;this.upperBound.y<n&&(this.upperBound.y=n);var f=e.lowerBound.z;this.lowerBound.z>f&&(this.lowerBound.z=f);var n=e.upperBound.z;this.upperBound.z<n&&(this.upperBound.z=n)},n.prototype.overlaps=function(e){var f=this.lowerBound,n=this.upperBound,o=e.lowerBound,d=e.upperBound;return(o.x<=n.x&&n.x<=d.x||f.x<=d.x&&d.x<=n.x)&&(o.y<=n.y&&n.y<=d.y||f.y<=d.y&&d.y<=n.y)&&(o.z<=n.z&&n.z<=d.z||f.z<=d.z&&d.z<=n.z)},n.prototype.contains=function(e){var f=this.lowerBound,n=this.upperBound,o=e.lowerBound,d=e.upperBound;return f.x<=o.x&&n.x>=d.x&&f.y<=o.y&&n.y>=d.y&&f.z<=o.z&&n.z>=d.z},n.prototype.getCorners=function(e,f,n,o,d,i,t,l){var u=this.lowerBound,p=this.upperBound;e.copy(u),f.set(p.x,u.y,u.z),n.set(p.x,p.y,u.z),o.set(u.x,p.y,p.z),d.set(p.x,u.y,u.z),i.set(u.x,p.y,u.z),t.set(u.x,u.y,p.z),l.copy(p)};var i=[new o,new o,new o,new o,new o,new o,new o,new o];n.prototype.toLocalFrame=function(e,f){var n=i,o=n[0],d=n[1],t=n[2],l=n[3],u=n[4],p=n[5],s=n[6],y=n[7];this.getCorners(o,d,t,l,u,p,s,y);for(var c=0;8!==c;c++){var a=n[c];e.pointToLocal(a,a)}return f.setFromPoints(n)},n.prototype.toWorldFrame=function(e,f){var n=i,o=n[0],d=n[1],t=n[2],l=n[3],u=n[4],p=n[5],s=n[6],y=n[7];this.getCorners(o,d,t,l,u,p,s,y);for(var c=0;8!==c;c++){var a=n[c];e.pointToWorld(a,a)}return f.setFromPoints(n)}},{"../math/Vec3":30,"../utils/Utils":53}],4:[function(e,f){function n(){this.matrix=[]}f.exports=n,n.prototype.get=function(e,f){if(e=e.index,f=f.index,f>e){var n=f;f=e,e=n}return this.matrix[(e*(e+1)>>1)+f-1]},n.prototype.set=function(e,f,n){if(e=e.index,f=f.index,f>e){var o=f;f=e,e=o}this.matrix[(e*(e+1)>>1)+f-1]=n?1:0},n.prototype.reset=function(){for(var e=0,f=this.matrix.length;e!==f;e++)this.matrix[e]=0},n.prototype.setNumObjects=function(e){this.matrix.length=e*(e-1)>>1}},{}],5:[function(e,f){function n(){this.world=null,this.useBoundingBoxes=!1,this.dirty=!0}{var o=e("../objects/Body"),d=e("../math/Vec3"),i=e("../math/Quaternion");e("../shapes/Shape"),e("../shapes/Plane")}f.exports=n,n.prototype.collisionPairs=function(){throw new Error("collisionPairs not implemented for this BroadPhase class!")};var t=o.STATIC|o.KINEMATIC;n.prototype.needBroadphaseCollision=function(e,f){return 0===(e.collisionFilterGroup&f.collisionFilterMask)||0===(f.collisionFilterGroup&e.collisionFilterMask)?!1:0===(e.type&t)&&e.sleepState!==o.SLEEPING||0===(f.type&t)&&f.sleepState!==o.SLEEPING?!0:!1},n.prototype.intersectionTest=function(e,f,n,o){this.useBoundingBoxes?this.doBoundingBoxBroadphase(e,f,n,o):this.doBoundingSphereBroadphase(e,f,n,o)};{var l=new d;new d,new i,new d}n.prototype.doBoundingSphereBroadphase=function(e,f,n,o){var d=l;f.position.vsub(e.position,d);var i=Math.pow(e.boundingRadius+f.boundingRadius,2),t=d.norm2();i>t&&(n.push(e),o.push(f))},n.prototype.doBoundingBoxBroadphase=function(e,f,n,o){e.aabbNeedsUpdate&&e.computeAABB(),f.aabbNeedsUpdate&&f.computeAABB(),e.aabb.overlaps(f.aabb)&&(n.push(e),o.push(f))};var u={keys:[]},p=[],s=[];n.prototype.makePairsUnique=function(e,f){for(var n=u,o=p,d=s,i=e.length,t=0;t!==i;t++)o[t]=e[t],d[t]=f[t];e.length=0,f.length=0;for(var t=0;t!==i;t++){var l=o[t].id,y=d[t].id,c=y>l?l+","+y:y+","+l;n[c]=t,n.keys.push(c)}for(var t=0;t!==n.keys.length;t++){var c=n.keys.pop(),a=n[c];e.push(o[a]),f.push(d[a]),delete n[c]}},n.prototype.setWorld=function(){};var y=new d;n.boundingSphereCheck=function(e,f){var n=y;return e.position.vsub(f.position,n),Math.pow(e.shape.boundingSphereRadius+f.shape.boundingSphereRadius,2)>n.norm2()},n.prototype.aabbQuery=function(){return console.warn(".aabbQuery is not implemented in this Broadphase subclass."),[]}},{"../math/Quaternion":28,"../math/Vec3":30,"../objects/Body":31,"../shapes/Plane":42,"../shapes/Shape":43}],6:[function(e,f){function n(e,f,n,i,t){o.apply(this),this.nx=n||10,this.ny=i||10,this.nz=t||10,this.aabbMin=e||new d(100,100,100),this.aabbMax=f||new d(-100,-100,-100);var l=this.nx*this.ny*this.nz;if(0>=l)throw"GridBroadphase: Each dimension's n must be >0";this.bins=[],this.binLengths=[],this.bins.length=l,this.binLengths.length=l;for(var u=0;l>u;u++)this.bins[u]=[],this.binLengths[u]=0}f.exports=n;var o=e("./Broadphase"),d=e("../math/Vec3"),i=e("../shapes/Shape");n.prototype=new o,n.prototype.constructor=n;{var t=new d;new d}n.prototype.collisionPairs=function(e,f,n){function o(e,f,n,o,d,i,t){var l=(e-g)*v|0,u=(f-x)*A|0,p=(n-j)*C|0,b=I((o-g)*v),m=I((d-x)*A),N=I((i-j)*C);0>l?l=0:l>=s&&(l=s-1),0>u?u=0:u>=y&&(u=y-1),0>p?p=0:p>=c&&(p=c-1),0>b?b=0:b>=s&&(b=s-1),0>m?m=0:m>=y&&(m=y-1),0>N?N=0:N>=c&&(N=c-1),l*=a,u*=r,p*=w,b*=a,m*=r,N*=w;for(var O=l;b>=O;O+=a)for(var h=u;m>=h;h+=r)for(var k=p;N>=k;k+=w){var q=O+h+k;E[q][F[q]++]=t}}for(var d=e.numObjects(),l=e.bodies,u=this.aabbMax,p=this.aabbMin,s=this.nx,y=this.ny,c=this.nz,a=y*c,r=c,w=1,b=u.x,m=u.y,N=u.z,g=p.x,x=p.y,j=p.z,v=s/(b-g),A=y/(m-x),C=c/(N-j),O=(b-g)/s,h=(m-x)/y,k=(N-j)/c,q=.5*Math.sqrt(O*O+h*h+k*k),z=i.types,B=z.SPHERE,D=z.PLANE,E=(z.BOX,z.COMPOUND,z.CONVEXPOLYHEDRON,this.bins),F=this.binLengths,G=this.bins.length,H=0;H!==G;H++)F[H]=0;for(var I=Math.ceil,p=Math.min,u=Math.max,H=0;H!==d;H++){var J=l[H],K=J.shape;switch(K.type){case B:var L=J.position.x,M=J.position.y,P=J.position.z,Q=K.radius;o(L-Q,M-Q,P-Q,L+Q,M+Q,P+Q,J);break;case D:K.worldNormalNeedsUpdate&&K.computeWorldNormal(J.quaternion);var R=K.worldNormal,S=g+.5*O-J.position.x,T=x+.5*h-J.position.y,U=j+.5*k-J.position.z,V=t;V.set(S,T,U);for(var W=0,X=0;W!==s;W++,X+=a,V.y=T,V.x+=O)for(var Y=0,Z=0;Y!==y;Y++,Z+=r,V.z=U,V.y+=h)for(var $=0,_=0;$!==c;$++,_+=w,V.z+=k)if(V.dot(R)<q){var ef=X+Z+_;E[ef][F[ef]++]=J}break;default:J.aabbNeedsUpdate&&J.computeAABB(),o(J.aabb.lowerBound.x,J.aabb.lowerBound.y,J.aabb.lowerBound.z,J.aabb.upperBound.x,J.aabb.upperBound.y,J.aabb.upperBound.z,J)}}for(var H=0;H!==G;H++){var ff=F[H];if(ff>1)for(var nf=E[H],W=0;W!==ff;W++)for(var J=nf[W],Y=0;Y!==W;Y++){var of=nf[Y];this.needBroadphaseCollision(J,of)&&this.intersectionTest(J,of,f,n)}}this.makePairsUnique(f,n)}},{"../math/Vec3":30,"../shapes/Shape":43,"./Broadphase":5}],7:[function(e,f){function n(){o.apply(this)}f.exports=n;var o=e("./Broadphase"),d=e("./AABB");n.prototype=new o,n.prototype.constructor=n,n.prototype.collisionPairs=function(e,f,n){var o,d,i,t,l=e.bodies,u=l.length;for(o=0;o!==u;o++)for(d=0;d!==o;d++)i=l[o],t=l[d],this.needBroadphaseCollision(i,t)&&this.intersectionTest(i,t,f,n)};new d;n.prototype.aabbQuery=function(e,f,n){n=n||[];for(var o=0;o<e.bodies.length;o++){var d=e.bodies[o];d.aabbNeedsUpdate&&d.computeAABB(),d.aabb.overlaps(f)&&n.push(d)}return n}},{"./AABB":3,"./Broadphase":5}],8:[function(e,f){function n(){this.matrix={}}f.exports=n,n.prototype.get=function(e,f){if(e=e.id,f=f.id,f>e){var n=f;f=e,e=n}return e+"-"+f in this.matrix},n.prototype.set=function(e,f,n){if(e=e.id,f=f.id,f>e){var o=f;f=e,e=o}n?this.matrix[e+"-"+f]=!0:delete this.matrix[e+"-"+f]},n.prototype.reset=function(){this.matrix={}},n.prototype.setNumObjects=function(){}},{}],9:[function(e,f){function n(e,f){this.from=e?e.clone():new i,this.to=f?f.clone():new i,this._direction=new i,this.precision=1e-4,this.checkCollisionResponse=!0,this.skipBackfaces=!1,this.collisionFilterMask=-1,this.collisionFilterGroup=-1,this.mode=n.ANY,this.result=new u,this.hasHit=!1,this.callback=function(){}}function o(e,f,n,o){o.vsub(f,G),n.vsub(f,a),e.vsub(f,r);var d,i,t=G.dot(G),l=G.dot(a),u=G.dot(r),p=a.dot(a),s=a.dot(r);return(d=p*u-l*s)>=0&&(i=t*s-l*u)>=0&&t*p-l*l>d+i}function d(e,f,n){n.vsub(e,G);var o=G.dot(f);f.mult(o,H),H.vadd(e,H);var d=n.distanceTo(H);return d}f.exports=n;var i=e("../math/Vec3"),t=e("../math/Quaternion"),l=e("../math/Transform"),u=(e("../shapes/ConvexPolyhedron"),e("../shapes/Box"),e("../collision/RaycastResult")),p=e("../shapes/Shape"),s=e("../collision/AABB");n.prototype.constructor=n,n.CLOSEST=1,n.ANY=2,n.ALL=4;var y=new s,c=[];n.prototype.intersectWorld=function(e,f){return this.mode=f.mode||n.ANY,this.result=f.result||new u,this.skipBackfaces=!!f.skipBackfaces,this.collisionFilterMask="undefined"!=typeof f.collisionFilterMask?f.collisionFilterMask:-1,this.collisionFilterGroup="undefined"!=typeof f.collisionFilterGroup?f.collisionFilterGroup:-1,f.from&&this.from.copy(f.from),f.to&&this.to.copy(f.to),this.callback=f.callback||function(){},this.hasHit=!1,this.result.reset(),this._updateDirection(),this.getAABB(y),c.length=0,e.broadphase.aabbQuery(e,y,c),this.intersectBodies(c),this.hasHit};var a=new i,r=new i;n.pointInTriangle=o;var w=new i,b=new t;n.prototype.intersectBody=function(e,f){f&&(this.result=f,this._updateDirection());var n=this.checkCollisionResponse;if((!n||e.collisionResponse)&&0!==(this.collisionFilterGroup&e.collisionFilterMask)&&0!==(e.collisionFilterGroup&this.collisionFilterMask))for(var o=w,d=b,i=0,t=e.shapes.length;t>i;i++){var l=e.shapes[i];if((!n||l.collisionResponse)&&(e.quaternion.mult(e.shapeOrientations[i],d),e.quaternion.vmult(e.shapeOffsets[i],o),o.vadd(e.position,o),this.intersectShape(l,d,o,e),this.result._shouldStop))break}},n.prototype.intersectBodies=function(e,f){f&&(this.result=f,this._updateDirection());for(var n=0,o=e.length;!this.result._shouldStop&&o>n;n++)this.intersectBody(e[n])},n.prototype._updateDirection=function(){this.to.vsub(this.from,this._direction),this._direction.normalize()},n.prototype.intersectShape=function(e,f,n,o){var i=this.from,t=d(i,this._direction,n);if(!(t>e.boundingSphereRadius)){var l=this[e.type];l&&l.call(this,e,f,n,o)}};{var m=(new i,new i,new i),N=new i,g=new i,x=new i;new i,new u}n.prototype.intersectBox=function(e,f,n,o){return this.intersectConvex(e.convexPolyhedronRepresentation,f,n,o)},n.prototype[p.types.BOX]=n.prototype.intersectBox,n.prototype.intersectPlane=function(e,f,n,o){var d=this.from,t=this.to,l=this._direction,u=new i(0,0,1);f.vmult(u,u);var p=new i;d.vsub(n,p);var s=p.dot(u);t.vsub(n,p);var y=p.dot(u);if(!(s*y>0||d.distanceTo(t)<s)){var c=u.dot(l);if(!(Math.abs(c)<this.precision)){var a=new i,r=new i,w=new i;d.vsub(n,a);var b=-u.dot(a)/c;l.scale(b,r),d.vadd(r,w),this.reportIntersection(u,w,e,o,-1)}}},n.prototype[p.types.PLANE]=n.prototype.intersectPlane,n.prototype.getAABB=function(e){var f=this.to,n=this.from;e.lowerBound.x=Math.min(f.x,n.x),e.lowerBound.y=Math.min(f.y,n.y),e.lowerBound.z=Math.min(f.z,n.z),e.upperBound.x=Math.max(f.x,n.x),e.upperBound.y=Math.max(f.y,n.y),e.upperBound.z=Math.max(f.z,n.z)};var j={faceList:[0]};n.prototype.intersectHeightfield=function(e,f,o,d){var t=(e.data,e.elementSize,new i),u=new n(this.from,this.to);l.pointToLocalFrame(o,f,u.from,u.from),l.pointToLocalFrame(o,f,u.to,u.to);var p=[],s=null,y=null,c=null,a=null,r=e.getIndexOfPosition(u.from.x,u.from.y,p,!1);if(r&&(s=p[0],y=p[1],c=p[0],a=p[1]),r=e.getIndexOfPosition(u.to.x,u.to.y,p,!1),r&&((null===s||p[0]<s)&&(s=p[0]),(null===c||p[0]>c)&&(c=p[0]),(null===y||p[1]<y)&&(y=p[1]),(null===a||p[1]>a)&&(a=p[1])),null!==s){var w=[];e.getRectMinMax(s,y,c,a,w);for(var b=(w[0],w[1],s);c>=b;b++)for(var m=y;a>=m;m++){if(this.result._shouldStop)return;if(e.getConvexTrianglePillar(b,m,!1),l.pointToWorldFrame(o,f,e.pillarOffset,t),this.intersectConvex(e.pillarConvex,f,t,d,j),this.result._shouldStop)return;e.getConvexTrianglePillar(b,m,!0),l.pointToWorldFrame(o,f,e.pillarOffset,t),this.intersectConvex(e.pillarConvex,f,t,d,j)}}},n.prototype[p.types.HEIGHTFIELD]=n.prototype.intersectHeightfield;var v=new i,A=new i;n.prototype.intersectSphere=function(e,f,n,o){var d=this.from,i=this.to,t=e.radius,l=Math.pow(i.x-d.x,2)+Math.pow(i.y-d.y,2)+Math.pow(i.z-d.z,2),u=2*((i.x-d.x)*(d.x-n.x)+(i.y-d.y)*(d.y-n.y)+(i.z-d.z)*(d.z-n.z)),p=Math.pow(d.x-n.x,2)+Math.pow(d.y-n.y,2)+Math.pow(d.z-n.z,2)-Math.pow(t,2),s=Math.pow(u,2)-4*l*p,y=v,c=A;if(!(0>s))if(0===s)d.lerp(i,s,y),y.vsub(n,c),c.normalize(),this.reportIntersection(c,y,e,o,-1);else{var a=(-u-Math.sqrt(s))/(2*l),r=(-u+Math.sqrt(s))/(2*l);if(a>=0&&1>=a&&(d.lerp(i,a,y),y.vsub(n,c),c.normalize(),this.reportIntersection(c,y,e,o,-1)),this.result._shouldStop)return;r>=0&&1>=r&&(d.lerp(i,r,y),y.vsub(n,c),c.normalize(),this.reportIntersection(c,y,e,o,-1))}},n.prototype[p.types.SPHERE]=n.prototype.intersectSphere;var C=new i,O=(new i,new i,new i);n.prototype.intersectConvex=function(e,f,n,d,i){for(var t=C,l=O,u=i&&i.faceList||null,p=e.faces,s=e.vertices,y=e.faceNormals,c=this._direction,a=this.from,r=this.to,w=a.distanceTo(r),b=u?u.length:p.length,j=this.result,v=0;!j._shouldStop&&b>v;v++){var A=u?u[v]:v,h=p[A],k=y[A],q=f,z=n;l.copy(s[h[0]]),q.vmult(l,l),l.vadd(z,l),l.vsub(a,l),q.vmult(k,t);var B=c.dot(t);if(!(Math.abs(B)<this.precision)){var D=t.dot(l)/B;if(!(0>D)){c.mult(D,m),m.vadd(a,m),N.copy(s[h[0]]),q.vmult(N,N),z.vadd(N,N);for(var E=1;!j._shouldStop&&E<h.length-1;E++){g.copy(s[h[E]]),x.copy(s[h[E+1]]),q.vmult(g,g),q.vmult(x,x),z.vadd(g,g),z.vadd(x,x);var F=m.distanceTo(a);!o(m,N,g,x)&&!o(m,g,N,x)||F>w||this.reportIntersection(t,m,e,d,A)}}}}},n.prototype[p.types.CONVEXPOLYHEDRON]=n.prototype.intersectConvex;var h=new i,k=new i,q=new i,z=new i,B=new i,D=new i,E=(new s,[]),F=new l;n.prototype.intersectTrimesh=function(e,f,n,d,i){var t=h,u=E,p=F,s=O,y=k,c=q,a=z,r=D,w=B,b=(i&&i.faceList||null,e.indices),j=(e.vertices,e.faceNormals,this.from),v=this.to,A=this._direction;p.position.copy(n),p.quaternion.copy(f),l.vectorToLocalFrame(n,f,A,y),l.pointToLocalFrame(n,f,j,c),l.pointToLocalFrame(n,f,v,a);var C=c.distanceSquared(a);e.tree.rayQuery(this,p,u);for(var G=0,H=u.length;!this.result._shouldStop&&G!==H;G++){var I=u[G];e.getNormal(I,t),e.getVertex(b[3*I],N),N.vsub(c,s);var J=y.dot(t),K=t.dot(s)/J;if(!(0>K)){y.scale(K,m),m.vadd(c,m),e.getVertex(b[3*I+1],g),e.getVertex(b[3*I+2],x);var L=m.distanceSquared(c);!o(m,g,N,x)&&!o(m,N,g,x)||L>C||(l.vectorToWorldFrame(f,t,w),l.pointToWorldFrame(n,f,m,r),this.reportIntersection(w,r,e,d,I))}}u.length=0},n.prototype[p.types.TRIMESH]=n.prototype.intersectTrimesh,n.prototype.reportIntersection=function(e,f,o,d,i){var t=this.from,l=this.to,u=t.distanceTo(f),p=this.result;if(!(this.skipBackfaces&&e.dot(this._direction)>0))switch(p.hitFaceIndex="undefined"!=typeof i?i:-1,this.mode){case n.ALL:this.hasHit=!0,p.set(t,l,e,f,o,d,u),p.hasHit=!0,this.callback(p);break;case n.CLOSEST:(u<p.distance||!p.hasHit)&&(this.hasHit=!0,p.hasHit=!0,p.set(t,l,e,f,o,d,u));break;case n.ANY:this.hasHit=!0,p.hasHit=!0,p.set(t,l,e,f,o,d,u),p._shouldStop=!0}};var G=new i,H=new i},{"../collision/AABB":3,"../collision/RaycastResult":10,"../math/Quaternion":28,"../math/Transform":29,"../math/Vec3":30,"../shapes/Box":37,"../shapes/ConvexPolyhedron":38,"../shapes/Shape":43}],10:[function(e,f){function n(){this.rayFromWorld=new o,this.rayToWorld=new o,this.hitNormalWorld=new o,this.hitPointWorld=new o,this.hasHit=!1,this.shape=null,this.body=null,this.hitFaceIndex=-1,this.distance=-1,this._shouldStop=!1}var o=e("../math/Vec3");f.exports=n,n.prototype.reset=function(){this.rayFromWorld.setZero(),this.rayToWorld.setZero(),this.hitNormalWorld.setZero(),this.hitPointWorld.setZero(),this.hasHit=!1,this.shape=null,this.body=null,this.hitFaceIndex=-1,this.distance=-1,this._shouldStop=!1},n.prototype.abort=function(){this._shouldStop=!0},n.prototype.set=function(e,f,n,o,d,i,t){this.rayFromWorld.copy(e),this.rayToWorld.copy(f),this.hitNormalWorld.copy(n),this.hitPointWorld.copy(o),this.shape=d,this.body=i,this.distance=t}},{"../math/Vec3":30}],11:[function(e,f){function n(e){o.apply(this),this.axisList=[],this.world=null,this.axisIndex=0;var f=this.axisList;this._addBodyHandler=function(e){f.push(e.body)},this._removeBodyHandler=function(e){var n=f.indexOf(e.body);-1!==n&&f.splice(n,1)},e&&this.setWorld(e)}var o=(e("../shapes/Shape"),e("../collision/Broadphase"));f.exports=n,n.prototype=new o,n.prototype.setWorld=function(e){this.axisList.length=0;for(var f=0;f<e.bodies.length;f++)this.axisList.push(e.bodies[f]);e.removeEventListener("addBody",this._addBodyHandler),e.removeEventListener("removeBody",this._removeBodyHandler),e.addEventListener("addBody",this._addBodyHandler),e.addEventListener("removeBody",this._removeBodyHandler),this.world=e,this.dirty=!0},n.insertionSortX=function(e){for(var f=1,n=e.length;n>f;f++){for(var o=e[f],d=f-1;d>=0&&!(e[d].aabb.lowerBound.x<=o.aabb.lowerBound.x);d--)e[d+1]=e[d];e[d+1]=o}return e},n.insertionSortY=function(e){for(var f=1,n=e.length;n>f;f++){for(var o=e[f],d=f-1;d>=0&&!(e[d].aabb.lowerBound.y<=o.aabb.lowerBound.y);d--)e[d+1]=e[d];e[d+1]=o}return e},n.insertionSortZ=function(e){for(var f=1,n=e.length;n>f;f++){for(var o=e[f],d=f-1;d>=0&&!(e[d].aabb.lowerBound.z<=o.aabb.lowerBound.z);d--)e[d+1]=e[d];e[d+1]=o}return e},n.prototype.collisionPairs=function(e,f,o){var d,i,t=this.axisList,l=t.length,u=this.axisIndex;for(this.dirty&&(this.sortList(),this.dirty=!1),d=0;d!==l;d++){var p=t[d];for(i=d+1;l>i;i++){var s=t[i];if(this.needBroadphaseCollision(p,s)){if(!n.checkBounds(p,s,u))break;this.intersectionTest(p,s,f,o)}}}},n.prototype.sortList=function(){for(var e=this.axisList,f=this.axisIndex,o=e.length,d=0;d!==o;d++){var i=e[d];i.aabbNeedsUpdate&&i.computeAABB()}0===f?n.insertionSortX(e):1===f?n.insertionSortY(e):2===f&&n.insertionSortZ(e)},n.checkBounds=function(e,f,n){var o,d;0===n?(o=e.position.x,d=f.position.x):1===n?(o=e.position.y,d=f.position.y):2===n&&(o=e.position.z,d=f.position.z);var i=e.boundingRadius,t=f.boundingRadius,l=o+i,u=d-t;return l>u},n.prototype.autoDetectAxis=function(){for(var e=0,f=0,n=0,o=0,d=0,i=0,t=this.axisList,l=t.length,u=1/l,p=0;p!==l;p++){var s=t[p],y=s.position.x;e+=y,f+=y*y;var c=s.position.y;n+=c,o+=c*c;var a=s.position.z;d+=a,i+=a*a}var r=f-e*e*u,w=o-n*n*u,b=i-d*d*u;this.axisIndex=r>w?r>b?0:2:w>b?1:2},n.prototype.aabbQuery=function(e,f,n){n=n||[],this.dirty&&(this.sortList(),this.dirty=!1);var o=this.axisIndex,d="x";1===o&&(d="y"),2===o&&(d="z");for(var i=this.axisList,t=(f.lowerBound[d],f.upperBound[d],0);t<i.length;t++){var l=i[t];l.aabbNeedsUpdate&&l.computeAABB(),l.aabb.overlaps(f)&&n.push(l)}return n}},{"../collision/Broadphase":5,"../shapes/Shape":43}],12:[function(e,f){function n(e,f,n){n=n||{};var l="undefined"!=typeof n.maxForce?n.maxForce:1e6,u=n.pivotA?n.pivotA.clone():new t,p=n.pivotB?n.pivotB.clone():new t;this.axisA=n.axisA?n.axisA.clone():new t,this.axisB=n.axisB?n.axisB.clone():new t,o.call(this,e,u,f,p,l),this.collideConnected=!!n.collideConnected,this.angle="undefined"!=typeof n.angle?n.angle:0;var s=this.coneEquation=new d(e,f,n),y=this.twistEquation=new i(e,f,n);this.twistAngle="undefined"!=typeof n.twistAngle?n.twistAngle:0,s.maxForce=0,s.minForce=-l,y.maxForce=0,y.minForce=-l,this.equations.push(s,y)}f.exports=n;var o=(e("./Constraint"),e("./PointToPointConstraint")),d=e("../equations/ConeEquation"),i=e("../equations/RotationalEquation"),t=(e("../equations/ContactEquation"),e("../math/Vec3"));n.prototype=new o,n.constructor=n;new t,new t;n.prototype.update=function(){var e=this.bodyA,f=this.bodyB,n=this.coneEquation,d=this.twistEquation;o.prototype.update.call(this),e.vectorToWorldFrame(this.axisA,n.axisA),f.vectorToWorldFrame(this.axisB,n.axisB),this.axisA.tangents(d.axisA,d.axisA),e.vectorToWorldFrame(d.axisA,d.axisA),this.axisB.tangents(d.axisB,d.axisB),f.vectorToWorldFrame(d.axisB,d.axisB),n.angle=this.angle,d.maxAngle=this.twistAngle}},{"../equations/ConeEquation":18,"../equations/ContactEquation":19,"../equations/RotationalEquation":22,"../math/Vec3":30,"./Constraint":13,"./PointToPointConstraint":17}],13:[function(e,f){function n(e,f,d){d=o.defaults(d,{collideConnected:!0,wakeUpBodies:!0}),this.equations=[],this.bodyA=e,this.bodyB=f,this.id=n.idCounter++,this.collideConnected=d.collideConnected,d.wakeUpBodies&&(e&&e.wakeUp(),f&&f.wakeUp())}f.exports=n;var o=e("../utils/Utils");n.prototype.update=function(){throw new Error("method update() not implmemented in this Constraint subclass!")},n.prototype.enable=function(){for(var e=this.equations,f=0;f<e.length;f++)e[f].enabled=!0},n.prototype.disable=function(){for(var e=this.equations,f=0;f<e.length;f++)e[f].enabled=!1},n.idCounter=0},{"../utils/Utils":53}],14:[function(e,f){function n(e,f,n,i){o.call(this,e,f),"undefined"==typeof n&&(n=e.position.distanceTo(f.position)),"undefined"==typeof i&&(i=1e6),this.distance=n;var t=this.distanceEquation=new d(e,f);this.equations.push(t),t.minForce=-i,t.maxForce=i}f.exports=n;var o=e("./Constraint"),d=e("../equations/ContactEquation");n.prototype=new o,n.prototype.update=function(){var e=this.bodyA,f=this.bodyB,n=this.distanceEquation,o=.5*this.distance,d=n.ni;f.position.vsub(e.position,d),d.normalize(),d.mult(o,n.ri),d.mult(-o,n.rj)}},{"../equations/ContactEquation":19,"./Constraint":13}],15:[function(e,f){function n(e,f,n){n=n||{};var l="undefined"!=typeof n.maxForce?n.maxForce:1e6,u=n.pivotA?n.pivotA.clone():new t,p=n.pivotB?n.pivotB.clone():new t;o.call(this,e,u,f,p,l);var s=this.axisA=n.axisA?n.axisA.clone():new t(1,0,0);s.normalize();var y=this.axisB=n.axisB?n.axisB.clone():new t(1,0,0);y.normalize();var c=this.rotationalEquation1=new d(e,f,n),a=this.rotationalEquation2=new d(e,f,n),r=this.motorEquation=new i(e,f,l);r.enabled=!1,this.equations.push(c,a,r)}f.exports=n;var o=(e("./Constraint"),e("./PointToPointConstraint")),d=e("../equations/RotationalEquation"),i=e("../equations/RotationalMotorEquation"),t=(e("../equations/ContactEquation"),e("../math/Vec3"));n.prototype=new o,n.constructor=n,n.prototype.enableMotor=function(){this.motorEquation.enabled=!0},n.prototype.disableMotor=function(){this.motorEquation.enabled=!1},n.prototype.setMotorSpeed=function(e){this.motorEquation.targetVelocity=e},n.prototype.setMotorMaxForce=function(e){this.motorEquation.maxForce=e,this.motorEquation.minForce=-e};var l=new t,u=new t;n.prototype.update=function(){var e=this.bodyA,f=this.bodyB,n=this.motorEquation,d=this.rotationalEquation1,i=this.rotationalEquation2,t=l,p=u,s=this.axisA,y=this.axisB;o.prototype.update.call(this),e.quaternion.vmult(s,t),f.quaternion.vmult(y,p),t.tangents(d.axisA,i.axisA),d.axisB.copy(p),i.axisB.copy(p),this.motorEquation.enabled&&(e.quaternion.vmult(this.axisA,n.axisA),f.quaternion.vmult(this.axisB,n.axisB))}},{"../equations/ContactEquation":19,"../equations/RotationalEquation":22,"../equations/RotationalMotorEquation":23,"../math/Vec3":30,"./Constraint":13,"./PointToPointConstraint":17}],16:[function(e,f){function n(e,f,n){n=n||{};var t="undefined"!=typeof n.maxForce?n.maxForce:1e6,l=new i,u=new i,p=new i;e.position.vadd(f.position,p),p.scale(.5,p),f.pointToLocalFrame(p,u),e.pointToLocalFrame(p,l),o.call(this,e,l,f,u,t);var s=this.rotationalEquation1=new d(e,f,n),y=this.rotationalEquation2=new d(e,f,n),c=this.rotationalEquation3=new d(e,f,n);this.equations.push(s,y,c)}f.exports=n;var o=(e("./Constraint"),e("./PointToPointConstraint")),d=e("../equations/RotationalEquation"),i=(e("../equations/RotationalMotorEquation"),e("../equations/ContactEquation"),e("../math/Vec3"));n.prototype=new o,n.constructor=n;new i,new i;n.prototype.update=function(){var e=this.bodyA,f=this.bodyB,n=(this.motorEquation,this.rotationalEquation1),d=this.rotationalEquation2,t=this.rotationalEquation3;o.prototype.update.call(this),e.vectorToWorldFrame(i.UNIT_X,n.axisA),f.vectorToWorldFrame(i.UNIT_Y,n.axisB),e.vectorToWorldFrame(i.UNIT_Y,d.axisA),f.vectorToWorldFrame(i.UNIT_Z,d.axisB),e.vectorToWorldFrame(i.UNIT_Z,t.axisA),f.vectorToWorldFrame(i.UNIT_X,t.axisB)}},{"../equations/ContactEquation":19,"../equations/RotationalEquation":22,"../equations/RotationalMotorEquation":23,"../math/Vec3":30,"./Constraint":13,"./PointToPointConstraint":17}],17:[function(e,f){function n(e,f,n,t,l){o.call(this,e,n),l="undefined"!=typeof l?l:1e6,this.pivotA=f?f.clone():new i,this.pivotB=t?t.clone():new i;var u=this.equationX=new d(e,n),p=this.equationY=new d(e,n),s=this.equationZ=new d(e,n);this.equations.push(u,p,s),u.minForce=p.minForce=s.minForce=-l,u.maxForce=p.maxForce=s.maxForce=l,u.ni.set(1,0,0),p.ni.set(0,1,0),s.ni.set(0,0,1)}f.exports=n;var o=e("./Constraint"),d=e("../equations/ContactEquation"),i=e("../math/Vec3");n.prototype=new o,n.prototype.update=function(){var e=this.bodyA,f=this.bodyB,n=this.equationX,o=this.equationY,d=this.equationZ;e.quaternion.vmult(this.pivotA,n.ri),f.quaternion.vmult(this.pivotB,n.rj),o.ri.copy(n.ri),o.rj.copy(n.rj),d.ri.copy(n.ri),d.rj.copy(n.rj)}},{"../equations/ContactEquation":19,"../math/Vec3":30,"./Constraint":13}],18:[function(e,f){function n(e,f,n){n=n||{};var i="undefined"!=typeof n.maxForce?n.maxForce:1e6;d.call(this,e,f,-i,i),this.axisA=n.axisA?n.axisA.clone():new o(1,0,0),this.axisB=n.axisB?n.axisB.clone():new o(0,1,0),this.angle="undefined"!=typeof n.angle?n.angle:0}f.exports=n;var o=e("../math/Vec3"),d=(e("../math/Mat3"),e("./Equation"));n.prototype=new d,n.prototype.constructor=n;var i=new o,t=new o;n.prototype.computeB=function(e){var f=this.a,n=this.b,o=this.axisA,d=this.axisB,l=i,u=t,p=this.jacobianElementA,s=this.jacobianElementB;o.cross(d,l),d.cross(o,u),p.rotational.copy(u),s.rotational.copy(l);var y=Math.cos(this.angle)-o.dot(d),c=this.computeGW(),a=this.computeGiMf(),r=-y*f-c*n-e*a;return r}},{"../math/Mat3":27,"../math/Vec3":30,"./Equation":20}],19:[function(e,f){function n(e,f,n){n="undefined"!=typeof n?n:1e6,o.call(this,e,f,0,n),this.restitution=0,this.ri=new d,this.rj=new d,this.ni=new d}f.exports=n;{var o=e("./Equation"),d=e("../math/Vec3");e("../math/Mat3")}n.prototype=new o,n.prototype.constructor=n;var i=new d,t=new d,l=new d;n.prototype.computeB=function(e){var f=this.a,n=this.b,o=this.bi,d=this.bj,u=this.ri,p=this.rj,s=i,y=t,c=o.velocity,a=o.angularVelocity,r=(o.force,o.torque,d.velocity),w=d.angularVelocity,b=(d.force,d.torque,l),m=this.jacobianElementA,N=this.jacobianElementB,g=this.ni;u.cross(g,s),p.cross(g,y),g.negate(m.spatial),s.negate(m.rotational),N.spatial.copy(g),N.rotational.copy(y),b.copy(d.position),b.vadd(p,b),b.vsub(o.position,b),b.vsub(u,b);var x=g.dot(b),j=this.restitution+1,v=j*r.dot(g)-j*c.dot(g)+w.dot(y)-a.dot(s),A=this.computeGiMf(),C=-x*f-v*n-e*A;return C};var u=new d,p=new d,s=new d,y=new d,c=new d;n.prototype.getImpactVelocityAlongNormal=function(){var e=u,f=p,n=s,o=y,d=c;return this.bi.position.vadd(this.ri,n),this.bj.position.vadd(this.rj,o),this.bi.getVelocityAtWorldPoint(n,e),this.bj.getVelocityAtWorldPoint(o,f),e.vsub(f,d),this.ni.dot(d)}},{"../math/Mat3":27,"../math/Vec3":30,"./Equation":20}],20:[function(e,f){function n(e,f,d,i){this.id=n.id++,this.minForce="undefined"==typeof d?-1e6:d,this.maxForce="undefined"==typeof i?1e6:i,this.bi=e,this.bj=f,this.a=0,this.b=0,this.eps=0,this.jacobianElementA=new o,this.jacobianElementB=new o,this.enabled=!0,this.setSpookParams(1e7,4,1/60)
}f.exports=n;var o=e("../math/JacobianElement"),d=e("../math/Vec3");n.prototype.constructor=n,n.id=0,n.prototype.setSpookParams=function(e,f,n){var o=f,d=e,i=n;this.a=4/(i*(1+4*o)),this.b=4*o/(1+4*o),this.eps=4/(i*i*d*(1+4*o))},n.prototype.computeB=function(e,f,n){var o=this.computeGW(),d=this.computeGq(),i=this.computeGiMf();return-d*e-o*f-i*n},n.prototype.computeGq=function(){var e=this.jacobianElementA,f=this.jacobianElementB,n=this.bi,o=this.bj,d=n.position,i=o.position;return e.spatial.dot(d)+f.spatial.dot(i)};var i=new d;n.prototype.computeGW=function(){var e=this.jacobianElementA,f=this.jacobianElementB,n=this.bi,o=this.bj,d=n.velocity,t=o.velocity,l=n.angularVelocity||i,u=o.angularVelocity||i;return e.multiplyVectors(d,l)+f.multiplyVectors(t,u)},n.prototype.computeGWlambda=function(){var e=this.jacobianElementA,f=this.jacobianElementB,n=this.bi,o=this.bj,d=n.vlambda,t=o.vlambda,l=n.wlambda||i,u=o.wlambda||i;return e.multiplyVectors(d,l)+f.multiplyVectors(t,u)};var t=new d,l=new d,u=new d,p=new d;n.prototype.computeGiMf=function(){var e=this.jacobianElementA,f=this.jacobianElementB,n=this.bi,o=this.bj,d=n.force,i=n.torque,s=o.force,y=o.torque,c=n.invMassSolve,a=o.invMassSolve;return n.invInertiaWorldSolve?n.invInertiaWorldSolve.vmult(i,u):u.set(0,0,0),o.invInertiaWorldSolve?o.invInertiaWorldSolve.vmult(y,p):p.set(0,0,0),d.mult(c,t),s.mult(a,l),e.multiplyVectors(t,u)+f.multiplyVectors(l,p)};var s=new d;n.prototype.computeGiMGt=function(){var e=this.jacobianElementA,f=this.jacobianElementB,n=this.bi,o=this.bj,d=n.invMassSolve,i=o.invMassSolve,t=n.invInertiaWorldSolve,l=o.invInertiaWorldSolve,u=d+i;return t&&(t.vmult(e.rotational,s),u+=s.dot(e.rotational)),l&&(l.vmult(f.rotational,s),u+=s.dot(f.rotational)),u};{var y=new d;new d,new d,new d,new d,new d}n.prototype.addToWlambda=function(e){var f=this.jacobianElementA,n=this.jacobianElementB,o=this.bi,d=this.bj,i=y;f.spatial.mult(o.invMassSolve*e,i),o.vlambda.vadd(i,o.vlambda),n.spatial.mult(d.invMassSolve*e,i),d.vlambda.vadd(i,d.vlambda),o.invInertiaWorldSolve&&(o.invInertiaWorldSolve.vmult(f.rotational,i),i.mult(e,i),o.wlambda.vadd(i,o.wlambda)),d.invInertiaWorldSolve&&(d.invInertiaWorldSolve.vmult(n.rotational,i),i.mult(e,i),d.wlambda.vadd(i,d.wlambda))},n.prototype.computeC=function(){return this.computeGiMGt()+this.eps}},{"../math/JacobianElement":26,"../math/Vec3":30}],21:[function(e,f){function n(e,f,n){o.call(this,e,f,-n,n),this.ri=new d,this.rj=new d,this.t=new d}f.exports=n;{var o=e("./Equation"),d=e("../math/Vec3");e("../math/Mat3")}n.prototype=new o,n.prototype.constructor=n;var i=new d,t=new d;n.prototype.computeB=function(e){var f=(this.a,this.b),n=(this.bi,this.bj,this.ri),o=this.rj,d=i,l=t,u=this.t;n.cross(u,d),o.cross(u,l);var p=this.jacobianElementA,s=this.jacobianElementB;u.negate(p.spatial),d.negate(p.rotational),s.spatial.copy(u),s.rotational.copy(l);var y=this.computeGW(),c=this.computeGiMf(),a=-y*f-e*c;return a}},{"../math/Mat3":27,"../math/Vec3":30,"./Equation":20}],22:[function(e,f){function n(e,f,n){n=n||{};var i="undefined"!=typeof n.maxForce?n.maxForce:1e6;d.call(this,e,f,-i,i),this.axisA=n.axisA?n.axisA.clone():new o(1,0,0),this.axisB=n.axisB?n.axisB.clone():new o(0,1,0),this.maxAngle=Math.PI/2}f.exports=n;var o=e("../math/Vec3"),d=(e("../math/Mat3"),e("./Equation"));n.prototype=new d,n.prototype.constructor=n;var i=new o,t=new o;n.prototype.computeB=function(e){var f=this.a,n=this.b,o=this.axisA,d=this.axisB,l=i,u=t,p=this.jacobianElementA,s=this.jacobianElementB;o.cross(d,l),d.cross(o,u),p.rotational.copy(u),s.rotational.copy(l);var y=Math.cos(this.maxAngle)-o.dot(d),c=this.computeGW(),a=this.computeGiMf(),r=-y*f-c*n-e*a;return r}},{"../math/Mat3":27,"../math/Vec3":30,"./Equation":20}],23:[function(e,f){function n(e,f,n){n="undefined"!=typeof n?n:1e6,d.call(this,e,f,-n,n),this.axisA=new o,this.axisB=new o,this.targetVelocity=0}f.exports=n;var o=e("../math/Vec3"),d=(e("../math/Mat3"),e("./Equation"));n.prototype=new d,n.prototype.constructor=n,n.prototype.computeB=function(e){var f=(this.a,this.b),n=(this.bi,this.bj,this.axisA),o=this.axisB,d=this.jacobianElementA,i=this.jacobianElementB;d.rotational.copy(n),o.negate(i.rotational);var t=this.computeGW()-this.targetVelocity,l=this.computeGiMf(),u=-t*f-e*l;return u}},{"../math/Mat3":27,"../math/Vec3":30,"./Equation":20}],24:[function(e,f){function n(e,f,d){d=o.defaults(d,{friction:.3,restitution:.3,contactEquationStiffness:1e7,contactEquationRelaxation:3,frictionEquationStiffness:1e7,frictionEquationRelaxation:3}),this.id=n.idCounter++,this.materials=[e,f],this.friction=d.friction,this.restitution=d.restitution,this.contactEquationStiffness=d.contactEquationStiffness,this.contactEquationRelaxation=d.contactEquationRelaxation,this.frictionEquationStiffness=d.frictionEquationStiffness,this.frictionEquationRelaxation=d.frictionEquationRelaxation}var o=e("../utils/Utils");f.exports=n,n.idCounter=0},{"../utils/Utils":53}],25:[function(e,f){function n(e){var f="";e=e||{},"string"==typeof e?(f=e,e={}):"object"==typeof e&&(f=""),this.name=f,this.id=n.idCounter++,this.friction="undefined"!=typeof e.friction?e.friction:-1,this.restitution="undefined"!=typeof e.restitution?e.restitution:-1}f.exports=n,n.idCounter=0},{}],26:[function(e,f){function n(){this.spatial=new o,this.rotational=new o}f.exports=n;var o=e("./Vec3");n.prototype.multiplyElement=function(e){return e.spatial.dot(this.spatial)+e.rotational.dot(this.rotational)},n.prototype.multiplyVectors=function(e,f){return e.dot(this.spatial)+f.dot(this.rotational)}},{"./Vec3":30}],27:[function(e,f){function n(e){this.elements=e?e:[0,0,0,0,0,0,0,0,0]}f.exports=n;var o=e("./Vec3");n.prototype.identity=function(){var e=this.elements;e[0]=1,e[1]=0,e[2]=0,e[3]=0,e[4]=1,e[5]=0,e[6]=0,e[7]=0,e[8]=1},n.prototype.setZero=function(){var e=this.elements;e[0]=0,e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=0,e[6]=0,e[7]=0,e[8]=0},n.prototype.setTrace=function(e){var f=this.elements;f[0]=e.x,f[4]=e.y,f[8]=e.z},n.prototype.getTrace=function(e){var e=e||new o,f=this.elements;e.x=f[0],e.y=f[4],e.z=f[8]},n.prototype.vmult=function(e,f){f=f||new o;var n=this.elements,d=e.x,i=e.y,t=e.z;return f.x=n[0]*d+n[1]*i+n[2]*t,f.y=n[3]*d+n[4]*i+n[5]*t,f.z=n[6]*d+n[7]*i+n[8]*t,f},n.prototype.smult=function(e){for(var f=0;f<this.elements.length;f++)this.elements[f]*=e},n.prototype.mmult=function(e,f){for(var o=f||new n,d=0;3>d;d++)for(var i=0;3>i;i++){for(var t=0,l=0;3>l;l++)t+=e.elements[d+3*l]*this.elements[l+3*i];o.elements[d+3*i]=t}return o},n.prototype.scale=function(e,f){f=f||new n;for(var o=this.elements,d=f.elements,i=0;3!==i;i++)d[3*i+0]=e.x*o[3*i+0],d[3*i+1]=e.y*o[3*i+1],d[3*i+2]=e.z*o[3*i+2];return f},n.prototype.solve=function(e,f){f=f||new o;for(var n=3,d=4,i=[],t=0;n*d>t;t++)i.push(0);var t,l;for(t=0;3>t;t++)for(l=0;3>l;l++)i[t+d*l]=this.elements[t+3*l];i[3]=e.x,i[7]=e.y,i[11]=e.z;var u,p,s=3,y=s,c=4;do{if(t=y-s,0===i[t+d*t])for(l=t+1;y>l;l++)if(0!==i[t+d*l]){u=c;do p=c-u,i[p+d*t]+=i[p+d*l];while(--u);break}if(0!==i[t+d*t])for(l=t+1;y>l;l++){var a=i[t+d*l]/i[t+d*t];u=c;do p=c-u,i[p+d*l]=t>=p?0:i[p+d*l]-i[p+d*t]*a;while(--u)}}while(--s);if(f.z=i[2*d+3]/i[2*d+2],f.y=(i[1*d+3]-i[1*d+2]*f.z)/i[1*d+1],f.x=(i[0*d+3]-i[0*d+2]*f.z-i[0*d+1]*f.y)/i[0*d+0],isNaN(f.x)||isNaN(f.y)||isNaN(f.z)||1/0===f.x||1/0===f.y||1/0===f.z)throw"Could not solve equation! Got x=["+f.toString()+"], b=["+e.toString()+"], A=["+this.toString()+"]";return f},n.prototype.e=function(e,f,n){return void 0===n?this.elements[f+3*e]:void(this.elements[f+3*e]=n)},n.prototype.copy=function(e){for(var f=0;f<e.elements.length;f++)this.elements[f]=e.elements[f];return this},n.prototype.toString=function(){for(var e="",f=",",n=0;9>n;n++)e+=this.elements[n]+f;return e},n.prototype.reverse=function(e){e=e||new n;for(var f=3,o=6,d=[],i=0;f*o>i;i++)d.push(0);var i,t;for(i=0;3>i;i++)for(t=0;3>t;t++)d[i+o*t]=this.elements[i+3*t];d[3]=1,d[9]=0,d[15]=0,d[4]=0,d[10]=1,d[16]=0,d[5]=0,d[11]=0,d[17]=1;var l,u,p=3,s=p,y=o;do{if(i=s-p,0===d[i+o*i])for(t=i+1;s>t;t++)if(0!==d[i+o*t]){l=y;do u=y-l,d[u+o*i]+=d[u+o*t];while(--l);break}if(0!==d[i+o*i])for(t=i+1;s>t;t++){var c=d[i+o*t]/d[i+o*i];l=y;do u=y-l,d[u+o*t]=i>=u?0:d[u+o*t]-d[u+o*i]*c;while(--l)}}while(--p);i=2;do{t=i-1;do{var c=d[i+o*t]/d[i+o*i];l=o;do u=o-l,d[u+o*t]=d[u+o*t]-d[u+o*i]*c;while(--l)}while(t--)}while(--i);i=2;do{var c=1/d[i+o*i];l=o;do u=o-l,d[u+o*i]=d[u+o*i]*c;while(--l)}while(i--);i=2;do{t=2;do{if(u=d[f+t+o*i],isNaN(u)||1/0===u)throw"Could not reverse! A=["+this.toString()+"]";e.e(i,t,u)}while(t--)}while(i--);return e},n.prototype.setRotationFromQuaternion=function(e){var f=e.x,n=e.y,o=e.z,d=e.w,i=f+f,t=n+n,l=o+o,u=f*i,p=f*t,s=f*l,y=n*t,c=n*l,a=o*l,r=d*i,w=d*t,b=d*l,m=this.elements;return m[0]=1-(y+a),m[1]=p-b,m[2]=s+w,m[3]=p+b,m[4]=1-(u+a),m[5]=c-r,m[6]=s-w,m[7]=c+r,m[8]=1-(u+y),this},n.prototype.transpose=function(e){e=e||new n;for(var f=e.elements,o=this.elements,d=0;3!==d;d++)for(var i=0;3!==i;i++)f[3*d+i]=o[3*i+d];return e}},{"./Vec3":30}],28:[function(e,f){function n(e,f,n,o){this.x=void 0!==e?e:0,this.y=void 0!==f?f:0,this.z=void 0!==n?n:0,this.w=void 0!==o?o:1}f.exports=n;var o=e("./Vec3");n.prototype.set=function(e,f,n,o){this.x=e,this.y=f,this.z=n,this.w=o},n.prototype.toString=function(){return this.x+","+this.y+","+this.z+","+this.w},n.prototype.toArray=function(){return[this.x,this.y,this.z,this.w]},n.prototype.setFromAxisAngle=function(e,f){var n=Math.sin(.5*f);this.x=e.x*n,this.y=e.y*n,this.z=e.z*n,this.w=Math.cos(.5*f)},n.prototype.toAxisAngle=function(e){e=e||new o,this.normalize();var f=2*Math.acos(this.w),n=Math.sqrt(1-this.w*this.w);return.001>n?(e.x=this.x,e.y=this.y,e.z=this.z):(e.x=this.x/n,e.y=this.y/n,e.z=this.z/n),[e,f]};var d=new o,i=new o;n.prototype.setFromVectors=function(e,f){if(e.isAntiparallelTo(f)){var n=d,o=i;e.tangents(n,o),this.setFromAxisAngle(n,Math.PI)}else{var t=e.cross(f);this.x=t.x,this.y=t.y,this.z=t.z,this.w=Math.sqrt(Math.pow(e.norm(),2)*Math.pow(f.norm(),2))+e.dot(f),this.normalize()}};var t=new o,l=new o,u=new o;n.prototype.mult=function(e,f){f=f||new n;var o=this.w,d=t,i=l,p=u;return d.set(this.x,this.y,this.z),i.set(e.x,e.y,e.z),f.w=o*e.w-d.dot(i),d.cross(i,p),f.x=o*i.x+e.w*d.x+p.x,f.y=o*i.y+e.w*d.y+p.y,f.z=o*i.z+e.w*d.z+p.z,f},n.prototype.inverse=function(e){var f=this.x,o=this.y,d=this.z,i=this.w;e=e||new n,this.conjugate(e);var t=1/(f*f+o*o+d*d+i*i);return e.x*=t,e.y*=t,e.z*=t,e.w*=t,e},n.prototype.conjugate=function(e){return e=e||new n,e.x=-this.x,e.y=-this.y,e.z=-this.z,e.w=this.w,e},n.prototype.normalize=function(){var e=Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w);0===e?(this.x=0,this.y=0,this.z=0,this.w=0):(e=1/e,this.x*=e,this.y*=e,this.z*=e,this.w*=e)},n.prototype.normalizeFast=function(){var e=(3-(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w))/2;0===e?(this.x=0,this.y=0,this.z=0,this.w=0):(this.x*=e,this.y*=e,this.z*=e,this.w*=e)},n.prototype.vmult=function(e,f){f=f||new o;var n=e.x,d=e.y,i=e.z,t=this.x,l=this.y,u=this.z,p=this.w,s=p*n+l*i-u*d,y=p*d+u*n-t*i,c=p*i+t*d-l*n,a=-t*n-l*d-u*i;return f.x=s*p+a*-t+y*-u-c*-l,f.y=y*p+a*-l+c*-t-s*-u,f.z=c*p+a*-u+s*-l-y*-t,f},n.prototype.copy=function(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w,this},n.prototype.toEuler=function(e,f){f=f||"YZX";var n,o,d,i=this.x,t=this.y,l=this.z,u=this.w;switch(f){case"YZX":var p=i*t+l*u;if(p>.499&&(n=2*Math.atan2(i,u),o=Math.PI/2,d=0),-.499>p&&(n=-2*Math.atan2(i,u),o=-Math.PI/2,d=0),isNaN(n)){var s=i*i,y=t*t,c=l*l;n=Math.atan2(2*t*u-2*i*l,1-2*y-2*c),o=Math.asin(2*p),d=Math.atan2(2*i*u-2*t*l,1-2*s-2*c)}break;default:throw new Error("Euler order "+f+" not supported yet.")}e.y=n,e.z=o,e.x=d},n.prototype.setFromEuler=function(e,f,n,o){o=o||"XYZ";var d=Math.cos(e/2),i=Math.cos(f/2),t=Math.cos(n/2),l=Math.sin(e/2),u=Math.sin(f/2),p=Math.sin(n/2);return"XYZ"===o?(this.x=l*i*t+d*u*p,this.y=d*u*t-l*i*p,this.z=d*i*p+l*u*t,this.w=d*i*t-l*u*p):"YXZ"===o?(this.x=l*i*t+d*u*p,this.y=d*u*t-l*i*p,this.z=d*i*p-l*u*t,this.w=d*i*t+l*u*p):"ZXY"===o?(this.x=l*i*t-d*u*p,this.y=d*u*t+l*i*p,this.z=d*i*p+l*u*t,this.w=d*i*t-l*u*p):"ZYX"===o?(this.x=l*i*t-d*u*p,this.y=d*u*t+l*i*p,this.z=d*i*p-l*u*t,this.w=d*i*t+l*u*p):"YZX"===o?(this.x=l*i*t+d*u*p,this.y=d*u*t+l*i*p,this.z=d*i*p-l*u*t,this.w=d*i*t-l*u*p):"XZY"===o&&(this.x=l*i*t-d*u*p,this.y=d*u*t-l*i*p,this.z=d*i*p+l*u*t,this.w=d*i*t+l*u*p),this},n.prototype.clone=function(){return new n(this.x,this.y,this.z,this.w)}},{"./Vec3":30}],29:[function(e,f){function n(e){e=e||{},this.position=new o,e.position&&this.position.copy(e.position),this.quaternion=new d,e.quaternion&&this.quaternion.copy(e.quaternion)}var o=e("./Vec3"),d=e("./Quaternion");f.exports=n;var i=new d;n.pointToLocalFrame=function(e,f,n,d){var d=d||new o;return n.vsub(e,d),f.conjugate(i),i.vmult(d,d),d},n.prototype.pointToLocal=function(e,f){return n.pointToLocalFrame(this.position,this.quaternion,e,f)},n.pointToWorldFrame=function(e,f,n,d){var d=d||new o;return f.vmult(n,d),d.vadd(e,d),d},n.prototype.pointToWorld=function(e,f){return n.pointToWorldFrame(this.position,this.quaternion,e,f)},n.prototype.vectorToWorldFrame=function(e,f){var f=f||new o;return this.quaternion.vmult(e,f),f},n.vectorToWorldFrame=function(e,f,n){return e.vmult(f,n),n},n.vectorToLocalFrame=function(e,f,n,d){var d=d||new o;return f.w*=-1,f.vmult(n,d),f.w*=-1,d}},{"./Quaternion":28,"./Vec3":30}],30:[function(e,f){function n(e,f,n){this.x=e||0,this.y=f||0,this.z=n||0}f.exports=n;var o=e("./Mat3");n.ZERO=new n(0,0,0),n.UNIT_X=new n(1,0,0),n.UNIT_Y=new n(0,1,0),n.UNIT_Z=new n(0,0,1),n.prototype.cross=function(e,f){var o=e.x,d=e.y,i=e.z,t=this.x,l=this.y,u=this.z;return f=f||new n,f.x=l*i-u*d,f.y=u*o-t*i,f.z=t*d-l*o,f},n.prototype.set=function(e,f,n){return this.x=e,this.y=f,this.z=n,this},n.prototype.setZero=function(){this.x=this.y=this.z=0},n.prototype.vadd=function(e,f){return f?(f.x=e.x+this.x,f.y=e.y+this.y,f.z=e.z+this.z,void 0):new n(this.x+e.x,this.y+e.y,this.z+e.z)},n.prototype.vsub=function(e,f){return f?(f.x=this.x-e.x,f.y=this.y-e.y,f.z=this.z-e.z,void 0):new n(this.x-e.x,this.y-e.y,this.z-e.z)},n.prototype.crossmat=function(){return new o([0,-this.z,this.y,this.z,0,-this.x,-this.y,this.x,0])},n.prototype.normalize=function(){var e=this.x,f=this.y,n=this.z,o=Math.sqrt(e*e+f*f+n*n);if(o>0){var d=1/o;this.x*=d,this.y*=d,this.z*=d}else this.x=0,this.y=0,this.z=0;return o},n.prototype.unit=function(e){e=e||new n;var f=this.x,o=this.y,d=this.z,i=Math.sqrt(f*f+o*o+d*d);return i>0?(i=1/i,e.x=f*i,e.y=o*i,e.z=d*i):(e.x=1,e.y=0,e.z=0),e},n.prototype.norm=function(){var e=this.x,f=this.y,n=this.z;return Math.sqrt(e*e+f*f+n*n)},n.prototype.length=n.prototype.norm,n.prototype.norm2=function(){return this.dot(this)},n.prototype.lengthSquared=n.prototype.norm2,n.prototype.distanceTo=function(e){var f=this.x,n=this.y,o=this.z,d=e.x,i=e.y,t=e.z;return Math.sqrt((d-f)*(d-f)+(i-n)*(i-n)+(t-o)*(t-o))},n.prototype.distanceSquared=function(e){var f=this.x,n=this.y,o=this.z,d=e.x,i=e.y,t=e.z;return(d-f)*(d-f)+(i-n)*(i-n)+(t-o)*(t-o)},n.prototype.mult=function(e,f){f=f||new n;var o=this.x,d=this.y,i=this.z;return f.x=e*o,f.y=e*d,f.z=e*i,f},n.prototype.scale=n.prototype.mult,n.prototype.dot=function(e){return this.x*e.x+this.y*e.y+this.z*e.z},n.prototype.isZero=function(){return 0===this.x&&0===this.y&&0===this.z},n.prototype.negate=function(e){return e=e||new n,e.x=-this.x,e.y=-this.y,e.z=-this.z,e};var d=new n,i=new n;n.prototype.tangents=function(e,f){var n=this.norm();if(n>0){var o=d,t=1/n;o.set(this.x*t,this.y*t,this.z*t);var l=i;Math.abs(o.x)<.9?(l.set(1,0,0),o.cross(l,e)):(l.set(0,1,0),o.cross(l,e)),o.cross(e,f)}else e.set(1,0,0),f.set(0,1,0)},n.prototype.toString=function(){return this.x+","+this.y+","+this.z},n.prototype.toArray=function(){return[this.x,this.y,this.z]},n.prototype.copy=function(e){return this.x=e.x,this.y=e.y,this.z=e.z,this},n.prototype.lerp=function(e,f,n){var o=this.x,d=this.y,i=this.z;n.x=o+(e.x-o)*f,n.y=d+(e.y-d)*f,n.z=i+(e.z-i)*f},n.prototype.almostEquals=function(e,f){return void 0===f&&(f=1e-6),Math.abs(this.x-e.x)>f||Math.abs(this.y-e.y)>f||Math.abs(this.z-e.z)>f?!1:!0},n.prototype.almostZero=function(e){return void 0===e&&(e=1e-6),Math.abs(this.x)>e||Math.abs(this.y)>e||Math.abs(this.z)>e?!1:!0};var t=new n;n.prototype.isAntiparallelTo=function(e,f){return this.negate(t),t.almostEquals(e,f)},n.prototype.clone=function(){return new n(this.x,this.y,this.z)}},{"./Mat3":27}],31:[function(e,f){function n(e){e=e||{},o.apply(this),this.id=n.idCounter++,this.world=null,this.preStep=null,this.postStep=null,this.vlambda=new d,this.collisionFilterGroup="number"==typeof e.collisionFilterGroup?e.collisionFilterGroup:1,this.collisionFilterMask="number"==typeof e.collisionFilterMask?e.collisionFilterMask:1,this.collisionResponse=!0,this.position=new d,e.position&&this.position.copy(e.position),this.previousPosition=new d,this.initPosition=new d,this.velocity=new d,e.velocity&&this.velocity.copy(e.velocity),this.initVelocity=new d,this.force=new d;var f="number"==typeof e.mass?e.mass:0;this.mass=f,this.invMass=f>0?1/f:0,this.material=e.material||null,this.linearDamping="number"==typeof e.linearDamping?e.linearDamping:.01,this.type=0>=f?n.STATIC:n.DYNAMIC,typeof e.type==typeof n.STATIC&&(this.type=e.type),this.allowSleep="undefined"!=typeof e.allowSleep?e.allowSleep:!0,this.sleepState=0,this.sleepSpeedLimit="undefined"!=typeof e.sleepSpeedLimit?e.sleepSpeedLimit:.1,this.sleepTimeLimit="undefined"!=typeof e.sleepTimeLimit?e.sleepTimeLimit:1,this.timeLastSleepy=0,this._wakeUpAfterNarrowphase=!1,this.torque=new d,this.quaternion=new t,e.quaternion&&this.quaternion.copy(e.quaternion),this.initQuaternion=new t,this.angularVelocity=new d,e.angularVelocity&&this.angularVelocity.copy(e.angularVelocity),this.initAngularVelocity=new d,this.interpolatedPosition=new d,this.interpolatedQuaternion=new t,this.shapes=[],this.shapeOffsets=[],this.shapeOrientations=[],this.inertia=new d,this.invInertia=new d,this.invInertiaWorld=new i,this.invMassSolve=0,this.invInertiaSolve=new d,this.invInertiaWorldSolve=new i,this.fixedRotation="undefined"!=typeof e.fixedRotation?e.fixedRotation:!1,this.angularDamping="undefined"!=typeof e.angularDamping?e.angularDamping:.01,this.aabb=new l,this.aabbNeedsUpdate=!0,this.wlambda=new d,e.shape&&this.addShape(e.shape),this.updateMassProperties()}f.exports=n;var o=e("../utils/EventTarget"),d=(e("../shapes/Shape"),e("../math/Vec3")),i=e("../math/Mat3"),t=e("../math/Quaternion"),l=(e("../material/Material"),e("../collision/AABB")),u=e("../shapes/Box");n.prototype=new o,n.prototype.constructor=n,n.DYNAMIC=1,n.STATIC=2,n.KINEMATIC=4,n.AWAKE=0,n.SLEEPY=1,n.SLEEPING=2,n.idCounter=0,n.prototype.wakeUp=function(){var e=this.sleepState;this.sleepState=0,e===n.SLEEPING&&this.dispatchEvent({type:"wakeup"})},n.prototype.sleep=function(){this.sleepState=n.SLEEPING,this.velocity.set(0,0,0),this.angularVelocity.set(0,0,0)},n.sleepyEvent={type:"sleepy"},n.sleepEvent={type:"sleep"},n.prototype.sleepTick=function(e){if(this.allowSleep){var f=this.sleepState,o=this.velocity.norm2()+this.angularVelocity.norm2(),d=Math.pow(this.sleepSpeedLimit,2);f===n.AWAKE&&d>o?(this.sleepState=n.SLEEPY,this.timeLastSleepy=e,this.dispatchEvent(n.sleepyEvent)):f===n.SLEEPY&&o>d?this.wakeUp():f===n.SLEEPY&&e-this.timeLastSleepy>this.sleepTimeLimit&&(this.sleep(),this.dispatchEvent(n.sleepEvent))}},n.prototype.updateSolveMassProperties=function(){this.sleepState===n.SLEEPING||this.type===n.KINEMATIC?(this.invMassSolve=0,this.invInertiaSolve.setZero(),this.invInertiaWorldSolve.setZero()):(this.invMassSolve=this.invMass,this.invInertiaSolve.copy(this.invInertia),this.invInertiaWorldSolve.copy(this.invInertiaWorld))},n.prototype.pointToLocalFrame=function(e,f){var f=f||new d;return e.vsub(this.position,f),this.quaternion.conjugate().vmult(f,f),f},n.prototype.vectorToLocalFrame=function(e,f){var f=f||new d;return this.quaternion.conjugate().vmult(e,f),f},n.prototype.pointToWorldFrame=function(e,f){var f=f||new d;return this.quaternion.vmult(e,f),f.vadd(this.position,f),f},n.prototype.vectorToWorldFrame=function(e,f){var f=f||new d;return this.quaternion.vmult(e,f),f};var p=new d,s=new t;n.prototype.addShape=function(e,f,n){var o=new d,i=new t;return f&&o.copy(f),n&&i.copy(n),this.shapes.push(e),this.shapeOffsets.push(o),this.shapeOrientations.push(i),this.updateMassProperties(),this.updateBoundingRadius(),this.aabbNeedsUpdate=!0,this},n.prototype.updateBoundingRadius=function(){for(var e=this.shapes,f=this.shapeOffsets,n=e.length,o=0,d=0;d!==n;d++){var i=e[d];i.updateBoundingSphereRadius();var t=f[d].norm(),l=i.boundingSphereRadius;t+l>o&&(o=t+l)}this.boundingRadius=o};var y=new l;n.prototype.computeAABB=function(){for(var e=this.shapes,f=this.shapeOffsets,n=this.shapeOrientations,o=e.length,d=p,i=s,t=this.quaternion,l=this.aabb,u=y,c=0;c!==o;c++){var a=e[c];n[c].mult(t,i),i.vmult(f[c],d),d.vadd(this.position,d),a.calculateWorldAABB(d,i,u.lowerBound,u.upperBound),0===c?l.copy(u):l.extend(u)}this.aabbNeedsUpdate=!1};{var c=new i,a=new i;new i}n.prototype.updateInertiaWorld=function(e){var f=this.invInertia;if(f.x!==f.y||f.y!==f.z||e){var n=c,o=a;n.setRotationFromQuaternion(this.quaternion),n.transpose(o),n.scale(f,n),n.mmult(o,this.invInertiaWorld)}else;};var r=new d,w=new d;n.prototype.applyForce=function(e,f){if(this.type===n.DYNAMIC){var o=r;f.vsub(this.position,o);var d=w;o.cross(e,d),this.force.vadd(e,this.force),this.torque.vadd(d,this.torque)}};var b=new d,m=new d;n.prototype.applyLocalForce=function(e,f){if(this.type===n.DYNAMIC){var o=b,d=m;this.vectorToWorldFrame(e,o),this.pointToWorldFrame(f,d),this.applyForce(o,d)}};var N=new d,g=new d,x=new d;n.prototype.applyImpulse=function(e,f){if(this.type===n.DYNAMIC){var o=N;f.vsub(this.position,o);var d=g;d.copy(e),d.mult(this.invMass,d),this.velocity.vadd(d,this.velocity);var i=x;o.cross(e,i),this.invInertiaWorld.vmult(i,i),this.angularVelocity.vadd(i,this.angularVelocity)}};var j=new d,v=new d;n.prototype.applyLocalImpulse=function(e,f){if(this.type===n.DYNAMIC){var o=j,d=v;this.vectorToWorldFrame(e,o),this.pointToWorldFrame(f,d),this.applyImpulse(o,d)}};var A=new d;n.prototype.updateMassProperties=function(){var e=A;this.invMass=this.mass>0?1/this.mass:0;var f=this.inertia,n=this.fixedRotation;this.computeAABB(),e.set((this.aabb.upperBound.x-this.aabb.lowerBound.x)/2,(this.aabb.upperBound.y-this.aabb.lowerBound.y)/2,(this.aabb.upperBound.z-this.aabb.lowerBound.z)/2),u.calculateInertia(e,this.mass,f),this.invInertia.set(f.x>0&&!n?1/f.x:0,f.y>0&&!n?1/f.y:0,f.z>0&&!n?1/f.z:0),this.updateInertiaWorld(!0)},n.prototype.getVelocityAtWorldPoint=function(e,f){var n=new d;return e.vsub(this.position,n),this.angularVelocity.cross(n,f),this.velocity.vadd(f,f),f}},{"../collision/AABB":3,"../material/Material":25,"../math/Mat3":27,"../math/Quaternion":28,"../math/Vec3":30,"../shapes/Box":37,"../shapes/Shape":43,"../utils/EventTarget":49}],32:[function(e,f){function n(e){this.chassisBody=e.chassisBody,this.wheelInfos=[],this.sliding=!1,this.world=null,this.indexRightAxis="undefined"!=typeof e.indexRightAxis?e.indexRightAxis:1,this.indexForwardAxis="undefined"!=typeof e.indexForwardAxis?e.indexForwardAxis:0,this.indexUpAxis="undefined"!=typeof e.indexUpAxis?e.indexUpAxis:2}function o(e,f,n,o,i){var t=0,l=n,u=x,p=j,s=v;e.getVelocityAtWorldPoint(l,u),f.getVelocityAtWorldPoint(l,p),u.vsub(p,s);var y=o.dot(s),c=d(e,n,o),a=d(f,n,o),r=1,w=r/(c+a);return t=-y*w,t>i&&(t=i),-i>t&&(t=-i),t}function d(e,f,n){var o=A,d=C,i=O,t=h;return f.vsub(e.position,o),o.cross(n,d),e.invInertiaWorld.vmult(d,t),t.cross(o,i),e.invMass+n.dot(i)}function i(e,f,n,o,d,i){var t=d.norm2();if(t>1.1)return 0;var l=k,u=q,p=z;e.getVelocityAtWorldPoint(f,l),n.getVelocityAtWorldPoint(o,u),l.vsub(u,p);var s=d.dot(p),y=.2,c=1/(e.invMass+n.invMass),i=-y*s*c;return i}var t=(e("./Body"),e("../math/Vec3")),l=e("../math/Quaternion"),u=(e("../collision/RaycastResult"),e("../collision/Ray")),p=e("../objects/WheelInfo");f.exports=n;{var s=(new t,new t,new t,new t),y=new t,c=new t;new u}n.prototype.addWheel=function(e){e=e||{};var f=new p(e),n=this.wheelInfos.length;return this.wheelInfos.push(f),n},n.prototype.setSteeringValue=function(e,f){var n=this.wheelInfos[f];n.steering=e};new t;n.prototype.applyEngineForce=function(e,f){this.wheelInfos[f].engineForce=e},n.prototype.setBrake=function(e,f){this.wheelInfos[f].brake=e},n.prototype.addToWorld=function(e){this.constraints;e.add(this.chassisBody);var f=this;this.preStepCallback=function(){f.updateVehicle(e.dt)},e.addEventListener("preStep",this.preStepCallback),this.world=e},n.prototype.getVehicleAxisWorld=function(e,f){f.set(0===e?1:0,1===e?1:0,2===e?1:0),this.chassisBody.vectorToWorldFrame(f,f)},n.prototype.updateVehicle=function(e){for(var f=this.wheelInfos,n=f.length,o=this.chassisBody,d=0;n>d;d++)this.updateWheelTransform(d);this.currentVehicleSpeedKmHour=3.6*o.velocity.norm();var i=new t;this.getVehicleAxisWorld(this.indexForwardAxis,i),i.dot(o.velocity)<0&&(this.currentVehicleSpeedKmHour*=-1);for(var d=0;n>d;d++)this.castRay(f[d]);this.updateSuspension(e);for(var l=new t,u=new t,d=0;n>d;d++){var p=f[d],s=p.suspensionForce;s>p.maxSuspensionForce&&(s=p.maxSuspensionForce),p.raycastResult.hitNormalWorld.scale(s*e,l),p.raycastResult.hitPointWorld.vsub(o.position,u),o.applyImpulse(l,p.raycastResult.hitPointWorld)}this.updateFriction(e);var y=new t,c=new t,a=new t;for(d=0;n>d;d++){var p=f[d];o.getVelocityAtWorldPoint(p.chassisConnectionPointWorld,a);var r=1;switch(this.indexUpAxis){case 1:r=-1}if(p.isInContact){this.getVehicleAxisWorld(this.indexForwardAxis,c);var w=c.dot(p.raycastResult.hitNormalWorld);p.raycastResult.hitNormalWorld.scale(w,y),c.vsub(y,c);var b=c.dot(a);p.deltaRotation=r*b*e/p.radius}!p.sliding&&p.isInContact||0===p.engineForce||!p.useCustomSlidingRotationalSpeed||(p.deltaRotation=(p.engineForce>0?1:-1)*p.customSlidingRotationalSpeed*e),Math.abs(p.brake)>Math.abs(p.engineForce)&&(p.deltaRotation=0),p.rotation+=p.deltaRotation,p.deltaRotation*=.99}},n.prototype.updateSuspension=function(){for(var e=this.chassisBody,f=e.mass,n=this.wheelInfos,o=n.length,d=0;o>d;d++){var i=n[d];if(i.isInContact){var t,l=i.suspensionRestLength,u=i.suspensionLength,p=l-u;t=i.suspensionStiffness*p*i.clippedInvContactDotSuspension;var s,y=i.suspensionRelativeVelocity;s=0>y?i.dampingCompression:i.dampingRelaxation,t-=s*y,i.suspensionForce=t*f,i.suspensionForce<0&&(i.suspensionForce=0)}else i.suspensionForce=0}},n.prototype.removeFromWorld=function(e){this.constraints;e.remove(this.chassisBody),e.removeEventListener("preStep",this.preStepCallback),this.world=null};var a=new t,r=new t;n.prototype.castRay=function(e){var f=a,n=r;this.updateWheelTransformWorld(e);var o=this.chassisBody,d=-1,i=e.suspensionRestLength+e.radius;e.directionWorld.scale(i,f);var l=e.chassisConnectionPointWorld;l.vadd(f,n);var u=e.raycastResult;u.reset();var p=o.collisionResponse;o.collisionResponse=!1,this.world.rayTest(l,n,u),o.collisionResponse=p;var s=u.body;if(e.raycastResult.groundObject=0,s){d=u.distance,e.raycastResult.hitNormalWorld=u.hitNormalWorld,e.isInContact=!0;var y=u.distance;e.suspensionLength=y-e.radius;var c=e.suspensionRestLength-e.maxSuspensionTravel,w=e.suspensionRestLength+e.maxSuspensionTravel;e.suspensionLength<c&&(e.suspensionLength=c),e.suspensionLength>w&&(e.suspensionLength=w,e.raycastResult.reset());var b=e.raycastResult.hitNormalWorld.dot(e.directionWorld),m=new t;o.getVelocityAtWorldPoint(e.raycastResult.hitPointWorld,m);var N=e.raycastResult.hitNormalWorld.dot(m);if(b>=-.1)e.suspensionRelativeVelocity=0,e.clippedInvContactDotSuspension=10;else{var g=-1/b;e.suspensionRelativeVelocity=N*g,e.clippedInvContactDotSuspension=g}}else e.suspensionLength=e.suspensionRestLength+0*e.maxSuspensionTravel,e.suspensionRelativeVelocity=0,e.directionWorld.scale(-1,e.raycastResult.hitNormalWorld),e.clippedInvContactDotSuspension=1;return d},n.prototype.updateWheelTransformWorld=function(e){e.isInContact=!1;var f=this.chassisBody;f.pointToWorldFrame(e.chassisConnectionPointLocal,e.chassisConnectionPointWorld),f.vectorToWorldFrame(e.directionLocal,e.directionWorld),f.vectorToWorldFrame(e.axleLocal,e.axleWorld)},n.prototype.updateWheelTransform=function(e){var f=s,n=y,o=c,d=this.wheelInfos[e];this.updateWheelTransformWorld(d),d.directionLocal.scale(-1,f),n.copy(d.axleLocal),f.cross(n,o),o.normalize(),n.normalize();var i=d.steering,t=new l;t.setFromAxisAngle(f,i);var u=new l;u.setFromAxisAngle(n,d.rotation);var p=d.worldTransform.quaternion;this.chassisBody.quaternion.mult(t,p),p.mult(u,p),p.normalize();var a=d.worldTransform.position;a.copy(d.directionWorld),a.scale(d.suspensionLength,a),a.vadd(d.chassisConnectionPointWorld,a)};var w=[new t(1,0,0),new t(0,1,0),new t(0,0,1)];n.prototype.getWheelTransformWorld=function(e){return this.wheelInfos[e].worldTransform};var b=new t,m=[],N=[],g=1;n.prototype.updateFriction=function(e){for(var f=b,n=this.wheelInfos,d=n.length,l=this.chassisBody,u=N,p=m,s=0,y=0;d>y;y++){var c=n[y],a=c.raycastResult.body;a&&s++,c.sideImpulse=0,c.forwardImpulse=0,u[y]||(u[y]=new t),p[y]||(p[y]=new t)}for(var y=0;d>y;y++){var c=n[y],a=c.raycastResult.body;if(a){var r=p[y],x=this.getWheelTransformWorld(y);x.vectorToWorldFrame(w[this.indexRightAxis],r);var j=c.raycastResult.hitNormalWorld,v=r.dot(j);j.scale(v,f),r.vsub(f,r),r.normalize(),j.cross(r,u[y]),u[y].normalize(),c.sideImpulse=i(l,c.raycastResult.hitPointWorld,a,c.raycastResult.hitPointWorld,r),c.sideImpulse*=g}}var A=1,C=.5;this.sliding=!1;for(var y=0;d>y;y++){var c=n[y],a=c.raycastResult.body,O=0;if(c.slipInfo=1,a){var h=0,k=c.brake?c.brake:h;O=o(l,a,c.raycastResult.hitPointWorld,u[y],k),O+=c.engineForce*e;var q=k/O;c.slipInfo*=q}if(c.forwardImpulse=0,c.skidInfo=1,a){c.skidInfo=1;var z=c.suspensionForce*e*c.frictionSlip,B=z,D=z*B;c.forwardImpulse=O;var E=c.forwardImpulse*C,F=c.sideImpulse*A,G=E*E+F*F;if(c.sliding=!1,G>D){this.sliding=!0,c.sliding=!0;var q=z/Math.sqrt(G);c.skidInfo*=q}}}if(this.sliding)for(var y=0;d>y;y++){var c=n[y];0!==c.sideImpulse&&c.skidInfo<1&&(c.forwardImpulse*=c.skidInfo,c.sideImpulse*=c.skidInfo)}for(var y=0;d>y;y++){var c=n[y],H=new t;if(H.copy(c.raycastResult.hitPointWorld),0!==c.forwardImpulse){var I=new t;u[y].scale(c.forwardImpulse,I),l.applyImpulse(I,H)}if(0!==c.sideImpulse){var a=c.raycastResult.body,J=new t;J.copy(c.raycastResult.hitPointWorld);var K=new t;p[y].scale(c.sideImpulse,K),l.pointToLocalFrame(H,H),H["xyz"[this.indexUpAxis]]*=c.rollInfluence,l.pointToWorldFrame(H,H),l.applyImpulse(K,H),K.scale(-1,K),a.applyImpulse(K,J)}}};var x=new t,j=new t,v=new t,A=new t,C=new t,O=new t,h=new t,k=new t,q=new t,z=new t},{"../collision/Ray":9,"../collision/RaycastResult":10,"../math/Quaternion":28,"../math/Vec3":30,"../objects/WheelInfo":36,"./Body":31}],33:[function(e,f){function n(e){if(this.wheelBodies=[],this.coordinateSystem="undefined"==typeof e.coordinateSystem?new t(1,2,3):e.coordinateSystem.clone(),this.chassisBody=e.chassisBody,!this.chassisBody){var f=new i(new t(5,2,.5));this.chassisBody=new o(1,f)}this.constraints=[],this.wheelAxes=[],this.wheelForces=[]}var o=e("./Body"),d=e("../shapes/Sphere"),i=e("../shapes/Box"),t=e("../math/Vec3"),l=e("../constraints/HingeConstraint");f.exports=n,n.prototype.addWheel=function(e){e=e||{};var f=e.body;f||(f=new o(1,new d(1.2))),this.wheelBodies.push(f),this.wheelForces.push(0);var n=(new t,"undefined"!=typeof e.position?e.position.clone():new t),i=new t;this.chassisBody.pointToWorldFrame(n,i),f.position.set(i.x,i.y,i.z);var u="undefined"!=typeof e.axis?e.axis.clone():new t(0,1,0);this.wheelAxes.push(u);var p=new l(this.chassisBody,f,{pivotA:n,axisA:u,pivotB:t.ZERO,axisB:u,collideConnected:!1});return this.constraints.push(p),this.wheelBodies.length-1},n.prototype.setSteeringValue=function(e,f){var n=this.wheelAxes[f],o=Math.cos(e),d=Math.sin(e),i=n.x,t=n.y;this.constraints[f].axisA.set(o*i-d*t,d*i+o*t,0)},n.prototype.setMotorSpeed=function(e,f){var n=this.constraints[f];n.enableMotor(),n.motorTargetVelocity=e},n.prototype.disableMotor=function(e){var f=this.constraints[e];
f.disableMotor()};var u=new t;n.prototype.setWheelForce=function(e,f){this.wheelForces[f]=e},n.prototype.applyWheelForce=function(e,f){var n=this.wheelAxes[f],o=this.wheelBodies[f],d=o.torque;n.scale(e,u),o.vectorToWorldFrame(u,u),d.vadd(u,d)},n.prototype.addToWorld=function(e){for(var f=this.constraints,n=this.wheelBodies.concat([this.chassisBody]),o=0;o<n.length;o++)e.add(n[o]);for(var o=0;o<f.length;o++)e.addConstraint(f[o]);e.addEventListener("preStep",this._update.bind(this))},n.prototype._update=function(){for(var e=this.wheelForces,f=0;f<e.length;f++)this.applyWheelForce(e[f],f)},n.prototype.removeFromWorld=function(e){for(var f=this.constraints,n=this.wheelBodies.concat([this.chassisBody]),o=0;o<n.length;o++)e.remove(n[o]);for(var o=0;o<f.length;o++)e.removeConstraint(f[o])};var p=new t;n.prototype.getWheelSpeed=function(e){var f=this.wheelAxes[e],n=this.wheelBodies[e],o=n.angularVelocity;return this.chassisBody.vectorToWorldFrame(f,p),o.dot(p)}},{"../constraints/HingeConstraint":15,"../math/Vec3":30,"../shapes/Box":37,"../shapes/Sphere":44,"./Body":31}],34:[function(e,f){function n(){this.particles=[],this.density=1,this.smoothingRadius=1,this.speedOfSound=1,this.viscosity=.01,this.eps=1e-6,this.pressures=[],this.densities=[],this.neighbors=[]}f.exports=n;{var o=(e("../shapes/Shape"),e("../math/Vec3"));e("../math/Quaternion"),e("../shapes/Particle"),e("../objects/Body"),e("../material/Material")}n.prototype.add=function(e){this.particles.push(e),this.neighbors.length<this.particles.length&&this.neighbors.push([])},n.prototype.remove=function(e){var f=this.particles.indexOf(e);-1!==f&&(this.particles.splice(f,1),this.neighbors.length>this.particles.length&&this.neighbors.pop())};var d=new o;n.prototype.getNeighbors=function(e,f){for(var n=this.particles.length,o=e.id,i=this.smoothingRadius*this.smoothingRadius,t=d,l=0;l!==n;l++){var u=this.particles[l];u.position.vsub(e.position,t),o!==u.id&&t.norm2()<i&&f.push(u)}};var i=new o,t=new o,l=new o,u=new o,p=new o,s=new o;n.prototype.update=function(){for(var e=this.particles.length,f=i,n=this.speedOfSound,o=this.eps,d=0;d!==e;d++){var y=this.particles[d],c=this.neighbors[d];c.length=0,this.getNeighbors(y,c),c.push(this.particles[d]);for(var a=c.length,r=0,w=0;w!==a;w++){y.position.vsub(c[w].position,f);var b=f.norm(),m=this.w(b);r+=c[w].mass*m}this.densities[d]=r,this.pressures[d]=n*n*(this.densities[d]-this.density)}for(var N=t,g=l,x=u,j=p,v=s,d=0;d!==e;d++){var A=this.particles[d];N.set(0,0,0),g.set(0,0,0);for(var C,O,c=this.neighbors[d],a=c.length,w=0;w!==a;w++){var h=c[w];A.position.vsub(h.position,j);var k=j.norm();C=-h.mass*(this.pressures[d]/(this.densities[d]*this.densities[d]+o)+this.pressures[w]/(this.densities[w]*this.densities[w]+o)),this.gradw(j,x),x.mult(C,x),N.vadd(x,N),h.velocity.vsub(A.velocity,v),v.mult(1/(1e-4+this.densities[d]*this.densities[w])*this.viscosity*h.mass,v),O=this.nablaw(k),v.mult(O,v),g.vadd(v,g)}g.mult(A.mass,g),N.mult(A.mass,N),A.force.vadd(g,A.force),A.force.vadd(N,A.force)}},n.prototype.w=function(e){var f=this.smoothingRadius;return 315/(64*Math.PI*Math.pow(f,9))*Math.pow(f*f-e*e,3)},n.prototype.gradw=function(e,f){var n=e.norm(),o=this.smoothingRadius;e.mult(945/(32*Math.PI*Math.pow(o,9))*Math.pow(o*o-n*n,2),f)},n.prototype.nablaw=function(e){var f=this.smoothingRadius,n=945/(32*Math.PI*Math.pow(f,9))*(f*f-e*e)*(7*e*e-3*f*f);return n}},{"../material/Material":25,"../math/Quaternion":28,"../math/Vec3":30,"../objects/Body":31,"../shapes/Particle":41,"../shapes/Shape":43}],35:[function(e,f){function n(e,f,n){n=n||{},this.restLength="number"==typeof n.restLength?n.restLength:1,this.stiffness=n.stiffness||100,this.damping=n.damping||1,this.bodyA=e,this.bodyB=f,this.localAnchorA=new o,this.localAnchorB=new o,n.localAnchorA&&this.localAnchorA.copy(n.localAnchorA),n.localAnchorB&&this.localAnchorB.copy(n.localAnchorB),n.worldAnchorA&&this.setWorldAnchorA(n.worldAnchorA),n.worldAnchorB&&this.setWorldAnchorB(n.worldAnchorB)}var o=e("../math/Vec3");f.exports=n,n.prototype.setWorldAnchorA=function(e){this.bodyA.pointToLocalFrame(e,this.localAnchorA)},n.prototype.setWorldAnchorB=function(e){this.bodyB.pointToLocalFrame(e,this.localAnchorB)},n.prototype.getWorldAnchorA=function(e){this.bodyA.pointToWorldFrame(this.localAnchorA,e)},n.prototype.getWorldAnchorB=function(e){this.bodyB.pointToWorldFrame(this.localAnchorB,e)};var d=new o,i=new o,t=new o,l=new o,u=new o,p=new o,s=new o,y=new o,c=new o,a=new o,r=new o;n.prototype.applyForce=function(){var e=this.stiffness,f=this.damping,n=this.restLength,o=this.bodyA,w=this.bodyB,b=d,m=i,N=t,g=l,x=r,j=u,v=p,A=s,C=y,O=c,h=a;this.getWorldAnchorA(j),this.getWorldAnchorB(v),j.vsub(o.position,A),v.vsub(w.position,C),v.vsub(j,b);var k=b.norm();m.copy(b),m.normalize(),w.velocity.vsub(o.velocity,N),w.angularVelocity.cross(C,x),N.vadd(x,N),o.angularVelocity.cross(A,x),N.vsub(x,N),m.mult(-e*(k-n)-f*N.dot(m),g),o.force.vsub(g,o.force),w.force.vadd(g,w.force),A.cross(g,O),C.cross(g,h),o.torque.vsub(O,o.torque),w.torque.vadd(h,w.torque)}},{"../math/Vec3":30}],36:[function(e,f){function n(e){e=t.defaults(e,{chassisConnectionPointLocal:new o,chassisConnectionPointWorld:new o,directionLocal:new o,directionWorld:new o,axleLocal:new o,axleWorld:new o,suspensionRestLength:1,suspensionMaxLength:2,radius:1,suspensionStiffness:100,dampingCompression:10,dampingRelaxation:10,frictionSlip:1e4,steering:0,rotation:0,deltaRotation:0,rollInfluence:.01,maxSuspensionForce:Number.MAX_VALUE,isFrontWheel:!0,clippedInvContactDotSuspension:1,suspensionRelativeVelocity:0,suspensionForce:0,skidInfo:0,suspensionLength:0,maxSuspensionTravel:1,useCustomSlidingRotationalSpeed:!1,customSlidingRotationalSpeed:-.1}),this.maxSuspensionTravel=e.maxSuspensionTravel,this.customSlidingRotationalSpeed=e.customSlidingRotationalSpeed,this.useCustomSlidingRotationalSpeed=e.useCustomSlidingRotationalSpeed,this.sliding=!1,this.chassisConnectionPointLocal=e.chassisConnectionPointLocal.clone(),this.chassisConnectionPointWorld=e.chassisConnectionPointWorld.clone(),this.directionLocal=e.directionLocal.clone(),this.directionWorld=e.directionWorld.clone(),this.axleLocal=e.axleLocal.clone(),this.axleWorld=e.axleWorld.clone(),this.suspensionRestLength=e.suspensionRestLength,this.suspensionMaxLength=e.suspensionMaxLength,this.radius=e.radius,this.suspensionStiffness=e.suspensionStiffness,this.dampingCompression=e.dampingCompression,this.dampingRelaxation=e.dampingRelaxation,this.frictionSlip=e.frictionSlip,this.steering=0,this.rotation=0,this.deltaRotation=0,this.rollInfluence=e.rollInfluence,this.maxSuspensionForce=e.maxSuspensionForce,this.engineForce=0,this.brake=0,this.isFrontWheel=e.isFrontWheel,this.clippedInvContactDotSuspension=1,this.suspensionRelativeVelocity=0,this.suspensionForce=0,this.skidInfo=0,this.suspensionLength=0,this.sideImpulse=0,this.forwardImpulse=0,this.raycastResult=new i,this.worldTransform=new d,this.isInContact=!1}var o=e("../math/Vec3"),d=e("../math/Transform"),i=e("../collision/RaycastResult"),t=e("../utils/Utils");f.exports=n;var l=new o,u=new o,l=new o;n.prototype.updateWheel=function(e){var f=this.raycastResult;if(this.isInContact){var n=f.hitNormalWorld.dot(f.directionWorld);f.hitPointWorld.vsub(e.position,u),e.getVelocityAtWorldPoint(u,l);var o=f.hitNormalWorld.dot(l);if(n>=-.1)this.suspensionRelativeVelocity=0,this.clippedInvContactDotSuspension=10;else{var d=-1/n;this.suspensionRelativeVelocity=o*d,this.clippedInvContactDotSuspension=d}}else f.suspensionLength=this.suspensionRestLength,this.suspensionRelativeVelocity=0,f.directionWorld.scale(-1,f.hitNormalWorld),this.clippedInvContactDotSuspension=1}},{"../collision/RaycastResult":10,"../math/Transform":29,"../math/Vec3":30,"../utils/Utils":53}],37:[function(e,f){function n(e){o.call(this),this.type=o.types.BOX,this.halfExtents=e,this.convexPolyhedronRepresentation=null,this.updateConvexPolyhedronRepresentation(),this.updateBoundingSphereRadius()}f.exports=n;var o=e("./Shape"),d=e("../math/Vec3"),i=e("./ConvexPolyhedron");n.prototype=new o,n.prototype.constructor=n,n.prototype.updateConvexPolyhedronRepresentation=function(){var e=this.halfExtents.x,f=this.halfExtents.y,n=this.halfExtents.z,o=d,t=[new o(-e,-f,-n),new o(e,-f,-n),new o(e,f,-n),new o(-e,f,-n),new o(-e,-f,n),new o(e,-f,n),new o(e,f,n),new o(-e,f,n)],l=[[3,2,1,0],[4,5,6,7],[5,4,0,1],[2,3,7,6],[0,4,7,3],[1,2,6,5]],u=([new o(0,0,1),new o(0,1,0),new o(1,0,0)],new i(t,l));this.convexPolyhedronRepresentation=u,u.material=this.material},n.prototype.calculateLocalInertia=function(e,f){return f=f||new d,n.calculateInertia(this.halfExtents,e,f),f},n.calculateInertia=function(e,f,n){var o=e;n.x=1/12*f*(2*o.y*2*o.y+2*o.z*2*o.z),n.y=1/12*f*(2*o.x*2*o.x+2*o.z*2*o.z),n.z=1/12*f*(2*o.y*2*o.y+2*o.x*2*o.x)},n.prototype.getSideNormals=function(e,f){var n=e,o=this.halfExtents;if(n[0].set(o.x,0,0),n[1].set(0,o.y,0),n[2].set(0,0,o.z),n[3].set(-o.x,0,0),n[4].set(0,-o.y,0),n[5].set(0,0,-o.z),void 0!==f)for(var d=0;d!==n.length;d++)f.vmult(n[d],n[d]);return n},n.prototype.volume=function(){return 8*this.halfExtents.x*this.halfExtents.y*this.halfExtents.z},n.prototype.updateBoundingSphereRadius=function(){this.boundingSphereRadius=this.halfExtents.norm()};{var t=new d;new d}n.prototype.forEachWorldCorner=function(e,f,n){for(var o=this.halfExtents,d=[[o.x,o.y,o.z],[-o.x,o.y,o.z],[-o.x,-o.y,o.z],[-o.x,-o.y,-o.z],[o.x,-o.y,-o.z],[o.x,o.y,-o.z],[-o.x,o.y,-o.z],[o.x,-o.y,o.z]],i=0;i<d.length;i++)t.set(d[i][0],d[i][1],d[i][2]),f.vmult(t,t),e.vadd(t,t),n(t.x,t.y,t.z)};var l=[new d,new d,new d,new d,new d,new d,new d,new d];n.prototype.calculateWorldAABB=function(e,f,n,o){var d=this.halfExtents;l[0].set(d.x,d.y,d.z),l[1].set(-d.x,d.y,d.z),l[2].set(-d.x,-d.y,d.z),l[3].set(-d.x,-d.y,-d.z),l[4].set(d.x,-d.y,-d.z),l[5].set(d.x,d.y,-d.z),l[6].set(-d.x,d.y,-d.z),l[7].set(d.x,-d.y,d.z);var i=l[0];f.vmult(i,i),e.vadd(i,i),o.copy(i),n.copy(i);for(var t=1;8>t;t++){var i=l[t];f.vmult(i,i),e.vadd(i,i);var u=i.x,p=i.y,s=i.z;u>o.x&&(o.x=u),p>o.y&&(o.y=p),s>o.z&&(o.z=s),u<n.x&&(n.x=u),p<n.y&&(n.y=p),s<n.z&&(n.z=s)}}},{"../math/Vec3":30,"./ConvexPolyhedron":38,"./Shape":43}],38:[function(e,f){function n(e,f,n){o.call(this),this.type=o.types.CONVEXPOLYHEDRON,this.vertices=e||[],this.worldVertices=[],this.worldVerticesNeedsUpdate=!0,this.faces=f||[],this.faceNormals=[],this.computeNormals(),this.worldFaceNormalsNeedsUpdate=!0,this.worldFaceNormals=[],this.uniqueEdges=[],this.uniqueAxes=n?n.slice():null,this.computeEdges(),this.updateBoundingSphereRadius()}f.exports=n;var o=e("./Shape"),d=e("../math/Vec3"),i=(e("../math/Quaternion"),e("../math/Transform"));n.prototype=new o,n.prototype.constructor=n;var t=new d;n.prototype.computeEdges=function(){var e=this.faces,f=this.vertices,n=(f.length,this.uniqueEdges);n.length=0;for(var o=t,d=0;d!==e.length;d++)for(var i=e[d],l=i.length,u=0;u!==l;u++){var p=(u+1)%l;f[i[u]].vsub(f[i[p]],o),o.normalize();for(var s=!1,y=0;y!==n.length;y++)if(n[y].almostEquals(o)||n[y].almostEquals(o)){s=!0;break}s||n.push(o.clone())}},n.prototype.computeNormals=function(){this.faceNormals.length=this.faces.length;for(var e=0;e<this.faces.length;e++){for(var f=0;f<this.faces[e].length;f++)if(!this.vertices[this.faces[e][f]])throw new Error("Vertex "+this.faces[e][f]+" not found!");var n=this.faceNormals[e]||new d;this.getFaceNormal(e,n),n.negate(n),this.faceNormals[e]=n;var o=this.vertices[this.faces[e][0]];if(n.dot(o)<0){console.error(".faceNormals["+e+"] = Vec3("+n.toString()+") looks like it points into the shape? The vertices follow. Make sure they are ordered CCW around the normal, using the right hand rule.");for(var f=0;f<this.faces[e].length;f++)console.warn(".vertices["+this.faces[e][f]+"] = Vec3("+this.vertices[this.faces[e][f]].toString()+")")}}};var l=new d,u=new d;n.computeNormal=function(e,f,n,o){f.vsub(e,u),n.vsub(f,l),l.cross(u,o),o.isZero()||o.normalize()},n.prototype.getFaceNormal=function(e,f){var o=this.faces[e],d=this.vertices[o[0]],i=this.vertices[o[1]],t=this.vertices[o[2]];return n.computeNormal(d,i,t,f)};var p=new d;n.prototype.clipAgainstHull=function(e,f,n,o,i,t,l,u,s){for(var y=p,c=-1,a=-Number.MAX_VALUE,r=0;r<n.faces.length;r++){y.copy(n.faceNormals[r]),i.vmult(y,y);var w=y.dot(t);w>a&&(a=w,c=r)}for(var b=[],m=n.faces[c],N=m.length,g=0;N>g;g++){var x=n.vertices[m[g]],j=new d;j.copy(x),i.vmult(j,j),o.vadd(j,j),b.push(j)}c>=0&&this.clipFaceAgainstHull(t,e,f,b,l,u,s)};var s=new d,y=new d,c=new d,a=new d,r=new d,w=new d;n.prototype.findSeparatingAxis=function(e,f,n,o,d,i,t,l){var u=s,p=y,b=c,m=a,N=r,g=w,x=Number.MAX_VALUE,j=this,v=0;if(j.uniqueAxes)for(var A=0;A!==j.uniqueAxes.length;A++){n.vmult(j.uniqueAxes[A],u);var C=j.testSepAxis(u,e,f,n,o,d);if(C===!1)return!1;x>C&&(x=C,i.copy(u))}else for(var O=t?t.length:j.faces.length,A=0;O>A;A++){var h=t?t[A]:A;u.copy(j.faceNormals[h]),n.vmult(u,u);var C=j.testSepAxis(u,e,f,n,o,d);if(C===!1)return!1;x>C&&(x=C,i.copy(u))}if(e.uniqueAxes)for(var A=0;A!==e.uniqueAxes.length;A++){d.vmult(e.uniqueAxes[A],p),v++;var C=j.testSepAxis(p,e,f,n,o,d);if(C===!1)return!1;x>C&&(x=C,i.copy(p))}else for(var k=l?l.length:e.faces.length,A=0;k>A;A++){var h=l?l[A]:A;p.copy(e.faceNormals[h]),d.vmult(p,p),v++;var C=j.testSepAxis(p,e,f,n,o,d);if(C===!1)return!1;x>C&&(x=C,i.copy(p))}for(var q=0;q!==j.uniqueEdges.length;q++){n.vmult(j.uniqueEdges[q],m);for(var z=0;z!==e.uniqueEdges.length;z++)if(d.vmult(e.uniqueEdges[z],N),m.cross(N,g),!g.almostZero()){g.normalize();var B=j.testSepAxis(g,e,f,n,o,d);if(B===!1)return!1;x>B&&(x=B,i.copy(g))}}return o.vsub(f,b),b.dot(i)>0&&i.negate(i),!0};var b=[],m=[];n.prototype.testSepAxis=function(e,f,o,d,i,t){var l=this;n.project(l,e,o,d,b),n.project(f,e,i,t,m);var u=b[0],p=b[1],s=m[0],y=m[1];if(y>u||p>s)return!1;var c=u-y,a=s-p,r=a>c?c:a;return r};var N=new d,g=new d;n.prototype.calculateLocalInertia=function(e,f){this.computeLocalAABB(N,g);var n=g.x-N.x,o=g.y-N.y,d=g.z-N.z;f.x=1/12*e*(2*o*2*o+2*d*2*d),f.y=1/12*e*(2*n*2*n+2*d*2*d),f.z=1/12*e*(2*o*2*o+2*n*2*n)},n.prototype.getPlaneConstantOfFace=function(e){var f=this.faces[e],n=this.faceNormals[e],o=this.vertices[f[0]],d=-n.dot(o);return d};var x=new d,j=new d,v=new d,A=new d,C=new d,O=new d,h=new d,k=new d;n.prototype.clipFaceAgainstHull=function(e,f,n,o,d,i,t){for(var l=x,u=j,p=v,s=A,y=C,c=O,a=h,r=k,w=this,b=[],m=o,N=b,g=-1,q=Number.MAX_VALUE,z=0;z<w.faces.length;z++){l.copy(w.faceNormals[z]),n.vmult(l,l);var B=l.dot(e);q>B&&(q=B,g=z)}if(!(0>g)){var D=w.faces[g];D.connectedFaces=[];for(var E=0;E<w.faces.length;E++)for(var F=0;F<w.faces[E].length;F++)-1!==D.indexOf(w.faces[E][F])&&E!==g&&-1===D.connectedFaces.indexOf(E)&&D.connectedFaces.push(E);for(var G=(m.length,D.length),H=0;G>H;H++){var I=w.vertices[D[H]],J=w.vertices[D[(H+1)%G]];I.vsub(J,u),p.copy(u),n.vmult(p,p),f.vadd(p,p),s.copy(this.faceNormals[g]),n.vmult(s,s),f.vadd(s,s),p.cross(s,y),y.negate(y),c.copy(I),n.vmult(c,c),f.vadd(c,c);var K,L=(-c.dot(y),D.connectedFaces[H]);a.copy(this.faceNormals[L]);var M=this.getPlaneConstantOfFace(L);r.copy(a),n.vmult(r,r);var K=M-r.dot(f);for(this.clipFaceAgainstPlane(m,N,r,K);m.length;)m.shift();for(;N.length;)m.push(N.shift())}a.copy(this.faceNormals[g]);var M=this.getPlaneConstantOfFace(g);r.copy(a),n.vmult(r,r);for(var K=M-r.dot(f),E=0;E<m.length;E++){var P=r.dot(m[E])+K;if(d>=P&&(console.log("clamped: depth="+P+" to minDist="+(d+"")),P=d),i>=P){var Q=m[E];if(0>=P){var R={point:Q,normal:r,depth:P};t.push(R)}}}}},n.prototype.clipFaceAgainstPlane=function(e,f,n,o){var i,t,l=e.length;if(2>l)return f;var u=e[e.length-1],p=e[0];i=n.dot(u)+o;for(var s=0;l>s;s++){if(p=e[s],t=n.dot(p)+o,0>i)if(0>t){var y=new d;y.copy(p),f.push(y)}else{var y=new d;u.lerp(p,i/(i-t),y),f.push(y)}else if(0>t){var y=new d;u.lerp(p,i/(i-t),y),f.push(y),f.push(p)}u=p,i=t}return f},n.prototype.computeWorldVertices=function(e,f){for(var n=this.vertices.length;this.worldVertices.length<n;)this.worldVertices.push(new d);for(var o=this.vertices,i=this.worldVertices,t=0;t!==n;t++)f.vmult(o[t],i[t]),e.vadd(i[t],i[t]);this.worldVerticesNeedsUpdate=!1};new d;n.prototype.computeLocalAABB=function(e,f){var n=this.vertices.length,o=this.vertices;e.set(Number.MAX_VALUE,Number.MAX_VALUE,Number.MAX_VALUE),f.set(-Number.MAX_VALUE,-Number.MAX_VALUE,-Number.MAX_VALUE);for(var d=0;n>d;d++){var i=o[d];i.x<e.x?e.x=i.x:i.x>f.x&&(f.x=i.x),i.y<e.y?e.y=i.y:i.y>f.y&&(f.y=i.y),i.z<e.z?e.z=i.z:i.z>f.z&&(f.z=i.z)}},n.prototype.computeWorldFaceNormals=function(e){for(var f=this.faceNormals.length;this.worldFaceNormals.length<f;)this.worldFaceNormals.push(new d);for(var n=this.faceNormals,o=this.worldFaceNormals,i=0;i!==f;i++)e.vmult(n[i],o[i]);this.worldFaceNormalsNeedsUpdate=!1},n.prototype.updateBoundingSphereRadius=function(){for(var e=0,f=this.vertices,n=0,o=f.length;n!==o;n++){var d=f[n].norm2();d>e&&(e=d)}this.boundingSphereRadius=Math.sqrt(e)};var q=new d;n.prototype.calculateWorldAABB=function(e,f,n,o){for(var d,i,t,l,u,p,s=this.vertices.length,y=this.vertices,c=0;s>c;c++){q.copy(y[c]),f.vmult(q,q),e.vadd(q,q);var a=q;a.x<d||void 0===d?d=a.x:(a.x>l||void 0===l)&&(l=a.x),a.y<i||void 0===i?i=a.y:(a.y>u||void 0===u)&&(u=a.y),a.z<t||void 0===t?t=a.z:(a.z>p||void 0===p)&&(p=a.z)}n.set(d,i,t),o.set(l,u,p)},n.prototype.volume=function(){return 4*Math.PI*this.boundingSphereRadius/3},n.prototype.getAveragePointLocal=function(e){e=e||new d;for(var f=this.vertices.length,n=this.vertices,o=0;f>o;o++)e.vadd(n[o],e);return e.mult(1/f,e),e},n.prototype.transformAllPoints=function(e,f){var n=this.vertices.length,o=this.vertices;if(f){for(var d=0;n>d;d++){var i=o[d];f.vmult(i,i)}for(var d=0;d<this.faceNormals.length;d++){var i=this.faceNormals[d];f.vmult(i,i)}}if(e)for(var d=0;n>d;d++){var i=o[d];i.vadd(e,i)}};var z=new d,B=new d,D=new d;n.prototype.pointIsInside=function(e){var f=this.vertices.length,n=this.vertices,o=this.faces,d=this.faceNormals,i=null,t=this.faces.length,l=z;this.getAveragePointLocal(l);for(var u=0;t>u;u++){var f=(this.faces[u].length,d[u]),p=n[o[u][0]],s=B;e.vsub(p,s);var y=f.dot(s),c=D;l.vsub(p,c);var a=f.dot(c);if(0>y&&a>0||y>0&&0>a)return!1}return i?1:-1};var E=(new d,new d),F=new d;n.project=function(e,f,n,o,d){var t=e.vertices.length,l=E,u=0,p=0,s=F,y=e.vertices;s.setZero(),i.vectorToLocalFrame(n,o,f,l),i.pointToLocalFrame(n,o,s,s);var c=s.dot(l);p=u=y[0].dot(l);for(var a=1;t>a;a++){var r=y[a].dot(l);r>u&&(u=r),p>r&&(p=r)}if(p-=c,u-=c,p>u){var w=p;p=u,u=w}d[0]=u,d[1]=p}},{"../math/Quaternion":28,"../math/Transform":29,"../math/Vec3":30,"./Shape":43}],39:[function(e,f){function n(e,f,n,t){var l=t,u=[],p=[],s=[],y=[],c=[],a=Math.cos,r=Math.sin;u.push(new d(f*a(0),f*r(0),.5*-n)),y.push(0),u.push(new d(e*a(0),e*r(0),.5*n)),c.push(1);for(var w=0;l>w;w++){var b=2*Math.PI/l*(w+1),m=2*Math.PI/l*(w+.5);l-1>w?(u.push(new d(f*a(b),f*r(b),.5*-n)),y.push(2*w+2),u.push(new d(e*a(b),e*r(b),.5*n)),c.push(2*w+3),s.push([2*w+2,2*w+3,2*w+1,2*w])):s.push([0,1,2*w+1,2*w]),(l%2===1||l/2>w)&&p.push(new d(a(m),r(m),0))}s.push(c),p.push(new d(0,0,1));for(var N=[],w=0;w<y.length;w++)N.push(y[y.length-w-1]);s.push(N),this.type=o.types.CONVEXPOLYHEDRON,i.call(this,u,s,p)}f.exports=n;var o=e("./Shape"),d=e("../math/Vec3"),i=(e("../math/Quaternion"),e("./ConvexPolyhedron"));n.prototype=new i},{"../math/Quaternion":28,"../math/Vec3":30,"./ConvexPolyhedron":38,"./Shape":43}],40:[function(e,f){function n(e,f){f=t.defaults(f,{maxValue:null,minValue:null,elementSize:1}),this.data=e,this.maxValue=f.maxValue,this.minValue=f.minValue,this.elementSize=f.elementSize,null===f.minValue&&this.updateMinValue(),null===f.maxValue&&this.updateMaxValue(),this.cacheEnabled=!0,o.call(this),this.pillarConvex=new d,this.pillarOffset=new i,this.type=o.types.HEIGHTFIELD,this.updateBoundingSphereRadius(),this._cachedPillars={}}var o=e("./Shape"),d=e("./ConvexPolyhedron"),i=e("../math/Vec3"),t=e("../utils/Utils");f.exports=n,n.prototype=new o,n.prototype.update=function(){this._cachedPillars={}},n.prototype.updateMinValue=function(){for(var e=this.data,f=e[0][0],n=0;n!==e.length;n++)for(var o=0;o!==e[n].length;o++){var d=e[n][o];f>d&&(f=d)}this.minValue=f},n.prototype.updateMaxValue=function(){for(var e=this.data,f=e[0][0],n=0;n!==e.length;n++)for(var o=0;o!==e[n].length;o++){var d=e[n][o];d>f&&(f=d)}this.maxValue=f},n.prototype.setHeightValueAtIndex=function(e,f,n){var o=this.data;o[e][f]=n,this.clearCachedConvexTrianglePillar(e,f,!1),e>0&&(this.clearCachedConvexTrianglePillar(e-1,f,!0),this.clearCachedConvexTrianglePillar(e-1,f,!1)),f>0&&(this.clearCachedConvexTrianglePillar(e,f-1,!0),this.clearCachedConvexTrianglePillar(e,f-1,!1)),f>0&&e>0&&this.clearCachedConvexTrianglePillar(e-1,f-1,!0)},n.prototype.getRectMinMax=function(e,f,n,o,d){d=d||[];for(var i=this.data,t=this.minValue,l=e;n>=l;l++)for(var u=f;o>=u;u++){var p=i[l][u];p>t&&(t=p)}d[0]=this.minValue,d[1]=t},n.prototype.getIndexOfPosition=function(e,f,n,o){var d=this.elementSize,i=this.data,t=Math.floor(e/d),l=Math.floor(f/d);return n[0]=t,n[1]=l,o&&(0>t&&(t=0),0>l&&(l=0),t>=i.length-1&&(t=i.length-1),l>=i[0].length-1&&(l=i[0].length-1)),0>t||0>l||t>=i.length-1||l>=i[0].length-1?!1:!0},n.prototype.getHeightAt=function(e,f,n){var o=[];this.getIndexOfPosition(e,f,o,n);var d=[];return this.getRectMinMax(o[0],o[1]+1,o[0],o[1]+1,d),(d[0]+d[1])/2},n.prototype.getCacheConvexTrianglePillarKey=function(e,f,n){return e+"_"+f+"_"+(n?1:0)},n.prototype.getCachedConvexTrianglePillar=function(e,f,n){return this._cachedPillars[this.getCacheConvexTrianglePillarKey(e,f,n)]},n.prototype.setCachedConvexTrianglePillar=function(e,f,n,o,d){this._cachedPillars[this.getCacheConvexTrianglePillarKey(e,f,n)]={convex:o,offset:d}},n.prototype.clearCachedConvexTrianglePillar=function(e,f,n){delete this._cachedPillars[this.getCacheConvexTrianglePillarKey(e,f,n)]},n.prototype.getConvexTrianglePillar=function(e,f,n){var o=this.pillarConvex,t=this.pillarOffset;if(this.cacheEnabled){var l=this.getCachedConvexTrianglePillar(e,f,n);if(l)return this.pillarConvex=l.convex,void(this.pillarOffset=l.offset);o=new d,t=new i,this.pillarConvex=o,this.pillarOffset=t}var l=this.data,u=this.elementSize,p=o.faces;o.vertices.length=6;for(var s=0;6>s;s++)o.vertices[s]||(o.vertices[s]=new i);p.length=5;for(var s=0;5>s;s++)p[s]||(p[s]=[]);var y=o.vertices,c=(Math.min(l[e][f],l[e+1][f],l[e][f+1],l[e+1][f+1])-this.minValue)/2+this.minValue;n?(t.set((e+.75)*u,(f+.75)*u,c),y[0].set(.25*u,.25*u,l[e+1][f+1]-c),y[1].set(-.75*u,.25*u,l[e][f+1]-c),y[2].set(.25*u,-.75*u,l[e+1][f]-c),y[3].set(.25*u,.25*u,-c-1),y[4].set(-.75*u,.25*u,-c-1),y[5].set(.25*u,-.75*u,-c-1),p[0][0]=0,p[0][1]=1,p[0][2]=2,p[1][0]=5,p[1][1]=4,p[1][2]=3,p[2][0]=2,p[2][1]=5,p[2][2]=3,p[2][3]=0,p[3][0]=3,p[3][1]=4,p[3][2]=1,p[3][3]=0,p[4][0]=1,p[4][1]=4,p[4][2]=5,p[4][3]=2):(t.set((e+.25)*u,(f+.25)*u,c),y[0].set(-.25*u,-.25*u,l[e][f]-c),y[1].set(.75*u,-.25*u,l[e+1][f]-c),y[2].set(-.25*u,.75*u,l[e][f+1]-c),y[3].set(-.25*u,-.25*u,-c-1),y[4].set(.75*u,-.25*u,-c-1),y[5].set(-.25*u,.75*u,-c-1),p[0][0]=0,p[0][1]=1,p[0][2]=2,p[1][0]=5,p[1][1]=4,p[1][2]=3,p[2][0]=0,p[2][1]=2,p[2][2]=5,p[2][3]=3,p[3][0]=1,p[3][1]=0,p[3][2]=3,p[3][3]=4,p[4][0]=4,p[4][1]=5,p[4][2]=2,p[4][3]=1),o.computeNormals(),o.computeEdges(),o.updateBoundingSphereRadius(),this.setCachedConvexTrianglePillar(e,f,n,o,t)},n.prototype.calculateLocalInertia=function(e,f){return f=f||new i,f.set(0,0,0),f},n.prototype.volume=function(){return Number.MAX_VALUE},n.prototype.calculateWorldAABB=function(e,f,n,o){n.set(-Number.MAX_VALUE,-Number.MAX_VALUE,-Number.MAX_VALUE),o.set(Number.MAX_VALUE,Number.MAX_VALUE,Number.MAX_VALUE)},n.prototype.updateBoundingSphereRadius=function(){var e=this.data,f=this.elementSize;this.boundingSphereRadius=new i(e.length*f,e[0].length*f,Math.max(Math.abs(this.maxValue),Math.abs(this.minValue))).norm()}},{"../math/Vec3":30,"../utils/Utils":53,"./ConvexPolyhedron":38,"./Shape":43}],41:[function(e,f){function n(){o.call(this),this.type=o.types.PARTICLE}f.exports=n;var o=e("./Shape"),d=e("../math/Vec3");n.prototype=new o,n.prototype.constructor=n,n.prototype.calculateLocalInertia=function(e,f){return f=f||new d,f.set(0,0,0),f},n.prototype.volume=function(){return 0},n.prototype.updateBoundingSphereRadius=function(){this.boundingSphereRadius=0},n.prototype.calculateWorldAABB=function(e,f,n,o){n.copy(e),o.copy(e)}},{"../math/Vec3":30,"./Shape":43}],42:[function(e,f){function n(){o.call(this),this.type=o.types.PLANE,this.worldNormal=new d,this.worldNormalNeedsUpdate=!0,this.boundingSphereRadius=Number.MAX_VALUE}f.exports=n;var o=e("./Shape"),d=e("../math/Vec3");n.prototype=new o,n.prototype.constructor=n,n.prototype.computeWorldNormal=function(e){var f=this.worldNormal;f.set(0,0,1),e.vmult(f,f),this.worldNormalNeedsUpdate=!1},n.prototype.calculateLocalInertia=function(e,f){return f=f||new d},n.prototype.volume=function(){return Number.MAX_VALUE};var i=new d;n.prototype.calculateWorldAABB=function(e,f,n,o){i.set(0,0,1),f.vmult(i,i);var d=Number.MAX_VALUE;n.set(-d,-d,-d),o.set(d,d,d),1===i.x&&(o.x=e.x),1===i.y&&(o.y=e.y),1===i.z&&(o.z=e.z),-1===i.x&&(n.x=e.x),-1===i.y&&(n.y=e.y),-1===i.z&&(n.z=e.z)},n.prototype.updateBoundingSphereRadius=function(){this.boundingSphereRadius=Number.MAX_VALUE}},{"../math/Vec3":30,"./Shape":43}],43:[function(e,f){function n(){this.id=n.idCounter++,this.type=0,this.boundingSphereRadius=0,this.collisionResponse=!0,this.material=null}f.exports=n;{var n=e("./Shape");e("../math/Vec3"),e("../math/Quaternion"),e("../material/Material")}n.prototype.constructor=n,n.prototype.updateBoundingSphereRadius=function(){throw"computeBoundingSphereRadius() not implemented for shape type "+this.type},n.prototype.volume=function(){throw"volume() not implemented for shape type "+this.type},n.prototype.calculateLocalInertia=function(){throw"calculateLocalInertia() not implemented for shape type "+this.type},n.idCounter=0,n.types={SPHERE:1,PLANE:2,BOX:4,COMPOUND:8,CONVEXPOLYHEDRON:16,HEIGHTFIELD:32,PARTICLE:64,CYLINDER:128,TRIMESH:256}},{"../material/Material":25,"../math/Quaternion":28,"../math/Vec3":30,"./Shape":43}],44:[function(e,f){function n(e){if(o.call(this),this.radius=void 0!==e?Number(e):1,this.type=o.types.SPHERE,this.radius<0)throw new Error("The sphere radius cannot be negative.");this.updateBoundingSphereRadius()}f.exports=n;var o=e("./Shape"),d=e("../math/Vec3");n.prototype=new o,n.prototype.constructor=n,n.prototype.calculateLocalInertia=function(e,f){f=f||new d;var n=2*e*this.radius*this.radius/5;return f.x=n,f.y=n,f.z=n,f},n.prototype.volume=function(){return 4*Math.PI*this.radius/3},n.prototype.updateBoundingSphereRadius=function(){this.boundingSphereRadius=this.radius},n.prototype.calculateWorldAABB=function(e,f,n,o){for(var d=this.radius,i=["x","y","z"],t=0;t<i.length;t++){var l=i[t];n[l]=e[l]-d,o[l]=e[l]+d}}},{"../math/Vec3":30,"./Shape":43}],45:[function(e,f){function n(e,f){o.call(this),this.type=o.types.TRIMESH,this.vertices=new Float32Array(e),this.indices=new Int16Array(f),this.normals=new Float32Array(f.length),this.aabb=new t,this.edges=null,this.scale=new d(1,1,1),this.tree=new l,this.updateEdges(),this.updateNormals(),this.updateAABB(),this.updateBoundingSphereRadius(),this.updateTree()}f.exports=n;var o=e("./Shape"),d=e("../math/Vec3"),i=(e("../math/Quaternion"),e("../math/Transform")),t=e("../collision/AABB"),l=e("../utils/Octree");n.prototype=new o,n.prototype.constructor=n;var u=new d;n.prototype.updateTree=function(){var e=this.tree;e.reset(),e.aabb.copy(this.aabb);var f=this.scale;e.aabb.lowerBound.x*=1/f.x,e.aabb.lowerBound.y*=1/f.y,e.aabb.lowerBound.z*=1/f.z,e.aabb.upperBound.x*=1/f.x,e.aabb.upperBound.y*=1/f.y,e.aabb.upperBound.z*=1/f.z;for(var n=new t,o=new d,i=new d,l=new d,u=[o,i,l],p=0;p<this.indices.length/3;p++){var s=3*p;this._getUnscaledVertex(this.indices[s],o),this._getUnscaledVertex(this.indices[s+1],i),this._getUnscaledVertex(this.indices[s+2],l),n.setFromPoints(u),e.insert(n,p)}e.removeEmptyNodes()};var p=new t;n.prototype.getTrianglesInAABB=function(e,f){p.copy(e);var n=this.scale,o=n.x,d=n.y,i=n.z,t=p.lowerBound,l=p.upperBound;return t.x/=o,t.y/=d,t.z/=i,l.x/=o,l.y/=d,l.z/=i,this.tree.aabbQuery(p,f)},n.prototype.setScale=function(e){var f=this.scale.x===this.scale.y===this.scale.z,n=e.x===e.y===e.z;f&&n||this.updateNormals(),this.scale.copy(e),this.updateAABB(),this.updateBoundingSphereRadius()},n.prototype.updateNormals=function(){for(var e=u,f=this.normals,o=0;o<this.indices.length/3;o++){var d=3*o,i=this.indices[d],t=this.indices[d+1],l=this.indices[d+2];this.getVertex(i,r),this.getVertex(t,w),this.getVertex(l,b),n.computeNormal(w,r,b,e),f[d]=e.x,f[d+1]=e.y,f[d+2]=e.z}},n.prototype.updateEdges=function(){for(var e={},f=function(){var f=i>d?d+"_"+i:i+"_"+d;e[f]=!0},n=0;n<this.indices.length/3;n++){var o=3*n,d=this.indices[o],i=this.indices[o+1],t=this.indices[o+2];f(d,i),f(i,t),f(t,d)}var l=Object.keys(e);this.edges=new Int16Array(2*l.length);for(var n=0;n<l.length;n++){var u=l[n].split("_");this.edges[2*n]=parseInt(u[0],10),this.edges[2*n+1]=parseInt(u[1],10)}},n.prototype.getEdgeVertex=function(e,f,n){var o=this.edges[2*e+(f?1:0)];this.getVertex(o,n)};var s=new d,y=new d;n.prototype.getEdgeVector=function(e,f){var n=s,o=y;this.getEdgeVertex(e,0,n),this.getEdgeVertex(e,1,o),o.vsub(n,f)};var c=new d,a=new d;n.computeNormal=function(e,f,n,o){f.vsub(e,a),n.vsub(f,c),c.cross(a,o),o.isZero()||o.normalize()};var r=new d,w=new d,b=new d;n.prototype.getVertex=function(e,f){var n=this.scale;return this._getUnscaledVertex(e,f),f.x*=n.x,f.y*=n.y,f.z*=n.z,f},n.prototype._getUnscaledVertex=function(e,f){var n=3*e,o=this.vertices;return f.set(o[n],o[n+1],o[n+2])},n.prototype.getWorldVertex=function(e,f,n,o){return this.getVertex(e,o),i.pointToWorldFrame(f,n,o,o),o},n.prototype.getTriangleVertices=function(e,f,n,o){var d=3*e;this.getVertex(this.indices[d],f),this.getVertex(this.indices[d+1],n),this.getVertex(this.indices[d+2],o)},n.prototype.getNormal=function(e,f){var n=3*e;return f.set(this.normals[n],this.normals[n+1],this.normals[n+2])};var m=new t;n.prototype.calculateLocalInertia=function(e,f){this.computeLocalAABB(m);var n=m.upperBound.x-m.lowerBound.x,o=m.upperBound.y-m.lowerBound.y,d=m.upperBound.z-m.lowerBound.z;return f.set(1/12*e*(2*o*2*o+2*d*2*d),1/12*e*(2*n*2*n+2*d*2*d),1/12*e*(2*o*2*o+2*n*2*n))};var N=new d;n.prototype.computeLocalAABB=function(e){var f=e.lowerBound,n=e.upperBound,o=this.vertices.length,d=(this.vertices,N);this.getVertex(0,d),f.copy(d),n.copy(d);for(var i=0;i!==o;i++)this.getVertex(i,d),d.x<f.x?f.x=d.x:d.x>n.x&&(n.x=d.x),d.y<f.y?f.y=d.y:d.y>n.y&&(n.y=d.y),d.z<f.z?f.z=d.z:d.z>n.z&&(n.z=d.z)},n.prototype.updateAABB=function(){this.computeLocalAABB(this.aabb)},n.prototype.updateBoundingSphereRadius=function(){for(var e=0,f=this.vertices,n=new d,o=0,i=f.length/3;o!==i;o++){this.getVertex(o,n);var t=n.norm2();t>e&&(e=t)}this.boundingSphereRadius=Math.sqrt(e)};var g=(new d,new i),x=new t;n.prototype.calculateWorldAABB=function(e,f,n,o){var d=g,i=x;d.position=e,d.quaternion=f,this.aabb.toWorldFrame(d,i),n.copy(i.lowerBound),o.copy(i.upperBound)},n.prototype.volume=function(){return 4*Math.PI*this.boundingSphereRadius/3},n.createTorus=function(e,f,o,d,i){e=e||1,f=f||.5,o=o||8,d=d||6,i=i||2*Math.PI;for(var t=[],l=[],u=0;o>=u;u++)for(var p=0;d>=p;p++){var s=p/d*i,y=u/o*Math.PI*2,c=(e+f*Math.cos(y))*Math.cos(s),a=(e+f*Math.cos(y))*Math.sin(s),r=f*Math.sin(y);t.push(c,a,r)}for(var u=1;o>=u;u++)for(var p=1;d>=p;p++){var w=(d+1)*u+p-1,b=(d+1)*(u-1)+p-1,m=(d+1)*(u-1)+p,N=(d+1)*u+p;l.push(w,b,N),l.push(b,m,N)}return new n(t,l)}},{"../collision/AABB":3,"../math/Quaternion":28,"../math/Transform":29,"../math/Vec3":30,"../utils/Octree":50,"./Shape":43}],46:[function(e,f){function n(){o.call(this),this.iterations=10,this.tolerance=1e-7}f.exports=n;var o=(e("../math/Vec3"),e("../math/Quaternion"),e("./Solver"));n.prototype=new o;var d=[],i=[],t=[];n.prototype.solve=function(e,f){var n,o,l,u,p,s,y=0,c=this.iterations,a=this.tolerance*this.tolerance,r=this.equations,w=r.length,b=f.bodies,m=b.length,N=e;if(0!==w)for(var g=0;g!==m;g++)b[g].updateSolveMassProperties();var x=i,j=t,v=d;
x.length=w,j.length=w,v.length=w;for(var g=0;g!==w;g++){var A=r[g];v[g]=0,j[g]=A.computeB(N),x[g]=1/A.computeC()}if(0!==w){for(var g=0;g!==m;g++){var C=b[g],O=C.vlambda,h=C.wlambda;O.set(0,0,0),h&&h.set(0,0,0)}for(y=0;y!==c;y++){u=0;for(var k=0;k!==w;k++){var A=r[k];n=j[k],o=x[k],s=v[k],p=A.computeGWlambda(),l=o*(n-p-A.eps*s),s+l<A.minForce?l=A.minForce-s:s+l>A.maxForce&&(l=A.maxForce-s),v[k]+=l,u+=l>0?l:-l,A.addToWlambda(l)}if(a>u*u)break}for(var g=0;g!==m;g++){var C=b[g],q=C.velocity,z=C.angularVelocity;q.vadd(C.vlambda,q),z&&z.vadd(C.wlambda,z)}}return y}},{"../math/Quaternion":28,"../math/Vec3":30,"./Solver":47}],47:[function(e,f){function n(){this.equations=[]}f.exports=n,n.prototype.solve=function(){return 0},n.prototype.addEquation=function(e){e.enabled&&this.equations.push(e)},n.prototype.removeEquation=function(e){var f=this.equations,n=f.indexOf(e);-1!==n&&f.splice(n,1)},n.prototype.removeAllEquations=function(){this.equations.length=0}},{}],48:[function(e,f){function n(e){for(l.call(this),this.iterations=10,this.tolerance=1e-7,this.subsolver=e,this.nodes=[],this.nodePool=[];this.nodePool.length<128;)this.nodePool.push(this.createNode())}function o(e){for(var f=e.length,n=0;n!==f;n++){var o=e[n];if(!(o.visited||o.body.type&c))return o}return!1}function d(e,f,n,d){for(a.push(e),e.visited=!0,f(e,n,d);a.length;)for(var i,t=a.pop();i=o(t.children);)i.visited=!0,f(i,n,d),a.push(i)}function i(e,f,n){f.push(e.body);for(var o=e.eqs.length,d=0;d!==o;d++){var i=e.eqs[d];-1===n.indexOf(i)&&n.push(i)}}function t(e,f){return f.id-e.id}f.exports=n;var l=(e("../math/Vec3"),e("../math/Quaternion"),e("./Solver")),u=e("../objects/Body");n.prototype=new l;var p=[],s=[],y={bodies:[]},c=u.STATIC,a=[];n.prototype.createNode=function(){return{body:null,children:[],eqs:[],visited:!1}},n.prototype.solve=function(e,f){for(var n=p,l=this.nodePool,u=f.bodies,c=this.equations,a=c.length,r=u.length,w=this.subsolver;l.length<r;)l.push(this.createNode());n.length=r;for(var b=0;r>b;b++)n[b]=l[b];for(var b=0;b!==r;b++){var m=n[b];m.body=u[b],m.children.length=0,m.eqs.length=0,m.visited=!1}for(var N=0;N!==a;N++){var g=c[N],b=u.indexOf(g.bi),x=u.indexOf(g.bj),j=n[b],v=n[x];j.children.push(v),j.eqs.push(g),v.children.push(j),v.eqs.push(g)}var A,C=0,O=s;w.tolerance=this.tolerance,w.iterations=this.iterations;for(var h=y;A=o(n);){O.length=0,h.bodies.length=0,d(A,i,h.bodies,O);var k=O.length;O=O.sort(t);for(var b=0;b!==k;b++)w.addEquation(O[b]);{w.solve(e,h)}w.removeAllEquations(),C++}return C}},{"../math/Quaternion":28,"../math/Vec3":30,"../objects/Body":31,"./Solver":47}],49:[function(e,f){var n=function(){};f.exports=n,n.prototype={constructor:n,addEventListener:function(e,f){void 0===this._listeners&&(this._listeners={});var n=this._listeners;return void 0===n[e]&&(n[e]=[]),-1===n[e].indexOf(f)&&n[e].push(f),this},hasEventListener:function(e,f){if(void 0===this._listeners)return!1;var n=this._listeners;return void 0!==n[e]&&-1!==n[e].indexOf(f)?!0:!1},removeEventListener:function(e,f){if(void 0===this._listeners)return this;var n=this._listeners;if(void 0===n[e])return this;var o=n[e].indexOf(f);return-1!==o&&n[e].splice(o,1),this},dispatchEvent:function(e){if(void 0===this._listeners)return this;var f=this._listeners,n=f[e.type];if(void 0!==n){e.target=this;for(var o=0,d=n.length;d>o;o++)n[o].call(this,e)}return this}}},{}],50:[function(e,f){function n(e){e=e||{},this.root=e.root||null,this.aabb=e.aabb?e.aabb.clone():new d,this.data=[],this.children=[]}function o(e,f){f=f||{},f.root=null,f.aabb=e,n.call(this,f),this.maxDepth="undefined"!=typeof f.maxDepth?f.maxDepth:8}var d=e("../collision/AABB"),i=e("../math/Vec3");f.exports=o,o.prototype=new n,n.prototype.reset=function(){this.children.length=this.data.length=0},n.prototype.insert=function(e,f,n){var o=this.data;if(n=n||0,!this.aabb.contains(e))return!1;var d=this.children;if(n<(this.maxDepth||this.root.maxDepth)){var i=!1;d.length||(this.subdivide(),i=!0);for(var t=0;8!==t;t++)if(d[t].insert(e,f,n+1))return!0;i&&(d.length=0)}return o.push(f),!0};var t=new i;n.prototype.subdivide=function(){var e=this.aabb,f=e.lowerBound,o=e.upperBound,l=this.children;l.push(new n({aabb:new d({lowerBound:new i(0,0,0)})}),new n({aabb:new d({lowerBound:new i(1,0,0)})}),new n({aabb:new d({lowerBound:new i(1,1,0)})}),new n({aabb:new d({lowerBound:new i(1,1,1)})}),new n({aabb:new d({lowerBound:new i(0,1,1)})}),new n({aabb:new d({lowerBound:new i(0,0,1)})}),new n({aabb:new d({lowerBound:new i(1,0,1)})}),new n({aabb:new d({lowerBound:new i(0,1,0)})})),o.vsub(f,t),t.scale(.5,t);for(var u=this.root||this,p=0;8!==p;p++){var s=l[p];s.root=u;var y=s.aabb.lowerBound;y.x*=t.x,y.y*=t.y,y.z*=t.z,y.vadd(f,y),y.vadd(t,s.aabb.upperBound)}},n.prototype.aabbQuery=function(e,f){for(var n=(this.data,this.children,[this]);n.length;){var o=n.pop();o.aabb.overlaps(e)&&Array.prototype.push.apply(f,o.data),Array.prototype.push.apply(n,o.children)}return f};var l=new d;n.prototype.rayQuery=function(e,f,n){return e.getAABB(l),l.toLocalFrame(f,l),this.aabbQuery(l,n),n},n.prototype.removeEmptyNodes=function(){for(var e=[this];e.length;){for(var f=e.pop(),n=f.children.length-1;n>=0;n--)f.children[n].data.length||f.children.splice(n,1);Array.prototype.push.apply(e,f.children)}}},{"../collision/AABB":3,"../math/Vec3":30}],51:[function(e,f){function n(){this.objects=[],this.type=Object}f.exports=n,n.prototype.release=function(){for(var e=arguments.length,f=0;f!==e;f++)this.objects.push(arguments[f])},n.prototype.get=function(){return 0===this.objects.length?this.constructObject():this.objects.pop()},n.prototype.constructObject=function(){throw new Error("constructObject() not implemented in this Pool subclass yet!")}},{}],52:[function(e,f){function n(){this.data={keys:[]}}f.exports=n,n.prototype.get=function(e,f){if(e>f){var n=f;f=e,e=n}return this.data[e+"-"+f]},n.prototype.set=function(e,f,n){if(e>f){var o=f;f=e,e=o}var d=e+"-"+f;this.get(e,f)||this.data.keys.push(d),this.data[d]=n},n.prototype.reset=function(){for(var e=this.data,f=e.keys;f.length>0;){var n=f.pop();delete e[n]}}},{}],53:[function(e,f){function n(){}f.exports=n,n.defaults=function(e,f){e=e||{};for(var n in f)n in e||(e[n]=f[n]);return e}},{}],54:[function(e,f){function n(){d.call(this),this.type=o}f.exports=n;var o=e("../math/Vec3"),d=e("./Pool");n.prototype=new d,n.prototype.constructObject=function(){return new o}},{"../math/Vec3":30,"./Pool":51}],55:[function(e,f){function n(e){this.contactPointPool=[],this.frictionEquationPool=[],this.result=[],this.frictionResult=[],this.v3pool=new s,this.world=e,this.currentContactMaterial=null,this.enableFrictionReduction=!1}function o(e,f,n){for(var o=null,d=e.length,i=0;i!==d;i++){var t=e[i],l=M;e[(i+1)%d].vsub(t,l);var u=P;l.cross(f,u);var p=Q;n.vsub(t,p);var s=u.dot(p);if(!(null===o||s>0&&o===!0||0>=s&&o===!1))return!1;null===o&&(o=s>0)}return!0}f.exports=n;var d=e("../collision/AABB"),i=e("../shapes/Shape"),t=e("../collision/Ray"),l=e("../math/Vec3"),u=e("../math/Transform"),p=(e("../shapes/ConvexPolyhedron"),e("../math/Quaternion")),s=(e("../solver/Solver"),e("../utils/Vec3Pool")),y=e("../equations/ContactEquation"),c=e("../equations/FrictionEquation");n.prototype.createContactEquation=function(e,f,n,o,d,i){var t;this.contactPointPool.length?(t=this.contactPointPool.pop(),t.bi=e,t.bj=f):t=new y(e,f),t.enabled=e.collisionResponse&&f.collisionResponse&&n.collisionResponse&&o.collisionResponse;var l=this.currentContactMaterial;t.restitution=l.restitution,t.setSpookParams(l.contactEquationStiffness,l.contactEquationRelaxation,this.world.dt);var u=n.material||e.material,p=o.material||f.material;return u&&p&&u.restitution>=0&&p.restitution>=0&&(t.restitution=u.restitution*p.restitution),t.si=d||n,t.sj=i||o,t},n.prototype.createFrictionEquationsFromContact=function(e,f){var n=e.bi,o=e.bj,d=e.si,i=e.sj,t=this.world,l=this.currentContactMaterial,u=l.friction,p=d.material||n.material,s=i.material||o.material;if(p&&s&&p.friction>=0&&s.friction>=0&&(u=p.friction*s.friction),u>0){var y=u*t.gravity.length(),a=n.invMass+o.invMass;a>0&&(a=1/a);var r=this.frictionEquationPool,w=r.length?r.pop():new c(n,o,y*a),b=r.length?r.pop():new c(n,o,y*a);return w.bi=b.bi=n,w.bj=b.bj=o,w.minForce=b.minForce=-y*a,w.maxForce=b.maxForce=y*a,w.ri.copy(e.ri),w.rj.copy(e.rj),b.ri.copy(e.ri),b.rj.copy(e.rj),e.ni.tangents(w.t,b.t),w.setSpookParams(l.frictionEquationStiffness,l.frictionEquationRelaxation,t.dt),b.setSpookParams(l.frictionEquationStiffness,l.frictionEquationRelaxation,t.dt),w.enabled=b.enabled=e.enabled,f.push(w,b),!0}return!1};var a=new l,r=new l,w=new l;n.prototype.createFrictionFromAverage=function(e){var f=this.result[this.result.length-1];if(this.createFrictionEquationsFromContact(f,this.frictionResult)&&1!==e){var n=this.frictionResult[this.frictionResult.length-2],o=this.frictionResult[this.frictionResult.length-1];a.setZero(),r.setZero(),w.setZero();for(var d=f.bi,i=(f.bj,0);i!==e;i++)f=this.result[this.result.length-1-i],f.bodyA!==d?(a.vadd(f.ni,a),r.vadd(f.ri,r),w.vadd(f.rj,w)):(a.vsub(f.ni,a),r.vadd(f.rj,r),w.vadd(f.ri,w));var t=1/e;r.scale(t,n.ri),w.scale(t,n.rj),o.ri.copy(n.ri),o.rj.copy(n.rj),a.normalize(),a.tangents(n.t,o.t)}};var b=new l,m=new l,N=new p,g=new p;n.prototype.getContacts=function(e,f,n,o,d,i,t){this.contactPointPool=d,this.frictionEquationPool=t,this.result=o,this.frictionResult=i;for(var l=N,u=g,p=b,s=m,y=0,c=e.length;y!==c;y++){var a=e[y],r=f[y],w=null;a.material&&r.material&&(w=n.getContactMaterial(a.material,r.material)||null);for(var x=0;x<a.shapes.length;x++){a.quaternion.mult(a.shapeOrientations[x],l),a.quaternion.vmult(a.shapeOffsets[x],p),p.vadd(a.position,p);for(var j=a.shapes[x],v=0;v<r.shapes.length;v++){r.quaternion.mult(r.shapeOrientations[v],u),r.quaternion.vmult(r.shapeOffsets[v],s),s.vadd(r.position,s);var A=r.shapes[v];if(!(p.distanceTo(s)>j.boundingSphereRadius+A.boundingSphereRadius)){var C=null;j.material&&A.material&&(C=n.getContactMaterial(j.material,A.material)||null),this.currentContactMaterial=C||w||n.defaultContactMaterial;var O=this[j.type|A.type];O&&(j.type<A.type?O.call(this,j,A,p,s,l,u,a,r,j,A):O.call(this,A,j,s,p,u,l,r,a,j,A))}}}}};n.prototype[i.types.BOX|i.types.BOX]=n.prototype.boxBox=function(e,f,n,o,d,i,t,l){e.convexPolyhedronRepresentation.material=e.material,f.convexPolyhedronRepresentation.material=f.material,e.convexPolyhedronRepresentation.collisionResponse=e.collisionResponse,f.convexPolyhedronRepresentation.collisionResponse=f.collisionResponse,this.convexConvex(e.convexPolyhedronRepresentation,f.convexPolyhedronRepresentation,n,o,d,i,t,l,e,f)},n.prototype[i.types.BOX|i.types.CONVEXPOLYHEDRON]=n.prototype.boxConvex=function(e,f,n,o,d,i,t,l){e.convexPolyhedronRepresentation.material=e.material,e.convexPolyhedronRepresentation.collisionResponse=e.collisionResponse,this.convexConvex(e.convexPolyhedronRepresentation,f,n,o,d,i,t,l,e,f)},n.prototype[i.types.BOX|i.types.PARTICLE]=n.prototype.boxParticle=function(e,f,n,o,d,i,t,l){e.convexPolyhedronRepresentation.material=e.material,e.convexPolyhedronRepresentation.collisionResponse=e.collisionResponse,this.convexParticle(e.convexPolyhedronRepresentation,f,n,o,d,i,t,l,e,f)},n.prototype[i.types.SPHERE]=n.prototype.sphereSphere=function(e,f,n,o,d,i,t,l){var u=this.createContactEquation(t,l,e,f);o.vsub(n,u.ni),u.ni.normalize(),u.ri.copy(u.ni),u.rj.copy(u.ni),u.ri.mult(e.radius,u.ri),u.rj.mult(-f.radius,u.rj),u.ri.vadd(n,u.ri),u.ri.vsub(t.position,u.ri),u.rj.vadd(o,u.rj),u.rj.vsub(l.position,u.rj),this.result.push(u),this.createFrictionEquationsFromContact(u,this.frictionResult)};var x=new l,j=new l,v=new l;n.prototype[i.types.PLANE|i.types.TRIMESH]=n.prototype.planeTrimesh=function(e,f,n,o,d,i,t,p){var s=new l,y=x;y.set(0,0,1),d.vmult(y,y);for(var c=0;c<f.vertices.length/3;c++){f.getVertex(c,s);var a=new l;a.copy(s),u.pointToWorldFrame(o,i,a,s);var r=j;s.vsub(n,r);var w=y.dot(r);if(0>=w){var b=this.createContactEquation(t,p,e,f);b.ni.copy(y);var m=v;y.scale(r.dot(y),m),s.vsub(m,m),b.ri.copy(m),b.ri.vsub(t.position,b.ri),b.rj.copy(s),b.rj.vsub(p.position,b.rj),this.result.push(b),this.createFrictionEquationsFromContact(b,this.frictionResult)}}};var A=new l,C=new l,O=(new l,new l),h=new l,k=new l,q=new l,z=new l,B=new l,D=new l,E=new l,F=new l,G=new l,H=new l,I=new d,J=[];n.prototype[i.types.SPHERE|i.types.TRIMESH]=n.prototype.sphereTrimesh=function(e,f,n,o,d,i,l,p){var s=k,y=q,c=z,a=B,r=D,w=E,b=I,m=h,N=C,g=J;u.pointToLocalFrame(o,i,n,r);var x=e.radius;b.lowerBound.set(r.x-x,r.y-x,r.z-x),b.upperBound.set(r.x+x,r.y+x,r.z+x),f.getTrianglesInAABB(b,g);for(var j=O,v=e.radius*e.radius,K=0;K<g.length;K++)for(var L=0;3>L;L++)if(f.getVertex(f.indices[3*g[K]+L],j),j.vsub(r,N),N.norm2()<=v){m.copy(j),u.pointToWorldFrame(o,i,m,j),j.vsub(n,N);var M=this.createContactEquation(l,p,e,f);M.ni.copy(N),M.ni.normalize(),M.ri.copy(M.ni),M.ri.scale(e.radius,M.ri),M.ri.vadd(n,M.ri),M.ri.vsub(l.position,M.ri),M.rj.copy(j),M.rj.vsub(p.position,M.rj),this.result.push(M),this.createFrictionEquationsFromContact(M,this.frictionResult)}for(var K=0;K<g.length;K++)for(var L=0;3>L;L++){f.getVertex(f.indices[3*g[K]+L],s),f.getVertex(f.indices[3*g[K]+(L+1)%3],y),y.vsub(s,c),r.vsub(y,w);var P=w.dot(c);r.vsub(s,w);var Q=w.dot(c);if(Q>0&&0>P){r.vsub(s,w),a.copy(c),a.normalize(),Q=w.dot(a),a.scale(Q,w),w.vadd(s,w);var R=w.distanceTo(r);if(R<e.radius){var M=this.createContactEquation(l,p,e,f);w.vsub(r,M.ni),M.ni.normalize(),M.ni.scale(e.radius,M.ri),u.pointToWorldFrame(o,i,w,w),w.vsub(p.position,M.rj),u.vectorToWorldFrame(i,M.ni,M.ni),u.vectorToWorldFrame(i,M.ri,M.ri),this.result.push(M),this.createFrictionEquationsFromContact(M,this.frictionResult)}}}for(var S=F,T=G,U=H,V=A,K=0,W=g.length;K!==W;K++){f.getTriangleVertices(g[K],S,T,U),f.getNormal(g[K],V),r.vsub(S,w);var R=w.dot(V);if(V.scale(R,w),r.vsub(w,w),R=w.distanceTo(r),t.pointInTriangle(w,S,T,U)&&R<e.radius){var M=this.createContactEquation(l,p,e,f);w.vsub(r,M.ni),M.ni.normalize(),M.ni.scale(e.radius,M.ri),u.pointToWorldFrame(o,i,w,w),w.vsub(p.position,M.rj),u.vectorToWorldFrame(i,M.ni,M.ni),u.vectorToWorldFrame(i,M.ri,M.ri),this.result.push(M),this.createFrictionEquationsFromContact(M,this.frictionResult)}}g.length=0};var K=new l,L=new l;n.prototype[i.types.SPHERE|i.types.PLANE]=n.prototype.spherePlane=function(e,f,n,o,d,i,t,l){var u=this.createContactEquation(t,l,e,f);if(u.ni.set(0,0,1),i.vmult(u.ni,u.ni),u.ni.negate(u.ni),u.ni.normalize(),u.ni.mult(e.radius,u.ri),n.vsub(o,K),u.ni.mult(u.ni.dot(K),L),K.vsub(L,u.rj),-K.dot(u.ni)<=e.radius){var p=u.ri,s=u.rj;p.vadd(n,p),p.vsub(t.position,p),s.vadd(o,s),s.vsub(l.position,s),this.result.push(u),this.createFrictionEquationsFromContact(u,this.frictionResult)}};var M=new l,P=new l,Q=new l,R=new l,S=new l,T=new l,U=new l,V=[new l,new l,new l,new l,new l,new l],W=new l,X=new l,Y=new l,Z=new l;n.prototype[i.types.SPHERE|i.types.BOX]=n.prototype.sphereBox=function(e,f,n,o,d,i,t,l){var u=this.v3pool,p=V;n.vsub(o,R),f.getSideNormals(p,i);for(var s=e.radius,y=!1,c=X,a=Y,r=Z,w=null,b=0,m=0,N=0,g=null,x=0,j=p.length;x!==j&&y===!1;x++){var v=S;v.copy(p[x]);var A=v.norm();v.normalize();var C=R.dot(v);if(A+s>C&&C>0){var O=T,h=U;O.copy(p[(x+1)%3]),h.copy(p[(x+2)%3]);var k=O.norm(),q=h.norm();O.normalize(),h.normalize();var z=R.dot(O),B=R.dot(h);if(k>z&&z>-k&&q>B&&B>-q){var D=Math.abs(C-A-s);(null===g||g>D)&&(g=D,m=z,N=B,w=A,c.copy(v),a.copy(O),r.copy(h),b++)}}}if(b){y=!0;var E=this.createContactEquation(t,l,e,f);c.mult(-s,E.ri),E.ni.copy(c),E.ni.negate(E.ni),c.mult(w,c),a.mult(m,a),c.vadd(a,c),r.mult(N,r),c.vadd(r,E.rj),E.ri.vadd(n,E.ri),E.ri.vsub(t.position,E.ri),E.rj.vadd(o,E.rj),E.rj.vsub(l.position,E.rj),this.result.push(E),this.createFrictionEquationsFromContact(E,this.frictionResult)}for(var F=u.get(),G=W,H=0;2!==H&&!y;H++)for(var I=0;2!==I&&!y;I++)for(var J=0;2!==J&&!y;J++)if(F.set(0,0,0),H?F.vadd(p[0],F):F.vsub(p[0],F),I?F.vadd(p[1],F):F.vsub(p[1],F),J?F.vadd(p[2],F):F.vsub(p[2],F),o.vadd(F,G),G.vsub(n,G),G.norm2()<s*s){y=!0;var E=this.createContactEquation(t,l,e,f);E.ri.copy(G),E.ri.normalize(),E.ni.copy(E.ri),E.ri.mult(s,E.ri),E.rj.copy(F),E.ri.vadd(n,E.ri),E.ri.vsub(t.position,E.ri),E.rj.vadd(o,E.rj),E.rj.vsub(l.position,E.rj),this.result.push(E),this.createFrictionEquationsFromContact(E,this.frictionResult)}u.release(F),F=null;for(var K=u.get(),L=u.get(),E=u.get(),M=u.get(),D=u.get(),P=p.length,H=0;H!==P&&!y;H++)for(var I=0;I!==P&&!y;I++)if(H%3!==I%3){p[I].cross(p[H],K),K.normalize(),p[H].vadd(p[I],L),E.copy(n),E.vsub(L,E),E.vsub(o,E);var Q=E.dot(K);K.mult(Q,M);for(var J=0;J===H%3||J===I%3;)J++;D.copy(n),D.vsub(M,D),D.vsub(L,D),D.vsub(o,D);var $=Math.abs(Q),_=D.norm();if($<p[J].norm()&&s>_){y=!0;var ef=this.createContactEquation(t,l,e,f);L.vadd(M,ef.rj),ef.rj.copy(ef.rj),D.negate(ef.ni),ef.ni.normalize(),ef.ri.copy(ef.rj),ef.ri.vadd(o,ef.ri),ef.ri.vsub(n,ef.ri),ef.ri.normalize(),ef.ri.mult(s,ef.ri),ef.ri.vadd(n,ef.ri),ef.ri.vsub(t.position,ef.ri),ef.rj.vadd(o,ef.rj),ef.rj.vsub(l.position,ef.rj),this.result.push(ef),this.createFrictionEquationsFromContact(ef,this.frictionResult)}}u.release(K,L,E,M,D)};var $=new l,_=new l,ef=new l,ff=new l,nf=new l,of=new l,df=new l,tf=new l,lf=new l,uf=new l;n.prototype[i.types.SPHERE|i.types.CONVEXPOLYHEDRON]=n.prototype.sphereConvex=function(e,f,n,d,i,t,l,u){var p=this.v3pool;n.vsub(d,$);for(var s=f.faceNormals,y=f.faces,c=f.vertices,a=e.radius,r=0;r!==c.length;r++){var w=c[r],b=nf;t.vmult(w,b),d.vadd(b,b);var m=ff;if(b.vsub(n,m),m.norm2()<a*a){g=!0;var N=this.createContactEquation(l,u,e,f);return N.ri.copy(m),N.ri.normalize(),N.ni.copy(N.ri),N.ri.mult(a,N.ri),b.vsub(d,N.rj),N.ri.vadd(n,N.ri),N.ri.vsub(l.position,N.ri),N.rj.vadd(d,N.rj),N.rj.vsub(u.position,N.rj),this.result.push(N),void this.createFrictionEquationsFromContact(N,this.frictionResult)}}for(var g=!1,r=0,x=y.length;r!==x&&g===!1;r++){var j=s[r],v=y[r],A=of;t.vmult(j,A);var C=df;t.vmult(c[v[0]],C),C.vadd(d,C);var O=tf;A.mult(-a,O),n.vadd(O,O);var h=lf;O.vsub(C,h);var k=h.dot(A),q=uf;if(n.vsub(C,q),0>k&&q.dot(A)>0){for(var z=[],B=0,D=v.length;B!==D;B++){var E=p.get();t.vmult(c[v[B]],E),d.vadd(E,E),z.push(E)}if(o(z,A,n)){g=!0;var N=this.createContactEquation(l,u,e,f);A.mult(-a,N.ri),A.negate(N.ni);var F=p.get();A.mult(-k,F);var G=p.get();A.mult(-a,G),n.vsub(d,N.rj),N.rj.vadd(G,N.rj),N.rj.vadd(F,N.rj),N.rj.vadd(d,N.rj),N.rj.vsub(u.position,N.rj),N.ri.vadd(n,N.ri),N.ri.vsub(l.position,N.ri),p.release(F),p.release(G),this.result.push(N),this.createFrictionEquationsFromContact(N,this.frictionResult);for(var B=0,H=z.length;B!==H;B++)p.release(z[B]);return}for(var B=0;B!==v.length;B++){var I=p.get(),J=p.get();t.vmult(c[v[(B+1)%v.length]],I),t.vmult(c[v[(B+2)%v.length]],J),d.vadd(I,I),d.vadd(J,J);var K=_;J.vsub(I,K);var L=ef;K.unit(L);var M=p.get(),P=p.get();n.vsub(I,P);var Q=P.dot(L);L.mult(Q,M),M.vadd(I,M);var R=p.get();if(M.vsub(n,R),Q>0&&Q*Q<K.norm2()&&R.norm2()<a*a){var N=this.createContactEquation(l,u,e,f);M.vsub(d,N.rj),M.vsub(n,N.ni),N.ni.normalize(),N.ni.mult(a,N.ri),N.rj.vadd(d,N.rj),N.rj.vsub(u.position,N.rj),N.ri.vadd(n,N.ri),N.ri.vsub(l.position,N.ri),this.result.push(N),this.createFrictionEquationsFromContact(N,this.frictionResult);for(var B=0,H=z.length;B!==H;B++)p.release(z[B]);return p.release(I),p.release(J),p.release(M),p.release(R),void p.release(P)}p.release(I),p.release(J),p.release(M),p.release(R),p.release(P)}for(var B=0,H=z.length;B!==H;B++)p.release(z[B])}}};new l,new l;n.prototype[i.types.PLANE|i.types.BOX]=n.prototype.planeBox=function(e,f,n,o,d,i,t,l){f.convexPolyhedronRepresentation.material=f.material,f.convexPolyhedronRepresentation.collisionResponse=f.collisionResponse,this.planeConvex(e,f.convexPolyhedronRepresentation,n,o,d,i,t,l)};var pf=new l,sf=new l,yf=new l,cf=new l;n.prototype[i.types.PLANE|i.types.CONVEXPOLYHEDRON]=n.prototype.planeConvex=function(e,f,n,o,d,i,t,l){var u=pf,p=sf;p.set(0,0,1),d.vmult(p,p);for(var s=0,y=yf,c=0;c!==f.vertices.length;c++){u.copy(f.vertices[c]),i.vmult(u,u),o.vadd(u,u),u.vsub(n,y);var a=p.dot(y);if(0>=a){var r=this.createContactEquation(t,l,e,f),w=cf;p.mult(p.dot(y),w),u.vsub(w,w),w.vsub(n,r.ri),r.ni.copy(p),u.vsub(o,r.rj),r.ri.vadd(n,r.ri),r.ri.vsub(t.position,r.ri),r.rj.vadd(o,r.rj),r.rj.vsub(l.position,r.rj),this.result.push(r),s++,this.enableFrictionReduction||this.createFrictionEquationsFromContact(r,this.frictionResult)}}this.enableFrictionReduction&&s&&this.createFrictionFromAverage(s)};var af=new l,rf=new l;n.prototype[i.types.CONVEXPOLYHEDRON]=n.prototype.convexConvex=function(e,f,n,o,d,i,t,l,u,p,s,y){var c=af;if(!(n.distanceTo(o)>e.boundingSphereRadius+f.boundingSphereRadius)&&e.findSeparatingAxis(f,n,d,o,i,c,s,y)){var a=[],r=rf;e.clipAgainstHull(n,d,f,o,i,c,-100,100,a);for(var w=0,b=0;b!==a.length;b++){var m=this.createContactEquation(t,l,e,f,u,p),N=m.ri,g=m.rj;c.negate(m.ni),a[b].normal.negate(r),r.mult(a[b].depth,r),a[b].point.vadd(r,N),g.copy(a[b].point),N.vsub(n,N),g.vsub(o,g),N.vadd(n,N),N.vsub(t.position,N),g.vadd(o,g),g.vsub(l.position,g),this.result.push(m),w++,this.enableFrictionReduction||this.createFrictionEquationsFromContact(m,this.frictionResult)}this.enableFrictionReduction&&w&&this.createFrictionFromAverage(w)}};var wf=new l,bf=new l,mf=new l;n.prototype[i.types.PLANE|i.types.PARTICLE]=n.prototype.planeParticle=function(e,f,n,o,d,i,t,l){var u=wf;u.set(0,0,1),t.quaternion.vmult(u,u);var p=bf;o.vsub(t.position,p);var s=u.dot(p);if(0>=s){var y=this.createContactEquation(l,t,f,e);y.ni.copy(u),y.ni.negate(y.ni),y.ri.set(0,0,0);var c=mf;u.mult(u.dot(o),c),o.vsub(c,c),y.rj.copy(c),this.result.push(y),this.createFrictionEquationsFromContact(y,this.frictionResult)}};var Nf=new l;n.prototype[i.types.PARTICLE|i.types.SPHERE]=n.prototype.sphereParticle=function(e,f,n,o,d,i,t,l){var u=Nf;u.set(0,0,1),o.vsub(n,u);var p=u.norm2();if(p<=e.radius*e.radius){var s=this.createContactEquation(l,t,f,e);u.normalize(),s.rj.copy(u),s.rj.mult(e.radius,s.rj),s.ni.copy(u),s.ni.negate(s.ni),s.ri.set(0,0,0),this.result.push(s),this.createFrictionEquationsFromContact(s,this.frictionResult)}};var gf=new p,xf=new l,jf=(new l,new l),vf=new l,Af=new l;n.prototype[i.types.PARTICLE|i.types.CONVEXPOLYHEDRON]=n.prototype.convexParticle=function(e,f,n,o,d,i,t,l){var u=-1,p=jf,s=Af,y=null,c=0,a=xf;if(a.copy(o),a.vsub(n,a),d.conjugate(gf),gf.vmult(a,a),e.pointIsInside(a)){e.worldVerticesNeedsUpdate&&e.computeWorldVertices(n,d),e.worldFaceNormalsNeedsUpdate&&e.computeWorldFaceNormals(d);for(var r=0,w=e.faces.length;r!==w;r++){var b=[e.worldVertices[e.faces[r][0]]],m=e.worldFaceNormals[r];o.vsub(b[0],vf);var N=-m.dot(vf);(null===y||Math.abs(N)<Math.abs(y))&&(y=N,u=r,p.copy(m),c++)}if(-1!==u){var g=this.createContactEquation(l,t,f,e);p.mult(y,s),s.vadd(o,s),s.vsub(n,s),g.rj.copy(s),p.negate(g.ni),g.ri.set(0,0,0);var x=g.ri,j=g.rj;x.vadd(o,x),x.vsub(l.position,x),j.vadd(n,j),j.vsub(t.position,j),this.result.push(g),this.createFrictionEquationsFromContact(g,this.frictionResult)}else console.warn("Point found inside convex, but did not find penetrating face!")}},n.prototype[i.types.BOX|i.types.HEIGHTFIELD]=n.prototype.boxHeightfield=function(e,f,n,o,d,i,t,l){e.convexPolyhedronRepresentation.material=e.material,e.convexPolyhedronRepresentation.collisionResponse=e.collisionResponse,this.convexHeightfield(e.convexPolyhedronRepresentation,f,n,o,d,i,t,l)};var Cf=new l,Of=new l,hf=[0];n.prototype[i.types.CONVEXPOLYHEDRON|i.types.HEIGHTFIELD]=n.prototype.convexHeightfield=function(e,f,n,o,d,i,t,l){var p=f.data,s=f.elementSize,y=e.boundingSphereRadius,c=Of,a=hf,r=Cf;u.pointToLocalFrame(o,i,n,r);var w=Math.floor((r.x-y)/s)-1,b=Math.ceil((r.x+y)/s)+1,m=Math.floor((r.y-y)/s)-1,N=Math.ceil((r.y+y)/s)+1;if(!(0>b||0>N||w>p.length||m>p[0].length)){0>w&&(w=0),0>b&&(b=0),0>m&&(m=0),0>N&&(N=0),w>=p.length&&(w=p.length-1),b>=p.length&&(b=p.length-1),N>=p[0].length&&(N=p[0].length-1),m>=p[0].length&&(m=p[0].length-1);var g=[];f.getRectMinMax(w,m,b,N,g);var x=g[0],j=g[1];if(!(r.z-y>j||r.z+y<x))for(var v=w;b>v;v++)for(var A=m;N>A;A++)f.getConvexTrianglePillar(v,A,!1),u.pointToWorldFrame(o,i,f.pillarOffset,c),n.distanceTo(c)<f.pillarConvex.boundingSphereRadius+e.boundingSphereRadius&&this.convexConvex(e,f.pillarConvex,n,c,d,i,t,l,null,null,a,null),f.getConvexTrianglePillar(v,A,!0),u.pointToWorldFrame(o,i,f.pillarOffset,c),n.distanceTo(c)<f.pillarConvex.boundingSphereRadius+e.boundingSphereRadius&&this.convexConvex(e,f.pillarConvex,n,c,d,i,t,l,null,null,a,null)}};var kf=new l,qf=new l;n.prototype[i.types.SPHERE|i.types.HEIGHTFIELD]=n.prototype.sphereHeightfield=function(e,f,n,o,d,i,t,l){var p=f.data,s=e.radius,y=f.elementSize,c=qf,a=kf;u.pointToLocalFrame(o,i,n,a);var r=Math.floor((a.x-s)/y)-1,w=Math.ceil((a.x+s)/y)+1,b=Math.floor((a.y-s)/y)-1,m=Math.ceil((a.y+s)/y)+1;if(!(0>w||0>m||r>p.length||m>p[0].length)){0>r&&(r=0),0>w&&(w=0),0>b&&(b=0),0>m&&(m=0),r>=p.length&&(r=p.length-1),w>=p.length&&(w=p.length-1),m>=p[0].length&&(m=p[0].length-1),b>=p[0].length&&(b=p[0].length-1);var N=[];f.getRectMinMax(r,b,w,m,N);var g=N[0],x=N[1];if(!(a.z-s>x||a.z+s<g))for(var j=this.result,v=r;w>v;v++)for(var A=b;m>A;A++){var C=j.length;f.getConvexTrianglePillar(v,A,!1),u.pointToWorldFrame(o,i,f.pillarOffset,c),n.distanceTo(c)<f.pillarConvex.boundingSphereRadius+e.boundingSphereRadius&&this.sphereConvex(e,f.pillarConvex,n,c,d,i,t,l),f.getConvexTrianglePillar(v,A,!0),u.pointToWorldFrame(o,i,f.pillarOffset,c),n.distanceTo(c)<f.pillarConvex.boundingSphereRadius+e.boundingSphereRadius&&this.sphereConvex(e,f.pillarConvex,n,c,d,i,t,l);var O=j.length-C;if(O>2)return}}}},{"../collision/AABB":3,"../collision/Ray":9,"../equations/ContactEquation":19,"../equations/FrictionEquation":21,"../math/Quaternion":28,"../math/Transform":29,"../math/Vec3":30,"../shapes/ConvexPolyhedron":38,"../shapes/Shape":43,"../solver/Solver":47,"../utils/Vec3Pool":54}],56:[function(e,f){function n(){u.apply(this),this.dt=-1,this.allowSleep=!1,this.contacts=[],this.frictionEquations=[],this.quatNormalizeSkip=0,this.quatNormalizeFast=!1,this.time=0,this.stepnumber=0,this.default_dt=1/60,this.nextId=0,this.gravity=new d,this.broadphase=new m,this.bodies=[],this.solver=new t,this.constraints=[],this.narrowphase=new l(this),this.collisionMatrix=new p,this.collisionMatrixPrevious=new p,this.materials=[],this.contactmaterials=[],this.contactMaterialTable=new a,this.defaultMaterial=new s("default"),this.defaultContactMaterial=new y(this.defaultMaterial,this.defaultMaterial,{friction:.3,restitution:0}),this.doProfiling=!1,this.profile={solve:0,makeContactConstraints:0,broadphase:0,integrate:0,narrowphase:0},this.subsystems=[],this.addBodyEvent={type:"addBody",body:null},this.removeBodyEvent={type:"removeBody",body:null}}f.exports=n;var o=e("../shapes/Shape"),d=e("../math/Vec3"),i=e("../math/Quaternion"),t=e("../solver/GSSolver"),l=(e("../utils/Vec3Pool"),e("../equations/ContactEquation"),e("../equations/FrictionEquation"),e("./Narrowphase")),u=e("../utils/EventTarget"),p=e("../collision/ArrayCollisionMatrix"),s=e("../material/Material"),y=e("../material/ContactMaterial"),c=e("../objects/Body"),a=e("../utils/TupleDictionary"),r=e("../collision/RaycastResult"),w=e("../collision/AABB"),b=e("../collision/Ray"),m=e("../collision/NaiveBroadphase");n.prototype=new u;var N=(new w,new b);if(n.prototype.getContactMaterial=function(e,f){return this.contactMaterialTable.get(e.id,f.id)},n.prototype.numObjects=function(){return this.bodies.length},n.prototype.collisionMatrixTick=function(){var e=this.collisionMatrixPrevious;this.collisionMatrixPrevious=this.collisionMatrix,this.collisionMatrix=e,this.collisionMatrix.reset()},n.prototype.add=n.prototype.addBody=function(e){-1===this.bodies.indexOf(e)&&(e.index=this.bodies.length,this.bodies.push(e),e.world=this,e.initPosition.copy(e.position),e.initVelocity.copy(e.velocity),e.timeLastSleepy=this.time,e instanceof c&&(e.initAngularVelocity.copy(e.angularVelocity),e.initQuaternion.copy(e.quaternion)),this.collisionMatrix.setNumObjects(this.bodies.length),this.addBodyEvent.body=e,this.dispatchEvent(this.addBodyEvent))},n.prototype.addConstraint=function(e){this.constraints.push(e)},n.prototype.removeConstraint=function(e){var f=this.constraints.indexOf(e);-1!==f&&this.constraints.splice(f,1)},n.prototype.rayTest=function(e,f,n){n instanceof r?this.raycastClosest(e,f,{skipBackfaces:!0},n):this.raycastAll(e,f,{skipBackfaces:!0},n)},n.prototype.raycastAll=function(e,f,n,o){return n.mode=b.ALL,n.from=e,n.to=f,n.callback=o,N.intersectWorld(this,n)},n.prototype.raycastAny=function(e,f,n,o){return n.mode=b.ANY,n.from=e,n.to=f,n.result=o,N.intersectWorld(this,n)},n.prototype.raycastClosest=function(e,f,n,o){return n.mode=b.CLOSEST,n.from=e,n.to=f,n.result=o,N.intersectWorld(this,n)},n.prototype.remove=function(e){e.world=null;var f=this.bodies.length-1,n=this.bodies,o=n.indexOf(e);if(-1!==o){n.splice(o,1);for(var d=0;d!==n.length;d++)n[d].index=d;this.collisionMatrix.setNumObjects(f),this.removeBodyEvent.body=e,this.dispatchEvent(this.removeBodyEvent)}},n.prototype.removeBody=n.prototype.remove,n.prototype.addMaterial=function(e){this.materials.push(e)},n.prototype.addContactMaterial=function(e){this.contactmaterials.push(e),this.contactMaterialTable.set(e.materials[0].id,e.materials[1].id,e)},"undefined"==typeof performance&&(performance={}),!performance.now){var g=Date.now();performance.timing&&performance.timing.navigationStart&&(g=performance.timing.navigationStart),performance.now=function(){return Date.now()-g}}var x=new d;n.prototype.step=function(e,f,n){if(n=n||10,f=f||0,0===f)this.internalStep(e),this.time+=e;else{var o=Math.floor((this.time+f)/e)-Math.floor(this.time/e);o=Math.min(o,n);for(var d=performance.now(),i=0;i!==o&&(this.internalStep(e),!(performance.now()-d>1e3*e));i++);this.time+=f;for(var t=this.time%e,l=t/e,u=x,p=this.bodies,s=0;s!==p.length;s++){var y=p[s];y.type!==c.STATIC&&y.sleepState!==c.SLEEPING?(y.position.vsub(y.previousPosition,u),u.scale(l,u),y.position.vadd(u,y.interpolatedPosition)):(y.interpolatedPosition.copy(y.position),y.interpolatedQuaternion.copy(y.quaternion))}}};var j={type:"postStep"},v={type:"preStep"},A={type:"collide",body:null,contact:null},C=[],O=[],h=[],k=[],q=(new d,new d,new d,new d,new d,new d,new d,new d,new d,new i,new i),z=new i,B=new d;n.prototype.internalStep=function(e){this.dt=e;var f,n=this.contacts,d=h,i=k,t=this.numObjects(),l=this.bodies,u=this.solver,p=this.gravity,s=this.doProfiling,y=this.profile,a=c.DYNAMIC,r=this.constraints,w=O,b=(p.norm(),p.x),m=p.y,N=p.z,g=0;for(s&&(f=performance.now()),g=0;g!==t;g++){var x=l[g];if(x.type&a){var D=x.force,E=x.mass;D.x+=E*b,D.y+=E*m,D.z+=E*N}}for(var g=0,F=this.subsystems.length;g!==F;g++)this.subsystems[g].update();s&&(f=performance.now()),d.length=0,i.length=0,this.broadphase.collisionPairs(this,d,i),s&&(y.broadphase=performance.now()-f);var G=r.length;for(g=0;g!==G;g++){var H=r[g];if(!H.collideConnected)for(var I=d.length-1;I>=0;I-=1)(H.bodyA===d[I]&&H.bodyB===i[I]||H.bodyB===d[I]&&H.bodyA===i[I])&&(d.splice(I,1),i.splice(I,1))}this.collisionMatrixTick(),s&&(f=performance.now());var J=C,K=n.length;for(g=0;g!==K;g++)J.push(n[g]);n.length=0;var L=this.frictionEquations.length;for(g=0;g!==L;g++)w.push(this.frictionEquations[g]);this.frictionEquations.length=0,this.narrowphase.getContacts(d,i,this,n,J,this.frictionEquations,w),s&&(y.narrowphase=performance.now()-f),s&&(f=performance.now());for(var g=0;g<this.frictionEquations.length;g++)u.addEquation(this.frictionEquations[g]);for(var M=n.length,P=0;P!==M;P++){{var Q,H=n[P],x=H.bi,R=H.bj;H.si,H.sj}Q=x.material&&R.material?this.getContactMaterial(x.material,R.material)||this.defaultContactMaterial:this.defaultContactMaterial;var S=Q.friction;if(x.material&&R.material&&(x.material.friction>=0&&R.material.friction>=0&&(S=x.material.friction*R.material.friction),x.material.restitution>=0&&R.material.restitution>=0&&(H.restitution=x.material.restitution*R.material.restitution)),u.addEquation(H),x.allowSleep&&x.type===c.DYNAMIC&&x.sleepState===c.SLEEPING&&R.sleepState===c.AWAKE&&R.type!==c.STATIC){var T=R.velocity.norm2()+R.angularVelocity.norm2(),U=Math.pow(R.sleepSpeedLimit,2);
T>=2*U&&(x._wakeUpAfterNarrowphase=!0)}if(R.allowSleep&&R.type===c.DYNAMIC&&R.sleepState===c.SLEEPING&&x.sleepState===c.AWAKE&&x.type!==c.STATIC){var V=x.velocity.norm2()+x.angularVelocity.norm2(),W=Math.pow(x.sleepSpeedLimit,2);V>=2*W&&(R._wakeUpAfterNarrowphase=!0)}this.collisionMatrix.set(x,R,!0),this.collisionMatrixPrevious.get(x,R)||(A.body=R,A.contact=H,x.dispatchEvent(A),A.body=x,R.dispatchEvent(A))}for(s&&(y.makeContactConstraints=performance.now()-f,f=performance.now()),g=0;g!==t;g++){var x=l[g];x._wakeUpAfterNarrowphase&&(x.wakeUp(),x._wakeUpAfterNarrowphase=!1)}var G=r.length;for(g=0;g!==G;g++){var H=r[g];H.update();for(var I=0,X=H.equations.length;I!==X;I++){var Y=H.equations[I];u.addEquation(Y)}}u.solve(e,this),s&&(y.solve=performance.now()-f),u.removeAllEquations();var Z=Math.pow;for(g=0;g!==t;g++){var x=l[g];if(x.type&a){var $=Z(1-x.linearDamping,e),_=x.velocity;_.mult($,_);var ef=x.angularVelocity;if(ef){var ff=Z(1-x.angularDamping,e);ef.mult(ff,ef)}}}for(this.dispatchEvent(v),g=0;g!==t;g++){var x=l[g];x.preStep&&x.preStep.call(x)}s&&(f=performance.now());{var nf=q,of=z,df=this.stepnumber,tf=c.DYNAMIC|c.KINEMATIC,lf=df%(this.quatNormalizeSkip+1)===0,uf=this.quatNormalizeFast,pf=.5*e;o.types.PLANE,o.types.CONVEXPOLYHEDRON}for(g=0;g!==t;g++){var sf=l[g],yf=sf.force,cf=sf.torque;if(sf.type&tf&&sf.sleepState!==c.SLEEPING){var af=sf.velocity,rf=sf.angularVelocity,wf=sf.position,bf=sf.quaternion,mf=sf.invMass,Nf=sf.invInertiaWorld;af.x+=yf.x*mf*e,af.y+=yf.y*mf*e,af.z+=yf.z*mf*e,sf.angularVelocity&&(Nf.vmult(cf,B),B.mult(e,B),B.vadd(rf,rf)),wf.x+=af.x*e,wf.y+=af.y*e,wf.z+=af.z*e,sf.angularVelocity&&(nf.set(rf.x,rf.y,rf.z,0),nf.mult(bf,of),bf.x+=pf*of.x,bf.y+=pf*of.y,bf.z+=pf*of.z,bf.w+=pf*of.w,lf&&(uf?bf.normalizeFast():bf.normalize())),sf.aabb&&(sf.aabbNeedsUpdate=!0),sf.updateInertiaWorld&&sf.updateInertiaWorld()}}for(this.clearForces(),this.broadphase.dirty=!0,s&&(y.integrate=performance.now()-f),this.time+=e,this.stepnumber+=1,this.dispatchEvent(j),g=0;g!==t;g++){var x=l[g],gf=x.postStep;gf&&gf.call(x)}if(this.allowSleep)for(g=0;g!==t;g++)l[g].sleepTick(this.time)},n.prototype.clearForces=function(){for(var e=this.bodies,f=e.length,n=0;n!==f;n++){{var o=e[n];o.force,o.torque}o.force.set(0,0,0),o.torque.set(0,0,0)}}},{"../collision/AABB":3,"../collision/ArrayCollisionMatrix":4,"../collision/NaiveBroadphase":7,"../collision/Ray":9,"../collision/RaycastResult":10,"../equations/ContactEquation":19,"../equations/FrictionEquation":21,"../material/ContactMaterial":24,"../material/Material":25,"../math/Quaternion":28,"../math/Vec3":30,"../objects/Body":31,"../shapes/Shape":43,"../solver/GSSolver":46,"../utils/EventTarget":49,"../utils/TupleDictionary":52,"../utils/Vec3Pool":54,"./Narrowphase":55}]},{},[2])(2)});
( // Module boilerplate to support browser globals and browserify and AMD.
  typeof define === "function" ? function (m) { define("msgpack-js", m); } :
  typeof exports === "object" ? function (m) { module.exports = m(); } :
  function(m){ this.msgpack = m(); }
)(function () {
"use strict";

var exports = {};

exports.inspect = inspect;
function inspect(buffer) {
  if (buffer === undefined) return "undefined";
  var view;
  var type;
  if (buffer instanceof ArrayBuffer) {
    type = "ArrayBuffer";
    view = new DataView(buffer);
  }
  else if (buffer instanceof DataView) {
    type = "DataView";
    view = buffer;
  }
  if (!view) return JSON.stringify(buffer);
  var bytes = [];
  for (var i = 0; i < buffer.byteLength; i++) {
    if (i > 20) {
      bytes.push("...");
      break;
    }
    var byte = view.getUint8(i).toString(16);
    if (byte.length === 1) byte = "0" + byte;
    bytes.push(byte);
  }
  return "<" + type + " " + bytes.join(" ") + ">";
}

// Encode string as utf8 into dataview at offset
exports.utf8Write = utf8Write;
function utf8Write(view, offset, string) {
  var byteLength = view.byteLength;
  for(var i = 0, l = string.length; i < l; i++) {
    var codePoint = string.charCodeAt(i);

    // One byte of UTF-8
    if (codePoint < 0x80) {
      view.setUint8(offset++, codePoint >>> 0 & 0x7f | 0x00);
      continue;
    }

    // Two bytes of UTF-8
    if (codePoint < 0x800) {
      view.setUint8(offset++, codePoint >>> 6 & 0x1f | 0xc0);
      view.setUint8(offset++, codePoint >>> 0 & 0x3f | 0x80);
      continue;
    }

    // Three bytes of UTF-8.  
    if (codePoint < 0x10000) {
      view.setUint8(offset++, codePoint >>> 12 & 0x0f | 0xe0);
      view.setUint8(offset++, codePoint >>> 6  & 0x3f | 0x80);
      view.setUint8(offset++, codePoint >>> 0  & 0x3f | 0x80);
      continue;
    }

    // Four bytes of UTF-8
    if (codePoint < 0x110000) {
      view.setUint8(offset++, codePoint >>> 18 & 0x07 | 0xf0);
      view.setUint8(offset++, codePoint >>> 12 & 0x3f | 0x80);
      view.setUint8(offset++, codePoint >>> 6  & 0x3f | 0x80);
      view.setUint8(offset++, codePoint >>> 0  & 0x3f | 0x80);
      continue;
    }
    throw new Error("bad codepoint " + codePoint);
  }
}

exports.utf8Read = utf8Read;
function utf8Read(view, offset, length) {
  var string = "";
  for (var i = offset, end = offset + length; i < end; i++) {
    var byte = view.getUint8(i);
    // One byte character
    if ((byte & 0x80) === 0x00) {
      string += String.fromCharCode(byte);
      continue;
    }
    // Two byte character
    if ((byte & 0xe0) === 0xc0) {
      string += String.fromCharCode(
        ((byte & 0x0f) << 6) | 
        (view.getUint8(++i) & 0x3f)
      );
      continue;
    }
    // Three byte character
    if ((byte & 0xf0) === 0xe0) {
      string += String.fromCharCode(
        ((byte & 0x0f) << 12) |
        ((view.getUint8(++i) & 0x3f) << 6) |
        ((view.getUint8(++i) & 0x3f) << 0)
      );
      continue;
    }
    // Four byte character
    if ((byte & 0xf8) === 0xf0) {
      string += String.fromCharCode(
        ((byte & 0x07) << 18) |
        ((view.getUint8(++i) & 0x3f) << 12) |
        ((view.getUint8(++i) & 0x3f) << 6) |
        ((view.getUint8(++i) & 0x3f) << 0)
      );
      continue;
    }
    throw new Error("Invalid byte " + byte.toString(16));
  }
  return string;
}

exports.utf8ByteCount = utf8ByteCount;
function utf8ByteCount(string) {
  var count = 0;
  for(var i = 0, l = string.length; i < l; i++) {
    var codePoint = string.charCodeAt(i);
    if (codePoint < 0x80) {
      count += 1;
      continue;
    }
    if (codePoint < 0x800) {
      count += 2;
      continue;
    }
    if (codePoint < 0x10000) {
      count += 3;
      continue;
    }
    if (codePoint < 0x110000) {
      count += 4;
      continue;
    }
    throw new Error("bad codepoint " + codePoint);
  }
  return count;
}

exports.encode = function (value) {
  var buffer = new ArrayBuffer(sizeof(value));
  var view = new DataView(buffer);
  encode(value, view, 0);
  return buffer;
};

exports.decode = decode;

// http://wiki.msgpack.org/display/MSGPACK/Format+specification
// I've extended the protocol to have two new types that were previously reserved.
//   buffer 16  11011000  0xd8
//   buffer 32  11011001  0xd9
// These work just like raw16 and raw32 except they are node buffers instead of strings.
//
// Also I've added a type for `undefined`
//   undefined  11000100  0xc4

function Decoder(view, offset) {
  this.offset = offset || 0;
  this.view = view;
}
Decoder.prototype.map = function (length) {
  var value = {};
  for (var i = 0; i < length; i++) {
    var key = this.parse();
    value[key] = this.parse();
  }
  return value;
};
Decoder.prototype.buf = function (length) {
  var value = new ArrayBuffer(length);
  (new Uint8Array(value)).set(new Uint8Array(this.view.buffer, this.offset, length), 0);
  this.offset += length;
  return value;
};
Decoder.prototype.raw = function (length) {
  var value = utf8Read(this.view, this.offset, length);
  this.offset += length;
  return value;
};
Decoder.prototype.array = function (length) {
  var value = new Array(length);
  for (var i = 0; i < length; i++) {
    value[i] = this.parse();
  }
  return value;
};
Decoder.prototype.parse = function () {
  var type = this.view.getUint8(this.offset);
  var value, length;
  // FixRaw
  if ((type & 0xe0) === 0xa0) {
    length = type & 0x1f;
    this.offset++;
    return this.raw(length);
  }
  // FixMap
  if ((type & 0xf0) === 0x80) {
    length = type & 0x0f;
    this.offset++;
    return this.map(length);
  }
  // FixArray
  if ((type & 0xf0) === 0x90) {
    length = type & 0x0f;
    this.offset++;
    return this.array(length);
  }
  // Positive FixNum
  if ((type & 0x80) === 0x00) {
    this.offset++;
    return type;
  }
  // Negative Fixnum
  if ((type & 0xe0) === 0xe0) {
    value = this.view.getInt8(this.offset);
    this.offset++;
    return value;
  }
  switch (type) {
  // raw 16
  case 0xda:
    length = this.view.getUint16(this.offset + 1);
    this.offset += 3;
    return this.raw(length);
  // raw 32
  case 0xdb:
    length = this.view.getUint32(this.offset + 1);
    this.offset += 5;
    return this.raw(length);
  // nil
  case 0xc0:
    this.offset++;
    return null;
  // false
  case 0xc2:
    this.offset++;
    return false;
  // true
  case 0xc3:
    this.offset++;
    return true;
  // undefined
  case 0xc4:
    this.offset++;
    return undefined;
  // uint8
  case 0xcc:
    value = this.view.getUint8(this.offset + 1);
    this.offset += 2;
    return value;
  // uint 16
  case 0xcd:
    value = this.view.getUint16(this.offset + 1);
    this.offset += 3;
    return value;
  // uint 32
  case 0xce:
    value = this.view.getUint32(this.offset + 1);
    this.offset += 5;
    return value;
  // int 8
  case 0xd0:
    value = this.view.getInt8(this.offset + 1);
    this.offset += 2;
    return value;
  // int 16
  case 0xd1:
    value = this.view.getInt16(this.offset + 1);
    this.offset += 3;
    return value;
  // int 32
  case 0xd2:
    value = this.view.getInt32(this.offset + 1);
    this.offset += 5;
    return value;
  // map 16
  case 0xde:
    length = this.view.getUint16(this.offset + 1);
    this.offset += 3;
    return this.map(length);
  // map 32
  case 0xdf:
    length = this.view.getUint32(this.offset + 1);
    this.offset += 5;
    return this.map(length);
  // array 16
  case 0xdc:
    length = this.view.getUint16(this.offset + 1);
    this.offset += 3;
    return this.array(length);
  // array 32
  case 0xdd:
    length = this.view.getUint32(this.offset + 1);
    this.offset += 5;
    return this.array(length);
  // buffer 16
  case 0xd8:
    length = this.view.getUint16(this.offset + 1);
    this.offset += 3;
    return this.buf(length);
  // buffer 32
  case 0xd9:
    length = this.view.getUint32(this.offset + 1);
    this.offset += 5;
    return this.buf(length);
  // float
  case 0xca:
    value = this.view.getFloat32(this.offset + 1);
    this.offset += 5;
    return value;
  // double
  case 0xcb:
    value = this.view.getFloat64(this.offset + 1);
    this.offset += 9;
    return value;
  }
  throw new Error("Unknown type 0x" + type.toString(16));
};
function decode(buffer) {
  var view = new DataView(buffer);
  var decoder = new Decoder(view);
  var value = decoder.parse();
  if (decoder.offset !== buffer.byteLength) throw new Error((buffer.byteLength - decoder.offset) + " trailing bytes");
  return value;
}

function encode(value, view, offset) {
  var type = typeof value;

  // Strings Bytes
  if (type === "string") {
    var length = utf8ByteCount(value);
    // fix raw
    if (length < 0x20) {
      view.setUint8(offset, length | 0xa0);
      utf8Write(view, offset + 1, value);
      return 1 + length;
    }
    // raw 16
    if (length < 0x10000) {
      view.setUint8(offset, 0xda);
      view.setUint16(offset + 1, length);
      utf8Write(view, offset + 3, value);
      return 3 + length;
    }
    // raw 32
    if (length < 0x100000000) {
      view.setUint8(offset, 0xdb);
      view.setUint32(offset + 1, length);
      utf8Write(view, offset + 5, value);
      return 5 + length;
    }
  }

  if (value instanceof ArrayBuffer) {
    var length = value.byteLength;
    // buffer 16
    if (length < 0x10000) {
      view.setUint8(offset, 0xd8);
      view.setUint16(offset + 1, length);
      (new Uint8Array(view.buffer)).set(new Uint8Array(value), offset + 3);
      return 3 + length;
    }
    // buffer 32
    if (length < 0x100000000) {
      view.setUint8(offset, 0xd9);
      view.setUint32(offset + 1, length);
      (new Uint8Array(view.buffer)).set(new Uint8Array(value), offset + 5);
      return 5 + length;
    }
  }
  
  if (type === "number") {
    // Floating Point
    if ((value << 0) !== value) {
      view.setUint8(offset, 0xcb);
      view.setFloat64(offset + 1, value);
      return 9;
    }

    // Integers
    if (value >=0) {
      // positive fixnum
      if (value < 0x80) {
        view.setUint8(offset, value);
        return 1;
      }
      // uint 8
      if (value < 0x100) {
        view.setUint8(offset, 0xcc);
        view.setUint8(offset + 1, value);
        return 2;
      }
      // uint 16
      if (value < 0x10000) {
        view.setUint8(offset, 0xcd);
        view.setUint16(offset + 1, value);
        return 3;
      }
      // uint 32
      if (value < 0x100000000) {
        view.setUint8(offset, 0xce);
        view.setUint32(offset + 1, value);
        return 5;
      }
      throw new Error("Number too big 0x" + value.toString(16));
    }
    // negative fixnum
    if (value >= -0x20) {
      view.setInt8(offset, value);
      return 1;
    }
    // int 8
    if (value >= -0x80) {
      view.setUint8(offset, 0xd0);
      view.setInt8(offset + 1, value);
      return 2;
    }
    // int 16
    if (value >= -0x8000) {
      view.setUint8(offset, 0xd1);
      view.setInt16(offset + 1, value);
      return 3;
    }
    // int 32
    if (value >= -0x80000000) {
      view.setUint8(offset, 0xd2);
      view.setInt32(offset + 1, value);
      return 5;
    }
    throw new Error("Number too small -0x" + (-value).toString(16).substr(1));
  }
  
  // undefined
  if (type === "undefined") {
    view.setUint8(offset, 0xc4);
    return 1;
  }
  
  // null
  if (value === null) {
    view.setUint8(offset, 0xc0);
    return 1;
  }

  // Boolean
  if (type === "boolean") {
    view.setUint8(offset, value ? 0xc3 : 0xc2);
    return 1;
  }
  
  // Container Types
  if (type === "object") {
    var length, size = 0;
    var isArray = Array.isArray(value);

    if (isArray) {
      length = value.length;
    }
    else {
      var keys = Object.keys(value);
      length = keys.length;
    }

    var size;
    if (length < 0x10) {
      view.setUint8(offset, length | (isArray ? 0x90 : 0x80));
      size = 1;
    }
    else if (length < 0x10000) {
      view.setUint8(offset, isArray ? 0xdc : 0xde);
      view.setUint16(offset + 1, length);
      size = 3;
    }
    else if (length < 0x100000000) {
      view.setUint8(offset, isArray ? 0xdd : 0xdf);
      view.setUint32(offset + 1, length);
      size = 5;
    }

    if (isArray) {
      for (var i = 0; i < length; i++) {
        size += encode(value[i], view, offset + size);
      }
    }
    else {
      for (var i = 0; i < length; i++) {
        var key = keys[i];
        size += encode(key, view, offset + size);
        size += encode(value[key], view, offset + size);
      }
    }
    
    return size;
  }
  throw new Error("Unknown type " + type);
}

function sizeof(value) {
  var type = typeof value;

  // Raw Bytes
  if (type === "string") {
    var length = utf8ByteCount(value);
    if (length < 0x20) {
      return 1 + length;
    }
    if (length < 0x10000) {
      return 3 + length;
    }
    if (length < 0x100000000) {
      return 5 + length;
    }
  }
  
  if (value instanceof ArrayBuffer) {
    var length = value.byteLength;
    if (length < 0x10000) {
      return 3 + length;
    }
    if (length < 0x100000000) {
      return 5 + length;
    }
  }
  
  if (type === "number") {
    // Floating Point
    // double
    if (value << 0 !== value) return 9;

    // Integers
    if (value >=0) {
      // positive fixnum
      if (value < 0x80) return 1;
      // uint 8
      if (value < 0x100) return 2;
      // uint 16
      if (value < 0x10000) return 3;
      // uint 32
      if (value < 0x100000000) return 5;
      // uint 64
      if (value < 0x10000000000000000) return 9;
      throw new Error("Number too big 0x" + value.toString(16));
    }
    // negative fixnum
    if (value >= -0x20) return 1;
    // int 8
    if (value >= -0x80) return 2;
    // int 16
    if (value >= -0x8000) return 3;
    // int 32
    if (value >= -0x80000000) return 5;
    // int 64
    if (value >= -0x8000000000000000) return 9;
    throw new Error("Number too small -0x" + value.toString(16).substr(1));
  }
  
  // Boolean, null, undefined
  if (type === "boolean" || type === "undefined" || value === null) return 1;
  
  // Container Types
  if (type === "object") {
    var length, size = 0;
    if (Array.isArray(value)) {
      length = value.length;
      for (var i = 0; i < length; i++) {
        size += sizeof(value[i]);
      }
    }
    else {
      var keys = Object.keys(value);
      length = keys.length;
      for (var i = 0; i < length; i++) {
        var key = keys[i];
        size += sizeof(key) + sizeof(value[key]);
      }
    }
    if (length < 0x10) {
      return 1 + size;
    }
    if (length < 0x10000) {
      return 3 + size;
    }
    if (length < 0x100000000) {
      return 5 + size;
    }
    throw new Error("Array or object too long 0x" + length.toString(16));
  }
  throw new Error("Unknown type " + type);
}

return exports;

});

(function(scope){
var CryptoJS=CryptoJS||function(e,n){var t={},i=t.lib={},r=function(){},s=i.Base={extend:function(e){r.prototype=this;var n=new r;return e&&n.mixIn(e),n.hasOwnProperty("init")||(n.init=function(){n.$super.init.apply(this,arguments)}),n.init.prototype=n,n.$super=this,n},create:function(){var e=this.extend();return e.init.apply(e,arguments),e},init:function(){},mixIn:function(e){for(var n in e)e.hasOwnProperty(n)&&(this[n]=e[n]);e.hasOwnProperty("toString")&&(this.toString=e.toString)},clone:function(){return this.init.prototype.extend(this)}},o=i.WordArray=s.extend({init:function(e,n){e=this.words=e||[],this.sigBytes=void 0!=n?n:4*e.length},toString:function(e){return(e||u).stringify(this)},concat:function(e){var n=this.words,t=e.words,i=this.sigBytes;if(e=e.sigBytes,this.clamp(),i%4)for(var r=0;r<e;r++)n[i+r>>>2]|=(t[r>>>2]>>>24-r%4*8&255)<<24-(i+r)%4*8;else if(65535<t.length)for(r=0;r<e;r+=4)n[i+r>>>2]=t[r>>>2];else n.push.apply(n,t);return this.sigBytes+=e,this},clamp:function(){var n=this.words,t=this.sigBytes;n[t>>>2]&=4294967295<<32-t%4*8,n.length=e.ceil(t/4)},clone:function(){var e=s.clone.call(this);return e.words=this.words.slice(0),e},random:function(n){for(var t=[],i=0;i<n;i+=4)t.push(4294967296*e.random()|0);return new o.init(t,n)}}),a=t.enc={},u=a.Hex={stringify:function(e){var n=e.words;e=e.sigBytes;for(var t=[],i=0;i<e;i++){var r=n[i>>>2]>>>24-i%4*8&255;t.push((r>>>4).toString(16)),t.push((15&r).toString(16))}return t.join("")},parse:function(e){for(var n=e.length,t=[],i=0;i<n;i+=2)t[i>>>3]|=parseInt(e.substr(i,2),16)<<24-i%8*4;return new o.init(t,n/2)}},c=a.Latin1={stringify:function(e){var n=e.words;e=e.sigBytes;for(var t=[],i=0;i<e;i++)t.push(String.fromCharCode(n[i>>>2]>>>24-i%4*8&255));return t.join("")},parse:function(e){for(var n=e.length,t=[],i=0;i<n;i++)t[i>>>2]|=(255&e.charCodeAt(i))<<24-i%4*8;return new o.init(t,n)}},d=a.Utf8={stringify:function(e){try{return decodeURIComponent(escape(c.stringify(e)))}catch(e){throw Error("Malformed UTF-8 data")}},parse:function(e){return c.parse(unescape(encodeURIComponent(e)))}},l=i.BufferedBlockAlgorithm=s.extend({reset:function(){this._data=new o.init,this._nDataBytes=0},_append:function(e){"string"==typeof e&&(e=d.parse(e)),this._data.concat(e),this._nDataBytes+=e.sigBytes},_process:function(n){var t=this._data,i=t.words,r=t.sigBytes,s=this.blockSize,a=r/(4*s),a=n?e.ceil(a):e.max((0|a)-this._minBufferSize,0);if(n=a*s,r=e.min(4*n,r),n){for(var u=0;u<n;u+=s)this._doProcessBlock(i,u);u=i.splice(0,n),t.sigBytes-=r}return new o.init(u,r)},clone:function(){var e=s.clone.call(this);return e._data=this._data.clone(),e},_minBufferSize:0});i.Hasher=l.extend({cfg:s.extend(),init:function(e){this.cfg=this.cfg.extend(e),this.reset()},reset:function(){l.reset.call(this),this._doReset()},update:function(e){return this._append(e),this._process(),this},finalize:function(e){return e&&this._append(e),this._doFinalize()},blockSize:16,_createHelper:function(e){return function(n,t){return new e.init(t).finalize(n)}},_createHmacHelper:function(e){return function(n,t){return new f.HMAC.init(e,t).finalize(n)}}});var f=t.algo={};return t}(Math);!function(e){for(var n=CryptoJS,t=n.lib,i=t.WordArray,r=t.Hasher,t=n.algo,s=[],o=[],a=function(e){return 4294967296*(e-(0|e))|0},u=2,c=0;64>c;){var d;e:{d=u;for(var l=e.sqrt(d),f=2;f<=l;f++)if(!(d%f)){d=!1;break e}d=!0}d&&(8>c&&(s[c]=a(e.pow(u,.5))),o[c]=a(e.pow(u,1/3)),c++),u++}var v=[],t=t.SHA256=r.extend({_doReset:function(){this._hash=new i.init(s.slice(0))},_doProcessBlock:function(e,n){for(var t=this._hash.words,i=t[0],r=t[1],s=t[2],a=t[3],u=t[4],c=t[5],d=t[6],l=t[7],f=0;64>f;f++){if(16>f)v[f]=0|e[n+f];else{var g=v[f-15],m=v[f-2];v[f]=((g<<25|g>>>7)^(g<<14|g>>>18)^g>>>3)+v[f-7]+((m<<15|m>>>17)^(m<<13|m>>>19)^m>>>10)+v[f-16]}g=l+((u<<26|u>>>6)^(u<<21|u>>>11)^(u<<7|u>>>25))+(u&c^~u&d)+o[f]+v[f],m=((i<<30|i>>>2)^(i<<19|i>>>13)^(i<<10|i>>>22))+(i&r^i&s^r&s),l=d,d=c,c=u,u=a+g|0,a=s,s=r,r=i,i=g+m|0}t[0]=t[0]+i|0,t[1]=t[1]+r|0,t[2]=t[2]+s|0,t[3]=t[3]+a|0,t[4]=t[4]+u|0,t[5]=t[5]+c|0,t[6]=t[6]+d|0,t[7]=t[7]+l|0},_doFinalize:function(){var n=this._data,t=n.words,i=8*this._nDataBytes,r=8*n.sigBytes;return t[r>>>5]|=128<<24-r%32,t[14+(r+64>>>9<<4)]=e.floor(i/4294967296),t[15+(r+64>>>9<<4)]=i,n.sigBytes=4*t.length,this._process(),this._hash},clone:function(){var e=r.clone.call(this);return e._hash=this._hash.clone(),e}});n.SHA256=r._createHelper(t),n.HmacSHA256=r._createHmacHelper(t)}(Math),function(){var e=CryptoJS,n=e.enc.Utf8;e.algo.HMAC=e.lib.Base.extend({init:function(e,t){e=this._hasher=new e.init,"string"==typeof t&&(t=n.parse(t));var i=e.blockSize,r=4*i;t.sigBytes>r&&(t=e.finalize(t)),t.clamp();for(var s=this._oKey=t.clone(),o=this._iKey=t.clone(),a=s.words,u=o.words,c=0;c<i;c++)a[c]^=1549556828,u[c]^=909522486;s.sigBytes=o.sigBytes=r,this.reset()},reset:function(){var e=this._hasher;e.reset(),e.update(this._iKey)},update:function(e){return this._hasher.update(e),this},finalize:function(e){var n=this._hasher;return e=n.finalize(e),n.reset(),n.finalize(this._oKey.clone().concat(e))}})}(),function(){var e=CryptoJS,n=e.lib.WordArray;e.enc.Base64={stringify:function(e){var n=e.words,t=e.sigBytes,i=this._map;e.clamp(),e=[];for(var r=0;r<t;r+=3)for(var s=(n[r>>>2]>>>24-r%4*8&255)<<16|(n[r+1>>>2]>>>24-(r+1)%4*8&255)<<8|n[r+2>>>2]>>>24-(r+2)%4*8&255,o=0;4>o&&r+.75*o<t;o++)e.push(i.charAt(s>>>6*(3-o)&63));if(n=i.charAt(64))for(;e.length%4;)e.push(n);return e.join("")},parse:function(e){var t=e.length,i=this._map,r=i.charAt(64);r&&-1!=(r=e.indexOf(r))&&(t=r);for(var r=[],s=0,o=0;o<t;o++)if(o%4){var a=i.indexOf(e.charAt(o-1))<<o%4*2,u=i.indexOf(e.charAt(o))>>>6-o%4*2;r[s>>>2]|=(a|u)<<24-s%4*8,s++}return n.create(r,s)},_map:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="}}();var gameanalytics;!function(e){!function(e){e[e.Undefined=0]="Undefined",e[e.Debug=1]="Debug",e[e.Info=2]="Info",e[e.Warning=3]="Warning",e[e.Error=4]="Error",e[e.Critical=5]="Critical"}(e.EGAErrorSeverity||(e.EGAErrorSeverity={}));!function(e){e[e.Undefined=0]="Undefined",e[e.Male=1]="Male",e[e.Female=2]="Female"}(e.EGAGender||(e.EGAGender={}));!function(e){e[e.Undefined=0]="Undefined",e[e.Start=1]="Start",e[e.Complete=2]="Complete",e[e.Fail=3]="Fail"}(e.EGAProgressionStatus||(e.EGAProgressionStatus={}));!function(e){e[e.Undefined=0]="Undefined",e[e.Source=1]="Source",e[e.Sink=2]="Sink"}(e.EGAResourceFlowType||(e.EGAResourceFlowType={}));!function(e){!function(e){e[e.Undefined=0]="Undefined",e[e.Rejected=1]="Rejected"}(e.EGASdkErrorType||(e.EGASdkErrorType={}));!function(e){e[e.NoResponse=0]="NoResponse",e[e.BadResponse=1]="BadResponse",e[e.RequestTimeout=2]="RequestTimeout",e[e.JsonEncodeFailed=3]="JsonEncodeFailed",e[e.JsonDecodeFailed=4]="JsonDecodeFailed",e[e.InternalServerError=5]="InternalServerError",e[e.BadRequest=6]="BadRequest",e[e.Unauthorized=7]="Unauthorized",e[e.UnknownResponseCode=8]="UnknownResponseCode",e[e.Ok=9]="Ok"}(e.EGAHTTPApiResponse||(e.EGAHTTPApiResponse={}))}(e.http||(e.http={}))}(gameanalytics||(gameanalytics={}));var EGAErrorSeverity=gameanalytics.EGAErrorSeverity,EGAGender=gameanalytics.EGAGender,EGAProgressionStatus=gameanalytics.EGAProgressionStatus,EGAResourceFlowType=gameanalytics.EGAResourceFlowType,gameanalytics;!function(e){!function(e){var n;!function(e){e[e.Error=0]="Error",e[e.Warning=1]="Warning",e[e.Info=2]="Info",e[e.Debug=3]="Debug"}(n||(n={}));var t=function(){function e(){e.debugEnabled=!1}return e.setInfoLog=function(n){e.instance.infoLogEnabled=n},e.setVerboseLog=function(n){e.instance.infoLogVerboseEnabled=n},e.i=function(t){if(e.instance.infoLogEnabled){var i="Info/"+e.Tag+": "+t;e.instance.sendNotificationMessage(i,n.Info)}},e.w=function(t){var i="Warning/"+e.Tag+": "+t;e.instance.sendNotificationMessage(i,n.Warning)},e.e=function(t){var i="Error/"+e.Tag+": "+t;e.instance.sendNotificationMessage(i,n.Error)},e.ii=function(t){if(e.instance.infoLogVerboseEnabled){var i="Verbose/"+e.Tag+": "+t;e.instance.sendNotificationMessage(i,n.Info)}},e.d=function(t){if(e.debugEnabled){var i="Debug/"+e.Tag+": "+t;e.instance.sendNotificationMessage(i,n.Debug)}},e.prototype.sendNotificationMessage=function(e,t){switch(t){case n.Error:console.error(e);break;case n.Warning:console.warn(e);break;case n.Debug:"function"==typeof console.debug?console.debug(e):console.log(e);break;case n.Info:console.log(e)}},e}();t.instance=new t,t.Tag="GameAnalytics",e.GALogger=t}(e.logging||(e.logging={}))}(gameanalytics||(gameanalytics={}));var gameanalytics;!function(e){!function(n){var t=e.logging.GALogger,i=function(){function e(){}return e.getHmac=function(e,n){var t=CryptoJS.HmacSHA256(n,e);return CryptoJS.enc.Base64.stringify(t)},e.stringMatch=function(e,n){return!(!e||!n)&&n.test(e)},e.joinStringArray=function(e,n){for(var t="",i=0,r=e.length;i<r;i++)i>0&&(t+=n),t+=e[i];return t},e.stringArrayContainsString=function(e,n){if(0===e.length)return!1;for(var t in e)if(e[t]===n)return!0;return!1},e.encode64=function(n){n=encodeURI(n);var t,i,r,s,o,a="",u=0,c=0,d=0;do{t=n.charCodeAt(d++),i=n.charCodeAt(d++),u=n.charCodeAt(d++),r=t>>2,s=(3&t)<<4|i>>4,o=(15&i)<<2|u>>6,c=63&u,isNaN(i)?o=c=64:isNaN(u)&&(c=64),a=a+e.keyStr.charAt(r)+e.keyStr.charAt(s)+e.keyStr.charAt(o)+e.keyStr.charAt(c),t=i=u=0,r=s=o=c=0}while(d<n.length);return a},e.decode64=function(n){var i,r,s,o,a,u="",c=0,d=0,l=0;/[^A-Za-z0-9\+\/\=]/g.exec(n)&&t.w("There were invalid base64 characters in the input text. Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='. Expect errors in decoding."),n=n.replace(/[^A-Za-z0-9\+\/\=]/g,"");do{s=e.keyStr.indexOf(n.charAt(l++)),o=e.keyStr.indexOf(n.charAt(l++)),a=e.keyStr.indexOf(n.charAt(l++)),d=e.keyStr.indexOf(n.charAt(l++)),i=s<<2|o>>4,r=(15&o)<<4|a>>2,c=(3&a)<<6|d,u+=String.fromCharCode(i),64!=a&&(u+=String.fromCharCode(r)),64!=d&&(u+=String.fromCharCode(c)),i=r=c=0,s=o=a=d=0}while(l<n.length);return decodeURI(u)},e.timeIntervalSince1970=function(){var e=new Date;return Math.round(e.getTime()/1e3)},e.createGuid=function(){return(e.s4()+e.s4()+"-"+e.s4()+"-4"+e.s4().substr(0,3)+"-"+e.s4()+"-"+e.s4()+e.s4()+e.s4()).toLowerCase()},e.s4=function(){return(65536*(1+Math.random())|0).toString(16).substring(1)},e}();i.keyStr="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",n.GAUtilities=i}(e.utilities||(e.utilities={}))}(gameanalytics||(gameanalytics={}));var gameanalytics;!function(e){!function(n){var t=e.logging.GALogger,i=e.http.EGASdkErrorType,r=e.utilities.GAUtilities,s=function(){function n(){}return n.validateBusinessEvent=function(e,i,r,s,o){return n.validateCurrency(e)?n.validateShortString(r,!0)?n.validateEventPartLength(s,!1)?n.validateEventPartCharacters(s)?n.validateEventPartLength(o,!1)?!!n.validateEventPartCharacters(o)||(t.i("Validation fail - business event - itemId: Cannot contain other characters than A-z, 0-9, -_., ()!?. String: "+o),!1):(t.i("Validation fail - business event - itemId. Cannot be (null), empty or above 64 characters. String: "+o),!1):(t.i("Validation fail - business event - itemType: Cannot contain other characters than A-z, 0-9, -_., ()!?. String: "+s),!1):(t.i("Validation fail - business event - itemType: Cannot be (null), empty or above 64 characters. String: "+s),!1):(t.i("Validation fail - business event - cartType. Cannot be above 32 length. String: "+r),!1):(t.i("Validation fail - business event - currency: Cannot be (null) and need to be A-Z, 3 characters and in the standard at openexchangerates.org. Failed currency: "+e),!1)},n.validateResourceEvent=function(i,s,o,a,u,c,d){return i==e.EGAResourceFlowType.Undefined?(t.i("Validation fail - resource event - flowType: Invalid flow type."),!1):s?r.stringArrayContainsString(c,s)?o>0?a?n.validateEventPartLength(a,!1)?n.validateEventPartCharacters(a)?r.stringArrayContainsString(d,a)?n.validateEventPartLength(u,!1)?!!n.validateEventPartCharacters(u)||(t.i("Validation fail - resource event - itemId: Cannot contain other characters than A-z, 0-9, -_., ()!?. String: "+u),!1):(t.i("Validation fail - resource event - itemId: Cannot be (null), empty or above 64 characters. String: "+u),!1):(t.i("Validation fail - resource event - itemType: Not found in list of pre-defined available resource itemTypes. String: "+a),!1):(t.i("Validation fail - resource event - itemType: Cannot contain other characters than A-z, 0-9, -_., ()!?. String: "+a),!1):(t.i("Validation fail - resource event - itemType: Cannot be (null), empty or above 64 characters. String: "+a),!1):(t.i("Validation fail - resource event - itemType: Cannot be (null)"),!1):(t.i("Validation fail - resource event - amount: Float amount cannot be 0 or negative. Value: "+o),!1):(t.i("Validation fail - resource event - currency: Not found in list of pre-defined available resource currencies. String: "+s),!1):(t.i("Validation fail - resource event - currency: Cannot be (null)"),!1)},n.validateProgressionEvent=function(i,r,s,o){if(i==e.EGAProgressionStatus.Undefined)return t.i("Validation fail - progression event: Invalid progression status."),!1;if(o&&!s&&r)return t.i("Validation fail - progression event: 03 found but 01+02 are invalid. Progression must be set as either 01, 01+02 or 01+02+03."),!1;if(s&&!r)return t.i("Validation fail - progression event: 02 found but not 01. Progression must be set as either 01, 01+02 or 01+02+03"),!1;if(!r)return t.i("Validation fail - progression event: progression01 not valid. Progressions must be set as either 01, 01+02 or 01+02+03"),!1;if(!n.validateEventPartLength(r,!1))return t.i("Validation fail - progression event - progression01: Cannot be (null), empty or above 64 characters. String: "+r),!1;if(!n.validateEventPartCharacters(r))return t.i("Validation fail - progression event - progression01: Cannot contain other characters than A-z, 0-9, -_., ()!?. String: "+r),!1;if(s){if(!n.validateEventPartLength(s,!0))return t.i("Validation fail - progression event - progression02: Cannot be empty or above 64 characters. String: "+s),!1;if(!n.validateEventPartCharacters(s))return t.i("Validation fail - progression event - progression02: Cannot contain other characters than A-z, 0-9, -_., ()!?. String: "+s),!1}if(o){if(!n.validateEventPartLength(o,!0))return t.i("Validation fail - progression event - progression03: Cannot be empty or above 64 characters. String: "+o),!1;if(!n.validateEventPartCharacters(o))return t.i("Validation fail - progression event - progression03: Cannot contain other characters than A-z, 0-9, -_., ()!?. String: "+o),!1}return!0},n.validateDesignEvent=function(e,i){return n.validateEventIdLength(e)?!!n.validateEventIdCharacters(e)||(t.i("Validation fail - design event - eventId: Non valid characters. Only allowed A-z, 0-9, -_., ()!?. String: "+e),!1):(t.i("Validation fail - design event - eventId: Cannot be (null) or empty. Only 5 event parts allowed seperated by :. Each part need to be 32 characters or less. String: "+e),!1)},n.validateErrorEvent=function(i,r){return i==e.EGAErrorSeverity.Undefined?(t.i("Validation fail - error event - severity: Severity was unsupported value."),!1):!!n.validateLongString(r,!0)||(t.i("Validation fail - error event - message: Message cannot be above 8192 characters."),!1)},n.validateSdkErrorEvent=function(e,r,s){return!!n.validateKeys(e,r)&&(s!==i.Undefined||(t.i("Validation fail - sdk error event - type: Type was unsupported value."),!1))},n.validateKeys=function(e,n){return!(!r.stringMatch(e,/^[A-z0-9]{32}$/)||!r.stringMatch(n,/^[A-z0-9]{40}$/))},n.validateCurrency=function(e){return!!e&&!!r.stringMatch(e,/^[A-Z]{3}$/)},n.validateEventPartLength=function(e,n){return!(!n||e)||!!e&&!(e.length>64)},n.validateEventPartCharacters=function(e){return!!r.stringMatch(e,/^[A-Za-z0-9\s\-_\.\(\)\!\?]{1,64}$/)},n.validateEventIdLength=function(e){return!!e&&!!r.stringMatch(e,/^[^:]{1,64}(?::[^:]{1,64}){0,4}$/)},n.validateEventIdCharacters=function(e){return!!e&&!!r.stringMatch(e,/^[A-Za-z0-9\s\-_\.\(\)\!\?]{1,64}(:[A-Za-z0-9\s\-_\.\(\)\!\?]{1,64}){0,4}$/)},n.validateAndCleanInitRequestResponse=function(e){if(null==e)return t.w("validateInitRequestResponse failed - no response dictionary."),null;var n={};try{n.enabled=e.enabled}catch(e){return t.w("validateInitRequestResponse failed - invalid type in 'enabled' field."),null}try{var i=e.server_ts;if(!(i>0))return t.w("validateInitRequestResponse failed - invalid value in 'server_ts' field."),null;n.server_ts=i}catch(n){return t.w("validateInitRequestResponse failed - invalid type in 'server_ts' field. type="+typeof e.server_ts+", value="+e.server_ts+", "+n),null}return n},n.validateBuild=function(e){return!!n.validateShortString(e,!1)},n.validateSdkWrapperVersion=function(e){return!!r.stringMatch(e,/^(unity|unreal|gamemaker|cocos2d|construct) [0-9]{0,5}(\.[0-9]{0,5}){0,2}$/)},n.validateEngineVersion=function(e){return!(!e||!r.stringMatch(e,/^(unity|unreal|gamemaker|cocos2d|construct) [0-9]{0,5}(\.[0-9]{0,5}){0,2}$/))},n.validateUserId=function(e){return!!n.validateString(e,!1)||(t.i("Validation fail - user id: id cannot be (null), empty or above 64 characters."),!1)},n.validateShortString=function(e,n){return!(!n||e)||!(!e||e.length>32)},n.validateString=function(e,n){return!(!n||e)||!(!e||e.length>64)},n.validateLongString=function(e,n){return!(!n||e)||!(!e||e.length>8192)},n.validateConnectionType=function(e){return r.stringMatch(e,/^(wwan|wifi|lan|offline)$/)},n.validateCustomDimensions=function(e){return n.validateArrayOfStrings(20,32,!1,"custom dimensions",e)},n.validateResourceCurrencies=function(e){if(!n.validateArrayOfStrings(20,64,!1,"resource currencies",e))return!1;for(var i=0;i<e.length;++i)if(!r.stringMatch(e[i],/^[A-Za-z]+$/))return t.i("resource currencies validation failed: a resource currency can only be A-Z, a-z. String was: "+e[i]),!1;return!0},n.validateResourceItemTypes=function(e){if(!n.validateArrayOfStrings(20,32,!1,"resource item types",e))return!1;for(var i=0;i<e.length;++i)if(!n.validateEventPartCharacters(e[i]))return t.i("resource item types validation failed: a resource item type cannot contain other characters than A-z, 0-9, -_., ()!?. String was: "+e[i]),!1;return!0},n.validateDimension01=function(e,n){return!e||!!r.stringArrayContainsString(n,e)},n.validateDimension02=function(e,n){return!e||!!r.stringArrayContainsString(n,e)},n.validateDimension03=function(e,n){return!e||!!r.stringArrayContainsString(n,e)},n.validateArrayOfStrings=function(e,n,i,r,s){var o=r;if(o||(o="Array"),!s)return t.i(o+" validation failed: array cannot be null. "),!1;if(0==i&&0==s.length)return t.i(o+" validation failed: array cannot be empty. "),!1;if(e>0&&s.length>e)return t.i(o+" validation failed: array cannot exceed "+e+" values. It has "+s.length+" values."),!1;for(var a=0;a<s.length;++a){var u=s[a]?s[a].length:0;if(0===u)return t.i(o+" validation failed: contained an empty string. Array="+JSON.stringify(s)),!1;if(n>0&&u>n)return t.i(o+" validation failed: a string exceeded max allowed length (which is: "+n+"). String was: "+s[a]),!1}return!0},n.validateFacebookId=function(e){return!!n.validateString(e,!1)||(t.i("Validation fail - facebook id: id cannot be (null), empty or above 64 characters."),!1)},n.validateGender=function(n){if(isNaN(Number(e.EGAGender[n]))){if(n==e.EGAGender.Undefined||n!=e.EGAGender.Male&&n!=e.EGAGender.Female)return t.i("Validation fail - gender: Has to be 'male' or 'female'. Was: "+n),!1}else if(n==e.EGAGender[e.EGAGender.Undefined]||n!=e.EGAGender[e.EGAGender.Male]&&n!=e.EGAGender[e.EGAGender.Female])return t.i("Validation fail - gender: Has to be 'male' or 'female'. Was: "+n),!1;return!0},n.validateBirthyear=function(e){return!(e<0||e>9999)||(t.i("Validation fail - birthYear: Cannot be (null) or invalid range."),!1)},n.validateClientTs=function(e){return!(e<-4294967294||e>4294967294)},n}();n.GAValidator=s}(e.validators||(e.validators={}))}(gameanalytics||(gameanalytics={}));var gameanalytics;!function(e){!function(e){var n=function(){function e(e,n,t){this.name=e,this.value=n,this.version=t}return e}();e.NameValueVersion=n;var t=function(){function e(e,n){this.name=e,this.version=n}return e}();e.NameVersion=t;var i=function(){function e(){}return e.touch=function(){},e.getRelevantSdkVersion=function(){return e.sdkGameEngineVersion?e.sdkGameEngineVersion:e.sdkWrapperVersion},e.getConnectionType=function(){return e.connectionType},e.updateConnectionType=function(){navigator.onLine?"ios"===e.buildPlatform||"android"===e.buildPlatform?e.connectionType="wwan":e.connectionType="lan":e.connectionType="offline"},e.getOSVersionString=function(){return e.buildPlatform+" "+e.osVersionPair.version},e.runtimePlatformToString=function(){return e.osVersionPair.name},e.getBrowserVersionString=function(){var e,n=navigator.userAgent,t=n.match(/(opera|chrome|safari|firefox|ubrowser|msie|trident(?=\/))\/?\s*(\d+)/i)||[];if(/trident/i.test(t[1]))return e=/\brv[ :]+(\d+)/g.exec(n)||[],"IE "+(e[1]||"");if("Chrome"===t[1]&&null!=(e=n.match(/\b(OPR|Edge|UBrowser)\/(\d+)/)))return e.slice(1).join(" ").replace("OPR","Opera").replace("UBrowser","UC").toLowerCase();var i=t[2]?[t[1],t[2]]:[navigator.appName,navigator.appVersion,"-?"];return null!=(e=n.match(/version\/(\d+)/i))&&i.splice(1,1,e[1]),i.join(" ").toLowerCase()},e.getDeviceModel=function(){return"unknown"},e.getDeviceManufacturer=function(){return"unknown"},e.matchItem=function(e,n){var i,r,s,o,a,u=new t("unknown","0.0.0"),c=0,d=0;for(c=0;c<n.length;c+=1)if(i=new RegExp(n[c].value,"i"),i.test(e)){if(r=new RegExp(n[c].version+"[- /:;]([\\d._]+)","i"),s=e.match(r),a="",s&&s[1]&&(o=s[1]),o){var l=o.split(/[._]+/);for(d=0;d<Math.min(l.length,3);d+=1)a+=l[d]+(d<Math.min(l.length,3)-1?".":"")}else a="0.0.0";return u.name=n[c].name,u.version=a,u}return u},e}();i.sdkWrapperVersion="javascript 2.1.0",i.osVersionPair=i.matchItem([navigator.platform,navigator.userAgent,navigator.appVersion,navigator.vendor,window.opera].join(" "),[new n("windows_phone","Windows Phone","OS"),new n("windows","Win","NT"),new n("ios","iPhone","OS"),new n("ios","iPad","OS"),new n("ios","iPod","OS"),new n("android","Android","Android"),new n("blackBerry","BlackBerry","/"),new n("mac_osx","Mac","OS X"),new n("tizen","Tizen","Tizen"),new n("linux","Linux","rv")]),i.buildPlatform=i.runtimePlatformToString(),i.deviceModel=i.getDeviceModel(),i.deviceManufacturer=i.getDeviceManufacturer(),i.osVersion=i.getOSVersionString(),i.browserVersion=i.getBrowserVersionString(),i.maxSafeInteger=Math.pow(2,53)-1,e.GADevice=i}(e.device||(e.device={}))}(gameanalytics||(gameanalytics={}));var gameanalytics;!function(e){!function(e){var n=function(){function e(n){this.deadline=n,this.ignore=!1,this.async=!1,this.running=!1,this.id=++e.idCounter}return e}();n.idCounter=0,e.TimedBlock=n}(e.threading||(e.threading={}))}(gameanalytics||(gameanalytics={}));var gameanalytics;!function(e){!function(e){var n=function(){function e(e){this.comparer=e,this._subQueues={},this._sortedKeys=[]}return e.prototype.enqueue=function(e,n){-1===this._sortedKeys.indexOf(e)&&this.addQueueOfPriority(e),this._subQueues[e].push(n)},e.prototype.addQueueOfPriority=function(e){var n=this;this._sortedKeys.push(e),this._sortedKeys.sort(function(e,t){return n.comparer.compare(e,t)}),this._subQueues[e]=[]},e.prototype.peek=function(){if(this.hasItems())return this._subQueues[this._sortedKeys[0]][0];throw new Error("The queue is empty")},e.prototype.hasItems=function(){return this._sortedKeys.length>0},e.prototype.dequeue=function(){if(this.hasItems())return this.dequeueFromHighPriorityQueue();throw new Error("The queue is empty")},e.prototype.dequeueFromHighPriorityQueue=function(){var e=this._sortedKeys[0],n=this._subQueues[e].shift();return 0===this._subQueues[e].length&&(this._sortedKeys.shift(),delete this._subQueues[e]),n},e}();e.PriorityQueue=n}(e.threading||(e.threading={}))}(gameanalytics||(gameanalytics={}));var gameanalytics;!function(e){!function(n){var t,i=e.logging.GALogger;!function(e){e[e.Equal=0]="Equal",e[e.LessOrEqual=1]="LessOrEqual",e[e.NotEqual=2]="NotEqual"}(t=n.EGAStoreArgsOperator||(n.EGAStoreArgsOperator={}));var r;!function(e){e[e.Events=0]="Events",e[e.Sessions=1]="Sessions",e[e.Progression=2]="Progression"}(r=n.EGAStore||(n.EGAStore={}));var s=function(){function e(){this.eventsStore=[],this.sessionsStore=[],this.progressionStore=[],this.storeItems={};try{"object"==typeof localStorage?(localStorage.setItem("testingLocalStorage","yes"),localStorage.removeItem("testingLocalStorage"),e.storageAvailable=!0):e.storageAvailable=!1}catch(e){}}return e.isStorageAvailable=function(){return e.storageAvailable},e.isStoreTooLargeForEvents=function(){return e.instance.eventsStore.length+e.instance.sessionsStore.length>e.MaxNumberOfEntries},e.select=function(n,i,r,s){void 0===i&&(i=[]),void 0===r&&(r=!1),void 0===s&&(s=0);var o=e.getStore(n);if(!o)return null;for(var a=[],u=0;u<o.length;++u){for(var c=o[u],d=!0,l=0;l<i.length;++l){var f=i[l];if(c[f[0]])switch(f[1]){case t.Equal:d=c[f[0]]==f[2];break;case t.LessOrEqual:d=c[f[0]]<=f[2];break;case t.NotEqual:d=c[f[0]]!=f[2];break;default:d=!1}else d=!1;if(!d)break}d&&a.push(c)}return r&&a.sort(function(e,n){return e.client_ts-n.client_ts}),s>0&&a.length>s&&(a=a.slice(0,s+1)),a},e.update=function(n,i,r){void 0===r&&(r=[]);var s=e.getStore(n);if(!s)return!1;for(var o=0;o<s.length;++o){for(var a=s[o],u=!0,c=0;c<r.length;++c){var d=r[c];if(a[d[0]])switch(d[1]){case t.Equal:u=a[d[0]]==d[2];break;case t.LessOrEqual:u=a[d[0]]<=d[2];break;case t.NotEqual:u=a[d[0]]!=d[2];break;default:u=!1}else u=!1;if(!u)break}if(u)for(var c=0;c<i.length;++c){var l=i[c];a[l[0]]=l[1]}}return!0},e.delete=function(n,i){var r=e.getStore(n);if(r)for(var s=0;s<r.length;++s){for(var o=r[s],a=!0,u=0;u<i.length;++u){var c=i[u];if(o[c[0]])switch(c[1]){case t.Equal:a=o[c[0]]==c[2];break;case t.LessOrEqual:a=o[c[0]]<=c[2];break;case t.NotEqual:a=o[c[0]]!=c[2];break;default:a=!1}else a=!1;if(!a)break}a&&(r.splice(s,1),--s)}},e.insert=function(n,t,i,r){void 0===i&&(i=!1),void 0===r&&(r=null);var s=e.getStore(n);if(s)if(i){if(!r)return;for(var o=!1,a=0;a<s.length;++a){var u=s[a];if(u[r]==t[r]){for(var c in t)u[c]=t[c];o=!0;break}}o||s.push(t)}else s.push(t)},e.save=function(){if(!e.isStorageAvailable())return void i.w("Storage is not available, cannot save.");localStorage.setItem(e.KeyPrefix+e.EventsStoreKey,JSON.stringify(e.instance.eventsStore)),localStorage.setItem(e.KeyPrefix+e.SessionsStoreKey,JSON.stringify(e.instance.sessionsStore)),localStorage.setItem(e.KeyPrefix+e.ProgressionStoreKey,JSON.stringify(e.instance.progressionStore)),localStorage.setItem(e.KeyPrefix+e.ItemsStoreKey,JSON.stringify(e.instance.storeItems))},e.load=function(){if(!e.isStorageAvailable())return void i.w("Storage is not available, cannot load.");try{e.instance.eventsStore=JSON.parse(localStorage.getItem(e.KeyPrefix+e.EventsStoreKey)),e.instance.eventsStore||(e.instance.eventsStore=[])}catch(n){i.w("Load failed for 'events' store. Using empty store."),e.instance.eventsStore=[]}try{e.instance.sessionsStore=JSON.parse(localStorage.getItem(e.KeyPrefix+e.SessionsStoreKey)),e.instance.sessionsStore||(e.instance.sessionsStore=[])}catch(n){i.w("Load failed for 'sessions' store. Using empty store."),e.instance.sessionsStore=[]}try{e.instance.progressionStore=JSON.parse(localStorage.getItem(e.KeyPrefix+e.ProgressionStoreKey)),e.instance.progressionStore||(e.instance.progressionStore=[])}catch(n){i.w("Load failed for 'progression' store. Using empty store."),e.instance.progressionStore=[]}try{e.instance.storeItems=JSON.parse(localStorage.getItem(e.KeyPrefix+e.ItemsStoreKey)),e.instance.storeItems||(e.instance.storeItems={})}catch(n){i.w("Load failed for 'items' store. Using empty store."),e.instance.progressionStore=[]}},e.setItem=function(n,t){var i=e.KeyPrefix+n;t?e.instance.storeItems[i]=t:i in e.instance.storeItems&&delete e.instance.storeItems[i]},e.getItem=function(n){var t=e.KeyPrefix+n;return t in e.instance.storeItems?e.instance.storeItems[t]:null},e.getStore=function(n){switch(n){case r.Events:return e.instance.eventsStore;case r.Sessions:return e.instance.sessionsStore;case r.Progression:return e.instance.progressionStore;default:return i.w("GAStore.getStore(): Cannot find store: "+n),null}},e}();s.instance=new s,s.MaxNumberOfEntries=2e3,s.KeyPrefix="GA::",s.EventsStoreKey="ga_event",s.SessionsStoreKey="ga_session",s.ProgressionStoreKey="ga_progression",s.ItemsStoreKey="ga_items",n.GAStore=s}(e.store||(e.store={}))}(gameanalytics||(gameanalytics={}));var gameanalytics;!function(e){!function(n){var t=e.validators.GAValidator,i=e.utilities.GAUtilities,r=e.logging.GALogger,s=e.store.GAStore,o=e.device.GADevice,a=e.store.EGAStore,u=e.store.EGAStoreArgsOperator,c=function(){function n(){this.availableCustomDimensions01=[],this.availableCustomDimensions02=[],this.availableCustomDimensions03=[],this.availableResourceCurrencies=[],this.availableResourceItemTypes=[],this.sdkConfigDefault={},this.sdkConfig={},this.progressionTries={}}return n.setUserId=function(e){n.instance.userId=e,n.cacheIdentifier()},n.getIdentifier=function(){return n.instance.identifier},n.isInitialized=function(){return n.instance.initialized},n.setInitialized=function(e){n.instance.initialized=e},n.getSessionStart=function(){return n.instance.sessionStart},n.getSessionNum=function(){return n.instance.sessionNum},n.getTransactionNum=function(){return n.instance.transactionNum},n.getSessionId=function(){return n.instance.sessionId},n.getCurrentCustomDimension01=function(){return n.instance.currentCustomDimension01},n.getCurrentCustomDimension02=function(){return n.instance.currentCustomDimension02},n.getCurrentCustomDimension03=function(){return n.instance.currentCustomDimension03},n.getGameKey=function(){return n.instance.gameKey},n.getGameSecret=function(){return n.instance.gameSecret},n.getAvailableCustomDimensions01=function(){return n.instance.availableCustomDimensions01},n.setAvailableCustomDimensions01=function(e){t.validateCustomDimensions(e)&&(n.instance.availableCustomDimensions01=e,n.validateAndFixCurrentDimensions(),r.i("Set available custom01 dimension values: ("+i.joinStringArray(e,", ")+")"))},n.getAvailableCustomDimensions02=function(){return n.instance.availableCustomDimensions02},n.setAvailableCustomDimensions02=function(e){t.validateCustomDimensions(e)&&(n.instance.availableCustomDimensions02=e,n.validateAndFixCurrentDimensions(),r.i("Set available custom02 dimension values: ("+i.joinStringArray(e,", ")+")"))},n.getAvailableCustomDimensions03=function(){return n.instance.availableCustomDimensions03},n.setAvailableCustomDimensions03=function(e){t.validateCustomDimensions(e)&&(n.instance.availableCustomDimensions03=e,n.validateAndFixCurrentDimensions(),r.i("Set available custom03 dimension values: ("+i.joinStringArray(e,", ")+")"))},n.getAvailableResourceCurrencies=function(){return n.instance.availableResourceCurrencies},n.setAvailableResourceCurrencies=function(e){t.validateResourceCurrencies(e)&&(n.instance.availableResourceCurrencies=e,r.i("Set available resource currencies: ("+i.joinStringArray(e,", ")+")"))},n.getAvailableResourceItemTypes=function(){return n.instance.availableResourceItemTypes},n.setAvailableResourceItemTypes=function(e){t.validateResourceItemTypes(e)&&(n.instance.availableResourceItemTypes=e,r.i("Set available resource item types: ("+i.joinStringArray(e,", ")+")"))},n.getBuild=function(){return n.instance.build},n.setBuild=function(e){n.instance.build=e,r.i("Set build version: "+e)},n.getUseManualSessionHandling=function(){return n.instance.useManualSessionHandling},n.prototype.setDefaultId=function(e){this.defaultUserId=e||"",n.cacheIdentifier()},n.getDefaultId=function(){return n.instance.defaultUserId},n.getSdkConfig=function(){var e,t=0;for(var i in n.instance.sdkConfig)0===t&&(e=i),++t;if(e&&t>0)return n.instance.sdkConfig;var e,t=0;for(var i in n.instance.sdkConfigCached)0===t&&(e=i),++t;return e&&t>0?n.instance.sdkConfigCached:n.instance.sdkConfigDefault},n.isEnabled=function(){var e=n.getSdkConfig()
;return(!e.enabled||"false"!=e.enabled)&&!!n.instance.initAuthorized},n.setCustomDimension01=function(e){n.instance.currentCustomDimension01=e,s.setItem(n.Dimension01Key,e),r.i("Set custom01 dimension value: "+e)},n.setCustomDimension02=function(e){n.instance.currentCustomDimension02=e,s.setItem(n.Dimension02Key,e),r.i("Set custom02 dimension value: "+e)},n.setCustomDimension03=function(e){n.instance.currentCustomDimension03=e,s.setItem(n.Dimension03Key,e),r.i("Set custom03 dimension value: "+e)},n.setFacebookId=function(e){n.instance.facebookId=e,s.setItem(n.FacebookIdKey,e),r.i("Set facebook id: "+e)},n.setGender=function(t){n.instance.gender=isNaN(Number(e.EGAGender[t]))?e.EGAGender[t].toString().toLowerCase():e.EGAGender[e.EGAGender[t]].toString().toLowerCase(),s.setItem(n.GenderKey,n.instance.gender),r.i("Set gender: "+n.instance.gender)},n.setBirthYear=function(e){n.instance.birthYear=e,s.setItem(n.BirthYearKey,e.toString()),r.i("Set birth year: "+e)},n.incrementSessionNum=function(){var e=n.getSessionNum()+1;n.instance.sessionNum=e},n.incrementTransactionNum=function(){var e=n.getTransactionNum()+1;n.instance.transactionNum=e},n.incrementProgressionTries=function(e){var t=n.getProgressionTries(e)+1;n.instance.progressionTries[e]=t;var i={};i.progression=e,i.tries=t,s.insert(a.Progression,i,!0,"progression")},n.getProgressionTries=function(e){return e in n.instance.progressionTries?n.instance.progressionTries[e]:0},n.clearProgressionTries=function(e){e in n.instance.progressionTries&&delete n.instance.progressionTries[e];var t=[];t.push(["progression",u.Equal,e]),s.delete(a.Progression,t)},n.setKeys=function(e,t){n.instance.gameKey=e,n.instance.gameSecret=t},n.setManualSessionHandling=function(e){n.instance.useManualSessionHandling=e,r.i("Use manual session handling: "+e)},n.getEventAnnotations=function(){var e={};e.v=2,e.user_id=n.instance.identifier,e.client_ts=n.getClientTsAdjusted(),e.sdk_version=o.getRelevantSdkVersion(),e.os_version=o.osVersion,e.manufacturer=o.deviceManufacturer,e.device=o.deviceModel,e.browser_version=o.browserVersion,e.platform=o.buildPlatform,e.session_id=n.instance.sessionId,e[n.SessionNumKey]=n.instance.sessionNum;var i=o.getConnectionType();return t.validateConnectionType(i)&&(e.connection_type=i),o.gameEngineVersion&&(e.engine_version=o.gameEngineVersion),n.instance.build&&(e.build=n.instance.build),n.instance.facebookId&&(e[n.FacebookIdKey]=n.instance.facebookId),n.instance.gender&&(e[n.GenderKey]=n.instance.gender),0!=n.instance.birthYear&&(e[n.BirthYearKey]=n.instance.birthYear),e},n.getSdkErrorEventAnnotations=function(){var e={};e.v=2,e.category=n.CategorySdkError,e.sdk_version=o.getRelevantSdkVersion(),e.os_version=o.osVersion,e.manufacturer=o.deviceManufacturer,e.device=o.deviceModel,e.platform=o.buildPlatform;var i=o.getConnectionType();return t.validateConnectionType(i)&&(e.connection_type=i),o.gameEngineVersion&&(e.engine_version=o.gameEngineVersion),e},n.getInitAnnotations=function(){var e={};return e.sdk_version=o.getRelevantSdkVersion(),e.os_version=o.osVersion,e.platform=o.buildPlatform,e},n.getClientTsAdjusted=function(){var e=i.timeIntervalSince1970(),r=e+n.instance.clientServerTimeOffset;return t.validateClientTs(r)?r:e},n.sessionIsStarted=function(){return 0!=n.instance.sessionStart},n.cacheIdentifier=function(){n.instance.userId?n.instance.identifier=n.instance.userId:n.instance.defaultUserId&&(n.instance.identifier=n.instance.defaultUserId)},n.ensurePersistedStates=function(){s.isStorageAvailable()&&s.load();var e=n.instance;e.setDefaultId(null!=s.getItem(n.DefaultUserIdKey)?s.getItem(n.DefaultUserIdKey):i.createGuid()),e.sessionNum=null!=s.getItem(n.SessionNumKey)?Number(s.getItem(n.SessionNumKey)):0,e.transactionNum=null!=s.getItem(n.TransactionNumKey)?Number(s.getItem(n.TransactionNumKey)):0,e.facebookId?s.setItem(n.FacebookIdKey,e.facebookId):(e.facebookId=null!=s.getItem(n.FacebookIdKey)?s.getItem(n.FacebookIdKey):"",e.facebookId),e.gender?s.setItem(n.GenderKey,e.gender):(e.gender=null!=s.getItem(n.GenderKey)?s.getItem(n.GenderKey):"",e.gender),e.birthYear&&0!=e.birthYear?s.setItem(n.BirthYearKey,e.birthYear.toString()):(e.birthYear=null!=s.getItem(n.BirthYearKey)?Number(s.getItem(n.BirthYearKey)):0,e.birthYear),e.currentCustomDimension01?s.setItem(n.Dimension01Key,e.currentCustomDimension01):(e.currentCustomDimension01=null!=s.getItem(n.Dimension01Key)?s.getItem(n.Dimension01Key):"",e.currentCustomDimension01),e.currentCustomDimension02?s.setItem(n.Dimension02Key,e.currentCustomDimension02):(e.currentCustomDimension02=null!=s.getItem(n.Dimension02Key)?s.getItem(n.Dimension02Key):"",e.currentCustomDimension02),e.currentCustomDimension03?s.setItem(n.Dimension03Key,e.currentCustomDimension03):(e.currentCustomDimension03=null!=s.getItem(n.Dimension03Key)?s.getItem(n.Dimension03Key):"",e.currentCustomDimension03);var t=null!=s.getItem(n.SdkConfigCachedKey)?s.getItem(n.SdkConfigCachedKey):"";if(t){var r=JSON.parse(i.decode64(t));r&&(e.sdkConfigCached=r)}var o=s.select(a.Progression);if(o)for(var u=0;u<o.length;++u){var c=o[u];c&&(e.progressionTries[c.progression]=c.tries)}},n.calculateServerTimeOffset=function(e){return e-i.timeIntervalSince1970()},n.validateAndFixCurrentDimensions=function(){t.validateDimension01(n.getCurrentCustomDimension01(),n.getAvailableCustomDimensions01())||n.setCustomDimension01(""),t.validateDimension02(n.getCurrentCustomDimension02(),n.getAvailableCustomDimensions02())||n.setCustomDimension02(""),t.validateDimension03(n.getCurrentCustomDimension03(),n.getAvailableCustomDimensions03())||n.setCustomDimension03("")},n}();c.CategorySdkError="sdk_error",c.instance=new c,c.DefaultUserIdKey="default_user_id",c.SessionNumKey="session_num",c.TransactionNumKey="transaction_num",c.FacebookIdKey="facebook_id",c.GenderKey="gender",c.BirthYearKey="birth_year",c.Dimension01Key="dimension01",c.Dimension02Key="dimension02",c.Dimension03Key="dimension03",c.SdkConfigCachedKey="sdk_config_cached",n.GAState=c}(e.state||(e.state={}))}(gameanalytics||(gameanalytics={}));var gameanalytics;!function(e){!function(n){var t=e.utilities.GAUtilities,i=e.logging.GALogger,r=function(){function e(){}return e.execute=function(n,r,s,o){if(e.countMap[r]||(e.countMap[r]=0),!(e.countMap[r]>=e.MaxCount)){var a=t.getHmac(o,s),u=new XMLHttpRequest;u.onreadystatechange=function(){if(4===u.readyState){if(!u.responseText)return;if(200!=u.status)return void i.w("sdk error failed. response code not 200. status code: "+u.status+", description: "+u.statusText+", body: "+u.responseText);e.countMap[r]=e.countMap[r]+1}},u.open("POST",n,!0),u.setRequestHeader("Content-Type","application/json"),u.setRequestHeader("Authorization",a);try{u.send(s)}catch(e){console.error(e)}}},e}();r.MaxCount=10,r.countMap={},n.SdkErrorTask=r}(e.tasks||(e.tasks={}))}(gameanalytics||(gameanalytics={}));var gameanalytics;!function(e){!function(n){var t=e.state.GAState,i=e.logging.GALogger,r=e.utilities.GAUtilities,s=e.validators.GAValidator,o=e.tasks.SdkErrorTask,a=function(){function e(){this.protocol="https",this.hostName="api.gameanalytics.com",this.version="v2",this.baseUrl=this.protocol+"://"+this.hostName+"/"+this.version,this.initializeUrlPath="init",this.eventsUrlPath="events",this.useGzip=!1}return e.prototype.requestInit=function(i){var r=t.getGameKey(),s=this.baseUrl+"/"+r+"/"+this.initializeUrlPath,o=t.getInitAnnotations(),a=JSON.stringify(o);if(!a)return void i(n.EGAHTTPApiResponse.JsonEncodeFailed,null);var u=this.createPayloadData(a,this.useGzip),c=[];c.push(a),e.sendRequest(s,u,c,this.useGzip,e.initRequestCallback,i)},e.prototype.sendEventsInArray=function(i,r,s){if(0!=i.length){var o=t.getGameKey(),a=this.baseUrl+"/"+o+"/"+this.eventsUrlPath,u=JSON.stringify(i);if(!u)return void s(n.EGAHTTPApiResponse.JsonEncodeFailed,null,r,i.length);var c=this.createPayloadData(u,this.useGzip),d=[];d.push(u),d.push(r),d.push(i.length.toString()),e.sendRequest(a,c,d,this.useGzip,e.sendEventInArrayRequestCallback,s)}},e.prototype.sendSdkErrorEvent=function(n){var r=t.getGameKey(),a=t.getGameSecret();if(s.validateSdkErrorEvent(r,a,n)){var u=this.baseUrl+"/"+r+"/"+this.eventsUrlPath,c="",d=t.getSdkErrorEventAnnotations(),l=e.sdkErrorTypeToString(n);d.type=l;var f=[];if(f.push(d),!(c=JSON.stringify(f)))return void i.w("sendSdkErrorEvent: JSON encoding failed.");o.execute(u,n,c,a)}},e.sendEventInArrayRequestCallback=function(t,i,r,s){void 0===s&&(s=null);var o=(s[0],s[1],s[2]),a=parseInt(s[3]),u="",c=0;u=t.responseText,c=t.status;var d=e.instance.processRequestResponse(c,t.statusText,u,"Events");if(d!=n.EGAHTTPApiResponse.Ok&&d!=n.EGAHTTPApiResponse.BadRequest)return void r(d,null,o,a);var l=u?JSON.parse(u):{};if(null==l)return void r(n.EGAHTTPApiResponse.JsonDecodeFailed,null,o,a);n.EGAHTTPApiResponse.BadRequest,r(d,l,o,a)},e.sendRequest=function(e,n,i,s,o,a){var u=new XMLHttpRequest,c=t.getGameSecret(),d=r.getHmac(c,n),l=[];l.push(d);for(var f in i)l.push(i[f]);if(u.onreadystatechange=function(){4===u.readyState&&o(u,e,a,l)},u.open("POST",e,!0),u.setRequestHeader("Content-Type","text/plain"),u.setRequestHeader("Authorization",d),s)throw new Error("gzip not supported");try{u.send(n)}catch(e){console.error(e.stack)}},e.initRequestCallback=function(t,i,r,o){void 0===o&&(o=null);var a=(o[0],o[1],""),u=0;a=t.responseText,u=t.status;var c=a?JSON.parse(a):{},d=e.instance.processRequestResponse(u,t.statusText,a,"Init");if(d!=n.EGAHTTPApiResponse.Ok&&d!=n.EGAHTTPApiResponse.BadRequest)return void r(d,null);if(null==c)return void r(n.EGAHTTPApiResponse.JsonDecodeFailed,null);if(d===n.EGAHTTPApiResponse.BadRequest)return void r(d,null);var l=s.validateAndCleanInitRequestResponse(c);if(!l)return void r(n.EGAHTTPApiResponse.BadResponse,null);r(n.EGAHTTPApiResponse.Ok,l)},e.prototype.createPayloadData=function(e,n){if(n)throw new Error("gzip not supported");return e},e.prototype.processRequestResponse=function(e,t,i,r){return i?200===e?n.EGAHTTPApiResponse.Ok:0===e||401===e?n.EGAHTTPApiResponse.Unauthorized:400===e?n.EGAHTTPApiResponse.BadRequest:500===e?n.EGAHTTPApiResponse.InternalServerError:n.EGAHTTPApiResponse.UnknownResponseCode:n.EGAHTTPApiResponse.NoResponse},e.sdkErrorTypeToString=function(e){switch(e){case n.EGASdkErrorType.Rejected:return"rejected";default:return""}},e}();a.instance=new a,n.GAHTTPApi=a}(e.http||(e.http={}))}(gameanalytics||(gameanalytics={}));var gameanalytics;!function(e){!function(n){var t=e.store.GAStore,i=e.store.EGAStore,r=e.store.EGAStoreArgsOperator,s=e.state.GAState,o=e.logging.GALogger,a=e.utilities.GAUtilities,u=e.http.EGAHTTPApiResponse,c=e.http.GAHTTPApi,d=e.validators.GAValidator,l=e.http.EGASdkErrorType,f=function(){function n(){}return n.addSessionStartEvent=function(){var e={};e.category=n.CategorySessionStart,s.incrementSessionNum(),t.setItem(s.SessionNumKey,s.getSessionNum().toString()),n.addDimensionsToEvent(e),n.addEventToStore(e),o.i("Add SESSION START event"),n.processEvents(n.CategorySessionStart,!1)},n.addSessionEndEvent=function(){var e=s.getSessionStart(),t=s.getClientTsAdjusted(),i=t-e;i<0&&(o.w("Session length was calculated to be less then 0. Should not be possible. Resetting to 0."),i=0);var r={};r.category=n.CategorySessionEnd,r.length=i,n.addDimensionsToEvent(r),n.addEventToStore(r),o.i("Add SESSION END event."),n.processEvents("",!1)},n.addBusinessEvent=function(e,i,r,a,u){if(void 0===u&&(u=null),!d.validateBusinessEvent(e,i,u,r,a))return void c.instance.sendSdkErrorEvent(l.Rejected);var f={};s.incrementTransactionNum(),t.setItem(s.TransactionNumKey,s.getTransactionNum().toString()),f.event_id=r+":"+a,f.category=n.CategoryBusiness,f.currency=e,f.amount=i,f[s.TransactionNumKey]=s.getTransactionNum(),u&&(f.cart_type=u),n.addDimensionsToEvent(f),o.i("Add BUSINESS event: {currency:"+e+", amount:"+i+", itemType:"+r+", itemId:"+a+", cartType:"+u+"}"),n.addEventToStore(f)},n.addResourceEvent=function(t,i,r,a,u){if(!d.validateResourceEvent(t,i,r,a,u,s.getAvailableResourceCurrencies(),s.getAvailableResourceItemTypes()))return void c.instance.sendSdkErrorEvent(l.Rejected);t===e.EGAResourceFlowType.Sink&&(r*=-1);var f={},v=n.resourceFlowTypeToString(t);f.event_id=v+":"+i+":"+a+":"+u,f.category=n.CategoryResource,f.amount=r,n.addDimensionsToEvent(f),o.i("Add RESOURCE event: {currency:"+i+", amount:"+r+", itemType:"+a+", itemId:"+u+"}"),n.addEventToStore(f)},n.addProgressionEvent=function(t,i,r,a,u,f){var v=n.progressionStatusToString(t);if(!d.validateProgressionEvent(t,i,r,a))return void c.instance.sendSdkErrorEvent(l.Rejected);var g,m={};g=r?a?i+":"+r+":"+a:i+":"+r:i,m.category=n.CategoryProgression,m.event_id=v+":"+g;var p=0;f&&t!=e.EGAProgressionStatus.Start&&(m.score=u),t===e.EGAProgressionStatus.Fail&&s.incrementProgressionTries(g),t===e.EGAProgressionStatus.Complete&&(s.incrementProgressionTries(g),p=s.getProgressionTries(g),m.attempt_num=p,s.clearProgressionTries(g)),n.addDimensionsToEvent(m),o.i("Add PROGRESSION event: {status:"+v+", progression01:"+i+", progression02:"+r+", progression03:"+a+", score:"+u+", attempt:"+p+"}"),n.addEventToStore(m)},n.addDesignEvent=function(e,t,i){if(!d.validateDesignEvent(e,t))return void c.instance.sendSdkErrorEvent(l.Rejected);var r={};r.category=n.CategoryDesign,r.event_id=e,i&&(r.value=t),o.i("Add DESIGN event: {eventId:"+e+", value:"+t+"}"),n.addEventToStore(r)},n.addErrorEvent=function(e,t){var i=n.errorSeverityToString(e);if(!d.validateErrorEvent(e,t))return void c.instance.sendSdkErrorEvent(l.Rejected);var r={};r.category=n.CategoryError,r.severity=i,r.message=t,o.i("Add ERROR event: {severity:"+i+", message:"+t+"}"),n.addEventToStore(r)},n.processEvents=function(e,s){try{var u=a.createGuid();s&&(n.cleanupEvents(),n.fixMissingSessionEndEvents());var d=[];d.push(["status",r.Equal,"new"]);var l=[];l.push(["status",r.Equal,"new"]),e&&(d.push(["category",r.Equal,e]),l.push(["category",r.Equal,e]));var f=[];f.push(["status",u]);var v=t.select(i.Events,d);if(!v||0==v.length)return void o.i("Event queue: No events to send");if(v.length>n.MaxEventCount){if(!(v=t.select(i.Events,d,!0,n.MaxEventCount)))return;var g=v[v.length-1],m=g.client_ts;if(d.push(["client_ts",r.LessOrEqual,m]),!(v=t.select(i.Events,d)))return;l.push(["client_ts",r.LessOrEqual,m])}if(o.i("Event queue: Sending "+v.length+" events."),!t.update(i.Events,f,l))return;for(var p=[],h=0;h<v.length;++h){var y=v[h],S=JSON.parse(a.decode64(y.event));0!=S.length&&p.push(S)}c.instance.sendEventsInArray(p,u,n.processEventsCallback)}catch(e){o.e("Error during ProcessEvents(): "+e.stack)}},n.processEventsCallback=function(e,s,a,c){var d=[];if(d.push(["status",r.Equal,a]),e===u.Ok)t.delete(i.Events,d),o.i("Event queue: "+c+" events sent.");else if(e===u.NoResponse){var l=[];l.push(["status","new"]),o.w("Event queue: Failed to send events to collector - Retrying next time"),t.update(i.Events,l,d)}else{if(s){var f,v=0;for(var g in s)0==v&&(f=s[g]),++v;e===u.BadRequest&&f.constructor===Array?o.w("Event queue: "+c+" events sent. "+v+" events failed GA server validation."):o.w("Event queue: Failed to send events.")}else o.w("Event queue: Failed to send events.");t.delete(i.Events,d)}n.updateSessionStore()},n.cleanupEvents=function(){t.update(i.Events,[["status","new"]])},n.fixMissingSessionEndEvents=function(){var e=[];e.push(["session_id",r.NotEqual,s.getSessionId()]);var u=t.select(i.Sessions,e);if(u&&0!=u.length){o.i(u.length+" session(s) located with missing session_end event.");for(var c=0;c<u.length;++c){var d=JSON.parse(a.decode64(u[c].event)),l=d.client_ts,f=u[c].timestamp,v=l-f;v=Math.max(0,v),d.category=n.CategorySessionEnd,d.length=v,n.addEventToStore(d)}}},n.addEventToStore=function(e){if(!s.isInitialized())return void o.w("Could not add event: SDK is not initialized");try{if(t.isStoreTooLargeForEvents()&&!a.stringMatch(e.category,/^(user|session_end|business)$/))return void o.w("Database too large. Event has been blocked.");var u=s.getEventAnnotations(),c=a.encode64(JSON.stringify(u));for(var d in e)u[d]=e[d];var l=JSON.stringify(u);o.ii("Event added to queue: "+l);var f={};f.status="new",f.category=u.category,f.session_id=u.session_id,f.client_ts=u.client_ts,f.event=a.encode64(JSON.stringify(u)),t.insert(i.Events,f),e.category==n.CategorySessionEnd?t.delete(i.Sessions,[["session_id",r.Equal,u.session_id]]):(f={},f.session_id=u.session_id,f.timestamp=s.getSessionStart(),f.event=c,t.insert(i.Sessions,f,!0,"session_id")),t.isStorageAvailable()&&t.save()}catch(d){o.e("addEventToStore: error"),o.e(d.stack)}},n.updateSessionStore=function(){if(s.sessionIsStarted()){var e={};e.session_id=s.instance.sessionId,e.timestamp=s.getSessionStart(),e.event=a.encode64(JSON.stringify(s.getEventAnnotations())),t.insert(i.Sessions,e,!0,"session_id"),t.isStorageAvailable()&&t.save()}},n.addDimensionsToEvent=function(e){e&&(s.getCurrentCustomDimension01()&&(e.custom_01=s.getCurrentCustomDimension01()),s.getCurrentCustomDimension02()&&(e.custom_02=s.getCurrentCustomDimension02()),s.getCurrentCustomDimension03()&&(e.custom_03=s.getCurrentCustomDimension03()))},n.resourceFlowTypeToString=function(n){return n==e.EGAResourceFlowType.Source||n==e.EGAResourceFlowType[e.EGAResourceFlowType.Source]?"Source":n==e.EGAResourceFlowType.Sink||n==e.EGAResourceFlowType[e.EGAResourceFlowType.Sink]?"Sink":""},n.progressionStatusToString=function(n){return n==e.EGAProgressionStatus.Start||n==e.EGAProgressionStatus[e.EGAProgressionStatus.Start]?"Start":n==e.EGAProgressionStatus.Complete||n==e.EGAProgressionStatus[e.EGAProgressionStatus.Complete]?"Complete":n==e.EGAProgressionStatus.Fail||n==e.EGAProgressionStatus[e.EGAProgressionStatus.Fail]?"Fail":""},n.errorSeverityToString=function(n){return n==e.EGAErrorSeverity.Debug||n==e.EGAErrorSeverity[e.EGAErrorSeverity.Debug]?"debug":n==e.EGAErrorSeverity.Info||n==e.EGAErrorSeverity[e.EGAErrorSeverity.Info]?"info":n==e.EGAErrorSeverity.Warning||n==e.EGAErrorSeverity[e.EGAErrorSeverity.Warning]?"warning":n==e.EGAErrorSeverity.Error||n==e.EGAErrorSeverity[e.EGAErrorSeverity.Error]?"error":n==e.EGAErrorSeverity.Critical||n==e.EGAErrorSeverity[e.EGAErrorSeverity.Critical]?"critical":""},n}();f.instance=new f,f.CategorySessionStart="user",f.CategorySessionEnd="session_end",f.CategoryDesign="design",f.CategoryBusiness="business",f.CategoryProgression="progression",f.CategoryResource="resource",f.CategoryError="error",f.MaxEventCount=500,n.GAEvents=f}(e.events||(e.events={}))}(gameanalytics||(gameanalytics={}));var gameanalytics;!function(e){!function(n){var t=e.logging.GALogger,i=e.state.GAState,r=e.events.GAEvents,s=function(){function e(){this.blocks=new n.PriorityQueue({compare:function(e,n){return e-n}}),this.id2TimedBlockMap={},e.startThread()}return e.createTimedBlock=function(e){void 0===e&&(e=0);var t=new Date;return t.setSeconds(t.getSeconds()+e),new n.TimedBlock(t)},e.performTaskOnGAThread=function(t,i){void 0===i&&(i=0);var r=new Date;r.setSeconds(r.getSeconds()+i);var s=new n.TimedBlock(r);s.block=t,e.instance.id2TimedBlockMap[s.id]=s,e.instance.addTimedBlock(s)},e.performTimedBlockOnGAThread=function(n){e.instance.id2TimedBlockMap[n.id]=n,e.instance.addTimedBlock(n)},e.scheduleTimer=function(t,i){var r=new Date;r.setSeconds(r.getSeconds()+t);var s=new n.TimedBlock(r);return s.block=i,e.instance.id2TimedBlockMap[s.id]=s,e.instance.addTimedBlock(s),s.id},e.getTimedBlockById=function(n){return n in e.instance.id2TimedBlockMap?e.instance.id2TimedBlockMap[n]:null},e.ensureEventQueueIsRunning=function(){e.instance.keepRunning=!0,e.instance.isRunning||(e.instance.isRunning=!0,e.scheduleTimer(e.ProcessEventsIntervalInSeconds,e.processEventQueue))},e.endSessionAndStopQueue=function(){i.isInitialized()&&(t.i("Ending session."),e.stopEventQueue(),i.isEnabled()&&i.sessionIsStarted()&&(r.addSessionEndEvent(),i.instance.sessionStart=0))},e.stopEventQueue=function(){e.instance.keepRunning=!1},e.ignoreTimer=function(n){n in e.instance.id2TimedBlockMap&&(e.instance.id2TimedBlockMap[n].ignore=!0)},e.setEventProcessInterval=function(n){n>0&&(e.ProcessEventsIntervalInSeconds=n)},e.prototype.addTimedBlock=function(e){this.blocks.enqueue(e.deadline.getTime(),e)},e.run=function(){clearTimeout(e.runTimeoutId);try{for(var n;n=e.getNextBlock();)if(!n.ignore)if(n.async){if(!n.running){n.running=!0,n.block();break}}else n.block();return void(e.runTimeoutId=setTimeout(e.run,e.ThreadWaitTimeInMs))}catch(e){t.e("Error on GA thread"),t.e(e.stack)}},e.startThread=function(){e.runTimeoutId=setTimeout(e.run,0)},e.getNextBlock=function(){var n=new Date;return e.instance.blocks.hasItems()&&e.instance.blocks.peek().deadline.getTime()<=n.getTime()?e.instance.blocks.peek().async&&e.instance.blocks.peek().running?e.instance.blocks.peek():e.instance.blocks.dequeue():null},e.processEventQueue=function(){r.processEvents("",!0),e.instance.keepRunning?e.scheduleTimer(e.ProcessEventsIntervalInSeconds,e.processEventQueue):e.instance.isRunning=!1},e}();s.instance=new s,s.ThreadWaitTimeInMs=1e3,s.ProcessEventsIntervalInSeconds=8,n.GAThreading=s}(e.threading||(e.threading={}))}(gameanalytics||(gameanalytics={}));var gameanalytics;!function(e){var n=e.threading.GAThreading,t=e.logging.GALogger,i=e.store.GAStore,r=e.state.GAState,s=e.http.GAHTTPApi,o=e.device.GADevice,a=e.validators.GAValidator,u=e.http.EGAHTTPApiResponse,c=e.utilities.GAUtilities,d=e.events.GAEvents,l=function(){function l(){}return l.init=function(){if(o.touch(),l.methodMap.configureAvailableCustomDimensions01=l.configureAvailableCustomDimensions01,l.methodMap.configureAvailableCustomDimensions02=l.configureAvailableCustomDimensions02,l.methodMap.configureAvailableCustomDimensions03=l.configureAvailableCustomDimensions03,l.methodMap.configureAvailableResourceCurrencies=l.configureAvailableResourceCurrencies,l.methodMap.configureAvailableResourceItemTypes=l.configureAvailableResourceItemTypes,l.methodMap.configureBuild=l.configureBuild,l.methodMap.configureSdkGameEngineVersion=l.configureSdkGameEngineVersion,l.methodMap.configureGameEngineVersion=l.configureGameEngineVersion,l.methodMap.configureUserId=l.configureUserId,l.methodMap.initialize=l.initialize,l.methodMap.addBusinessEvent=l.addBusinessEvent,l.methodMap.addResourceEvent=l.addResourceEvent,l.methodMap.addProgressionEvent=l.addProgressionEvent,l.methodMap.addDesignEvent=l.addDesignEvent,l.methodMap.addErrorEvent=l.addErrorEvent,l.methodMap.addErrorEvent=l.addErrorEvent,l.methodMap.setEnabledInfoLog=l.setEnabledInfoLog,l.methodMap.setEnabledVerboseLog=l.setEnabledVerboseLog,l.methodMap.setEnabledManualSessionHandling=l.setEnabledManualSessionHandling,l.methodMap.setCustomDimension01=l.setCustomDimension01,l.methodMap.setCustomDimension02=l.setCustomDimension02,l.methodMap.setCustomDimension03=l.setCustomDimension03,l.methodMap.setFacebookId=l.setFacebookId,l.methodMap.setGender=l.setGender,l.methodMap.setBirthYear=l.setBirthYear,l.methodMap.setEventProcessInterval=l.setEventProcessInterval,l.methodMap.startSession=l.startSession,l.methodMap.endSession=l.endSession,l.methodMap.onStop=l.onStop,l.methodMap.onResume=l.onResume,"undefined"!=typeof window&&void 0!==window.GameAnalytics&&void 0!==window.GameAnalytics.q){var e=window.GameAnalytics.q;for(var n in e)l.gaCommand.apply(null,e[n])}},l.gaCommand=function(){for(var n=[],t=0;t<arguments.length;t++)n[t]=arguments[t];n.length>0&&n[0]in e.GameAnalytics.methodMap&&(n.length>1?e.GameAnalytics.methodMap[n[0]].apply(null,Array.prototype.slice.call(n,1)):e.GameAnalytics.methodMap[n[0]]())},l.configureAvailableCustomDimensions01=function(e){void 0===e&&(e=[]),n.performTaskOnGAThread(function(){if(l.isSdkReady(!0,!1))return void t.w("Available custom dimensions must be set before SDK is initialized");r.setAvailableCustomDimensions01(e)})},l.configureAvailableCustomDimensions02=function(e){void 0===e&&(e=[]),n.performTaskOnGAThread(function(){if(l.isSdkReady(!0,!1))return void t.w("Available custom dimensions must be set before SDK is initialized");r.setAvailableCustomDimensions02(e)})},l.configureAvailableCustomDimensions03=function(e){void 0===e&&(e=[]),n.performTaskOnGAThread(function(){if(l.isSdkReady(!0,!1))return void t.w("Available custom dimensions must be set before SDK is initialized");r.setAvailableCustomDimensions03(e)})},l.configureAvailableResourceCurrencies=function(e){void 0===e&&(e=[]),n.performTaskOnGAThread(function(){if(l.isSdkReady(!0,!1))return void t.w("Available resource currencies must be set before SDK is initialized");r.setAvailableResourceCurrencies(e)})},l.configureAvailableResourceItemTypes=function(e){void 0===e&&(e=[]),n.performTaskOnGAThread(function(){if(l.isSdkReady(!0,!1))return void t.w("Available resource item types must be set before SDK is initialized");r.setAvailableResourceItemTypes(e)})},l.configureBuild=function(e){void 0===e&&(e=""),n.performTaskOnGAThread(function(){return l.isSdkReady(!0,!1)?void t.w("Build version must be set before SDK is initialized."):a.validateBuild(e)?void r.setBuild(e):void t.i("Validation fail - configure build: Cannot be null, empty or above 32 length. String: "+e)})},l.configureSdkGameEngineVersion=function(e){void 0===e&&(e=""),n.performTaskOnGAThread(function(){if(!l.isSdkReady(!0,!1))return a.validateSdkWrapperVersion(e)?void(o.sdkGameEngineVersion=e):void t.i("Validation fail - configure sdk version: Sdk version not supported. String: "+e)})},l.configureGameEngineVersion=function(e){void 0===e&&(e=""),n.performTaskOnGAThread(function(){if(!l.isSdkReady(!0,!1))return a.validateEngineVersion(e)?void(o.gameEngineVersion=e):void t.i("Validation fail - configure game engine version: Game engine version not supported. String: "+e)})},l.configureUserId=function(e){void 0===e&&(e=""),n.performTaskOnGAThread(function(){return l.isSdkReady(!0,!1)?void t.w("A custom user id must be set before SDK is initialized."):a.validateUserId(e)?void r.setUserId(e):void t.i("Validation fail - configure user_id: Cannot be null, empty or above 64 length. Will use default user_id method. Used string: "+e)})},l.initialize=function(e,i){void 0===e&&(e=""),void 0===i&&(i=""),o.updateConnectionType();var s=n.createTimedBlock();s.async=!0,l.initTimedBlockId=s.id,s.block=function(){return l.isSdkReady(!0,!1)?void t.w("SDK already initialized. Can only be called once."):a.validateKeys(e,i)?(r.setKeys(e,i),void l.internalInitialize()):void t.w("SDK failed initialize. Game key or secret key is invalid. Can only contain characters A-z 0-9, gameKey is 32 length, gameSecret is 40 length. Failed keys - gameKey: "+e+", secretKey: "+i)},n.performTimedBlockOnGAThread(s)},l.addBusinessEvent=function(e,t,i,r,s){void 0===e&&(e=""),void 0===t&&(t=0),void 0===i&&(i=""),void 0===r&&(r=""),void 0===s&&(s=""),o.updateConnectionType(),n.performTaskOnGAThread(function(){l.isSdkReady(!0,!0,"Could not add business event")&&d.addBusinessEvent(e,t,i,r,s)})},l.addResourceEvent=function(t,i,r,s,a){void 0===t&&(t=e.EGAResourceFlowType.Undefined),void 0===i&&(i=""),void 0===r&&(r=0),void 0===s&&(s=""),void 0===a&&(a=""),o.updateConnectionType(),n.performTaskOnGAThread(function(){l.isSdkReady(!0,!0,"Could not add resource event")&&d.addResourceEvent(t,i,r,s,a)})},l.addProgressionEvent=function(t,i,r,s,a){void 0===t&&(t=e.EGAProgressionStatus.Undefined),void 0===i&&(i=""),void 0===r&&(r=""),void 0===s&&(s=""),o.updateConnectionType(),n.performTaskOnGAThread(function(){if(l.isSdkReady(!0,!0,"Could not add progression event")){var e=void 0!==a;d.addProgressionEvent(t,i,r,s,e?a:0,e)}})},l.addDesignEvent=function(e,t){o.updateConnectionType(),n.performTaskOnGAThread(function(){if(l.isSdkReady(!0,!0,"Could not add design event")){var n=void 0!==t;d.addDesignEvent(e,n?t:0,n)}})},l.addErrorEvent=function(t,i){void 0===t&&(t=e.EGAErrorSeverity.Undefined),void 0===i&&(i=""),o.updateConnectionType(),n.performTaskOnGAThread(function(){l.isSdkReady(!0,!0,"Could not add error event")&&d.addErrorEvent(t,i)})},l.setEnabledInfoLog=function(e){void 0===e&&(e=!1),n.performTaskOnGAThread(function(){e?(t.setInfoLog(e),t.i("Info logging enabled")):(t.i("Info logging disabled"),t.setInfoLog(e))})},l.setEnabledVerboseLog=function(e){void 0===e&&(e=!1),n.performTaskOnGAThread(function(){e?(t.setVerboseLog(e),t.i("Verbose logging enabled")):(t.i("Verbose logging disabled"),t.setVerboseLog(e))})},l.setEnabledManualSessionHandling=function(e){void 0===e&&(e=!1),n.performTaskOnGAThread(function(){r.setManualSessionHandling(e)})},l.setCustomDimension01=function(e){void 0===e&&(e=""),n.performTaskOnGAThread(function(){if(!a.validateDimension01(e,r.getAvailableCustomDimensions01()))return void t.w("Could not set custom01 dimension value to '"+e+"'. Value not found in available custom01 dimension values");r.setCustomDimension01(e)})},l.setCustomDimension02=function(e){void 0===e&&(e=""),n.performTaskOnGAThread(function(){if(!a.validateDimension02(e,r.getAvailableCustomDimensions02()))return void t.w("Could not set custom02 dimension value to '"+e+"'. Value not found in available custom02 dimension values");r.setCustomDimension02(e)})},l.setCustomDimension03=function(e){void 0===e&&(e=""),n.performTaskOnGAThread(function(){if(!a.validateDimension03(e,r.getAvailableCustomDimensions03()))return void t.w("Could not set custom03 dimension value to '"+e+"'. Value not found in available custom03 dimension values");r.setCustomDimension03(e)})},l.setFacebookId=function(e){void 0===e&&(e=""),n.performTaskOnGAThread(function(){a.validateFacebookId(e)&&r.setFacebookId(e)})},l.setGender=function(t){void 0===t&&(t=e.EGAGender.Undefined),n.performTaskOnGAThread(function(){a.validateGender(t)&&r.setGender(t)})},l.setBirthYear=function(e){void 0===e&&(e=0),n.performTaskOnGAThread(function(){a.validateBirthyear(e)&&r.setBirthYear(e)})},l.setEventProcessInterval=function(e){n.performTaskOnGAThread(function(){n.setEventProcessInterval(e)})},l.startSession=function(){if(r.getUseManualSessionHandling()){if(!r.isInitialized())return;var e=n.createTimedBlock();e.async=!0,l.initTimedBlockId=e.id,e.block=function(){r.isEnabled()&&r.sessionIsStarted()&&n.endSessionAndStopQueue(),l.resumeSessionAndStartQueue()},n.performTimedBlockOnGAThread(e)}},l.endSession=function(){r.getUseManualSessionHandling()&&l.onStop()},l.onStop=function(){n.performTaskOnGAThread(function(){try{n.endSessionAndStopQueue()}catch(e){}})},l.onResume=function(){var e=n.createTimedBlock();e.async=!0,l.initTimedBlockId=e.id,e.block=function(){l.resumeSessionAndStartQueue()},n.performTimedBlockOnGAThread(e)},l.internalInitialize=function(){r.ensurePersistedStates(),i.setItem(r.DefaultUserIdKey,r.getDefaultId()),r.setInitialized(!0),l.newSession(),r.isEnabled()&&n.ensureEventQueueIsRunning()},l.newSession=function(){t.i("Starting a new session."),r.validateAndFixCurrentDimensions(),s.instance.requestInit(l.startNewSessionCallback)},l.startNewSessionCallback=function(e,s){if(e===u.Ok&&s){var o=0;if(s.server_ts){var a=s.server_ts;o=r.calculateServerTimeOffset(a)}s.time_offset=o,i.setItem(r.SdkConfigCachedKey,c.encode64(JSON.stringify(s))),r.instance.sdkConfigCached=s,r.instance.sdkConfig=s,r.instance.initAuthorized=!0}else e==u.Unauthorized?(t.w("Initialize SDK failed - Unauthorized"),r.instance.initAuthorized=!1):(e===u.NoResponse||e===u.RequestTimeout?t.i("Init call (session start) failed - no response. Could be offline or timeout."):e===u.BadResponse||e===u.JsonEncodeFailed||e===u.JsonDecodeFailed?t.i("Init call (session start) failed - bad response. Could be bad response from proxy or GA servers."):e!==u.BadRequest&&e!==u.UnknownResponseCode||t.i("Init call (session start) failed - bad request or unknown response."),null==r.instance.sdkConfig?null!=r.instance.sdkConfigCached?(t.i("Init call (session start) failed - using cached init values."),r.instance.sdkConfig=r.instance.sdkConfigCached):(t.i("Init call (session start) failed - using default init values."),r.instance.sdkConfig=r.instance.sdkConfigDefault):t.i("Init call (session start) failed - using cached init values."),r.instance.initAuthorized=!0)
;if(r.instance.clientServerTimeOffset=r.instance.sdkConfig.time_offset?r.instance.sdkConfig.time_offset:0,!r.isEnabled())return t.w("Could not start session: SDK is disabled."),void n.stopEventQueue();n.ensureEventQueueIsRunning();var f=c.createGuid();r.instance.sessionId=f,r.instance.sessionStart=r.getClientTsAdjusted(),d.addSessionStartEvent(),n.getTimedBlockById(l.initTimedBlockId).running=!1,l.initTimedBlockId=-1},l.resumeSessionAndStartQueue=function(){r.isInitialized()&&(t.i("Resuming session."),r.sessionIsStarted()||l.newSession())},l.isSdkReady=function(e,n,i){return void 0===n&&(n=!0),void 0===i&&(i=""),i&&(i+=": "),e&&!r.isInitialized()?(n&&t.w(i+"SDK is not initialized"),!1):!(e&&!r.isEnabled())||(n&&t.w(i+"SDK is disabled"),!1)},l}();l.initTimedBlockId=-1,l.methodMap={},e.GameAnalytics=l}(gameanalytics||(gameanalytics={})),gameanalytics.GameAnalytics.init();var GameAnalytics=gameanalytics.GameAnalytics.gaCommand;
scope.gameanalytics=gameanalytics;
scope.GameAnalytics=GameAnalytics;
})(this);

// stats.js - http://github.com/mrdoob/stats.js
var Stats=function(){function h(a){c.appendChild(a.dom);return a}function k(a){for(var d=0;d<c.children.length;d++)c.children[d].style.display=d===a?"block":"none";l=a}var l=0,c=document.createElement("div");c.style.cssText="position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000";c.addEventListener("click",function(a){a.preventDefault();k(++l%c.children.length)},!1);var g=(performance||Date).now(),e=g,a=0,r=h(new Stats.Panel("FPS","#0ff","#002")),f=h(new Stats.Panel("MS","#0f0","#020"));
if(self.performance&&self.performance.memory)var t=h(new Stats.Panel("MB","#f08","#201"));k(0);return{REVISION:16,dom:c,addPanel:h,showPanel:k,begin:function(){g=(performance||Date).now()},end:function(){a++;var c=(performance||Date).now();f.update(c-g,200);if(c>e+1E3&&(r.update(1E3*a/(c-e),100),e=c,a=0,t)){var d=performance.memory;t.update(d.usedJSHeapSize/1048576,d.jsHeapSizeLimit/1048576)}return c},update:function(){g=this.end()},domElement:c,setMode:k}};
Stats.Panel=function(h,k,l){var c=Infinity,g=0,e=Math.round,a=e(window.devicePixelRatio||1),r=80*a,f=48*a,t=3*a,u=2*a,d=3*a,m=15*a,n=74*a,p=30*a,q=document.createElement("canvas");q.width=r;q.height=f;q.style.cssText="width:80px;height:48px";var b=q.getContext("2d");b.font="bold "+9*a+"px Helvetica,Arial,sans-serif";b.textBaseline="top";b.fillStyle=l;b.fillRect(0,0,r,f);b.fillStyle=k;b.fillText(h,t,u);b.fillRect(d,m,n,p);b.fillStyle=l;b.globalAlpha=.9;b.fillRect(d,m,n,p);return{dom:q,update:function(f,
v){c=Math.min(c,f);g=Math.max(g,f);b.fillStyle=l;b.globalAlpha=1;b.fillRect(0,0,r,m);b.fillStyle=k;b.fillText(e(f)+" "+h+" ("+e(c)+"-"+e(g)+")",t,u);b.drawImage(q,d+a,m,n-a,p,d,m,n-a,p);b.fillRect(d+n-a,m,a,p);b.fillStyle=l;b.globalAlpha=.9;b.fillRect(d+n-a,m,a,e((1-f/v)*p))}}};"object"===typeof module&&(module.exports=Stats);

/**
 * @author qiao / https://github.com/qiao
 * @author mrdoob / http://mrdoob.com
 * @author alteredq / http://alteredqualia.com/
 * @author WestLangley / http://github.com/WestLangley
 * @author erich666 / http://erichaines.com
 */

// This set of controls performs orbiting, dollying (zooming), and panning.
// Unlike TrackballControls, it maintains the "up" direction object.up (+Y by default).
//
//    Orbit - left mouse / touch: one finger move
//    Zoom - middle mouse, or mousewheel / touch: two finger spread or squish
//    Pan - right mouse, or arrow keys / touch: three finger swipe

THREE.OrbitControls = function ( object, domElement ) {

	this.object = object;

	this.domElement = ( domElement !== undefined ) ? domElement : document;

	// Set to false to disable this control
	this.enabled = true;

	// "target" sets the location of focus, where the object orbits around
	this.target = new THREE.Vector3();

	// How far you can dolly in and out ( PerspectiveCamera only )
	this.minDistance = 0;
	this.maxDistance = Infinity;

	// How far you can zoom in and out ( OrthographicCamera only )
	this.minZoom = 0;
	this.maxZoom = Infinity;

	// How far you can orbit vertically, upper and lower limits.
	// Range is 0 to Math.PI radians.
	this.minPolarAngle = 0; // radians
	this.maxPolarAngle = Math.PI; // radians

	// How far you can orbit horizontally, upper and lower limits.
	// If set, must be a sub-interval of the interval [ - Math.PI, Math.PI ].
	this.minAzimuthAngle = - Infinity; // radians
	this.maxAzimuthAngle = Infinity; // radians

	// Set to true to enable damping (inertia)
	// If damping is enabled, you must call controls.update() in your animation loop
	this.enableDamping = false;
	this.dampingFactor = 0.25;

	// This option actually enables dollying in and out; left as "zoom" for backwards compatibility.
	// Set to false to disable zooming
	this.enableZoom = true;
	this.zoomSpeed = 1.0;

	// Set to false to disable rotating
	this.enableRotate = true;
	this.rotateSpeed = 1.0;

	// Set to false to disable panning
	this.enablePan = true;
	this.keyPanSpeed = 7.0;	// pixels moved per arrow key push

	// Set to true to automatically rotate around the target
	// If auto-rotate is enabled, you must call controls.update() in your animation loop
	this.autoRotate = false;
	this.autoRotateSpeed = 2.0; // 30 seconds per round when fps is 60

	// Set to false to disable use of the keys
	this.enableKeys = true;

	// The four arrow keys
	this.keys = { LEFT: 37, UP: 38, RIGHT: 39, BOTTOM: 40 };

	// Mouse buttons
	this.mouseButtons = { ORBIT: THREE.MOUSE.LEFT, ZOOM: THREE.MOUSE.MIDDLE, PAN: THREE.MOUSE.RIGHT };

	// for reset
	this.target0 = this.target.clone();
	this.position0 = this.object.position.clone();
	this.zoom0 = this.object.zoom;

	//
	// public methods
	//

	this.getPolarAngle = function () {

		return spherical.phi;

	};

	this.getAzimuthalAngle = function () {

		return spherical.theta;

	};

	this.reset = function () {

		scope.target.copy( scope.target0 );
		scope.object.position.copy( scope.position0 );
		scope.object.zoom = scope.zoom0;

		scope.object.updateProjectionMatrix();
		scope.dispatchEvent( changeEvent );

		scope.update();

		state = STATE.NONE;

	};

	// this method is exposed, but perhaps it would be better if we can make it private...
	this.update = function () {

		var offset = new THREE.Vector3();

		// so camera.up is the orbit axis
		var quat = new THREE.Quaternion().setFromUnitVectors( object.up, new THREE.Vector3( 0, 1, 0 ) );
		var quatInverse = quat.clone().inverse();

		var lastPosition = new THREE.Vector3();
		var lastQuaternion = new THREE.Quaternion();

		return function update() {

			var position = scope.object.position;

			offset.copy( position ).sub( scope.target );

			// rotate offset to "y-axis-is-up" space
			offset.applyQuaternion( quat );

			// angle from z-axis around y-axis
			spherical.setFromVector3( offset );

			if ( scope.autoRotate && state === STATE.NONE ) {

				rotateLeft( getAutoRotationAngle() );

			}

			spherical.theta += sphericalDelta.theta;
			spherical.phi += sphericalDelta.phi;

			// restrict theta to be between desired limits
			spherical.theta = Math.max( scope.minAzimuthAngle, Math.min( scope.maxAzimuthAngle, spherical.theta ) );

			// restrict phi to be between desired limits
			spherical.phi = Math.max( scope.minPolarAngle, Math.min( scope.maxPolarAngle, spherical.phi ) );

			spherical.makeSafe();


			spherical.radius *= scale;

			// restrict radius to be between desired limits
			spherical.radius = Math.max( scope.minDistance, Math.min( scope.maxDistance, spherical.radius ) );

			// move target to panned location
			scope.target.add( panOffset );

			offset.setFromSpherical( spherical );

			// rotate offset back to "camera-up-vector-is-up" space
			offset.applyQuaternion( quatInverse );

			position.copy( scope.target ).add( offset );

			scope.object.lookAt( scope.target );

			if ( scope.enableDamping === true ) {

				sphericalDelta.theta *= ( 1 - scope.dampingFactor );
				sphericalDelta.phi *= ( 1 - scope.dampingFactor );

			} else {

				sphericalDelta.set( 0, 0, 0 );

			}

			scale = 1;
			panOffset.set( 0, 0, 0 );

			// update condition is:
			// min(camera displacement, camera rotation in radians)^2 > EPS
			// using small-angle approximation cos(x/2) = 1 - x^2 / 8

			if ( zoomChanged ||
				lastPosition.distanceToSquared( scope.object.position ) > EPS ||
				8 * ( 1 - lastQuaternion.dot( scope.object.quaternion ) ) > EPS ) {

				scope.dispatchEvent( changeEvent );

				lastPosition.copy( scope.object.position );
				lastQuaternion.copy( scope.object.quaternion );
				zoomChanged = false;

				return true;

			}

			return false;

		};

	}();

	this.dispose = function () {

		scope.domElement.removeEventListener( 'contextmenu', onContextMenu, false );
		scope.domElement.removeEventListener( 'mousedown', onMouseDown, false );
		scope.domElement.removeEventListener( 'wheel', onMouseWheel, false );

		scope.domElement.removeEventListener( 'touchstart', onTouchStart, false );
		scope.domElement.removeEventListener( 'touchend', onTouchEnd, false );
		scope.domElement.removeEventListener( 'touchmove', onTouchMove, false );

		document.removeEventListener( 'mousemove', onMouseMove, false );
		document.removeEventListener( 'mouseup', onMouseUp, false );

		window.removeEventListener( 'keydown', onKeyDown, false );

		//scope.dispatchEvent( { type: 'dispose' } ); // should this be added here?

	};

	//
	// internals
	//

	var scope = this;

	var changeEvent = { type: 'change' };
	var startEvent = { type: 'start' };
	var endEvent = { type: 'end' };

	var STATE = { NONE: - 1, ROTATE: 0, DOLLY: 1, PAN: 2, TOUCH_ROTATE: 3, TOUCH_DOLLY: 4, TOUCH_PAN: 5 };

	var state = STATE.NONE;

	var EPS = 0.000001;

	// current position in spherical coordinates
	var spherical = new THREE.Spherical();
	var sphericalDelta = new THREE.Spherical();

	var scale = 1;
	var panOffset = new THREE.Vector3();
	var zoomChanged = false;

	var rotateStart = new THREE.Vector2();
	var rotateEnd = new THREE.Vector2();
	var rotateDelta = new THREE.Vector2();

	var panStart = new THREE.Vector2();
	var panEnd = new THREE.Vector2();
	var panDelta = new THREE.Vector2();

	var dollyStart = new THREE.Vector2();
	var dollyEnd = new THREE.Vector2();
	var dollyDelta = new THREE.Vector2();

	function getAutoRotationAngle() {

		return 2 * Math.PI / 60 / 60 * scope.autoRotateSpeed;

	}

	function getZoomScale() {

		return Math.pow( 0.95, scope.zoomSpeed );

	}

	function rotateLeft( angle ) {

		sphericalDelta.theta -= angle;

	}

	function rotateUp( angle ) {

		sphericalDelta.phi -= angle;

	}

	var panLeft = function () {

		var v = new THREE.Vector3();

		return function panLeft( distance, objectMatrix ) {

			v.setFromMatrixColumn( objectMatrix, 0 ); // get X column of objectMatrix
			v.multiplyScalar( - distance );

			panOffset.add( v );

		};

	}();

	var panUp = function () {

		var v = new THREE.Vector3();

		return function panUp( distance, objectMatrix ) {

			v.setFromMatrixColumn( objectMatrix, 1 ); // get Y column of objectMatrix
			v.multiplyScalar( distance );

			panOffset.add( v );

		};

	}();

	// deltaX and deltaY are in pixels; right and down are positive
	var pan = function () {

		var offset = new THREE.Vector3();

		return function pan( deltaX, deltaY ) {

			var element = scope.domElement === document ? scope.domElement.body : scope.domElement;

			if ( scope.object instanceof THREE.PerspectiveCamera ) {

				// perspective
				var position = scope.object.position;
				offset.copy( position ).sub( scope.target );
				var targetDistance = offset.length();

				// half of the fov is center to top of screen
				targetDistance *= Math.tan( ( scope.object.fov / 2 ) * Math.PI / 180.0 );

				// we actually don't use screenWidth, since perspective camera is fixed to screen height
				panLeft( 2 * deltaX * targetDistance / element.clientHeight, scope.object.matrix );
				panUp( 2 * deltaY * targetDistance / element.clientHeight, scope.object.matrix );

			} else if ( scope.object instanceof THREE.OrthographicCamera ) {

				// orthographic
				panLeft( deltaX * ( scope.object.right - scope.object.left ) / scope.object.zoom / element.clientWidth, scope.object.matrix );
				panUp( deltaY * ( scope.object.top - scope.object.bottom ) / scope.object.zoom / element.clientHeight, scope.object.matrix );

			} else {

				// camera neither orthographic nor perspective
				console.warn( 'WARNING: OrbitControls.js encountered an unknown camera type - pan disabled.' );
				scope.enablePan = false;

			}

		};

	}();

	function dollyIn( dollyScale ) {

		if ( scope.object instanceof THREE.PerspectiveCamera ) {

			scale /= dollyScale;

		} else if ( scope.object instanceof THREE.OrthographicCamera ) {

			scope.object.zoom = Math.max( scope.minZoom, Math.min( scope.maxZoom, scope.object.zoom * dollyScale ) );
			scope.object.updateProjectionMatrix();
			zoomChanged = true;

		} else {

			console.warn( 'WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.' );
			scope.enableZoom = false;

		}

	}

	function dollyOut( dollyScale ) {

		if ( scope.object instanceof THREE.PerspectiveCamera ) {

			scale *= dollyScale;

		} else if ( scope.object instanceof THREE.OrthographicCamera ) {

			scope.object.zoom = Math.max( scope.minZoom, Math.min( scope.maxZoom, scope.object.zoom / dollyScale ) );
			scope.object.updateProjectionMatrix();
			zoomChanged = true;

		} else {

			console.warn( 'WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.' );
			scope.enableZoom = false;

		}

	}

	//
	// event callbacks - update the object state
	//

	function handleMouseDownRotate( event ) {

		//console.log( 'handleMouseDownRotate' );

		rotateStart.set( event.clientX, event.clientY );

	}

	function handleMouseDownDolly( event ) {

		//console.log( 'handleMouseDownDolly' );

		dollyStart.set( event.clientX, event.clientY );

	}

	function handleMouseDownPan( event ) {

		//console.log( 'handleMouseDownPan' );

		panStart.set( event.clientX, event.clientY );

	}

	function handleMouseMoveRotate( event ) {

		//console.log( 'handleMouseMoveRotate' );

		rotateEnd.set( event.clientX, event.clientY );
		rotateDelta.subVectors( rotateEnd, rotateStart );

		var element = scope.domElement === document ? scope.domElement.body : scope.domElement;

		// rotating across whole screen goes 360 degrees around
		rotateLeft( 2 * Math.PI * rotateDelta.x / element.clientWidth * scope.rotateSpeed );

		// rotating up and down along whole screen attempts to go 360, but limited to 180
		rotateUp( 2 * Math.PI * rotateDelta.y / element.clientHeight * scope.rotateSpeed );

		rotateStart.copy( rotateEnd );

		scope.update();

	}

	function handleMouseMoveDolly( event ) {

		//console.log( 'handleMouseMoveDolly' );

		dollyEnd.set( event.clientX, event.clientY );

		dollyDelta.subVectors( dollyEnd, dollyStart );

		if ( dollyDelta.y > 0 ) {

			dollyIn( getZoomScale() );

		} else if ( dollyDelta.y < 0 ) {

			dollyOut( getZoomScale() );

		}

		dollyStart.copy( dollyEnd );

		scope.update();

	}

	function handleMouseMovePan( event ) {

		//console.log( 'handleMouseMovePan' );

		panEnd.set( event.clientX, event.clientY );

		panDelta.subVectors( panEnd, panStart );

		pan( panDelta.x, panDelta.y );

		panStart.copy( panEnd );

		scope.update();

	}

	function handleMouseUp( event ) {

		// console.log( 'handleMouseUp' );

	}

	function handleMouseWheel( event ) {

		// console.log( 'handleMouseWheel' );

		if ( event.deltaY < 0 ) {

			dollyOut( getZoomScale() );

		} else if ( event.deltaY > 0 ) {

			dollyIn( getZoomScale() );

		}

		scope.update();

	}

	function handleKeyDown( event ) {

		//console.log( 'handleKeyDown' );

		switch ( event.keyCode ) {

			case scope.keys.UP:
				pan( 0, scope.keyPanSpeed );
				scope.update();
				break;

			case scope.keys.BOTTOM:
				pan( 0, - scope.keyPanSpeed );
				scope.update();
				break;

			case scope.keys.LEFT:
				pan( scope.keyPanSpeed, 0 );
				scope.update();
				break;

			case scope.keys.RIGHT:
				pan( - scope.keyPanSpeed, 0 );
				scope.update();
				break;

		}

	}

	function handleTouchStartRotate( event ) {

		//console.log( 'handleTouchStartRotate' );

		rotateStart.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );

	}

	function handleTouchStartDolly( event ) {

		//console.log( 'handleTouchStartDolly' );

		var dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
		var dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;

		var distance = Math.sqrt( dx * dx + dy * dy );

		dollyStart.set( 0, distance );

	}

	function handleTouchStartPan( event ) {

		//console.log( 'handleTouchStartPan' );

		panStart.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );

	}

	function handleTouchMoveRotate( event ) {

		//console.log( 'handleTouchMoveRotate' );

		rotateEnd.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );
		rotateDelta.subVectors( rotateEnd, rotateStart );

		var element = scope.domElement === document ? scope.domElement.body : scope.domElement;

		// rotating across whole screen goes 360 degrees around
		rotateLeft( 2 * Math.PI * rotateDelta.x / element.clientWidth * scope.rotateSpeed );

		// rotating up and down along whole screen attempts to go 360, but limited to 180
		rotateUp( 2 * Math.PI * rotateDelta.y / element.clientHeight * scope.rotateSpeed );

		rotateStart.copy( rotateEnd );

		scope.update();

	}

	function handleTouchMoveDolly( event ) {

		//console.log( 'handleTouchMoveDolly' );

		var dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
		var dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;

		var distance = Math.sqrt( dx * dx + dy * dy );

		dollyEnd.set( 0, distance );

		dollyDelta.subVectors( dollyEnd, dollyStart );

		if ( dollyDelta.y > 0 ) {

			dollyOut( getZoomScale() );

		} else if ( dollyDelta.y < 0 ) {

			dollyIn( getZoomScale() );

		}

		dollyStart.copy( dollyEnd );

		scope.update();

	}

	function handleTouchMovePan( event ) {

		//console.log( 'handleTouchMovePan' );

		panEnd.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );

		panDelta.subVectors( panEnd, panStart );

		pan( panDelta.x, panDelta.y );

		panStart.copy( panEnd );

		scope.update();

	}

	function handleTouchEnd( event ) {

		//console.log( 'handleTouchEnd' );

	}

	//
	// event handlers - FSM: listen for events and reset state
	//

	function onMouseDown( event ) {

		if ( scope.enabled === false ) return;

		event.preventDefault();

		if ( event.button === scope.mouseButtons.ORBIT ) {

			if ( scope.enableRotate === false ) return;

			handleMouseDownRotate( event );

			state = STATE.ROTATE;

		} else if ( event.button === scope.mouseButtons.ZOOM ) {

			if ( scope.enableZoom === false ) return;

			handleMouseDownDolly( event );

			state = STATE.DOLLY;

		} else if ( event.button === scope.mouseButtons.PAN ) {

			if ( scope.enablePan === false ) return;

			handleMouseDownPan( event );

			state = STATE.PAN;

		}

		if ( state !== STATE.NONE ) {

			document.addEventListener( 'mousemove', onMouseMove, false );
			document.addEventListener( 'mouseup', onMouseUp, false );

			scope.dispatchEvent( startEvent );

		}

	}

	function onMouseMove( event ) {

		if ( scope.enabled === false ) return;

		event.preventDefault();

		if ( state === STATE.ROTATE ) {

			if ( scope.enableRotate === false ) return;

			handleMouseMoveRotate( event );

		} else if ( state === STATE.DOLLY ) {

			if ( scope.enableZoom === false ) return;

			handleMouseMoveDolly( event );

		} else if ( state === STATE.PAN ) {

			if ( scope.enablePan === false ) return;

			handleMouseMovePan( event );

		}

	}

	function onMouseUp( event ) {

		if ( scope.enabled === false ) return;

		handleMouseUp( event );

		document.removeEventListener( 'mousemove', onMouseMove, false );
		document.removeEventListener( 'mouseup', onMouseUp, false );

		scope.dispatchEvent( endEvent );

		state = STATE.NONE;

	}

	function onMouseWheel( event ) {

		if ( scope.enabled === false || scope.enableZoom === false || ( state !== STATE.NONE && state !== STATE.ROTATE ) ) return;

		event.preventDefault();
		event.stopPropagation();

		handleMouseWheel( event );

		scope.dispatchEvent( startEvent ); // not sure why these are here...
		scope.dispatchEvent( endEvent );

	}

	function onKeyDown( event ) {

		if ( scope.enabled === false || scope.enableKeys === false || scope.enablePan === false ) return;

		handleKeyDown( event );

	}

	function onTouchStart( event ) {

		if ( scope.enabled === false ) return;

		switch ( event.touches.length ) {

			case 1:	// one-fingered touch: rotate

				if ( scope.enableRotate === false ) return;

				handleTouchStartRotate( event );

				state = STATE.TOUCH_ROTATE;

				break;

			case 2:	// two-fingered touch: dolly

				if ( scope.enableZoom === false ) return;

				handleTouchStartDolly( event );

				state = STATE.TOUCH_DOLLY;

				break;

			case 3: // three-fingered touch: pan

				if ( scope.enablePan === false ) return;

				handleTouchStartPan( event );

				state = STATE.TOUCH_PAN;

				break;

			default:

				state = STATE.NONE;

		}

		if ( state !== STATE.NONE ) {

			scope.dispatchEvent( startEvent );

		}

	}

	function onTouchMove( event ) {

		if ( scope.enabled === false ) return;

		event.preventDefault();
		event.stopPropagation();

		switch ( event.touches.length ) {

			case 1: // one-fingered touch: rotate

				if ( scope.enableRotate === false ) return;
				if ( state !== STATE.TOUCH_ROTATE ) return; // is this needed?...

				handleTouchMoveRotate( event );

				break;

			case 2: // two-fingered touch: dolly

				if ( scope.enableZoom === false ) return;
				if ( state !== STATE.TOUCH_DOLLY ) return; // is this needed?...

				handleTouchMoveDolly( event );

				break;

			case 3: // three-fingered touch: pan

				if ( scope.enablePan === false ) return;
				if ( state !== STATE.TOUCH_PAN ) return; // is this needed?...

				handleTouchMovePan( event );

				break;

			default:

				state = STATE.NONE;

		}

	}

	function onTouchEnd( event ) {

		if ( scope.enabled === false ) return;

		handleTouchEnd( event );

		scope.dispatchEvent( endEvent );

		state = STATE.NONE;

	}

	function onContextMenu( event ) {

		event.preventDefault();

	}

	//

	scope.domElement.addEventListener( 'contextmenu', onContextMenu, false );

	scope.domElement.addEventListener( 'mousedown', onMouseDown, false );
	scope.domElement.addEventListener( 'wheel', onMouseWheel, false );

	scope.domElement.addEventListener( 'touchstart', onTouchStart, false );
	scope.domElement.addEventListener( 'touchend', onTouchEnd, false );
	scope.domElement.addEventListener( 'touchmove', onTouchMove, false );

	window.addEventListener( 'keydown', onKeyDown, false );

	// force an update at start

	this.update();

};

THREE.OrbitControls.prototype = Object.create( THREE.EventDispatcher.prototype );
THREE.OrbitControls.prototype.constructor = THREE.OrbitControls;

Object.defineProperties( THREE.OrbitControls.prototype, {

	center: {

		get: function () {

			console.warn( 'THREE.OrbitControls: .center has been renamed to .target' );
			return this.target;

		}

	},

	// backward compatibility

	noZoom: {

		get: function () {

			console.warn( 'THREE.OrbitControls: .noZoom has been deprecated. Use .enableZoom instead.' );
			return ! this.enableZoom;

		},

		set: function ( value ) {

			console.warn( 'THREE.OrbitControls: .noZoom has been deprecated. Use .enableZoom instead.' );
			this.enableZoom = ! value;

		}

	},

	noRotate: {

		get: function () {

			console.warn( 'THREE.OrbitControls: .noRotate has been deprecated. Use .enableRotate instead.' );
			return ! this.enableRotate;

		},

		set: function ( value ) {

			console.warn( 'THREE.OrbitControls: .noRotate has been deprecated. Use .enableRotate instead.' );
			this.enableRotate = ! value;

		}

	},

	noPan: {

		get: function () {

			console.warn( 'THREE.OrbitControls: .noPan has been deprecated. Use .enablePan instead.' );
			return ! this.enablePan;

		},

		set: function ( value ) {

			console.warn( 'THREE.OrbitControls: .noPan has been deprecated. Use .enablePan instead.' );
			this.enablePan = ! value;

		}

	},

	noKeys: {

		get: function () {

			console.warn( 'THREE.OrbitControls: .noKeys has been deprecated. Use .enableKeys instead.' );
			return ! this.enableKeys;

		},

		set: function ( value ) {

			console.warn( 'THREE.OrbitControls: .noKeys has been deprecated. Use .enableKeys instead.' );
			this.enableKeys = ! value;

		}

	},

	staticMoving: {

		get: function () {

			console.warn( 'THREE.OrbitControls: .staticMoving has been deprecated. Use .enableDamping instead.' );
			return ! this.enableDamping;

		},

		set: function ( value ) {

			console.warn( 'THREE.OrbitControls: .staticMoving has been deprecated. Use .enableDamping instead.' );
			this.enableDamping = ! value;

		}

	},

	dynamicDampingFactor: {

		get: function () {

			console.warn( 'THREE.OrbitControls: .dynamicDampingFactor has been renamed. Use .dampingFactor instead.' );
			return this.dampingFactor;

		},

		set: function ( value ) {

			console.warn( 'THREE.OrbitControls: .dynamicDampingFactor has been renamed. Use .dampingFactor instead.' );
			this.dampingFactor = value;

		}

	}

} );

/**
 * @author mrdoob / http://mrdoob.com/
 * @author jetienne / http://jetienne.com/
 */
/** @namespace */
var THREEx	= THREEx || {}

/**
 * provide info on THREE.WebGLRenderer
 *
*/
THREEx.RendererStats	= function (){

	var msMin	= 100;
	var msMax	= 0;

	var container	= document.createElement( 'div' );
	container.style.cssText = 'width:80px;opacity:0.9;cursor:pointer';

	var msDiv	= document.createElement( 'div' );
	msDiv.style.cssText = 'padding:0 0 3px 3px;text-align:left;background-color:#200;';
	container.appendChild( msDiv );

	var msText	= document.createElement( 'div' );
	msText.style.cssText = 'color:#f00;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px';
	msText.innerHTML= 'WebGLRenderer';
	msDiv.appendChild( msText );

	var msTexts	= [];
	var nLines	= 9;
	for(var i = 0; i < nLines; i++){
		msTexts[i]	= document.createElement( 'div' );
		msTexts[i].style.cssText = 'color:#f00;background-color:#311;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px';
		msDiv.appendChild( msTexts[i] );
		msTexts[i].innerHTML= '-';
	}


	var lastTime	= Date.now();
	return {
		domElement: container,

		update: function(webGLRenderer){
			// sanity check
			console.assert(webGLRenderer instanceof THREE.WebGLRenderer)

			// refresh only 30time per second
			if( Date.now() - lastTime < 1000/30 )	return;
			lastTime	= Date.now()

			var i	= 0;
			msTexts[i++].textContent = "== Memory =====";
			msTexts[i++].textContent = "Programs: "	+ webGLRenderer.info.programs.length;
			msTexts[i++].textContent = "Geometries: "+webGLRenderer.info.memory.geometries;
			msTexts[i++].textContent = "Textures: "	+ webGLRenderer.info.memory.textures;

			msTexts[i++].textContent = "== Render =====";
			msTexts[i++].textContent = "Calls: "	+ webGLRenderer.info.render.calls;
			msTexts[i++].textContent = "Vertices: "	+ webGLRenderer.info.render.vertices;
			msTexts[i++].textContent = "Faces: "	+ webGLRenderer.info.render.faces;
			msTexts[i++].textContent = "Points: "	+ webGLRenderer.info.render.points;
		}
	}
};

/*! Full Tilt v0.5.3 / http://github.com/richtr/Full-Tilt */
!function(a){function b(a){return a=+a,0===a||isNaN(a)?a:a>0?1:-1}function c(a){var b=new Promise(function(b,c){var d=function(e){setTimeout(function(){a&&a.data?b():e>=20?c():d(++e)},50)};d(0)});return b}function d(){o=n?(a.screen.orientation.angle||0)*j:(a.orientation||0)*j}function e(a){l.orientation.data=a;for(var b in l.orientation.callbacks)l.orientation.callbacks[b].call(this)}function f(a){l.motion.data=a;for(var b in l.motion.callbacks)l.motion.callbacks[b].call(this)}if(void 0===a.FULLTILT||null===a.FULLTILT){var g=Math.PI,h=g/2,i=2*g,j=g/180,k=180/g,l={orientation:{active:!1,callbacks:[],data:void 0},motion:{active:!1,callbacks:[],data:void 0}},m=!1,n=a.screen&&a.screen.orientation&&void 0!==a.screen.orientation.angle&&null!==a.screen.orientation.angle?!0:!1,o=(n?a.screen.orientation.angle:a.orientation||0)*j,p=h,q=g,r=i/3,s=-h,t={};t.version="0.5.3",t.getDeviceOrientation=function(a){var b=new Promise(function(b,d){var e=new t.DeviceOrientation(a);e.start();var f=new c(l.orientation);f.then(function(){e._alphaAvailable=l.orientation.data.alpha&&null!==l.orientation.data.alpha,e._betaAvailable=l.orientation.data.beta&&null!==l.orientation.data.beta,e._gammaAvailable=l.orientation.data.gamma&&null!==l.orientation.data.gamma,b(e)})["catch"](function(){e.stop(),d("DeviceOrientation is not supported")})});return b},t.getDeviceMotion=function(a){var b=new Promise(function(b,d){var e=new t.DeviceMotion(a);e.start();var f=new c(l.motion);f.then(function(){e._accelerationXAvailable=l.motion.data.acceleration&&l.motion.data.acceleration.x,e._accelerationYAvailable=l.motion.data.acceleration&&l.motion.data.acceleration.y,e._accelerationZAvailable=l.motion.data.acceleration&&l.motion.data.acceleration.z,e._accelerationIncludingGravityXAvailable=l.motion.data.accelerationIncludingGravity&&l.motion.data.accelerationIncludingGravity.x,e._accelerationIncludingGravityYAvailable=l.motion.data.accelerationIncludingGravity&&l.motion.data.accelerationIncludingGravity.y,e._accelerationIncludingGravityZAvailable=l.motion.data.accelerationIncludingGravity&&l.motion.data.accelerationIncludingGravity.z,e._rotationRateAlphaAvailable=l.motion.data.rotationRate&&l.motion.data.rotationRate.alpha,e._rotationRateBetaAvailable=l.motion.data.rotationRate&&l.motion.data.rotationRate.beta,e._rotationRateGammaAvailable=l.motion.data.rotationRate&&l.motion.data.rotationRate.gamma,b(e)})["catch"](function(){e.stop(),d("DeviceMotion is not supported")})});return b},t.Quaternion=function(a,c,d,e){var f;this.set=function(a,b,c,d){this.x=a||0,this.y=b||0,this.z=c||0,this.w=d||1},this.copy=function(a){this.x=a.x,this.y=a.y,this.z=a.z,this.w=a.w},this.setFromEuler=function(){var a,b,c,d,e,f,g,h,i,k,l,m;return function(n){return n=n||{},c=(n.alpha||0)*j,a=(n.beta||0)*j,b=(n.gamma||0)*j,f=c/2,d=a/2,e=b/2,g=Math.cos(d),h=Math.cos(e),i=Math.cos(f),k=Math.sin(d),l=Math.sin(e),m=Math.sin(f),this.set(k*h*i-g*l*m,g*l*i+k*h*m,g*h*m+k*l*i,g*h*i-k*l*m),this.normalize(),this}}(),this.setFromRotationMatrix=function(){var a;return function(c){return a=c.elements,this.set(.5*Math.sqrt(1+a[0]-a[4]-a[8])*b(a[7]-a[5]),.5*Math.sqrt(1-a[0]+a[4]-a[8])*b(a[2]-a[6]),.5*Math.sqrt(1-a[0]-a[4]+a[8])*b(a[3]-a[1]),.5*Math.sqrt(1+a[0]+a[4]+a[8])),this}}(),this.multiply=function(a){return f=t.Quaternion.prototype.multiplyQuaternions(this,a),this.copy(f),this},this.rotateX=function(a){return f=t.Quaternion.prototype.rotateByAxisAngle(this,[1,0,0],a),this.copy(f),this},this.rotateY=function(a){return f=t.Quaternion.prototype.rotateByAxisAngle(this,[0,1,0],a),this.copy(f),this},this.rotateZ=function(a){return f=t.Quaternion.prototype.rotateByAxisAngle(this,[0,0,1],a),this.copy(f),this},this.normalize=function(){return t.Quaternion.prototype.normalize(this)},this.set(a,c,d,e)},t.Quaternion.prototype={constructor:t.Quaternion,multiplyQuaternions:function(){var a=new t.Quaternion;return function(b,c){var d=b.x,e=b.y,f=b.z,g=b.w,h=c.x,i=c.y,j=c.z,k=c.w;return a.set(d*k+g*h+e*j-f*i,e*k+g*i+f*h-d*j,f*k+g*j+d*i-e*h,g*k-d*h-e*i-f*j),a}}(),normalize:function(a){var b=Math.sqrt(a.x*a.x+a.y*a.y+a.z*a.z+a.w*a.w);return 0===b?(a.x=0,a.y=0,a.z=0,a.w=1):(b=1/b,a.x*=b,a.y*=b,a.z*=b,a.w*=b),a},rotateByAxisAngle:function(){var a,b,c=new t.Quaternion,d=new t.Quaternion;return function(e,f,g){return a=(g||0)/2,b=Math.sin(a),d.set((f[0]||0)*b,(f[1]||0)*b,(f[2]||0)*b,Math.cos(a)),c=t.Quaternion.prototype.multiplyQuaternions(e,d),t.Quaternion.prototype.normalize(c)}}()},t.RotationMatrix=function(a,b,c,d,e,f,g,h,i){var k;this.elements=new Float32Array(9),this.identity=function(){return this.set(1,0,0,0,1,0,0,0,1),this},this.set=function(a,b,c,d,e,f,g,h,i){this.elements[0]=a||1,this.elements[1]=b||0,this.elements[2]=c||0,this.elements[3]=d||0,this.elements[4]=e||1,this.elements[5]=f||0,this.elements[6]=g||0,this.elements[7]=h||0,this.elements[8]=i||1},this.copy=function(a){this.elements[0]=a.elements[0],this.elements[1]=a.elements[1],this.elements[2]=a.elements[2],this.elements[3]=a.elements[3],this.elements[4]=a.elements[4],this.elements[5]=a.elements[5],this.elements[6]=a.elements[6],this.elements[7]=a.elements[7],this.elements[8]=a.elements[8]},this.setFromEuler=function(){var a,b,c,d,e,f,g,h,i;return function(k){return k=k||{},c=(k.alpha||0)*j,a=(k.beta||0)*j,b=(k.gamma||0)*j,d=Math.cos(a),e=Math.cos(b),f=Math.cos(c),g=Math.sin(a),h=Math.sin(b),i=Math.sin(c),this.set(f*e-i*g*h,-d*i,e*i*g+f*h,e*i+f*g*h,f*d,i*h-f*e*g,-d*h,g,d*e),this.normalize(),this}}(),this.setFromQuaternion=function(){var a,b,c,d;return function(e){return a=e.w*e.w,b=e.x*e.x,c=e.y*e.y,d=e.z*e.z,this.set(a+b-c-d,2*(e.x*e.y-e.w*e.z),2*(e.x*e.z+e.w*e.y),2*(e.x*e.y+e.w*e.z),a-b+c-d,2*(e.y*e.z-e.w*e.x),2*(e.x*e.z-e.w*e.y),2*(e.y*e.z+e.w*e.x),a-b-c+d),this}}(),this.multiply=function(a){return k=t.RotationMatrix.prototype.multiplyMatrices(this,a),this.copy(k),this},this.rotateX=function(a){return k=t.RotationMatrix.prototype.rotateByAxisAngle(this,[1,0,0],a),this.copy(k),this},this.rotateY=function(a){return k=t.RotationMatrix.prototype.rotateByAxisAngle(this,[0,1,0],a),this.copy(k),this},this.rotateZ=function(a){return k=t.RotationMatrix.prototype.rotateByAxisAngle(this,[0,0,1],a),this.copy(k),this},this.normalize=function(){return t.RotationMatrix.prototype.normalize(this)},this.set(a,b,c,d,e,f,g,h,i)},t.RotationMatrix.prototype={constructor:t.RotationMatrix,multiplyMatrices:function(){var a,b,c=new t.RotationMatrix;return function(d,e){return a=d.elements,b=e.elements,c.set(a[0]*b[0]+a[1]*b[3]+a[2]*b[6],a[0]*b[1]+a[1]*b[4]+a[2]*b[7],a[0]*b[2]+a[1]*b[5]+a[2]*b[8],a[3]*b[0]+a[4]*b[3]+a[5]*b[6],a[3]*b[1]+a[4]*b[4]+a[5]*b[7],a[3]*b[2]+a[4]*b[5]+a[5]*b[8],a[6]*b[0]+a[7]*b[3]+a[8]*b[6],a[6]*b[1]+a[7]*b[4]+a[8]*b[7],a[6]*b[2]+a[7]*b[5]+a[8]*b[8]),c}}(),normalize:function(a){var b=a.elements,c=b[0]*b[4]*b[8]-b[0]*b[5]*b[7]-b[1]*b[3]*b[8]+b[1]*b[5]*b[6]+b[2]*b[3]*b[7]-b[2]*b[4]*b[6];return b[0]/=c,b[1]/=c,b[2]/=c,b[3]/=c,b[4]/=c,b[5]/=c,b[6]/=c,b[7]/=c,b[8]/=c,a.elements=b,a},rotateByAxisAngle:function(){var a,b,c=new t.RotationMatrix,d=new t.RotationMatrix,e=!1;return function(f,g,h){return d.identity(),e=!1,a=Math.sin(h),b=Math.cos(h),1===g[0]&&0===g[1]&&0===g[2]?(e=!0,d.elements[4]=b,d.elements[5]=-a,d.elements[7]=a,d.elements[8]=b):1===g[1]&&0===g[0]&&0===g[2]?(e=!0,d.elements[0]=b,d.elements[2]=a,d.elements[6]=-a,d.elements[8]=b):1===g[2]&&0===g[0]&&0===g[1]&&(e=!0,d.elements[0]=b,d.elements[1]=-a,d.elements[3]=a,d.elements[4]=b),e?(c=t.RotationMatrix.prototype.multiplyMatrices(f,d),c=t.RotationMatrix.prototype.normalize(c)):c=f,c}}()},t.Euler=function(a,b,c){this.set=function(a,b,c){this.alpha=a||0,this.beta=b||0,this.gamma=c||0},this.copy=function(a){this.alpha=a.alpha,this.beta=a.beta,this.gamma=a.gamma},this.setFromRotationMatrix=function(){var a,b,c,d;return function(e){a=e.elements,a[8]>0?(b=Math.atan2(-a[1],a[4]),c=Math.asin(a[7]),d=Math.atan2(-a[6],a[8])):a[8]<0?(b=Math.atan2(a[1],-a[4]),c=-Math.asin(a[7]),c+=c>=0?-g:g,d=Math.atan2(a[6],-a[8])):a[6]>0?(b=Math.atan2(-a[1],a[4]),c=Math.asin(a[7]),d=-h):a[6]<0?(b=Math.atan2(a[1],-a[4]),c=-Math.asin(a[7]),c+=c>=0?-g:g,d=-h):(b=Math.atan2(a[3],a[0]),c=a[7]>0?h:-h,d=0),0>b&&(b+=i),b*=k,c*=k,d*=k,this.set(b,c,d)}}(),this.setFromQuaternion=function(){var a,b,c;return function(d){var e=d.w*d.w,f=d.x*d.x,j=d.y*d.y,l=d.z*d.z,m=e+f+j+l,n=d.w*d.x+d.y*d.z,o=1e-6;if(n>(.5-o)*m)a=2*Math.atan2(d.y,d.w),b=h,c=0;else if((-.5+o)*m>n)a=-2*Math.atan2(d.y,d.w),b=-h,c=0;else{var p=e-f+j-l,q=2*(d.w*d.z-d.x*d.y),r=e-f-j+l,s=2*(d.w*d.y-d.x*d.z);r>0?(a=Math.atan2(q,p),b=Math.asin(2*n/m),c=Math.atan2(s,r)):(a=Math.atan2(-q,-p),b=-Math.asin(2*n/m),b+=0>b?g:-g,c=Math.atan2(-s,-r))}0>a&&(a+=i),a*=k,b*=k,c*=k,this.set(a,b,c)}}(),this.rotateX=function(a){return t.Euler.prototype.rotateByAxisAngle(this,[1,0,0],a),this},this.rotateY=function(a){return t.Euler.prototype.rotateByAxisAngle(this,[0,1,0],a),this},this.rotateZ=function(a){return t.Euler.prototype.rotateByAxisAngle(this,[0,0,1],a),this},this.set(a,b,c)},t.Euler.prototype={constructor:t.Euler,rotateByAxisAngle:function(){var a=new t.RotationMatrix;return function(b,c,d){return a.setFromEuler(b),a=t.RotationMatrix.prototype.rotateByAxisAngle(a,c,d),b.setFromRotationMatrix(a),b}}()},t.DeviceOrientation=function(b){this.options=b||{};var c=0,d=200,e=0,f=10;if(this.alphaOffsetScreen=0,this.alphaOffsetDevice=void 0,"game"===this.options.type){var g=function(b){return null!==b.alpha&&(this.alphaOffsetDevice=new t.Euler(b.alpha,0,0),this.alphaOffsetDevice.rotateZ(-o),++e>=f)?void a.removeEventListener("deviceorientation",g,!1):void(++c>=d&&a.removeEventListener("deviceorientation",g,!1))}.bind(this);a.addEventListener("deviceorientation",g,!1)}else if("world"===this.options.type){var h=function(b){return b.absolute!==!0&&void 0!==b.webkitCompassAccuracy&&null!==b.webkitCompassAccuracy&&+b.webkitCompassAccuracy>=0&&+b.webkitCompassAccuracy<50&&(this.alphaOffsetDevice=new t.Euler(b.webkitCompassHeading,0,0),this.alphaOffsetDevice.rotateZ(o),this.alphaOffsetScreen=o,++e>=f)?void a.removeEventListener("deviceorientation",h,!1):void(++c>=d&&a.removeEventListener("deviceorientation",h,!1))}.bind(this);a.addEventListener("deviceorientation",h,!1)}},t.DeviceOrientation.prototype={constructor:t.DeviceOrientation,start:function(b){b&&"[object Function]"==Object.prototype.toString.call(b)&&l.orientation.callbacks.push(b),m||(n?a.screen.orientation.addEventListener("change",d,!1):a.addEventListener("orientationchange",d,!1)),l.orientation.active||(a.addEventListener("deviceorientation",e,!1),l.orientation.active=!0)},stop:function(){l.orientation.active&&(a.removeEventListener("deviceorientation",e,!1),l.orientation.active=!1)},listen:function(a){this.start(a)},getFixedFrameQuaternion:function(){var a=new t.Euler,b=new t.RotationMatrix,c=new t.Quaternion;return function(){var d=l.orientation.data||{alpha:0,beta:0,gamma:0},e=d.alpha;return this.alphaOffsetDevice&&(b.setFromEuler(this.alphaOffsetDevice),b.rotateZ(-this.alphaOffsetScreen),a.setFromRotationMatrix(b),a.alpha<0&&(a.alpha+=360),a.alpha%=360,e-=a.alpha),a.set(e,d.beta,d.gamma),c.setFromEuler(a),c}}(),getScreenAdjustedQuaternion:function(){var a;return function(){return a=this.getFixedFrameQuaternion(),a.rotateZ(-o),a}}(),getFixedFrameMatrix:function(){var a=new t.Euler,b=new t.RotationMatrix;return function(){var c=l.orientation.data||{alpha:0,beta:0,gamma:0},d=c.alpha;return this.alphaOffsetDevice&&(b.setFromEuler(this.alphaOffsetDevice),b.rotateZ(-this.alphaOffsetScreen),a.setFromRotationMatrix(b),a.alpha<0&&(a.alpha+=360),a.alpha%=360,d-=a.alpha),a.set(d,c.beta,c.gamma),b.setFromEuler(a),b}}(),getScreenAdjustedMatrix:function(){var a;return function(){return a=this.getFixedFrameMatrix(),a.rotateZ(-o),a}}(),getFixedFrameEuler:function(){var a,b=new t.Euler;return function(){return a=this.getFixedFrameMatrix(),b.setFromRotationMatrix(a),b}}(),getScreenAdjustedEuler:function(){var a,b=new t.Euler;return function(){return a=this.getScreenAdjustedMatrix(),b.setFromRotationMatrix(a),b}}(),isAbsolute:function(){return l.orientation.data&&l.orientation.data.absolute===!0?!0:!1},getLastRawEventData:function(){return l.orientation.data||{}},_alphaAvailable:!1,_betaAvailable:!1,_gammaAvailable:!1,isAvailable:function(a){switch(a){case this.ALPHA:return this._alphaAvailable;case this.BETA:return this._betaAvailable;case this.GAMMA:return this._gammaAvailable}},ALPHA:"alpha",BETA:"beta",GAMMA:"gamma"},t.DeviceMotion=function(a){this.options=a||{}},t.DeviceMotion.prototype={constructor:t.DeviceMotion,start:function(b){b&&"[object Function]"==Object.prototype.toString.call(b)&&l.motion.callbacks.push(b),m||(n?a.screen.orientation.addEventListener("change",d,!1):a.addEventListener("orientationchange",d,!1)),l.motion.active||(a.addEventListener("devicemotion",f,!1),l.motion.active=!0)},stop:function(){l.motion.active&&(a.removeEventListener("devicemotion",f,!1),l.motion.active=!1)},listen:function(a){this.start(a)},getScreenAdjustedAcceleration:function(){var a=l.motion.data&&l.motion.data.acceleration?l.motion.data.acceleration:{x:0,y:0,z:0},b={};switch(o){case p:b.x=-a.y,b.y=a.x;break;case q:b.x=-a.x,b.y=-a.y;break;case r:case s:b.x=a.y,b.y=-a.x;break;default:b.x=a.x,b.y=a.y}return b.z=a.z,b},getScreenAdjustedAccelerationIncludingGravity:function(){var a=l.motion.data&&l.motion.data.accelerationIncludingGravity?l.motion.data.accelerationIncludingGravity:{x:0,y:0,z:0},b={};switch(o){case p:b.x=-a.y,b.y=a.x;break;case q:b.x=-a.x,b.y=-a.y;break;case r:case s:b.x=a.y,b.y=-a.x;break;default:b.x=a.x,b.y=a.y}return b.z=a.z,b},getScreenAdjustedRotationRate:function(){var a=l.motion.data&&l.motion.data.rotationRate?l.motion.data.rotationRate:{alpha:0,beta:0,gamma:0},b={};switch(o){case p:b.beta=-a.gamma,b.gamma=a.beta;break;case q:b.beta=-a.beta,b.gamma=-a.gamma;break;case r:case s:b.beta=a.gamma,b.gamma=-a.beta;break;default:b.beta=a.beta,b.gamma=a.gamma}return b.alpha=a.alpha,b},getLastRawEventData:function(){return l.motion.data||{}},_accelerationXAvailable:!1,_accelerationYAvailable:!1,_accelerationZAvailable:!1,_accelerationIncludingGravityXAvailable:!1,_accelerationIncludingGravityYAvailable:!1,_accelerationIncludingGravityZAvailable:!1,_rotationRateAlphaAvailable:!1,_rotationRateBetaAvailable:!1,_rotationRateGammaAvailable:!1,isAvailable:function(a){switch(a){case this.ACCELERATION_X:return this._accelerationXAvailable;case this.ACCELERATION_Y:return this._accelerationYAvailable;case this.ACCELERATION_Z:return this._accelerationZAvailable;case this.ACCELERATION_INCLUDING_GRAVITY_X:return this._accelerationIncludingGravityXAvailable;case this.ACCELERATION_INCLUDING_GRAVITY_Y:return this._accelerationIncludingGravityYAvailable;case this.ACCELERATION_INCLUDING_GRAVITY_Z:return this._accelerationIncludingGravityZAvailable;case this.ROTATION_RATE_ALPHA:return this._rotationRateAlphaAvailable;case this.ROTATION_RATE_BETA:return this._rotationRateBetaAvailable;case this.ROTATION_RATE_GAMMA:return this._rotationRateGammaAvailable}},ACCELERATION_X:"accelerationX",ACCELERATION_Y:"accelerationY",ACCELERATION_Z:"accelerationZ",ACCELERATION_INCLUDING_GRAVITY_X:"accelerationIncludingGravityX",ACCELERATION_INCLUDING_GRAVITY_Y:"accelerationIncludingGravityY",ACCELERATION_INCLUDING_GRAVITY_Z:"accelerationIncludingGravityZ",ROTATION_RATE_ALPHA:"rotationRateAlpha",ROTATION_RATE_BETA:"rotationRateBeta",ROTATION_RATE_GAMMA:"rotationRateGamma"},a.FULLTILT=t}}(window);

/* gyronorm.js v2.0.5 - https://github.com/dorukeker/gyronorm.git*/
!function(a,b){"function"==typeof define&&define.amd?define(function(){return a.GyroNorm=b()}):"object"==typeof module&&module.exports?module.exports=a.GyroNorm=b():a.GyroNorm=b()}(this,function(){function a(a){return Math.round(a*Math.pow(10,t))/Math.pow(10,t)}function b(){var b={};b=v?o.getScreenAdjustedEuler():o.getFixedFrameEuler();var c=p.getScreenAdjustedAcceleration(),e=p.getScreenAdjustedAccelerationIncludingGravity(),f=p.getScreenAdjustedRotationRate(),g=0;s===d?(g=b.alpha-k,g=0>g?360-Math.abs(g):g):g=b.alpha;var h={"do":{alpha:a(g),beta:a(b.beta),gamma:a(b.gamma),absolute:o.isAbsolute()},dm:{x:a(c.x),y:a(c.y),z:a(c.z),gx:a(e.x),gy:a(e.y),gz:a(e.z),alpha:a(f.alpha),beta:a(f.beta),gamma:a(f.gamma)}};return r&&(h.dm.gx*=l,h.dm.gy*=l,h.dm.gz*=l),h}function c(a){u&&("string"==typeof a&&(a={message:a,code:0}),u(a))}var d="game",e="world",f="deviceorientation",g="acceleration",h="accelerationinludinggravity",i="rotationrate",j=null,k=0,l=0,m=!1,n=!1,o=null,p=null,q=50,r=!0,s=d,t=2,u=null,v=!1,w=function(a){};return w.GAME=d,w.WORLD=e,w.DEVICE_ORIENTATION=f,w.ACCELERATION=g,w.ACCELERATION_INCLUDING_GRAVITY=h,w.ROTATION_RATE=i,w.prototype.init=function(a){a&&a.frequency&&(q=a.frequency),a&&a.gravityNormalized&&(r=a.gravityNormalized),a&&a.orientationBase&&(s=a.orientationBase),a&&"number"==typeof a.decimalCount&&a.decimalCount>=0&&(t=parseInt(a.decimalCount)),a&&a.logger&&(u=a.logger),a&&a.screenAdjusted&&(v=a.screenAdjusted);var b=new FULLTILT.getDeviceOrientation({type:s}).then(function(a){o=a}),c=(new FULLTILT.getDeviceMotion).then(function(a){p=a,l=p.getScreenAdjustedAccelerationIncludingGravity().z>0?-1:1});return Promise.all([b,c]).then(function(){n=!0})},w.prototype.end=function(){try{n=!1,this.stop(),p.stop(),o.stop()}catch(a){c(a)}},w.prototype.start=function(a){return n?(j=setInterval(function(){a(b())},q),void(m=!0)):void c({message:'GyroNorm is not initialized yet. First call the "init()" function.',code:1})},w.prototype.stop=function(){j&&(clearInterval(j),m=!1)},w.prototype.normalizeGravity=function(a){r=a?!0:!1},w.prototype.setHeadDirection=function(){return v||s===e?!1:(k=o.getFixedFrameEuler().alpha,!0)},w.prototype.startLogging=function(a){a&&(u=a)},w.prototype.stopLogging=function(){u=null},w.prototype.isAvailable=function(a){var b=o.getScreenAdjustedEuler(),c=p.getScreenAdjustedAcceleration(),d=p.getScreenAdjustedAccelerationIncludingGravity(),e=p.getScreenAdjustedRotationRate();switch(a){case f:return b.alpha&&null!==b.alpha&&b.beta&&null!==b.beta&&b.gamma&&null!==b.gamma;case g:return c&&c.x&&c.y&&c.z;case h:return d&&d.x&&d.y&&d.z;case i:return e&&e.alpha&&e.beta&&e.gamma;default:return{deviceOrientationAvailable:b.alpha&&null!==b.alpha&&b.beta&&null!==b.beta&&b.gamma&&null!==b.gamma,accelerationAvailable:c&&c.x&&c.y&&c.z,accelerationIncludingGravityAvailable:d&&d.x&&d.y&&d.z,rotationRateAvailable:e&&e.alpha&&e.beta&&e.gamma}}},w.prototype.isRunning=function(){return m},w});
/*

 shader-particle-engine 1.0.5

 (c) 2015 Luke Moody (http://www.github.com/squarefeet)
 Originally based on Lee Stemkoski's original work (https://github.com/stemkoski/stemkoski.github.com/blob/master/Three.js/js/ParticleEngine.js).
 shader-particle-engine may be freely distributed under the MIT license (See LICENSE at root of this repository.)
 License
 Copyright (C) 2015 Luke Moody

 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 SheepFX
 SPE lib wrapper by Emil Larsson (emil@flying-sheep.com)
 Dependencies:
 three.js (v 81)
 SPE.js (v 1.0.5)
*/
var SPE={distributions:{BOX:1,SPHERE:2,DISC:3},valueOverLifetimeLength:4};"function"===typeof define&&define.amd?define("spe",SPE):"undefined"!==typeof exports&&"undefined"!==typeof module&&(module.exports=SPE);SPE.TypedArrayHelper=function(a,b,c,d){this.componentSize=c||1;this.size=b||1;this.TypedArrayConstructor=a||Float32Array;this.array=new a(b*this.componentSize);this.indexOffset=d||0};SPE.TypedArrayHelper.constructor=SPE.TypedArrayHelper;
SPE.TypedArrayHelper.prototype.setSize=function(a,b){var c=this.array.length;b||(a*=this.componentSize);if(a<c)return this.shrink(a);if(a>c)return this.grow(a);console.info("TypedArray is already of size:",a+".","Will not resize.")};SPE.TypedArrayHelper.prototype.shrink=function(a){this.array=this.array.subarray(0,a);this.size=a;return this};SPE.TypedArrayHelper.prototype.grow=function(a){var b=this.array,c=new this.TypedArrayConstructor(a);c.set(b);this.array=c;this.size=a;return this};
SPE.TypedArrayHelper.prototype.splice=function(a,b){a*=this.componentSize;b*=this.componentSize;for(var c=[],d=this.array,e=d.length,f=0;f<e;++f)(f<a||f>=b)&&c.push(d[f]);this.setFromArray(0,c);return this};SPE.TypedArrayHelper.prototype.setFromArray=function(a,b){var c=a+b.length;c>this.array.length?this.grow(c):c<this.array.length&&this.shrink(c);this.array.set(b,this.indexOffset+a);return this};SPE.TypedArrayHelper.prototype.setVec2=function(a,b){return this.setVec2Components(a,b.x,b.y)};
SPE.TypedArrayHelper.prototype.setVec2Components=function(a,b,c){var d=this.array;a=this.indexOffset+a*this.componentSize;d[a]=b;d[a+1]=c;return this};SPE.TypedArrayHelper.prototype.setVec3=function(a,b){return this.setVec3Components(a,b.x,b.y,b.z)};SPE.TypedArrayHelper.prototype.setVec3Components=function(a,b,c,d){var e=this.array;a=this.indexOffset+a*this.componentSize;e[a]=b;e[a+1]=c;e[a+2]=d;return this};
SPE.TypedArrayHelper.prototype.setVec4=function(a,b){return this.setVec4Components(a,b.x,b.y,b.z,b.w)};SPE.TypedArrayHelper.prototype.setVec4Components=function(a,b,c,d,e){var f=this.array;a=this.indexOffset+a*this.componentSize;f[a]=b;f[a+1]=c;f[a+2]=d;f[a+3]=e;return this};SPE.TypedArrayHelper.prototype.setMat3=function(a,b){return this.setFromArray(this.indexOffset+a*this.componentSize,b.elements)};
SPE.TypedArrayHelper.prototype.setMat4=function(a,b){return this.setFromArray(this.indexOffset+a*this.componentSize,b.elements)};SPE.TypedArrayHelper.prototype.setColor=function(a,b){return this.setVec3Components(a,b.r,b.g,b.b)};SPE.TypedArrayHelper.prototype.setNumber=function(a,b){this.array[this.indexOffset+a*this.componentSize]=b;return this};SPE.TypedArrayHelper.prototype.getValueAtIndex=function(a){return this.array[this.indexOffset+a]};
SPE.TypedArrayHelper.prototype.getComponentValueAtIndex=function(a){return this.array.subarray(this.indexOffset+a*this.componentSize)};SPE.ShaderAttribute=function(a,b,c){var d=SPE.ShaderAttribute.typeSizeMap;this.type="string"===typeof a&&d.hasOwnProperty(a)?a:"f";this.componentSize=d[this.type];this.arrayType=c||Float32Array;this.bufferAttribute=this.typedArray=null;this.dynamicBuffer=!!b;this.updateMax=this.updateMin=0};SPE.ShaderAttribute.constructor=SPE.ShaderAttribute;
SPE.ShaderAttribute.typeSizeMap={f:1,v2:2,v3:3,v4:4,c:3,m3:9,m4:16};SPE.ShaderAttribute.prototype.setUpdateRange=function(a,b){this.updateMin=Math.min(a*this.componentSize,this.updateMin*this.componentSize);this.updateMax=Math.max(b*this.componentSize,this.updateMax*this.componentSize)};
SPE.ShaderAttribute.prototype.flagUpdate=function(){var a=this.bufferAttribute,b=a.updateRange;b.offset=this.updateMin;b.count=Math.min(this.updateMax-this.updateMin+this.componentSize,this.typedArray.array.length);a.needsUpdate=!0};SPE.ShaderAttribute.prototype.resetUpdateRange=function(){this.updateMax=this.updateMin=0};SPE.ShaderAttribute.prototype.resetDynamic=function(){this.bufferAttribute.dynamic=this.dynamicBuffer};
SPE.ShaderAttribute.prototype.splice=function(a,b){this.typedArray.splice(a,b);this.forceUpdateAll()};SPE.ShaderAttribute.prototype.forceUpdateAll=function(){this.bufferAttribute.array=this.typedArray.array;this.bufferAttribute.updateRange.offset=0;this.bufferAttribute.updateRange.count=-1;this.bufferAttribute.dynamic=!1;this.bufferAttribute.needsUpdate=!0};
SPE.ShaderAttribute.prototype._ensureTypedArray=function(a){if(null===this.typedArray||this.typedArray.size!==a*this.componentSize)null!==this.typedArray&&this.typedArray.size!==a?this.typedArray.setSize(a):null===this.typedArray&&(this.typedArray=new SPE.TypedArrayHelper(this.arrayType,a,this.componentSize))};
SPE.ShaderAttribute.prototype._createBufferAttribute=function(a){this._ensureTypedArray(a);null!==this.bufferAttribute?(this.bufferAttribute.array=this.typedArray.array,this.bufferAttribute.needsUpdate=!0):(this.bufferAttribute=new THREE.BufferAttribute(this.typedArray.array,this.componentSize),this.bufferAttribute.dynamic=this.dynamicBuffer)};SPE.ShaderAttribute.prototype.getLength=function(){return null===this.typedArray?0:this.typedArray.array.length};
SPE.shaderChunks={defines:"#define PACKED_COLOR_SIZE 256.0\n#define PACKED_COLOR_DIVISOR 255.0",uniforms:"uniform float deltaTime;\nuniform float runTime;\nuniform sampler2D texture;\nuniform vec4 textureAnimation;\nuniform float scale;",attributes:"attribute vec4 acceleration;\nattribute vec3 velocity;\nattribute vec4 rotation;\nattribute vec3 rotationCenter;\nattribute vec4 params;\nattribute vec4 size;\nattribute vec4 angle;\nattribute vec4 color;\nattribute vec4 opacity;",varyings:"varying vec4 vColor;\n#ifdef SHOULD_ROTATE_TEXTURE\n    varying float vAngle;\n#endif\n#ifdef SHOULD_CALCULATE_SPRITE\n    varying vec4 vSpriteSheet;\n#endif",
branchAvoidanceFunctions:"float when_gt(float x, float y) {\n    return max(sign(x - y), 0.0);\n}\nfloat when_lt(float x, float y) {\n    return min( max(1.0 - sign(x - y), 0.0), 1.0 );\n}\nfloat when_eq( float x, float y ) {\n    return 1.0 - abs( sign( x - y ) );\n}\nfloat when_ge(float x, float y) {\n  return 1.0 - when_lt(x, y);\n}\nfloat when_le(float x, float y) {\n  return 1.0 - when_gt(x, y);\n}\nfloat and(float a, float b) {\n    return a * b;\n}\nfloat or(float a, float b) {\n    return min(a + b, 1.0);\n}",
unpackColor:"vec3 unpackColor( in float hex ) {\n   vec3 c = vec3( 0.0 );\n   float r = mod( (hex / PACKED_COLOR_SIZE / PACKED_COLOR_SIZE), PACKED_COLOR_SIZE );\n   float g = mod( (hex / PACKED_COLOR_SIZE), PACKED_COLOR_SIZE );\n   float b = mod( hex, PACKED_COLOR_SIZE );\n   c.r = r / PACKED_COLOR_DIVISOR;\n   c.g = g / PACKED_COLOR_DIVISOR;\n   c.b = b / PACKED_COLOR_DIVISOR;\n   return c;\n}",unpackRotationAxis:"vec3 unpackRotationAxis( in float hex ) {\n   vec3 c = vec3( 0.0 );\n   float r = mod( (hex / PACKED_COLOR_SIZE / PACKED_COLOR_SIZE), PACKED_COLOR_SIZE );\n   float g = mod( (hex / PACKED_COLOR_SIZE), PACKED_COLOR_SIZE );\n   float b = mod( hex, PACKED_COLOR_SIZE );\n   c.r = r / PACKED_COLOR_DIVISOR;\n   c.g = g / PACKED_COLOR_DIVISOR;\n   c.b = b / PACKED_COLOR_DIVISOR;\n   c *= vec3( 2.0 );\n   c -= vec3( 1.0 );\n   return c;\n}",
floatOverLifetime:"float getFloatOverLifetime( in float positionInTime, in vec4 attr ) {\n    highp float value = 0.0;\n    float deltaAge = positionInTime * float( VALUE_OVER_LIFETIME_LENGTH - 1 );\n    float fIndex = 0.0;\n    float shouldApplyValue = 0.0;\n    value += attr[ 0 ] * when_eq( deltaAge, 0.0 );\n\n    for( int i = 0; i < VALUE_OVER_LIFETIME_LENGTH - 1; ++i ) {\n       fIndex = float( i );\n       shouldApplyValue = and( when_gt( deltaAge, fIndex ), when_le( deltaAge, fIndex + 1.0 ) );\n       value += shouldApplyValue * mix( attr[ i ], attr[ i + 1 ], deltaAge - fIndex );\n    }\n\n    return value;\n}",
colorOverLifetime:"vec3 getColorOverLifetime( in float positionInTime, in vec3 color1, in vec3 color2, in vec3 color3, in vec3 color4 ) {\n    vec3 value = vec3( 0.0 );\n    value.x = getFloatOverLifetime( positionInTime, vec4( color1.x, color2.x, color3.x, color4.x ) );\n    value.y = getFloatOverLifetime( positionInTime, vec4( color1.y, color2.y, color3.y, color4.y ) );\n    value.z = getFloatOverLifetime( positionInTime, vec4( color1.z, color2.z, color3.z, color4.z ) );\n    return value;\n}",
paramFetchingFunctions:"float getAlive() {\n   return params.x;\n}\nfloat getAge() {\n   return params.y;\n}\nfloat getMaxAge() {\n   return params.z;\n}\nfloat getWiggle() {\n   return params.w;\n}",forceFetchingFunctions:"vec4 getPosition( in float age ) {\n   return modelViewMatrix * vec4( position, 1.0 );\n}\nvec3 getVelocity( in float age ) {\n   return velocity * age;\n}\nvec3 getAcceleration( in float age ) {\n   return acceleration.xyz * age;\n}",rotationFunctions:"#ifdef SHOULD_ROTATE_PARTICLES\n   mat4 getRotationMatrix( in vec3 axis, in float angle) {\n       axis = normalize(axis);\n       float s = sin(angle);\n       float c = cos(angle);\n       float oc = 1.0 - c;\n\n       return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,\n                   oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,\n                   oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,\n                   0.0,                                0.0,                                0.0,                                1.0);\n   }\n\n   vec3 getRotation( in vec3 pos, in float positionInTime ) {\n      if( rotation.y == 0.0 ) {\n           return pos;\n      }\n\n      vec3 axis = unpackRotationAxis( rotation.x );\n      vec3 center = rotationCenter;\n      vec3 translated;\n      mat4 rotationMatrix;\n      float angle = 0.0;\n      angle += when_eq( rotation.z, 0.0 ) * rotation.y;\n      angle += when_gt( rotation.z, 0.0 ) * mix( 0.0, rotation.y, positionInTime );\n      translated = rotationCenter - pos;\n      rotationMatrix = getRotationMatrix( axis, angle );\n      return center - vec3( rotationMatrix * vec4( translated, 0.0 ) );\n   }\n#endif",
rotateTexture:"    vec2 vUv = vec2( gl_PointCoord.x, 1.0 - gl_PointCoord.y );\n\n    #ifdef SHOULD_ROTATE_TEXTURE\n       float x = gl_PointCoord.x - 0.5;\n       float y = 1.0 - gl_PointCoord.y - 0.5;\n       float c = cos( -vAngle );\n       float s = sin( -vAngle );\n       vUv = vec2( c * x + s * y + 0.5, c * y - s * x + 0.5 );\n    #endif\n\n    #ifdef SHOULD_CALCULATE_SPRITE\n        float framesX = vSpriteSheet.x;\n        float framesY = vSpriteSheet.y;\n        float columnNorm = vSpriteSheet.z;\n        float rowNorm = vSpriteSheet.w;\n        vUv.x = gl_PointCoord.x * framesX + columnNorm;\n        vUv.y = 1.0 - (gl_PointCoord.y * framesY + rowNorm);\n    #endif\n\n    vec4 rotatedTexture = texture2D( texture, vUv );"};
SPE.shaders={vertex:[SPE.shaderChunks.defines,SPE.shaderChunks.uniforms,SPE.shaderChunks.attributes,SPE.shaderChunks.varyings,THREE.ShaderChunk.common,THREE.ShaderChunk.logdepthbuf_pars_vertex,SPE.shaderChunks.branchAvoidanceFunctions,SPE.shaderChunks.unpackColor,SPE.shaderChunks.unpackRotationAxis,SPE.shaderChunks.floatOverLifetime,SPE.shaderChunks.colorOverLifetime,SPE.shaderChunks.paramFetchingFunctions,SPE.shaderChunks.forceFetchingFunctions,SPE.shaderChunks.rotationFunctions,"void main() {\n    highp float age = getAge();\n    highp float alive = getAlive();\n    highp float maxAge = getMaxAge();\n    highp float positionInTime = (age / maxAge);\n    highp float isAlive = when_gt( alive, 0.0 );\n    #ifdef SHOULD_WIGGLE_PARTICLES\n        float wiggleAmount = positionInTime * getWiggle();\n        float wiggleSin = isAlive * sin( wiggleAmount );\n        float wiggleCos = isAlive * cos( wiggleAmount );\n    #endif\n    vec3 vel = getVelocity( age );\n    vec3 accel = getAcceleration( age );\n    vec3 force = vec3( 0.0 );\n    vec3 pos = vec3( position );\n    float drag = 1.0 - (positionInTime * 0.5) * acceleration.w;\n    force += vel;\n    force *= drag;\n    force += accel * age;\n    pos += force;\n    #ifdef SHOULD_WIGGLE_PARTICLES\n        pos.x += wiggleSin;\n        pos.y += wiggleCos;\n        pos.z += wiggleSin;\n    #endif\n    #ifdef SHOULD_ROTATE_PARTICLES\n        pos = getRotation( pos, positionInTime );\n    #endif\n    vec4 mvPos = modelViewMatrix * vec4( pos, 1.0 );\n    highp float pointSize = getFloatOverLifetime( positionInTime, size ) * isAlive;\n    #ifdef HAS_PERSPECTIVE\n        float perspective = scale / length( mvPos.xyz );\n    #else\n        float perspective = 1.0;\n    #endif\n    float pointSizePerspective = pointSize * perspective;\n    #ifdef COLORIZE\n       vec3 c = isAlive * getColorOverLifetime(\n           positionInTime,\n           unpackColor( color.x ),\n           unpackColor( color.y ),\n           unpackColor( color.z ),\n           unpackColor( color.w )\n       );\n    #else\n       vec3 c = vec3(1.0);\n    #endif\n    float o = isAlive * getFloatOverLifetime( positionInTime, opacity );\n    vColor = vec4( c, o );\n    #ifdef SHOULD_ROTATE_TEXTURE\n        vAngle = isAlive * getFloatOverLifetime( positionInTime, angle );\n    #endif\n    #ifdef SHOULD_CALCULATE_SPRITE\n        float framesX = textureAnimation.x;\n        float framesY = textureAnimation.y;\n        float loopCount = textureAnimation.w;\n        float totalFrames = textureAnimation.z;\n        float frameNumber = mod( (positionInTime * loopCount) * totalFrames, totalFrames );\n        float column = floor(mod( frameNumber, framesX ));\n        float row = floor( (frameNumber - column) / framesX );\n        float columnNorm = column / framesX;\n        float rowNorm = row / framesY;\n        vSpriteSheet.x = 1.0 / framesX;\n        vSpriteSheet.y = 1.0 / framesY;\n        vSpriteSheet.z = columnNorm;\n        vSpriteSheet.w = rowNorm;\n    #endif\n    gl_PointSize = pointSizePerspective;\n    gl_Position = projectionMatrix * mvPos;",
THREE.ShaderChunk.logdepthbuf_vertex,"}"].join("\n"),fragment:[SPE.shaderChunks.uniforms,THREE.ShaderChunk.common,THREE.ShaderChunk.fog_pars_fragment,THREE.ShaderChunk.logdepthbuf_pars_fragment,SPE.shaderChunks.varyings,SPE.shaderChunks.branchAvoidanceFunctions,"void main() {\n    vec3 outgoingLight = vColor.xyz;\n    \n    #ifdef ALPHATEST\n       if ( vColor.w < float(ALPHATEST) ) discard;\n    #endif",SPE.shaderChunks.rotateTexture,THREE.ShaderChunk.logdepthbuf_fragment,"    outgoingLight = vColor.xyz * rotatedTexture.xyz;",
THREE.ShaderChunk.fog_fragment,"    gl_FragColor = vec4( outgoingLight.xyz, rotatedTexture.w * vColor.w );\n}"].join("\n")};
SPE.utils={types:{BOOLEAN:"boolean",STRING:"string",NUMBER:"number",OBJECT:"object"},ensureTypedArg:function(a,b,c){return typeof a===b?a:c},ensureArrayTypedArg:function(a,b,c){if(Array.isArray(a)){for(var d=a.length-1;0<=d;--d)if(typeof a[d]!==b)return c;return a}return this.ensureTypedArg(a,b,c)},ensureInstanceOf:function(a,b,c){return void 0!==b&&a instanceof b?a:c},ensureArrayInstanceOf:function(a,b,c){if(Array.isArray(a)){for(var d=a.length-1;0<=d;--d)if(void 0!==b&&!1===a[d]instanceof b)return c;
return a}return this.ensureInstanceOf(a,b,c)},ensureValueOverLifetimeCompliance:function(a,b,c){b=b||3;c=c||3;!1===Array.isArray(a._value)&&(a._value=[a._value]);!1===Array.isArray(a._spread)&&(a._spread=[a._spread]);var d=this.clamp(a._value.length,b,c);b=this.clamp(a._spread.length,b,c);d=Math.max(d,b);a._value.length!==d&&(a._value=this.interpolateArray(a._value,d));a._spread.length!==d&&(a._spread=this.interpolateArray(a._spread,d))},interpolateArray:function(a,b){for(var c=a.length,d=["function"===
typeof a[0].clone?a[0].clone():a[0]],e=(c-1)/(b-1),f=1;f<b-1;++f){var g=f*e,h=Math.floor(g);d[f]=this.lerpTypeAgnostic(a[h],a[Math.ceil(g)],g-h)}d.push("function"===typeof a[c-1].clone?a[c-1].clone():a[c-1]);return d},clamp:function(a,b,c){return Math.max(b,Math.min(a,c))},zeroToEpsilon:function(a,b){b=b?1E-4*Math.random():1E-5;0>a&&-1E-5<a&&(b=-b);return b},lerpTypeAgnostic:function(a,b,c){var d=this.types;if(typeof a===d.NUMBER&&typeof b===d.NUMBER)return a+(b-a)*c;if(a instanceof THREE.Vector2&&
b instanceof THREE.Vector2)return d=a.clone(),d.x=this.lerp(a.x,b.x,c),d.y=this.lerp(a.y,b.y,c),d;if(a instanceof THREE.Vector3&&b instanceof THREE.Vector3)return d=a.clone(),d.x=this.lerp(a.x,b.x,c),d.y=this.lerp(a.y,b.y,c),d.z=this.lerp(a.z,b.z,c),d;if(a instanceof THREE.Vector4&&b instanceof THREE.Vector4)return d=a.clone(),d.x=this.lerp(a.x,b.x,c),d.y=this.lerp(a.y,b.y,c),d.z=this.lerp(a.z,b.z,c),d.w=this.lerp(a.w,b.w,c),d;if(a instanceof THREE.Color&&b instanceof THREE.Color)return d=a.clone(),
d.r=this.lerp(a.r,b.r,c),d.g=this.lerp(a.g,b.g,c),d.b=this.lerp(a.b,b.b,c),d;console.warn("Invalid argument types, or argument types do not match:",a,b)},lerp:function(a,b,c){return a+(b-a)*c},roundToNearestMultiple:function(a,b){var c;if(0===b)return a;c=Math.abs(a)%b;return 0===c?a:0>a?-(Math.abs(a)-c):a+b-c},arrayValuesAreEqual:function(a){for(var b=0;b<a.length-1;++b)if(a[b]!==a[b+1])return!1;return!0},randomFloat:function(a,b){return a+b*(Math.random()-.5)},randomVector3:function(a,b,c,d,e){var f=
c.x+(Math.random()*d.x-.5*d.x),g=c.y+(Math.random()*d.y-.5*d.y);c=c.z+(Math.random()*d.z-.5*d.z);e&&(f=.5*-e.x+this.roundToNearestMultiple(f,e.x),g=.5*-e.y+this.roundToNearestMultiple(g,e.y),c=.5*-e.z+this.roundToNearestMultiple(c,e.z));a.typedArray.setVec3Components(b,f,g,c)},randomColor:function(a,b,c,d){var e=c.r+Math.random()*d.x,f=c.g+Math.random()*d.y;c=c.b+Math.random()*d.z;e=this.clamp(e,0,1);f=this.clamp(f,0,1);c=this.clamp(c,0,1);a.typedArray.setVec3Components(b,e,f,c)},randomColorAsHex:function(){var a=
new THREE.Color;return function(b,c,d,e){for(var f=d.length,g=[],h=0;h<f;++h){var k=e[h];a.copy(d[h]);a.r+=Math.random()*k.x-.5*k.x;a.g+=Math.random()*k.y-.5*k.y;a.b+=Math.random()*k.z-.5*k.z;a.r=this.clamp(a.r,0,1);a.g=this.clamp(a.g,0,1);a.b=this.clamp(a.b,0,1);g.push(a.getHex())}b.typedArray.setVec4Components(c,g[0],g[1],g[2],g[3])}}(),randomVector3OnSphere:function(a,b,c,d,e,f,g,h){h=2*Math.random()-1;var k=6.2832*Math.random(),l=Math.sqrt(1-h*h);d=this.randomFloat(d,e);g&&(d=Math.round(d/g)*
g);g=l*Math.cos(k)*d;k=l*Math.sin(k)*d;g*=f.x;k*=f.y;f=h*d*f.z;g+=c.x;k+=c.y;f+=c.z;a.typedArray.setVec3Components(b,g,k,f)},seededRandom:function(a){a=1E4*Math.sin(a);return a-(a|0)},randomVector3OnDisc:function(a,b,c,d,e,f,g){var h=6.2832*Math.random();d=Math.abs(this.randomFloat(d,e));g&&(d=Math.round(d/g)*g);g=Math.cos(h)*d;h=Math.sin(h)*d;g*=f.x;h*=f.y;g+=c.x;h+=c.y;a.typedArray.setVec3Components(b,g,h,0+c.z)},randomDirectionVector3OnSphere:function(){var a=new THREE.Vector3;return function(b,
c,d,e,f,g,h,k){a.copy(g);a.x-=d;a.y-=e;a.z-=f;a.normalize().multiplyScalar(-this.randomFloat(h,k));b.typedArray.setVec3Components(c,a.x,a.y,a.z)}}(),randomDirectionVector3OnDisc:function(){var a=new THREE.Vector3;return function(b,c,d,e,f,g,h,k){a.copy(g);a.x-=d;a.y-=e;a.z-=f;a.normalize().multiplyScalar(-this.randomFloat(h,k));b.typedArray.setVec3Components(c,a.x,a.y,0)}}(),getPackedRotationAxis:function(){var a=new THREE.Vector3,b=new THREE.Vector3,c=new THREE.Color,d=new THREE.Vector3(1,1,1);return function(e,
f){a.copy(e).normalize();b.copy(f).normalize();a.x+=.5*-f.x+Math.random()*f.x;a.y+=.5*-f.y+Math.random()*f.y;a.z+=.5*-f.z+Math.random()*f.z;a.normalize().add(d).multiplyScalar(.5);c.setRGB(a.x,a.y,a.z);return c.getHex()}}()};
SPE.Group=function(a){var b=SPE.utils,c=b.types;a=b.ensureTypedArg(a,c.OBJECT,{});a.texture=b.ensureTypedArg(a.texture,c.OBJECT,{});this.uuid=THREE.Math.generateUUID();this.fixedTimeStep=b.ensureTypedArg(a.fixedTimeStep,c.NUMBER,.016);this.texture=b.ensureInstanceOf(a.texture.value,THREE.Texture,null);this.textureFrames=b.ensureInstanceOf(a.texture.frames,THREE.Vector2,new THREE.Vector2(1,1));this.textureFrameCount=b.ensureTypedArg(a.texture.frameCount,c.NUMBER,this.textureFrames.x*this.textureFrames.y);
this.textureLoop=b.ensureTypedArg(a.texture.loop,c.NUMBER,1);this.textureFrames.max(new THREE.Vector2(1,1));this.hasPerspective=b.ensureTypedArg(a.hasPerspective,c.BOOLEAN,!0);this.colorize=b.ensureTypedArg(a.colorize,c.BOOLEAN,!0);this.maxParticleCount=b.ensureTypedArg(a.maxParticleCount,c.NUMBER,null);this.blending=b.ensureTypedArg(a.blending,c.NUMBER,THREE.AdditiveBlending);this.transparent=b.ensureTypedArg(a.transparent,c.BOOLEAN,!0);this.alphaTest=parseFloat(b.ensureTypedArg(a.alphaTest,c.NUMBER,
0));this.depthWrite=b.ensureTypedArg(a.depthWrite,c.BOOLEAN,!1);this.depthTest=b.ensureTypedArg(a.depthTest,c.BOOLEAN,!0);this.fog=b.ensureTypedArg(a.fog,c.BOOLEAN,!0);this.scale=b.ensureTypedArg(a.scale,c.NUMBER,300);this.emitters=[];this.emitterIDs=[];this._pool=[];this._poolCreationSettings=null;this._createNewWhenPoolEmpty=0;this._attributesNeedDynamicReset=this._attributesNeedRefresh=!1;this.particleCount=0;this.uniforms={texture:{type:"t",value:this.texture},textureAnimation:{type:"v4",value:new THREE.Vector4(this.textureFrames.x,
this.textureFrames.y,this.textureFrameCount,Math.max(Math.abs(this.textureLoop),1))},fogColor:{type:"c",value:null},fogNear:{type:"f",value:10},fogFar:{type:"f",value:200},fogDensity:{type:"f",value:.5},deltaTime:{type:"f",value:0},runTime:{type:"f",value:0},scale:{type:"f",value:this.scale}};this.defines={HAS_PERSPECTIVE:this.hasPerspective,COLORIZE:this.colorize,VALUE_OVER_LIFETIME_LENGTH:SPE.valueOverLifetimeLength,SHOULD_ROTATE_TEXTURE:!1,SHOULD_ROTATE_PARTICLES:!1,SHOULD_WIGGLE_PARTICLES:!1,
SHOULD_CALCULATE_SPRITE:1<this.textureFrames.x||1<this.textureFrames.y};this.attributes={position:new SPE.ShaderAttribute("v3",!0),acceleration:new SPE.ShaderAttribute("v4",!0),velocity:new SPE.ShaderAttribute("v3",!0),rotation:new SPE.ShaderAttribute("v4",!0),rotationCenter:new SPE.ShaderAttribute("v3",!0),params:new SPE.ShaderAttribute("v4",!0),size:new SPE.ShaderAttribute("v4",!0),angle:new SPE.ShaderAttribute("v4",!0),color:new SPE.ShaderAttribute("v4",!0),opacity:new SPE.ShaderAttribute("v4",
!0)};this.attributeKeys=Object.keys(this.attributes);this.attributeCount=this.attributeKeys.length;this.material=new THREE.ShaderMaterial({uniforms:this.uniforms,vertexShader:SPE.shaders.vertex,fragmentShader:SPE.shaders.fragment,blending:this.blending,transparent:this.transparent,alphaTest:this.alphaTest,depthWrite:this.depthWrite,depthTest:this.depthTest,defines:this.defines,fog:this.fog});this.geometry=new THREE.BufferGeometry;this.mesh=new THREE.Points(this.geometry,this.material);null===this.maxParticleCount&&
console.warn("SPE.Group: No maxParticleCount specified. Adding emitters after rendering will probably cause errors.")};SPE.Group.constructor=SPE.Group;
SPE.Group.prototype._updateDefines=function(){var a=this.emitters,b=a.length-1,c,d=this.defines;for(b;0<=b;--b)c=a[b],d.SHOULD_CALCULATE_SPRITE||(d.SHOULD_ROTATE_TEXTURE=d.SHOULD_ROTATE_TEXTURE||!!Math.max(Math.max.apply(null,c.angle.value),Math.max.apply(null,c.angle.spread))),d.SHOULD_ROTATE_PARTICLES=d.SHOULD_ROTATE_PARTICLES||!!Math.max(c.rotation.angle,c.rotation.angleSpread),d.SHOULD_WIGGLE_PARTICLES=d.SHOULD_WIGGLE_PARTICLES||!!Math.max(c.wiggle.value,c.wiggle.spread);this.material.needsUpdate=
!0};SPE.Group.prototype._applyAttributesToGeometry=function(){var a=this.attributes,b=this.geometry,c=b.attributes,d,e,f;for(f in a)a.hasOwnProperty(f)&&(d=a[f],(e=c[f])?e.array=d.typedArray.array:b.addAttribute(f,d.bufferAttribute),d.bufferAttribute.needsUpdate=!0);this.geometry.setDrawRange(0,this.particleCount)};
SPE.Group.prototype.addEmitter=function(a){if(!1===a instanceof SPE.Emitter)console.error("`emitter` argument must be instance of SPE.Emitter. Was provided with:",a);else if(-1<this.emitterIDs.indexOf(a.uuid))console.error("Emitter already exists in this group. Will not add again.");else if(null!==a.group)console.error("Emitter already belongs to another group. Will not add to requested group.");else{var b=this.attributes,c=this.particleCount,d=c+a.particleCount;this.particleCount=d;null!==this.maxParticleCount&&
this.particleCount>this.maxParticleCount&&console.warn("SPE.Group: maxParticleCount exceeded. Requesting",this.particleCount,"particles, can support only",this.maxParticleCount);a._calculatePPSValue(a.maxAge._value+a.maxAge._spread);a._setBufferUpdateRanges(this.attributeKeys);a._setAttributeOffset(c);a.group=this;a.attributes=this.attributes;for(var e in b)b.hasOwnProperty(e)&&b[e]._createBufferAttribute(null!==this.maxParticleCount?this.maxParticleCount:this.particleCount);for(b=c;b<d;++b)a._assignPositionValue(b),
a._assignForceValue(b,"velocity"),a._assignForceValue(b,"acceleration"),a._assignAbsLifetimeValue(b,"opacity"),a._assignAbsLifetimeValue(b,"size"),a._assignAngleValue(b),a._assignRotationValue(b),a._assignParamsValue(b),a._assignColorValue(b);this._applyAttributesToGeometry();this.emitters.push(a);this.emitterIDs.push(a.uuid);this._updateDefines(a);this.material.needsUpdate=!0;this._attributesNeedRefresh=this.geometry.needsUpdate=!0;return this}};
SPE.Group.prototype.removeEmitter=function(a){var b=this.emitterIDs.indexOf(a.uuid);if(!1===a instanceof SPE.Emitter)console.error("`emitter` argument must be instance of SPE.Emitter. Was provided with:",a);else if(-1===b)console.error("Emitter does not exist in this group. Will not remove.");else{for(var c=a.attributeOffset,d=c+a.particleCount,e=this.attributes.params.typedArray,f=c;f<d;++f)e.array[4*f]=0,e.array[4*f+1]=0;this.emitters.splice(b,1);this.emitterIDs.splice(b,1);for(var g in this.attributes)this.attributes.hasOwnProperty(g)&&
this.attributes[g].splice(c,d);this.particleCount-=a.particleCount;a._onRemove();this._attributesNeedRefresh=!0}};SPE.Group.prototype.getFromPool=function(){var a=this._pool,b=this._createNewWhenPoolEmpty;return a.length?a.pop():b?new SPE.Emitter(this._poolCreationSettings):null};SPE.Group.prototype.releaseIntoPool=function(a){if(!1===a instanceof SPE.Emitter)console.error("Argument is not instanceof SPE.Emitter:",a);else return a.reset(),this._pool.unshift(a),this};SPE.Group.prototype.getPool=function(){return this._pool};
SPE.Group.prototype.addPool=function(a,b,c){this._poolCreationSettings=b;this._createNewWhenPoolEmpty=!!c;for(var d=0;d<a;++d)c=Array.isArray(b)?new SPE.Emitter(b[d]):new SPE.Emitter(b),this.addEmitter(c),this.releaseIntoPool(c);return this};
SPE.Group.prototype._triggerSingleEmitter=function(a){var b=this.getFromPool(),c=this;if(null===b)console.log("SPE.Group pool ran out.");else return a instanceof THREE.Vector3&&(b.position.value.copy(a),b.position.value=b.position.value),b.enable(),setTimeout(function(){b.disable();c.releaseIntoPool(b)},1E3*Math.max(b.duration,b.maxAge.value+b.maxAge.spread)),this};
SPE.Group.prototype.triggerPoolEmitter=function(a,b){if("number"===typeof a&&1<a)for(var c=0;c<a;++c)this._triggerSingleEmitter(b);else this._triggerSingleEmitter(b);return this};SPE.Group.prototype._updateUniforms=function(a){this.uniforms.runTime.value+=a;this.uniforms.deltaTime.value=a};SPE.Group.prototype._resetBufferRanges=function(){var a=this.attributeKeys,b=this.attributeCount-1,c=this.attributes;for(b;0<=b;--b)c[a[b]].resetUpdateRange()};
SPE.Group.prototype._updateBuffers=function(a){var b=this.attributeKeys,c=this.attributeCount-1,d=this.attributes;a=a.bufferUpdateRanges;var e,f;for(c;0<=c;--c)e=b[c],f=a[e],e=d[e],e.setUpdateRange(f.min,f.max),e.flagUpdate()};
SPE.Group.prototype.tick=function(a){var b=this.emitters,c=b.length;a=a||this.fixedTimeStep;var d=this.attributeKeys,e,f=this.attributes;this._updateUniforms(a);this._resetBufferRanges();if(0!==c||!1!==this._attributesNeedRefresh||!1!==this._attributesNeedDynamicReset){e=0;for(var g;e<c;++e)g=b[e],g.tick(a),this._updateBuffers(g);if(!0===this._attributesNeedDynamicReset){e=this.attributeCount-1;for(e;0<=e;--e)f[d[e]].resetDynamic();this._attributesNeedDynamicReset=!1}if(!0===this._attributesNeedRefresh){e=
this.attributeCount-1;for(e;0<=e;--e)f[d[e]].forceUpdateAll();this._attributesNeedRefresh=!1;this._attributesNeedDynamicReset=!0}}};SPE.Group.prototype.dispose=function(){this.geometry.dispose();this.material.dispose();return this};
SPE.Emitter=function(a){var b=SPE.utils,c=b.types,d=SPE.valueOverLifetimeLength;a=b.ensureTypedArg(a,c.OBJECT,{});a.position=b.ensureTypedArg(a.position,c.OBJECT,{});a.velocity=b.ensureTypedArg(a.velocity,c.OBJECT,{});a.acceleration=b.ensureTypedArg(a.acceleration,c.OBJECT,{});a.radius=b.ensureTypedArg(a.radius,c.OBJECT,{});a.drag=b.ensureTypedArg(a.drag,c.OBJECT,{});a.rotation=b.ensureTypedArg(a.rotation,c.OBJECT,{});a.color=b.ensureTypedArg(a.color,c.OBJECT,{});a.opacity=b.ensureTypedArg(a.opacity,
c.OBJECT,{});a.size=b.ensureTypedArg(a.size,c.OBJECT,{});a.angle=b.ensureTypedArg(a.angle,c.OBJECT,{});a.wiggle=b.ensureTypedArg(a.wiggle,c.OBJECT,{});a.maxAge=b.ensureTypedArg(a.maxAge,c.OBJECT,{});a.onParticleSpawn&&console.warn("onParticleSpawn has been removed. Please set properties directly to alter values at runtime.");this.uuid=THREE.Math.generateUUID();this.type=b.ensureTypedArg(a.type,c.NUMBER,SPE.distributions.BOX);this.position={_value:b.ensureInstanceOf(a.position.value,THREE.Vector3,
new THREE.Vector3),_spread:b.ensureInstanceOf(a.position.spread,THREE.Vector3,new THREE.Vector3),_spreadClamp:b.ensureInstanceOf(a.position.spreadClamp,THREE.Vector3,new THREE.Vector3),_distribution:b.ensureTypedArg(a.position.distribution,c.NUMBER,this.type),_randomise:b.ensureTypedArg(a.position.randomise,c.BOOLEAN,!1),_radius:b.ensureTypedArg(a.position.radius,c.NUMBER,10),_radiusScale:b.ensureInstanceOf(a.position.radiusScale,THREE.Vector3,new THREE.Vector3(1,1,1)),_distributionClamp:b.ensureTypedArg(a.position.distributionClamp,
c.NUMBER,0)};this.velocity={_value:b.ensureInstanceOf(a.velocity.value,THREE.Vector3,new THREE.Vector3),_spread:b.ensureInstanceOf(a.velocity.spread,THREE.Vector3,new THREE.Vector3),_distribution:b.ensureTypedArg(a.velocity.distribution,c.NUMBER,this.type),_randomise:b.ensureTypedArg(a.position.randomise,c.BOOLEAN,!1)};this.acceleration={_value:b.ensureInstanceOf(a.acceleration.value,THREE.Vector3,new THREE.Vector3),_spread:b.ensureInstanceOf(a.acceleration.spread,THREE.Vector3,new THREE.Vector3),
_distribution:b.ensureTypedArg(a.acceleration.distribution,c.NUMBER,this.type),_randomise:b.ensureTypedArg(a.position.randomise,c.BOOLEAN,!1)};this.drag={_value:b.ensureTypedArg(a.drag.value,c.NUMBER,0),_spread:b.ensureTypedArg(a.drag.spread,c.NUMBER,0),_randomise:b.ensureTypedArg(a.position.randomise,c.BOOLEAN,!1)};this.wiggle={_value:b.ensureTypedArg(a.wiggle.value,c.NUMBER,0),_spread:b.ensureTypedArg(a.wiggle.spread,c.NUMBER,0)};this.rotation={_axis:b.ensureInstanceOf(a.rotation.axis,THREE.Vector3,
new THREE.Vector3(0,1,0)),_axisSpread:b.ensureInstanceOf(a.rotation.axisSpread,THREE.Vector3,new THREE.Vector3),_angle:b.ensureTypedArg(a.rotation.angle,c.NUMBER,0),_angleSpread:b.ensureTypedArg(a.rotation.angleSpread,c.NUMBER,0),_static:b.ensureTypedArg(a.rotation.static,c.BOOLEAN,!1),_center:b.ensureInstanceOf(a.rotation.center,THREE.Vector3,this.position._value.clone()),_randomise:b.ensureTypedArg(a.position.randomise,c.BOOLEAN,!1)};this.maxAge={_value:b.ensureTypedArg(a.maxAge.value,c.NUMBER,
2),_spread:b.ensureTypedArg(a.maxAge.spread,c.NUMBER,0)};this.color={_value:b.ensureArrayInstanceOf(a.color.value,THREE.Color,new THREE.Color),_spread:b.ensureArrayInstanceOf(a.color.spread,THREE.Vector3,new THREE.Vector3),_randomise:b.ensureTypedArg(a.position.randomise,c.BOOLEAN,!1)};this.opacity={_value:b.ensureArrayTypedArg(a.opacity.value,c.NUMBER,1),_spread:b.ensureArrayTypedArg(a.opacity.spread,c.NUMBER,0),_randomise:b.ensureTypedArg(a.position.randomise,c.BOOLEAN,!1)};this.size={_value:b.ensureArrayTypedArg(a.size.value,
c.NUMBER,1),_spread:b.ensureArrayTypedArg(a.size.spread,c.NUMBER,0),_randomise:b.ensureTypedArg(a.position.randomise,c.BOOLEAN,!1)};this.angle={_value:b.ensureArrayTypedArg(a.angle.value,c.NUMBER,0),_spread:b.ensureArrayTypedArg(a.angle.spread,c.NUMBER,0),_randomise:b.ensureTypedArg(a.position.randomise,c.BOOLEAN,!1)};this.particleCount=b.ensureTypedArg(a.particleCount,c.NUMBER,100);this.duration=b.ensureTypedArg(a.duration,c.NUMBER,null);this.isStatic=b.ensureTypedArg(a.isStatic,c.BOOLEAN,!1);this.activeMultiplier=
b.ensureTypedArg(a.activeMultiplier,c.NUMBER,1);this.direction=b.ensureTypedArg(a.direction,c.NUMBER,1);this.alive=b.ensureTypedArg(a.alive,c.BOOLEAN,!0);this.activeParticleCount=this.age=this.attributeEnd=this.attributeOffset=this.activationIndex=this.particlesPerSecond=0;this.paramsArray=this.attributes=this.group=null;this.resetFlags={position:b.ensureTypedArg(a.position.randomise,c.BOOLEAN,!1)||b.ensureTypedArg(a.radius.randomise,c.BOOLEAN,!1),velocity:b.ensureTypedArg(a.velocity.randomise,c.BOOLEAN,
!1),acceleration:b.ensureTypedArg(a.acceleration.randomise,c.BOOLEAN,!1)||b.ensureTypedArg(a.drag.randomise,c.BOOLEAN,!1),rotation:b.ensureTypedArg(a.rotation.randomise,c.BOOLEAN,!1),rotationCenter:b.ensureTypedArg(a.rotation.randomise,c.BOOLEAN,!1),size:b.ensureTypedArg(a.size.randomise,c.BOOLEAN,!1),color:b.ensureTypedArg(a.color.randomise,c.BOOLEAN,!1),opacity:b.ensureTypedArg(a.opacity.randomise,c.BOOLEAN,!1),angle:b.ensureTypedArg(a.angle.randomise,c.BOOLEAN,!1)};this.updateFlags={};this.updateCounts=
{};this.updateMap={maxAge:"params",position:"position",velocity:"velocity",acceleration:"acceleration",drag:"acceleration",wiggle:"params",rotation:"rotation",size:"size",color:"color",opacity:"opacity",angle:"angle"};for(var e in this.updateMap)this.updateMap.hasOwnProperty(e)&&(this.updateCounts[this.updateMap[e]]=0,this.updateFlags[this.updateMap[e]]=!1,this._createGetterSetters(this[e],e));this.bufferUpdateRanges={};this.attributeKeys=null;this.attributeCount=0;b.ensureValueOverLifetimeCompliance(this.color,
d,d);b.ensureValueOverLifetimeCompliance(this.opacity,d,d);b.ensureValueOverLifetimeCompliance(this.size,d,d);b.ensureValueOverLifetimeCompliance(this.angle,d,d)};SPE.Emitter.constructor=SPE.Emitter;
SPE.Emitter.prototype._createGetterSetters=function(a,b){var c=this,d;for(d in a)if(a.hasOwnProperty(d)){var e=d.replace("_","");Object.defineProperty(a,e,{get:function(a){return function(){return this[a]}}(d),set:function(a){return function(d){var e=c.updateMap[b],f=this[a],g=SPE.valueOverLifetimeLength;"_rotationCenter"===a?(c.updateFlags.rotationCenter=!0,c.updateCounts.rotationCenter=0):"_randomise"===a?c.resetFlags[e]=d:(c.updateFlags[e]=!0,c.updateCounts[e]=0);c.group._updateDefines();this[a]=
d;Array.isArray(f)&&SPE.utils.ensureValueOverLifetimeCompliance(c[b],g,g)}}(d)})}};SPE.Emitter.prototype._setBufferUpdateRanges=function(a){this.attributeKeys=a;this.attributeCount=a.length;for(var b=this.attributeCount-1;0<=b;--b)this.bufferUpdateRanges[a[b]]={min:Number.POSITIVE_INFINITY,max:Number.NEGATIVE_INFINITY}};SPE.Emitter.prototype._calculatePPSValue=function(a){var b=this.particleCount;this.particlesPerSecond=this.duration?b/(a<this.duration?a:this.duration):b/a};
SPE.Emitter.prototype._setAttributeOffset=function(a){this.activationIndex=this.attributeOffset=a;this.activationEnd=a+this.particleCount};
SPE.Emitter.prototype._assignValue=function(a,b){switch(a){case "position":this._assignPositionValue(b);break;case "velocity":case "acceleration":this._assignForceValue(b,a);break;case "size":case "opacity":this._assignAbsLifetimeValue(b,a);break;case "angle":this._assignAngleValue(b);break;case "params":this._assignParamsValue(b);break;case "rotation":this._assignRotationValue(b);break;case "color":this._assignColorValue(b)}};
SPE.Emitter.prototype._assignPositionValue=function(a){var b=SPE.distributions,c=SPE.utils,d=this.position,e=this.attributes.position,f=d._value,g=d._spread;switch(d._distribution){case b.BOX:c.randomVector3(e,a,f,g,d._spreadClamp);break;case b.SPHERE:c.randomVector3OnSphere(e,a,f,d._radius,d._spread.x,d._radiusScale,d._spreadClamp.x,d._distributionClamp||this.particleCount);break;case b.DISC:c.randomVector3OnDisc(e,a,f,d._radius,d._spread.x,d._radiusScale,d._spreadClamp.x)}};
SPE.Emitter.prototype._assignForceValue=function(a,b){var c=SPE.distributions,d=SPE.utils,e=this[b],f=e._value,g=e._spread,h;switch(e._distribution){case c.BOX:d.randomVector3(this.attributes[b],a,f,g);break;case c.SPHERE:g=this.attributes.position.typedArray.array;h=3*a;c=g[h];f=g[h+1];g=g[h+2];d.randomDirectionVector3OnSphere(this.attributes[b],a,c,f,g,this.position._value,e._value.x,e._spread.x);break;case c.DISC:g=this.attributes.position.typedArray.array,h=3*a,c=g[h],f=g[h+1],g=g[h+2],d.randomDirectionVector3OnDisc(this.attributes[b],
a,c,f,g,this.position._value,e._value.x,e._spread.x)}"acceleration"===b&&(b=d.clamp(d.randomFloat(this.drag._value,this.drag._spread),0,1),this.attributes.acceleration.typedArray.array[4*a+3]=b)};
SPE.Emitter.prototype._assignAbsLifetimeValue=function(a,b){var c=this.attributes[b].typedArray;b=this[b];var d=SPE.utils;d.arrayValuesAreEqual(b._value)&&d.arrayValuesAreEqual(b._spread)?(b=Math.abs(d.randomFloat(b._value[0],b._spread[0])),c.setVec4Components(a,b,b,b,b)):c.setVec4Components(a,Math.abs(d.randomFloat(b._value[0],b._spread[0])),Math.abs(d.randomFloat(b._value[1],b._spread[1])),Math.abs(d.randomFloat(b._value[2],b._spread[2])),Math.abs(d.randomFloat(b._value[3],b._spread[3])))};
SPE.Emitter.prototype._assignAngleValue=function(a){var b=this.attributes.angle.typedArray,c=this.angle,d=SPE.utils;d.arrayValuesAreEqual(c._value)&&d.arrayValuesAreEqual(c._spread)?(c=d.randomFloat(c._value[0],c._spread[0]),b.setVec4Components(a,c,c,c,c)):b.setVec4Components(a,d.randomFloat(c._value[0],c._spread[0]),d.randomFloat(c._value[1],c._spread[1]),d.randomFloat(c._value[2],c._spread[2]),d.randomFloat(c._value[3],c._spread[3]))};
SPE.Emitter.prototype._assignParamsValue=function(a){this.attributes.params.typedArray.setVec4Components(a,this.isStatic?1:0,0,Math.abs(SPE.utils.randomFloat(this.maxAge._value,this.maxAge._spread)),SPE.utils.randomFloat(this.wiggle._value,this.wiggle._spread))};
SPE.Emitter.prototype._assignRotationValue=function(a){this.attributes.rotation.typedArray.setVec3Components(a,SPE.utils.getPackedRotationAxis(this.rotation._axis,this.rotation._axisSpread),SPE.utils.randomFloat(this.rotation._angle,this.rotation._angleSpread),this.rotation._static?0:1);this.attributes.rotationCenter.typedArray.setVec3(a,this.rotation._center)};SPE.Emitter.prototype._assignColorValue=function(a){SPE.utils.randomColorAsHex(this.attributes.color,a,this.color._value,this.color._spread)};
SPE.Emitter.prototype._resetParticle=function(a){for(var b=this.resetFlags,c=this.updateFlags,d=this.updateCounts,e=this.attributeKeys,f,g,h=this.attributeCount-1;0<=h;--h)if(f=e[h],g=c[f],!0===b[f]||!0===g)this._assignValue(f,a),this._updateAttributeUpdateRange(f,a),!0===g&&d[f]===this.particleCount?(c[f]=!1,d[f]=0):1==g&&++d[f]};SPE.Emitter.prototype._updateAttributeUpdateRange=function(a,b){a=this.bufferUpdateRanges[a];a.min=Math.min(b,a.min);a.max=Math.max(b,a.max)};
SPE.Emitter.prototype._resetBufferRanges=function(){var a=this.bufferUpdateRanges,b=this.bufferUpdateKeys,c=this.bufferUpdateCount-1,d;for(c;0<=c;--c)d=b[c],a[d].min=Number.POSITIVE_INFINITY,a[d].max=Number.NEGATIVE_INFINITY};SPE.Emitter.prototype._onRemove=function(){this.activeParticleCount=this.activationIndex=this.attributeOffset=this.particlesPerSecond=0;this.paramsArray=this.attributes=this.group=null;this.age=0};SPE.Emitter.prototype._decrementParticleCount=function(){--this.activeParticleCount};
SPE.Emitter.prototype._incrementParticleCount=function(){++this.activeParticleCount};SPE.Emitter.prototype._checkParticleAges=function(a,b,c,d){--b;for(var e,f,g,h;b>=a;--b)e=4*b,h=c[e],0!==h&&(g=c[e+1],f=c[e+2],1===this.direction?(g+=d,g>=f&&(h=g=0,this._decrementParticleCount())):(g-=d,0>=g&&(g=f,h=0,this._decrementParticleCount())),c[e]=h,c[e+1]=g,this._updateAttributeUpdateRange("params",b))};
SPE.Emitter.prototype._activateParticles=function(a,b,c,d){for(var e=this.direction,f=a,g,h;f<b;++f)if(g=4*f,0==c[g]||1===this.particleCount)this._incrementParticleCount(),c[g]=1,this._resetParticle(f),h=d*(f-a),c[g+1]=-1===e?c[g+2]-h:h,this._updateAttributeUpdateRange("params",f)};
SPE.Emitter.prototype.tick=function(a){if(!this.isStatic){null===this.paramsArray&&(this.paramsArray=this.attributes.params.typedArray.array);var b=this.attributeOffset,c=b+this.particleCount,d=this.paramsArray,e=this.particlesPerSecond*this.activeMultiplier*a,f=this.activationIndex;this._resetBufferRanges();this._checkParticleAges(b,c,d,a);if(!1===this.alive)this.age=0;else if(null!==this.duration&&this.age>this.duration)this.alive=!1,this.age=0;else{var f=1===this.particleCount?f:f|0,g=Math.min(f+
e,this.activationEnd),h=g-this.activationIndex|0;this._activateParticles(f,g,d,0<h?a/h:0);this.activationIndex+=e;this.activationIndex>c&&(this.activationIndex=b);this.age+=a}}};SPE.Emitter.prototype.reset=function(a){this.age=0;this.alive=!1;if(!0===a){a=this.attributeOffset;for(var b=this.paramsArray,c=this.attributes.params.bufferAttribute,d=a+this.particleCount-1,e;d>=a;--d)e=4*d,b[e]=0,b[e+1]=0;c.updateRange.offset=0;c.updateRange.count=-1;c.needsUpdate=!0}return this};
SPE.Emitter.prototype.enable=function(){this.alive=!0;return this};SPE.Emitter.prototype.disable=function(){this.alive=!1;return this};SPE.Emitter.prototype.remove=function(){null!==this.group?this.group.removeEmitter(this):console.error("Emitter does not belong to a group, cannot remove.");return this};function SheepFX(){this.groups=[];this.screenScale=180}SheepFX.prototype._finalize=function(a){for(var b=0;b<a.emitters.length;b++)0==a.emitters[b].duration&&9<a.emitters[b].activeMultiplier&&(a.emitters[b].particlesPerSecond=1E4);this.groups.push(a);a.sheepfxID=this.groups.length-1;a.mesh.group=a;a.mesh.emitters=a.emitters;a.uniforms.scale.value=this.screenScale;return a.mesh};
SheepFX.prototype.effectFromJson=function(a,b,c){if(!a.emitter_length)return console.log("Error: Json file is not of type 'Effect'"),this.generateTemplate(b);var d=0;if(c)d=c;else for(c=0;c<a.emitter_length;c++)d+=a["emitter_"+c.toString()].particleCount;b=a.texture&&a.texture.frames&&(1!=a.texture.frames.x||1!=a.texture.frames.y)?new SPE.Group({maxParticleCount:d,texture:{value:b,frames:(new THREE.Vector2).copy(a.texture.frames),frameCount:a.texture.frameCount,loop:a.texture.loop},blending:a.blending,
depthWrite:a.depthWrite,depthTest:a.depthTest,fog:!0}):new SPE.Group({maxParticleCount:d,texture:{value:b,frames:null,frameCount:null,loop:null},blending:a.blending,depthWrite:a.depthWrite,depthTest:a.depthTest,fog:!0});for(c=0;c<a.emitter_length;c++)b.addEmitter(this.emitterFromJson(a["emitter_"+c.toString()]));return this._finalize(b)};
SheepFX.prototype.emitterFromJson=function(a){if(!a.particleCount){console.log("Error: Json file is not of type 'Emitter'");a=this.generateTemplate(a,null);var b=a.emitters[0].copy();this.remove(a);return b}var b=[new THREE.Color(a.color.value[0].x,a.color.value[0].y,a.color.value[0].z),new THREE.Color(a.color.value[1].x,a.color.value[1].y,a.color.value[1].z),new THREE.Color(a.color.value[2].x,a.color.value[2].y,a.color.value[2].z),new THREE.Color(a.color.value[3].x,a.color.value[3].y,a.color.value[3].z)],
c=[(new THREE.Vector3).copy(a.color.spread[0]),(new THREE.Vector3).copy(a.color.spread[1]),(new THREE.Vector3).copy(a.color.spread[2]),(new THREE.Vector3).copy(a.color.spread[3])];return new SPE.Emitter({type:a.type,particleCount:a.particleCount,duration:a.duration,isStatic:a.isStatic,activeMultiplier:a.activeMultiplier,direction:a.direction,maxAge:{value:a.maxAge.value,spread:a.maxAge.spread},position:{value:(new THREE.Vector3).copy(a.position.value),spread:(new THREE.Vector3).copy(a.position.spread),
radius:a.position.radius,radiusScale:(new THREE.Vector3).copy(a.position.radiusScale),distribution:a.position.distribution,randomise:!1},velocity:{value:(new THREE.Vector3).copy(a.velocity.value),spread:(new THREE.Vector3).copy(a.velocity.spread),distribution:a.velocity.distribution,randomise:!1},acceleration:{value:(new THREE.Vector3).copy(a.acceleration.value),spread:(new THREE.Vector3).copy(a.acceleration.spread),randomise:!1},drag:{value:a.drag.value,spread:a.drag.spread,randomise:!1},wiggle:{value:a.wiggle.value,
spread:a.wiggle.spread},rotation:{axis:(new THREE.Vector3).copy(a.rotation.axis),axisSpread:(new THREE.Vector3).copy(a.rotation.axisSpread),angle:a.rotation.angle,angleSpread:a.rotation.angleSpread,static:a.rotation.static,center:(new THREE.Vector3).copy(a.rotation.center),randomise:!1},color:{value:b,spread:c,randomise:!1},opacity:{value:[a.opacity.value[0],a.opacity.value[1],a.opacity.value[2],a.opacity.value[3]],spread:[a.opacity.spread[0],a.opacity.spread[1],a.opacity.spread[2],a.opacity.spread[3]],
randomise:!1},size:{value:[a.size.value[0],a.size.value[1],a.size.value[2],a.size.value[3]],spread:[a.size.spread[0],a.size.spread[1],a.size.spread[2],a.size.spread[3]],randomise:!1},angle:{value:[a.angle.value[0],a.angle.value[1],a.angle.value[2],a.angle.value[3]],spread:[a.angle.spread[0],a.angle.spread[1],a.angle.spread[2],a.angle.spread[3]],randomise:!1}})};
SheepFX.prototype.generateTemplate=function(a){a=new SPE.Group({maxParticleCount:1E4,texture:{value:a,frames:null,frameCount:1,loop:1},blending:THREE.AdditiveBlending,transparent:!0,depthWrite:!1,depthTest:!0,fog:!1,scale:100});var b=new SPE.Emitter({type:SPE.distributions.box,particleCount:400,duration:null,isStatic:!1,activeMultiplier:1,direction:1,maxAge:{value:2,spread:0},position:{value:new THREE.Vector3(0,0,0),spread:new THREE.Vector3(0,0,0),radius:1,radiusScale:new THREE.Vector3(1,1,1),distribution:SPE.distributions.BOX,
randomise:!1},velocity:{value:new THREE.Vector3(0,.5,0),spread:new THREE.Vector3(.2,0,.2),distribution:SPE.distributions.box,randomise:!1},acceleration:{value:new THREE.Vector3(0,0,0),spread:new THREE.Vector3(0,-.5,0),randomise:!1},drag:{value:0,spread:0,randomise:!1},wiggle:{value:0,spread:0},rotation:{axis:new THREE.Vector3(0,0,0),axisSpread:new THREE.Vector3(1,1,1),angle:0,angleSpread:0,static:!1,center:new THREE.Vector3(0,0,0),randomise:!1},color:{value:[new THREE.Color("blue"),new THREE.Color("yellow"),
new THREE.Color("red"),new THREE.Color("black")],spread:[new THREE.Vector3(0,0,0),new THREE.Vector3(0,0,0),new THREE.Vector3(0,0,0),new THREE.Vector3(0,0,0)],randomise:!1},opacity:{value:[0,1,1,0],spread:[0,0,0,0],randomise:!1},size:{value:[1,1,1,3],spread:[0,0,0,0],randomise:!1},angle:{value:[0,10],spread:[1,1],randomise:!1}});a.addEmitter(b);return this._finalize(a)};
SheepFX.prototype.copyFX=function(a,b,c){var d=a.group,e=0;if(c)e=c;else for(c=0;c<a.emitters.length;c++)e+=a.emitters[c].particleCount;b=new SPE.Group({maxParticleCount:e,texture:{value:b,frames:d.textureFrames,frameCount:d.textureFrameCount,loop:d.textureLoop},blending:d.material.blending,depthWrite:d.material.depthWrite,depthTest:d.material.depthTest,fog:d.fog});for(c=0;c<a.emitters.length;c++)d=a.emitters[c].copy(),b.addEmitter(d);return this._finalize(b)};
SheepFX.prototype.remove=function(a){0>=this.groups.length&&console.info("SheepFX: Attempting to remove from empty list");if(1==this.groups.length){this.groups.pop();for(a.parent&&a.parent.remove(a);0<a.group.emitters.length;)a.group.removeEmitter(a.emitters[0]);a.group.dispose()}else{a=a.group.sheepfxID;var b=this.groups[a];this.groups[a]=this.groups[this.groups.length-1];this.groups[a].sheepfxID=a;this.groups.pop();for(b.mesh.parent&&b.mesh.parent.remove(b.mesh);0<b.emitters.length;)b.removeEmitter(b.emitters[0]);
b.dispose()}};SheepFX.prototype.removeAll=function(){for(;0<this.groups.length;)this.remove(this.groups[0].mesh)};SheepFX.prototype.update=function(a){for(var b=0;b<this.groups.length;b++)this.groups[b].tick(a)};SheepFX.prototype.setParticleSize=function(a){this.screenScale=.2*a;for(a=0;a<this.groups.length;a++)this.groups[a].uniforms.scale.value=this.screenScale};
SheepFX.prototype.getJSON=function(a,b,c){var d="undefined"!=typeof XMLHttpRequest?new XMLHttpRequest:new ActiveXObject("Microsoft.XMLHTTP");d.open("get",a,!0);d.onreadystatechange=function(){var a;4==d.readyState&&(a=d.status,200==a?(a=JSON.parse(d.responseText),b&&b(a)):c&&c(a))};d.send()};
THREE.Points.prototype.setEffectScale=function(a){var b=a/this._effectSize;this._effectSize=a;for(a=0;a<this.emitters.length;a++){var c=this.emitters[a];c.position.spread&&(c.position.spread=c.position.spread.multiplyScalar(b));c.position.radious&&(c.position.radious=c.position.radious.multiplyScalar(b));c.velocity.value&&(c.velocity.value=c.velocity.value.multiplyScalar(b));c.velocity.spread&&(c.velocity.spread=c.velocity.spread.multiplyScalar(b));c.acceleration.value&&(c.acceleration.value=c.acceleration.value.multiplyScalar(b));
c.acceleration.spread&&(c.acceleration.spread=c.acceleration.spread.multiplyScalar(b));c.drag.value&&(c.drag.value*=b);c.drag.spread&&(c.drag.spread*=b);c.size.value&&(c.size.value[0]*=b,c.size.value[1]*=b,c.size.value[2]*=b,c.size.value[3]*=b,c.size.value=c.size.value);c.size.spread&&(c.size.spread[0]*=b,c.size.spread[1]*=b,c.size.spread[2]*=b,c.size.spread[3]*=b,c.size.spread=c.size.spread)}};THREE.Points.prototype.getEffectScale=function(){return this._effectSize};
THREE.Points.prototype.reset=function(a){a&&(foce=!0);for(a=0;a<this.group.emitters.length;a++)this.emitters[a].reset(!1),this.emitters[a].alive=!0};
SPE.Emitter.prototype.copy=function(a){a||(a=this.particleCount);var b=[new THREE.Color(this.color.value[0].r,this.color.value[0].g,this.color.value[0].b),new THREE.Color(this.color.value[1].r,this.color.value[1].g,this.color.value[1].b),new THREE.Color(this.color.value[2].r,this.color.value[2].g,this.color.value[2].b),new THREE.Color(this.color.value[3].r,this.color.value[3].g,this.color.value[3].b)],c=[(new THREE.Vector3).copy(this.color.spread[0]),(new THREE.Vector3).copy(this.color.spread[1]),
(new THREE.Vector3).copy(this.color.spread[2]),(new THREE.Vector3).copy(this.color.spread[3])];return new SPE.Emitter({particleCount:a,type:this.type,duration:this.duration,isStatic:this.isStatic,activeMultiplier:this.activeMultiplier,direction:this.direction,maxAge:{value:this.maxAge.value,spread:this.maxAge.spread},position:{value:(new THREE.Vector3).copy(this.position.value),spread:(new THREE.Vector3).copy(this.position.spread),radius:this.position.radius,radiusScale:(new THREE.Vector3).copy(this.position.radiusScale),
distribution:this.position.distribution,randomise:!1},velocity:{value:(new THREE.Vector3).copy(this.velocity.value),spread:(new THREE.Vector3).copy(this.velocity.spread),distribution:this.velocity.distribution,randomise:!1},acceleration:{value:(new THREE.Vector3).copy(this.acceleration.value),spread:(new THREE.Vector3).copy(this.acceleration.spread),randomise:!1},drag:{value:this.drag.value,spread:this.drag.spread,randomise:!1},wiggle:{value:this.wiggle.value,spread:this.wiggle.spread},rotation:{axis:(new THREE.Vector3).copy(this.rotation.axis),
axisSpread:(new THREE.Vector3).copy(this.rotation.axisSpread),angle:this.rotation.angle,angleSpread:this.rotation.angleSpread,static:this.rotation.static,center:(new THREE.Vector3).copy(this.rotation.center),randomise:!1},color:{value:b,spread:c,randomise:!1},opacity:{value:[this.opacity.value[0],this.opacity.value[1],this.opacity.value[2],this.opacity.value[3]],spread:[this.opacity.spread[0],this.opacity.spread[1],this.opacity.spread[2],this.opacity.spread[3]],randomise:!1},size:{value:[this.size.value[0],
this.size.value[1],this.size.value[2],this.size.value[3]],spread:[this.size.spread[0],this.size.spread[1],this.size.spread[2],this.size.spread[3]],randomise:!1},angle:{value:[this.angle.value[0],this.angle.value[1],this.angle.value[2],this.angle.value[3]],spread:[this.angle.spread[0],this.angle.spread[1],this.angle.spread[2],this.angle.spread[3]],randomise:!1}})};SPE.Emitter.prototype.setPositionLocal=function(a,b,c){this.position.value=this.position.value.set(a,b,c)};
SPE.Emitter.prototype.setPositionLocalX=function(a){this.position.value.x=a;this.position.value=this.position.value};SPE.Emitter.prototype.setPositionLocalY=function(a){this.position.value.y=a;this.position.value=this.position.value};SPE.Emitter.prototype.setPositionLocalZ=function(a){this.position.value.z=a;this.position.value=this.position.value};SPE.Emitter.prototype.setPositionLocalv3=function(a){this.position.value=this.position.value.set(a.x,a.y,a.z)};
SPE.Emitter.prototype.getPositionLocal=function(){return this.position.value};
