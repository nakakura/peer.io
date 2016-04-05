exports.PeerIo=function(e){function n(o){if(t[o])return t[o].exports;var r=t[o]={exports:{},id:o,loaded:!1};return e[o].call(r.exports,r,r.exports,n),r.loaded=!0,r.exports}var t={};return n.m=e,n.c=t,n.p="dist/npm",n(0)}([function(e,n,t){t(14),e.exports=t(3)},function(e,n){e.exports=require("eventemitter2")},function(e,n,t){"use strict";function o(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}function r(e,n){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!n||"object"!=typeof n&&"function"!=typeof n?e:n}function i(e,n){if("function"!=typeof n&&null!==n)throw new TypeError("Super expression must either be null or a function, not "+typeof n);e.prototype=Object.create(n&&n.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),n&&(Object.setPrototypeOf?Object.setPrototypeOf(e,n):e.__proto__=n)}var u=function(){function e(e,n){for(var t=0;t<n.length;t++){var o=n[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(n,t,o){return t&&e(n.prototype,t),o&&e(n,o),n}}(),a=t(5),c=t(1);!function(e){e[e.initial=1]="initial",e[e.online=2]="online",e[e.connected=3]="connected",e[e.wait_closing=4]="wait_closing"}(n.PeerJsStateEnum||(n.PeerJsStateEnum={}));var s=(n.PeerJsStateEnum,function(e){function n(){o(this,n);var e=r(this,Object.getPrototypeOf(n).call(this));return e._ON_STATE_CHANGED="onStateCahnged",e._state=new a["default"],e}return i(n,e),u(n,[{key:"state",value:function(){return this._state.state()}},{key:"stateObject",value:function(){return this._state}},{key:"setStateObject",value:function(e){this._state=e,this.emit(this._ON_STATE_CHANGED,e.state())}},{key:"onStateChanged",value:function(e){this.on(this._ON_STATE_CHANGED,e)}}]),n}(c.EventEmitter2));n.PeerJsStateManager=s},function(e,n,t){"use strict";function o(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}function r(e,n){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!n||"object"!=typeof n&&"function"!=typeof n?e:n}function i(e,n){if("function"!=typeof n&&null!==n)throw new TypeError("Super expression must either be null or a function, not "+typeof n);e.prototype=Object.create(n&&n.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),n&&(Object.setPrototypeOf?Object.setPrototypeOf(e,n):e.__proto__=n)}var u=function(){function e(e,n){for(var t=0;t<n.length;t++){var o=n[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(n,t,o){return t&&e(n.prototype,t),o&&e(n,o),n}}(),a=t(7),c=t(12),s=t(11),l=t(1),f=t(6);!function(e){e[e.video=1]="video",e[e.data=2]="data"}(n.NeighbourTypeEnum||(n.NeighbourTypeEnum={}));var p=n.NeighbourTypeEnum;n.OnStartVideo="onStartVideo-in-peer.io.ts",n.OnStopVideo="onStopVideo-in-peer.io.ts",n.OnDataLinkUp="onDataLinkUp",n.OnDataLinkDown="onDataLinkDown",n.OnRecvData="onRecvData";var h=function(e){function t(e){o(this,t);var i=r(this,Object.getPrototypeOf(t).call(this));return i.peerJs_=e,i.newDataChannel_=function(e){i.neighbourStore_.addLink(e),i.emit(n.OnDataLinkUp,e.peerID(),e.options()),e.on(e.OnRecvData,function(t){i.emit(n.OnRecvData,e.peerID(),t)}),e.on(e.OnDataLinkDown,function(){i.emit(n.OnStopVideo,e.peerID())})},i.newMediaStream_=function(e,t){i.neighbourStore_.addLink(e),i.emit(n.OnStartVideo,e.peerID(),t),e.on(e.OnStopVideo,function(){i.emit(n.OnStopVideo,e.peerID())})},i.neighbourStore_=new c["default"],i.linkGenerator_=new s["default"](e),i.linkGenerator_.addNeighbourSource("neighbourSource",i.neighbourStore_.neighbours),i.linkGenerator_.on(i.linkGenerator_.OnNewDataChannel,i.newDataChannel_),i.linkGenerator_.on(i.linkGenerator_.OnNewMediaStream,i.newMediaStream_),i.neighbourStore_.on(i.neighbourStore_.NEED_ESTABLISH_LINK,i.linkGenerator_.establishLink),i}return i(t,e),u(t,[{key:"addDefaultStream",value:function(e){this.linkGenerator_.setDefaultStream(e)}},{key:"addVideoNeighbour",value:function(e,n){var t=new a.NeighbourRecord(e,p.video);n&&t.setStream(n),this.neighbourStore_.addRecord(t)}},{key:"addDataNeighbour",value:function(e,n){var t=new a.NeighbourRecord(e,p.data);n&&t.setDataChannelOption(n),this.neighbourStore_.addRecord(t)}},{key:"removeVideoNeighbour",value:function(e){this.neighbourStore_.removeRecord(new a.NeighbourRecord(e,p.video))}},{key:"removeDataNeighbour",value:function(e){this.neighbourStore_.removeRecord(new a.NeighbourRecord(e,p.data))}},{key:"send",value:function(e,n){var t=this.neighbourStore_.findLink(e+"-data");t&&t.send(n)}},{key:"broadcast",value:function(e){var n=this.neighbourStore_.links();f.each(n,function(n){n.send(e)})}}]),t}(l.EventEmitter2);n.PeerIo=h},function(e,n,t){"use strict";function o(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}var r=function(){function e(e,n){for(var t=0;t<n.length;t++){var o=n[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(n,t,o){return t&&e(n.prototype,t),o&&e(n,o),n}}(),i=t(3),u=function(){function e(){o(this,e)}return r(e,null,[{key:"waitTime",value:function(e,n){return e+Math.random()*(n-e)}},{key:"key",value:function(e,n){switch(n){case i.NeighbourTypeEnum.video:return e+"-video";case i.NeighbourTypeEnum.data:return e+"-data"}}},{key:"isDataChannel",value:function(e){return e&&e.hasOwnProperty("reliable")}},{key:"isMediaConnection",value:function(e){return e&&e.hasOwnProperty("localStream")}},{key:"isMediaStream",value:function(e){return e&&"active"in e&&"id"in e}}]),e}();n.Util=u},function(e,n,t){"use strict";function o(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}var r=function(){function e(e,n){for(var t=0;t<n.length;t++){var o=n[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(n,t,o){return t&&e(n.prototype,t),o&&e(n,o),n}}(),i=t(2),u=t(9),a=function(){function e(){o(this,e)}return r(e,[{key:"state",value:function(){return i.PeerJsStateEnum.initial}},{key:"network",value:function(e,n){n&&e.setStateObject(new u["default"])}},{key:"peer",value:function(e,n){}}]),e}();Object.defineProperty(n,"__esModule",{value:!0}),n["default"]=a},function(e,n){e.exports=require("lodash")},function(e,n,t){"use strict";function o(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}function r(e,n){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!n||"object"!=typeof n&&"function"!=typeof n?e:n}function i(e,n){if("function"!=typeof n&&null!==n)throw new TypeError("Super expression must either be null or a function, not "+typeof n);e.prototype=Object.create(n&&n.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),n&&(Object.setPrototypeOf?Object.setPrototypeOf(e,n):e.__proto__=n)}var u=function(){function e(e,n){for(var t=0;t<n.length;t++){var o=n[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(n,t,o){return t&&e(n.prototype,t),o&&e(n,o),n}}(),a=t(4),c=t(1),s=function(e){function n(e,t){o(this,n);var i=r(this,Object.getPrototypeOf(n).call(this));return i.peerId_=e,i.type_=t,i.sources_=[],i.option_={label:"json",serialization:"none",reliable:!1},i.isEstablished=function(){return!1},i.addLink=function(e){throw"this method should be overwrite."},console.log("create neighbour record "+e+" type "+t),i}return i(n,e),u(n,[{key:"type",value:function(){return this.type_}},{key:"peerID",value:function(){return this.peerId_}},{key:"streams",value:function(){return this.sources_}},{key:"setStream",value:function(e){console.log("setstream"),e instanceof Array?(console.log("array"),console.log(e[0].getVideoTracks()),Array.prototype.push.apply(this.sources_,e)):a.Util.isMediaStream(e)&&(console.log("stream"),console.log(e.getVideoTracks()),this.sources_.push(e))}},{key:"dataChannelOption",value:function(){return this.option_}},{key:"setDataChannelOption",value:function(e){this.option_=e}},{key:"key",value:function(){return a.Util.key(this.peerId_,this.type_)}}]),n}(c.EventEmitter2);n.NeighbourRecord=s},function(e,n,t){"use strict";function o(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}var r=function(){function e(e,n){for(var t=0;t<n.length;t++){var o=n[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(n,t,o){return t&&e(n.prototype,t),o&&e(n,o),n}}(),i=t(2),u=t(9),a=t(13),c=function(){function e(){o(this,e)}return r(e,[{key:"state",value:function(){return i.PeerJsStateEnum.connected}},{key:"network",value:function(e,n){n||e.setStateObject(new a["default"])}},{key:"peer",value:function(e,n){n||e.setStateObject(new u["default"])}}]),e}();Object.defineProperty(n,"__esModule",{value:!0}),n["default"]=c},function(e,n,t){"use strict";function o(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}var r=function(){function e(e,n){for(var t=0;t<n.length;t++){var o=n[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(n,t,o){return t&&e(n.prototype,t),o&&e(n,o),n}}(),i=t(2),u=t(5),a=t(8),c=function(){function e(){o(this,e)}return r(e,[{key:"state",value:function(){return i.PeerJsStateEnum.online}},{key:"network",value:function(e,n){n||e.setStateObject(new u["default"])}},{key:"peer",value:function(e,n){n&&e.setStateObject(new a["default"])}}]),e}();Object.defineProperty(n,"__esModule",{value:!0}),n["default"]=c},function(e,n,t){"use strict";function o(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}function r(e,n){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!n||"object"!=typeof n&&"function"!=typeof n?e:n}function i(e,n){if("function"!=typeof n&&null!==n)throw new TypeError("Super expression must either be null or a function, not "+typeof n);e.prototype=Object.create(n&&n.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),n&&(Object.setPrototypeOf?Object.setPrototypeOf(e,n):e.__proto__=n)}var u=function(){function e(e,n){for(var t=0;t<n.length;t++){var o=n[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(n,t,o){return t&&e(n.prototype,t),o&&e(n,o),n}}(),a=t(4),c=t(3),s=t(1),l=function(e){function n(e,t){o(this,n);var i=r(this,Object.getPrototypeOf(n).call(this));return i.peerID_=e,i.link_=t,i.OnStopVideo="onStopVideo-in-peer.io.ts",i.OnDataLinkDown="onDataLinkDown-in-link_component.ts",i.OnRecvData="onRecvData-in-link_component.ts",i}return i(n,e),u(n,[{key:"type",value:function(){return null}},{key:"peerID",value:function(){return this.peerID_}},{key:"key",value:function(){return a.Util.key(this.peerID_,this.type())}},{key:"isEstablished",value:function(){return!1}},{key:"send",value:function(e){}},{key:"close",value:function(){}}]),n}(s.EventEmitter2);n.LinkComponentTemplate=l;var f=function(e){function n(e,t){o(this,n);var i=r(this,Object.getPrototypeOf(n).call(this,e,t));return i.peerID_=e,i.link_=t,t.on("close",function(){i.link_=null,i.emit(i.OnDataLinkDown)}),t.on("error",function(e){i.link_=null}),t.on("data",function(e){i.emit(i.OnRecvData,e)}),i}return i(n,e),u(n,[{key:"type",value:function(){return c.NeighbourTypeEnum.data}},{key:"isEstablished",value:function(){return this.link_&&this.link_.open?this.link_.open:!1}},{key:"send",value:function(e){this.isEstablished()&&this.link_&&this.link_.send(e)}},{key:"close",value:function(){this.link_&&this.link_.close(),this.link_=null}},{key:"options",value:function(){return{metadata:this.link_.metadata,serialization:this.link_.serialization,reliable:this.link_.reliable}}}]),n}(l);n.DataLinkComponent=f;var p=function(e){function n(e,t){o(this,n);var i=r(this,Object.getPrototypeOf(n).call(this,e,t));return i.peerID_=e,i.link_=t,i._sources=[],t.on("close",function(){i.link_=null,i.emit(i.OnStopVideo)}),t.on("error",function(e){i.link_=null}),i}return i(n,e),u(n,[{key:"type",value:function(){return c.NeighbourTypeEnum.video}},{key:"isEstablished",value:function(){return this.link_&&this.link_.open?this.link_.open:!1}},{key:"sources",value:function(){return this._sources}},{key:"setSource",value:function(e){e instanceof Array?Array.prototype.push.apply(this._sources,e):this._sources.push(e)}},{key:"close",value:function(){this.link_&&this.link_.close(),this.link_=null}}]),n}(l);n.VideoLinkComponent=p;var h=function(){function e(){o(this,e)}return u(e,null,[{key:"createLinkComponent",value:function(e,n){return a.Util.isDataChannel(n)?new f(e,n):a.Util.isMediaConnection(n)?new p(e,n):null}}]),e}();n.LinkComponentFactory=h},function(e,n,t){"use strict";function o(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}function r(e,n){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!n||"object"!=typeof n&&"function"!=typeof n?e:n}function i(e,n){if("function"!=typeof n&&null!==n)throw new TypeError("Super expression must either be null or a function, not "+typeof n);e.prototype=Object.create(n&&n.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),n&&(Object.setPrototypeOf?Object.setPrototypeOf(e,n):e.__proto__=n)}var u=function(){function e(e,n){for(var t=0;t<n.length;t++){var o=n[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(n,t,o){return t&&e(n.prototype,t),o&&e(n,o),n}}(),a=t(10),c=t(2),s=t(4),l=t(3),f=t(1),p=t(6),h=function(e){function n(e){o(this,n);var t=r(this,Object.getPrototypeOf(n).call(this));return t.peer_=e,t.OnNewMediaStream="on-new-mediastream-in-link_generator.ts",t.OnNewDataChannel="on-new-datachannel-in-link_generator.ts",t.NeighbourSourceHash_={},t.onStateChanged_=function(e){switch(e){case c.PeerJsStateEnum.initial:break;case c.PeerJsStateEnum.online:t.peer_.disconnected||t.state_.stateObject().peer(t.state_,!0);break;case c.PeerJsStateEnum.connected:setTimeout(t._establishAllPeer,s.Util.waitTime(2e3,5e3));break;case c.PeerJsStateEnum.wait_closing:}},t.establishLink=function(e){switch(e.type()){case l.NeighbourTypeEnum.video:t.tryCall_(e);break;case l.NeighbourTypeEnum.data:t.tryConnect_(e)}},t._establishAllPeer=function(){p.each(t.targetNeighbours_(),t.establishLink)},t.onRecvCall_=function(e){var n=e.peer,o=t.findNeighbour_(s.Util.key(n,l.NeighbourTypeEnum.video)),r=t.defaultStream_;if(o){var i=o.streams();i&&i.length>0&&(r=i[0])}e.answer(r),e.on("stream",function(o){var r=a.LinkComponentFactory.createLinkComponent(n,e);t.emit(t.OnNewMediaStream,r,o)})},t.onRecvConnect_=function(e){var n=e.peer;e.on("open",function(){var o=a.LinkComponentFactory.createLinkComponent(n,e);t.emit(t.OnNewDataChannel,o)})},t.state_=new c.PeerJsStateManager,t.state_.onStateChanged(t.onStateChanged_),t.checkNetworkStatus_(),t.wrapPeerEvent_(),t}return i(n,e),u(n,[{key:"setDefaultStream",value:function(e){this.defaultStream_=e}},{key:"addNeighbourSource",value:function(e,n){this.NeighbourSourceHash_[e]=n}},{key:"removeNeighbourSource",value:function(e){e in this.NeighbourSourceHash_&&delete this.NeighbourSourceHash_[e]}},{key:"checkNetworkStatus_",value:function(){var e=this;Offline.options={checks:{xhr:{url:"https://skyway.io/dist/0.3/peer.min.js"}}},Offline.on("up",function(){e.state_.stateObject().network(e.state_,!0)}),Offline.on("down",function(){e.state_.stateObject().network(e.state_,!1)}),"up"===Offline.state&&this.state_.stateObject().network(this.state_,!0),Offline.check()}},{key:"wrapPeerEvent_",value:function(){var e=this;this.peer_.on("open",function(){e.state_.stateObject().peer(e.state_,!0)}),this.peer_.on("error",function(e){console.log(e)}),this.peer_.on("disconnected",function(){e.state_.stateObject().peer(e.state_,!1)}),this.peer_.on("connection",this.onRecvConnect_),this.peer_.on("call",this.onRecvCall_)}},{key:"findNeighbour_",value:function(e){var n=p.find(this.NeighbourSourceHash_,function(n){return e in n()});return n?n()[e]:null}},{key:"neighbourArray_",value:function(){return p.reduce(this.NeighbourSourceHash_,function(e,n,t){return p.reduce(n(),function(e,n,t){return e.concat(n)},e)},[])}},{key:"targetNeighbours_",value:function(){var e=this.neighbourArray_();return p.filter(e,function(e){return!e.isEstablished()})}},{key:"tryCall_",value:function(e){var n=this,t=e.streams(),o=this.defaultStream_;t&&t.length>0&&(o=t[0]);var r=this.peer_.call(e.peerID(),o);r&&r.on("stream",function(t){var o=a.LinkComponentFactory.createLinkComponent(e.peerID(),r);n.emit(n.OnNewMediaStream,o,t)})}},{key:"tryConnect_",value:function(e){var n=this,t=this.peer_.connect(e.peerID(),e.dataChannelOption());t&&t.on("open",function(){var o=a.LinkComponentFactory.createLinkComponent(e.peerID(),t);n.emit(n.OnNewDataChannel,o)})}}]),n}(f.EventEmitter2);Object.defineProperty(n,"__esModule",{value:!0}),n["default"]=h},function(e,n,t){"use strict";function o(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}function r(e,n){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!n||"object"!=typeof n&&"function"!=typeof n?e:n}function i(e,n){if("function"!=typeof n&&null!==n)throw new TypeError("Super expression must either be null or a function, not "+typeof n);e.prototype=Object.create(n&&n.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),n&&(Object.setPrototypeOf?Object.setPrototypeOf(e,n):e.__proto__=n)}var u=function(){function e(e,n){for(var t=0;t<n.length;t++){var o=n[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(n,t,o){return t&&e(n.prototype,t),o&&e(n,o),n}}(),a=t(7),c=t(1),s=t(6),l=function(e){function n(){o(this,n);var e=r(this,Object.getPrototypeOf(n).call(this));return e.NEED_ESTABLISH_LINK="need-establish-link-in-neighbourstore",e.recordsHash_={},e.linksHash_={},e.neighbours=function(){return e.recordsHash_},e}return i(n,e),u(n,[{key:"addRecord_",value:function(e){e.isEstablished=this.isEstablished_.bind(this,e.key()),e.addLink=this.addLink_.bind(this,e.key()),this.recordsHash_[e.key()]=e}},{key:"addRecord",value:function(e){e.key()in this.recordsHash_?this.recordsHash_[e.key()].isEstablished()||this.emit(this.NEED_ESTABLISH_LINK,this.recordsHash_[e.key()]):(this.addRecord_(e),this.emit(this.NEED_ESTABLISH_LINK,e))}},{key:"removeRecord",value:function(e){e.key()in this.linksHash_&&(this.linksHash_[e.key()].close(),delete this.linksHash_[e.key()]),e.key()in this.recordsHash_&&delete this.recordsHash_[e.key()]}},{key:"addLink",value:function(e){if(!(e.key()in this.recordsHash_)){var n=new a.NeighbourRecord(e.peerID(),e.type());this.addRecord_(n)}this.linksHash_[e.key()]=e}},{key:"findLink",value:function(e){return this.linksHash_[e]}},{key:"links",value:function(){return s.reduce(this.linksHash_,function(e,n,t){return e.concat(n)},[])}},{key:"addLink_",value:function(e,n){this.isEstablished_(e)&&this.linksHash_[e].close(),this.linksHash_[e]=n}},{key:"isEstablished_",value:function(e){return e in this.linksHash_?this.linksHash_[e].isEstablished():!1}}]),n}(c.EventEmitter2);Object.defineProperty(n,"__esModule",{value:!0}),n["default"]=l},function(e,n,t){"use strict";function o(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}var r=function(){function e(e,n){for(var t=0;t<n.length;t++){var o=n[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(n,t,o){return t&&e(n.prototype,t),o&&e(n,o),n}}(),i=t(2),u=t(5),a=t(8),c=function(){function e(){o(this,e)}return r(e,[{key:"state",value:function(){return i.PeerJsStateEnum.wait_closing}},{key:"network",value:function(e,n){n&&e.setStateObject(new a["default"])}},{key:"peer",value:function(e,n){n||e.setStateObject(new u["default"])}}]),e}();Object.defineProperty(n,"__esModule",{value:!0}),n["default"]=c},function(e,n){"use strict";var t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol?"symbol":typeof e};/*! offline-js 0.7.14 */
(function(){var e,n,o,r,i,u,a;r=function c(e,n){var t,c,o,r;o=[];for(c in n.prototype)try{r=n.prototype[c],null==e[c]&&"function"!=typeof r?o.push(e[c]=r):o.push(void 0)}catch(i){t=i}return o},e={},e.options=window.Offline?window.Offline.options||{}:{},o={checks:{xhr:{url:function(){return"/favicon.ico?_="+(new Date).getTime()},timeout:5e3,type:"HEAD"},image:{url:function(){return"/favicon.ico?_="+(new Date).getTime()}},active:"xhr"},checkOnLoad:!1,interceptRequests:!0,reconnect:!0,deDupBody:!1},i=function s(e,n){var o,r,s,i,u,a;for(o=e,a=n.split("."),r=s=0,i=a.length;i>s&&(u=a[r],o=o[u],"object"==("undefined"==typeof o?"undefined":t(o)));r=++s);return r===a.length-1?o:void 0},e.getOption=function(n){var t,r;return r=null!=(t=i(e.options,n))?t:i(o,n),"function"==typeof r?r():r},"function"==typeof window.addEventListener&&window.addEventListener("online",function(){return setTimeout(e.confirmUp,100)},!1),"function"==typeof window.addEventListener&&window.addEventListener("offline",function(){return e.confirmDown()},!1),e.state="up",e.markUp=function(){return e.trigger("confirmed-up"),"up"!==e.state?(e.state="up",e.trigger("up")):void 0},e.markDown=function(){return e.trigger("confirmed-down"),"down"!==e.state?(e.state="down",e.trigger("down")):void 0},u={},e.on=function(n,t,o){var r,i,a,c,s;if(i=n.split(" "),i.length>1){for(s=[],a=0,c=i.length;c>a;a++)r=i[a],s.push(e.on(r,t,o));return s}return null==u[n]&&(u[n]=[]),u[n].push([o,t])},e.off=function(e,n){var t,o,r,i,a;if(null!=u[e]){if(n){for(r=0,a=[];r<u[e].length;)i=u[e][r],o=i[0],t=i[1],t===n?a.push(u[e].splice(r,1)):a.push(r++);return a}return u[e]=[]}},e.trigger=function(e){var n,t,o,r,i,a,c;if(null!=u[e]){for(i=u[e],c=[],o=0,r=i.length;r>o;o++)a=i[o],n=a[0],t=a[1],c.push(t.call(n));return c}},n=function(e,n,t){var o,r,i,u,a;return a=function(){return e.status&&e.status<12e3?n():t()},null===e.onprogress?(o=e.onerror,e.onerror=function(){return t(),"function"==typeof o?o.apply(null,arguments):void 0},u=e.ontimeout,e.ontimeout=function(){return t(),"function"==typeof u?u.apply(null,arguments):void 0},r=e.onload,e.onload=function(){return a(),"function"==typeof r?r.apply(null,arguments):void 0}):(i=e.onreadystatechange,e.onreadystatechange=function(){return 4===e.readyState?a():0===e.readyState&&t(),"function"==typeof i?i.apply(null,arguments):void 0})},e.checks={},e.checks.xhr=function(){var t,o;o=new XMLHttpRequest,o.offline=!1,o.open(e.getOption("checks.xhr.type"),e.getOption("checks.xhr.url"),!0),null!=o.timeout&&(o.timeout=e.getOption("checks.xhr.timeout")),n(o,e.markUp,e.markDown);try{o.send()}catch(r){t=r,e.markDown()}return o},e.checks.image=function(){var n;return n=document.createElement("img"),n.onerror=e.markDown,n.onload=e.markUp,void(n.src=e.getOption("checks.image.url"))},e.checks.down=e.markDown,e.checks.up=e.markUp,e.check=function(){return e.trigger("checking"),e.checks[e.getOption("checks.active")]()},e.confirmUp=e.confirmDown=e.check,e.onXHR=function(e){var n,t,o;return o=function(n,t){var o;return o=n.open,n.open=function(r,i,u,a,c){return e({type:r,url:i,async:u,flags:t,user:a,password:c,xhr:n}),o.apply(n,arguments)}},t=window.XMLHttpRequest,window.XMLHttpRequest=function(e){var n,r,i;return i=new t(e),o(i,e),r=i.setRequestHeader,i.headers={},i.setRequestHeader=function(e,n){return i.headers[e]=n,r.call(i,e,n)},n=i.overrideMimeType,i.overrideMimeType=function(e){return i.mimeType=e,n.call(i,e)},i},r(window.XMLHttpRequest,t),null!=window.XDomainRequest?(n=window.XDomainRequest,window.XDomainRequest=function(){var e;return e=new n,o(e),e},r(window.XDomainRequest,n)):void 0},a=function(){return e.getOption("interceptRequests")&&e.onXHR(function(t){var o;return o=t.xhr,o.offline!==!1?n(o,e.markUp,e.confirmDown):void 0}),e.getOption("checkOnLoad")?e.check():void 0},setTimeout(a,0),window.Offline=e}).call(void 0),function(){var e,n,t,o,r,i,u,a,c;if(!window.Offline)throw new Error("Offline Reconnect brought in without offline.js");o=Offline.reconnect={},i=null,r=function(){var e;return null!=o.state&&"inactive"!==o.state&&Offline.trigger("reconnect:stopped"),o.state="inactive",o.remaining=o.delay=null!=(e=Offline.getOption("reconnect.initialDelay"))?e:3},n=function s(){var e,s;return e=null!=(s=Offline.getOption("reconnect.delay"))?s:Math.min(Math.ceil(1.5*o.delay),3600),o.remaining=o.delay=e},u=function(){return"connecting"!==o.state?(o.remaining-=1,Offline.trigger("reconnect:tick"),0===o.remaining?a():void 0):void 0},a=function(){return"waiting"===o.state?(Offline.trigger("reconnect:connecting"),o.state="connecting",Offline.check()):void 0},e=function(){return Offline.getOption("reconnect")?(r(),o.state="waiting",Offline.trigger("reconnect:started"),i=setInterval(u,1e3)):void 0},c=function(){return null!=i&&clearInterval(i),r()},t=function(){return Offline.getOption("reconnect")&&"connecting"===o.state?(Offline.trigger("reconnect:failure"),o.state="waiting",n()):void 0},o.tryNow=a,r(),Offline.on("down",e),Offline.on("confirmed-down",t),Offline.on("up",c)}.call(void 0),function(){var e,n,t,o,r,i;if(!window.Offline)throw new Error("Requests module brought in without offline.js");t=[],i=!1,o=function(e){return Offline.getOption("requests")!==!1?(Offline.trigger("requests:capture"),"down"!==Offline.state&&(i=!0),t.push(e)):void 0},r=function u(e){var n,t,o,u,r,i,a,c,s;if(s=e.xhr,i=e.url,r=e.type,a=e.user,o=e.password,n=e.body,Offline.getOption("requests")!==!1){s.abort(),s.open(r,i,!0,a,o),u=s.headers;for(t in u)c=u[t],s.setRequestHeader(t,c);return s.mimeType&&s.overrideMimeType(s.mimeType),s.send(n)}},e=function(){return t=[]},n=function a(){var a,n,o,i,u,c,s;if(Offline.getOption("requests")!==!1){for(Offline.trigger("requests:flush"),c={},n=0,i=t.length;i>n;n++)u=t[n],s=u.url.replace(/(\?|&)_=[0-9]+/,function(e,n){return"?"===n?n:""}),Offline.getOption("deDupBody")?(a=u.body,a="[object Object]"===a.toString()?JSON.stringify(a):a.toString(),c[u.type.toUpperCase()+" - "+s+" - "+a]=u):c[u.type.toUpperCase()+" - "+s]=u;for(o in c)u=c[o],r(u);return e()}},setTimeout(function(){return Offline.getOption("requests")!==!1?(Offline.on("confirmed-up",function(){return i?(i=!1,e()):void 0}),Offline.on("up",n),Offline.on("down",function(){return i=!1}),Offline.onXHR(function(e){var n,t,r,i,u;return u=e.xhr,r=e.async,u.offline!==!1&&(i=function(){return o(e)},t=u.send,u.send=function(n){return e.body=n,t.apply(u,arguments)},r)?null===u.onprogress?(u.addEventListener("error",i,!1),u.addEventListener("timeout",i,!1)):(n=u.onreadystatechange,u.onreadystatechange=function(){return 0===u.readyState?i():4===u.readyState&&(0===u.status||u.status>=12e3)&&i(),"function"==typeof n?n.apply(null,arguments):void 0}):void 0}),Offline.requests={flush:n,clear:e}):void 0},0)}.call(void 0),function(){var e,n,t,o,r;if(!Offline)throw new Error("Offline simulate brought in without offline.js");for(o=["up","down"],n=0,t=o.length;t>n;n++)r=o[n],(document.querySelector("script[data-simulate='"+r+"']")||("undefined"!=typeof localStorage&&null!==localStorage?localStorage.OFFLINE_SIMULATE:void 0)===r)&&(null==Offline.options&&(Offline.options={}),null==(e=Offline.options).checks&&(e.checks={}),Offline.options.checks.active=r)}.call(void 0),function(){var e,n,t,o,r,i,u,a,c,s,l,f,p;if(!window.Offline)throw new Error("Offline UI brought in without offline.js");n='<div class="offline-ui"><div class="offline-ui-content"></div></div>',e='<a href class="offline-ui-retry"></a>',i=function(e){var n;return n=document.createElement("div"),n.innerHTML=e,n.children[0]},u=r=null,o=function(e){return l(e),u.className+=" "+e},l=function(e){return u.className=u.className.replace(new RegExp("(^| )"+e.split(" ").join("|")+"( |$)","gi")," ")},c={},a=function(e,n){return o(e),null!=c[e]&&clearTimeout(c[e]),c[e]=setTimeout(function(){return l(e),delete c[e]},1e3*n)},p=function(e){var n,t,o,r;o={day:86400,hour:3600,minute:60,second:1};for(t in o)if(n=o[t],e>=n)return r=Math.floor(e/n),[r,t];return["now",""]},f=function(){var t,a;return u=i(n),document.body.appendChild(u),null!=Offline.reconnect&&Offline.getOption("reconnect")&&(u.appendChild(i(e)),t=u.querySelector(".offline-ui-retry"),a=function(e){return e.preventDefault(),Offline.reconnect.tryNow()},null!=t.addEventListener?t.addEventListener("click",a,!1):t.attachEvent("click",a)),o("offline-ui-"+Offline.state),r=u.querySelector(".offline-ui-content")},s=function(){return f(),Offline.on("up",function(){return l("offline-ui-down"),o("offline-ui-up"),a("offline-ui-up-2s",2),a("offline-ui-up-5s",5)}),Offline.on("down",function(){return l("offline-ui-up"),o("offline-ui-down"),a("offline-ui-down-2s",2),a("offline-ui-down-5s",5)}),Offline.on("reconnect:connecting",function(){return o("offline-ui-connecting"),l("offline-ui-waiting")}),Offline.on("reconnect:tick",function(){var e,n,t;return o("offline-ui-waiting"),l("offline-ui-connecting"),e=p(Offline.reconnect.remaining),n=e[0],t=e[1],r.setAttribute("data-retry-in-value",n),r.setAttribute("data-retry-in-unit",t)}),Offline.on("reconnect:stopped",function(){return l("offline-ui-connecting offline-ui-waiting"),r.setAttribute("data-retry-in-value",null),r.setAttribute("data-retry-in-unit",null)}),Offline.on("reconnect:failure",function(){return a("offline-ui-reconnect-failed-2s",2),a("offline-ui-reconnect-failed-5s",5)}),Offline.on("reconnect:success",function(){return a("offline-ui-reconnect-succeeded-2s",2),a("offline-ui-reconnect-succeeded-5s",5)})},"complete"===document.readyState?s():null!=document.addEventListener?document.addEventListener("DOMContentLoaded",s,!1):(t=document.onreadystatechange,document.onreadystatechange=function(){return"complete"===document.readyState&&s(),"function"==typeof t?t.apply(null,arguments):void 0})}.call(void 0)}]);
//# sourceMappingURL=peer.io.js.map