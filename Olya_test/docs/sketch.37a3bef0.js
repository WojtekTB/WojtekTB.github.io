parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"nyCU":[function(require,module,exports) {
var a,s,n,e,o,g,t,d,r,c=1200,l=900;function p(){a=loadImage("../assets/gold.png"),s=loadImage("../assets/metal.png"),n=loadImage("../assets/glass.png"),g=loadImage("../assets/background.jpg"),o=loadImage("../assets/spaceship.png"),t=.4*c,d=.7*l}function u(){createCanvas(.9*c,.9*l),background(g),r=new Ship(o,t,d)}function m(){clear(),background(g),r.draw()}function i(a,s){return Math.floor(Math.random()*(s-a+1))+a}
},{}]},{},["nyCU"], null)
//# sourceMappingURL=https://olgahwang.github.io/InsideBody_Game/sketch.37a3bef0.js.map