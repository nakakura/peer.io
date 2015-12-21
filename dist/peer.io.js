var PeerIo;!function(t){var e=function(){function e(){}return e.prototype.state=function(){return t.PeerJsStateEnum.initial},e.prototype.network=function(e,n){n&&e.setStateObject(new t.OnlineState)},e.prototype.peer=function(t,e){},e}();t.OfflineState=e}(PeerIo||(PeerIo={}));var PeerIo;!function(t){var e=function(){function e(){}return e.prototype.state=function(){return t.PeerJsStateEnum.online},e.prototype.network=function(e,n){n||e.setStateObject(new t.OfflineState)},e.prototype.peer=function(e,n){n&&e.setStateObject(new t.ConnectedState)},e}();t.OnlineState=e}(PeerIo||(PeerIo={}));var PeerIo;!function(t){var e=function(){function e(){}return e.prototype.state=function(){return t.PeerJsStateEnum.connected},e.prototype.network=function(e,n){n||e.setStateObject(new t.WaitClosingState)},e.prototype.peer=function(e,n){n||e.setStateObject(new t.OnlineState)},e}();t.ConnectedState=e}(PeerIo||(PeerIo={}));var PeerIo;!function(t){var e=function(){function e(){}return e.prototype.state=function(){return t.PeerJsStateEnum.wait_closing},e.prototype.network=function(e,n){n&&e.setStateObject(new t.ConnectedState)},e.prototype.peer=function(e,n){n||e.setStateObject(new t.OfflineState)},e}();t.WaitClosingState=e}(PeerIo||(PeerIo={}));var __extends=this&&this.__extends||function(t,e){function n(){this.constructor=t}for(var o in e)e.hasOwnProperty(o)&&(t[o]=e[o]);t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)},PeerIo;!function(t){!function(t){t[t.initial=1]="initial",t[t.online=2]="online",t[t.connected=3]="connected",t[t.wait_closing=4]="wait_closing"}(t.PeerJsStateEnum||(t.PeerJsStateEnum={}));var e=(t.PeerJsStateEnum,function(e){function n(){e.call(this),this._ON_STATE_CHANGED="onStateCahnged",this._state=new t.OfflineState}return __extends(n,e),n.prototype.state=function(){return this._state.state()},n.prototype.stateObject=function(){return this._state},n.prototype.setStateObject=function(t){this._state=t,this.emit(this._ON_STATE_CHANGED,t.state())},n.prototype.onStateChanged=function(t){this.on(this._ON_STATE_CHANGED,t)},n}(EventEmitter2));t.PeerJsStateManager=e}(PeerIo||(PeerIo={}));var __extends=this&&this.__extends||function(t,e){function n(){this.constructor=t}for(var o in e)e.hasOwnProperty(o)&&(t[o]=e[o]);t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)},PeerIo;!function(t){t.OnStartVideo="onStartVideo-in-peer.io.ts",t.OnStopVideo="onStopVideo-in-peer.io.ts",t.OnDataLinkUp="onDataLinkUp",t.OnDataLinkDown="onDataLinkDown",t.OnRecvData="onRecvData",function(t){t[t.video=1]="video",t[t.data=2]="data"}(t.NeighbourTypeEnum||(t.NeighbourTypeEnum={}));var e=t.NeighbourTypeEnum,n=function(t){function e(e){t.call(this),this._peerID=e}return __extends(e,t),e.prototype.key=function(){return"this must not called"},e.prototype.active=function(){return!1},e.prototype.connected=function(){return!1},e.prototype.type=function(){return null},e.prototype.peerID=function(){return this._peerID},e.prototype.sources=function(){return[]},e.prototype.setChannel=function(t){},e.prototype.setSource=function(t){},e.prototype.send=function(t){},e.prototype.close=function(){},e}(EventEmitter2);t.NeighbourTemplate=n;var o=function(n){function o(){n.apply(this,arguments),this._dataChannel=null,this._connecting=!1,this._startTime=-1}return __extends(o,n),o.prototype.type=function(){return e.data},o.prototype.key=function(){return this._peerID+"-data"},o.prototype.active=function(){var t=(new Date).getTime();return this.connected()||this._connecting&&t-this._startTime<2e3},o.prototype.connected=function(){return this._dataChannel&&this._dataChannel.open?this._dataChannel.open:!1},o.prototype.setChannel=function(e){var n=this;e&&(this._startTime=(new Date).getTime(),this._dataChannel=e,this._connecting=!0,e.on("open",function(){n._connecting=!1,n.emit(t.OnDataLinkUp)}),e.on("close",function(){n._connecting=!1,n._dataChannel=null,n.emit(t.OnDataLinkDown)}),e.on("error",function(t){n._connecting=!1,n._dataChannel=null}),e.on("data",function(e){n.emit(t.OnRecvData,e)}))},o.prototype.send=function(t){this.connected()&&this._dataChannel&&this._dataChannel.send(t)},o.prototype.close=function(){this._connecting=!1,this._dataChannel=null},o}(n);t.DataNeighbour=o;var r=function(n){function o(){n.apply(this,arguments),this._mediaConnection=null,this._sources=[],this._connecting=!1,this._startTime=-1}return __extends(o,n),o.prototype.type=function(){return e.video},o.prototype.key=function(){return this._peerID+"-video"},o.prototype.active=function(){var t=(new Date).getTime();return this.connected()||this._connecting&&t-this._startTime<2e3},o.prototype.connected=function(){return this._mediaConnection&&this._mediaConnection.open?this._mediaConnection.open:!1},o.prototype.sources=function(){return this._sources},o.prototype.setChannel=function(e){var n=this;e&&(this._connecting=!0,this._startTime=(new Date).getTime(),this._mediaConnection=e,e.on("stream",function(e){n._connecting=!1,n.emit(t.OnStartVideo,e)}),e.on("close",function(){n._connecting=!1,n._mediaConnection=null,n.emit(t.OnStopVideo)}),e.on("error",function(t){n._connecting=!1,n._mediaConnection=null}))},o.prototype.setSource=function(t){t instanceof Array?Array.prototype.push.apply(this._sources,t):this._sources.push(t)},o.prototype.close=function(){this._mediaConnection&&this._mediaConnection.close(),this._connecting=!1,this._mediaConnection=null},o}(n);t.VideoNeighbour=r;var i=function(){function t(){}return t.createNeighbour=function(t,n){switch(n){case e.video:return new r(t);case e.data:return new o(t)}},t}();t.NeighbourFactory=i}(PeerIo||(PeerIo={}));var __extends=this&&this.__extends||function(t,e){function n(){this.constructor=t}for(var o in e)e.hasOwnProperty(o)&&(t[o]=e[o]);t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)},PeerIo;!function(t){t.ON_NEED_ESTABLISH_LINK="onNeedEstablishLink-in-targetneighbours.ts",t.ON_NEED_CLOSE_LINK="onNeedCloseLink-in-targetneighbours.ts";var e=function(e){function n(){var t=this;e.call(this),this._neighbours={},this.targetNeighbours=function(){var e=_.filter(t._neighbours,function(t,e){return!t.active()});return e},this.findNeighbour=function(e){return e in t._neighbours?t._neighbours[e]:null},this.connectedNeighbours=function(){var e=_.filter(t._neighbours,function(t,e){return t.connected()});return e}}return __extends(n,e),n.prototype.tryAddNeighbour=function(e){return this.removeNeighbour(e.key()),this._neighbours[e.key()]=e,e.active()||this.emit(t.ON_NEED_ESTABLISH_LINK,e),!0},n.prototype.removeNeighbour=function(t){t in this._neighbours&&(this._neighbours[t].close(),delete this._neighbours[t])},n}(EventEmitter2);t.TargetNeighbours=e}(PeerIo||(PeerIo={}));var __extends=this&&this.__extends||function(t,e){function n(){this.constructor=t}for(var o in e)e.hasOwnProperty(o)&&(t[o]=e[o]);t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)},PeerIo;!function(t){var e=function(e){function n(n){var o=this;e.call(this),this._peer=n,this.ON_LINK_FROM_NEIGHBOUR="onLinkFromNeighbour-in-peerjs_manager.ts",this._neighbourSources={},this._defaultStream=[],this._onOnline=function(t){o._state.stateObject().network(o._state,t)},this._onOpenPeer=function(){o._state.stateObject().peer(o._state,!0)},this._onClosePeer=function(){o._state.stateObject().peer(o._state,!1)},this._onStateChanged=function(e){switch(e){case t.PeerJsStateEnum.initial:break;case t.PeerJsStateEnum.online:o._peer.disconnected||o._state.stateObject().peer(o._state,!0);break;case t.PeerJsStateEnum.connected:setTimeout(o._establishAllPeer,t.Util.waitTime(2e3,5e3));break;case t.PeerJsStateEnum.wait_closing:}},this._establishAllPeer=function(){_.each(o._targetNeighbours(),o.establishLink)},this.establishLink=function(e){switch(e.type()){case t.NeighbourTypeEnum.video:o._tryCall(e);break;case t.NeighbourTypeEnum.data:o._tryConnect(e)}},this._onRecvCall=function(e){var n=e.peer;e.answer(o._defaultStream[0]);var r=o._targetNeighbours();if(r.hasOwnProperty(n)&&r[n].type()===t.NeighbourTypeEnum.video)e.close();else{var i=t.NeighbourFactory.createNeighbour(n,t.NeighbourTypeEnum.video);i.setChannel(e),o.emit(o.ON_LINK_FROM_NEIGHBOUR,i)}},this._onRecvConnect=function(e){var n=e.peer,r=o._targetNeighbours();if(r.hasOwnProperty(n)&&r[n].type()===t.NeighbourTypeEnum.video)e.close();else{var i=t.NeighbourFactory.createNeighbour(n,t.NeighbourTypeEnum.data);i.setChannel(e),o.emit(o.ON_LINK_FROM_NEIGHBOUR,i)}},this._state=new t.PeerJsStateManager,this._state.onStateChanged(this._onStateChanged),this._checkNetworkStatus(),this._wrapPeerEvent()}return __extends(n,e),n.prototype._checkNetworkStatus=function(){var t=this;Offline.options={checks:{xhr:{url:"https://skyway.io/dist/0.3/peer.min.js"}}},Offline.on("up",function(){t._state.stateObject().network(t._state,!0)}),Offline.on("down",function(){t._state.stateObject().network(t._state,!1)}),"up"===Offline.state&&this._state.stateObject().network(this._state,!0),Offline.check()},n.prototype.addDefaultStream=function(t){t instanceof Array?Array.prototype.push.apply(this._defaultStream,t):this._defaultStream.push(t)},n.prototype.clearDefaultStream=function(){this._defaultStream=[]},n.prototype.addNeighboursSource=function(t,e){t in this._neighbourSources||(this._neighbourSources[t]=e)},n.prototype.removeNeighboursSource=function(t){t in this._neighbourSources&&delete this._neighbourSources[t]},n.prototype._wrapPeerEvent=function(){this._peer.on("open",this._onOpenPeer),this._peer.on("error",function(t){console.log(t)}),this._peer.on("disconnected",this._onClosePeer),this._peer.on("connection",this._onRecvConnect),this._peer.on("call",this._onRecvCall)},n.prototype._tryCall=function(t){var e=t.sources(),n=this._peer.call(t.peerID(),e[0]);t.setChannel(n)},n.prototype._tryConnect=function(t){var e=this._peer.connect(t.peerID(),{label:"json",serialization:"none",reliable:!1});t.setChannel(e)},n.prototype._targetNeighbours=function(){return _.reduce(this._neighbourSources,function(t,e,n){return Array.prototype.push.apply(t,e())},[])},n}(EventEmitter2);t.PeerJsManager=e}(PeerIo||(PeerIo={}));var PeerIo;!function(t){var e=function(){function t(){}return t.waitTime=function(t,e){return t+Math.random()*(e-t)},t}();t.Util=e}(PeerIo||(PeerIo={}));var __extends=this&&this.__extends||function(t,e){function n(){this.constructor=t}for(var o in e)e.hasOwnProperty(o)&&(t[o]=e[o]);t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)},PeerIo;!function(t){!function(t){t[t.videoLinkUp=1]="videoLinkUp",t[t.recvVideo=2]="recvVideo",t[t.dataLinkUp=3]="dataLinkUp",t[t.recvData=4]="recvData"}(t.EventTypeEnum||(t.EventTypeEnum={}));var e=(t.EventTypeEnum,function(e){function n(n){var o=this;e.call(this),this._onLinkFromNeighbour=function(t){o._targetNeighbours.tryAddNeighbour(t)&&o._addCallbackToNeighbour(t)},this._targetNeighbours=new t.TargetNeighbours,this._peerJsManager=new t.PeerJsManager(n),this._peerJsManager.addNeighboursSource("targetNeighbours",this._targetNeighbours.targetNeighbours),this._peerJsManager.on(this._peerJsManager.ON_LINK_FROM_NEIGHBOUR,this._onLinkFromNeighbour),this._targetNeighbours.on(t.ON_NEED_ESTABLISH_LINK,this._peerJsManager.establishLink)}return __extends(n,e),n.prototype.addDefaultStream=function(t){this._peerJsManager.addDefaultStream(t)},n.prototype.addNeighbour=function(e,n,o){var r=t.NeighbourFactory.createNeighbour(e,n);o&&r.setSource(o),this._targetNeighbours.tryAddNeighbour(r)&&this._addCallbackToNeighbour(r)},n.prototype.removeNeighbour=function(e,n){var o=t.NeighbourFactory.createNeighbour(e,n);this._targetNeighbours.removeNeighbour(o.key())},n.prototype._addCallbackToNeighbour=function(e){var n=this;switch(e.type()){case t.NeighbourTypeEnum.video:e.on(t.OnStartVideo,function(o){n.emit(t.OnStartVideo,e.peerID(),o)}),e.on(t.OnStopVideo,function(){n.emit(t.OnStopVideo,e.peerID())});break;case t.NeighbourTypeEnum.data:e.on(t.OnRecvData,function(o){n.emit(t.OnRecvData,e.peerID(),o)}),e.on(t.OnDataLinkUp,function(){n.emit(t.OnDataLinkUp,e.peerID())}),e.on(t.OnDataLinkDown,function(){n.emit(t.OnDataLinkDown,e.peerID())})}},n.prototype.send=function(t,e){var n=this._targetNeighbours.findNeighbour(t+"-data");n&&n.send(e)},n.prototype.broadcast=function(t){var e=this._targetNeighbours.connectedNeighbours();_.each(e,function(e){e.send(t)})},n}(EventEmitter2));t.PeerIo=e}(PeerIo||(PeerIo={}));