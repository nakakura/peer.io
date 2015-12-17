//PeerJSをラップしてP2Pを確立するクラス
//1. TargetNeighboursをobserveして、必要であれば接続・再接続する
//2. 他のPeerからの接続を待ち受け、接続されたらNeighbourを生成し、TargetNeighboursに格納する
//3. Peerサーバへの接続が切れたら再接続する
//   その際Neighbourへの接続も切れていたらそちらも再接続する

/// <reference path="../typings/tsd.d.ts" />
/// <reference path="./neighbour.ts" />
/// <reference path="./target_neighbours.ts" />
/// <reference path="states/peerjs_state.ts" />
/// <reference path="states/connected_state.ts" />
/// <reference path="./util.ts" />

module PeerIo{
    type NeighbourSourceContainer = {[key: string]: NeighboursSource};

    export class PeerJsManager extends EventEmitter2{
        public ON_LINK_FROM_NEIGHBOUR = "onLinkFromNeighbour-in-peerjs_manager.ts";
        private _state: PeerJsStateManager;
        private _neighbourSources: NeighbourSourceContainer = {};
        private _defaultStream: MediaStream[] = [];

        constructor(private _peer: PeerJs.Peer) {
            super();

            this._state = new PeerJsStateManager();
            this._state.onStateChanged(this._onStateChanged);

            this._checkNetworkStatus();
            this._wrapPeerEvent();
        }

        private _checkNetworkStatus(){
            (<any>Offline).options = { checks: { xhr: { url: 'https://skyway.io/dist/0.3/peer.min.js' } } };

            Offline.on('up', ()=>{
                this._state.stateObject().network(this._state, true);
            });

            Offline.on('down', ()=>{
                this._state.stateObject().network(this._state, false);
            });

            if(Offline.state === 'up'){
                this._state.stateObject().network(this._state, true);
            }

            Offline.check();
        }

        addDefaultStream(streams: MediaStream | MediaStream[]){
            if(streams instanceof Array) Array.prototype.push.apply(this._defaultStream, streams);
            else this._defaultStream.push(<MediaStream>streams);
        }

        clearDefaultStream(){
            this._defaultStream = [];
        }

        addNeighboursSource(sourceId: string, source: NeighboursSource){
            if(sourceId in this._neighbourSources) return;
            this._neighbourSources[sourceId] = source;
        }

        removeNeighboursSource(sourceId: string){
            if(!(sourceId in this._neighbourSources)) return;
            delete this._neighbourSources[sourceId];
        }

        //=============peer event and change state start=========

        private _wrapPeerEvent(){
            this._peer.on("open", this._onOpenPeer);
            this._peer.on('error', (err)=>{ console.log(err); });
            this._peer.on('disconnected', this._onClosePeer);
            this._peer.on('connection', this._onRecvConnect);
            this._peer.on('call', this._onRecvCall);
        }

        private _onOnline = (isOnline: boolean)=>{
            this._state.stateObject().network(this._state, isOnline);
        };

        private _onOpenPeer = ()=>{
            this._state.stateObject().peer(this._state, true);
        };

        private _onClosePeer = ()=>{
            this._state.stateObject().peer(this._state, false);
        };

        private _onStateChanged = (state: PeerJsStateEnum)=>{
            switch (state){
                case PeerJsStateEnum.initial:
                    break;
                case PeerJsStateEnum.online:
                    if(!this._peer.disconnected) {
                        this._state.stateObject().peer(this._state, true);
                    }
                    break;
                case PeerJsStateEnum.connected:
                    setTimeout(this._establishAllPeer, Util.waitTime(2000, 5000));
                    break;
                case PeerJsStateEnum.wait_closing:
                    break;
                default:
                    break;
            }
        };

        //=============peer event and change state end===========
        //=============establishing p2p link start===============

        private _establishAllPeer = ()=>{
            _.each(this._targetNeighbours(), this.establishLink);
        };

        establishLink = (neighbour: NeighbourTemplate)=>{
            switch(neighbour.type()){
                case NeighbourTypeEnum.video:
                    this._tryCall(<VideoNeighbour>neighbour);
                    break;
                case NeighbourTypeEnum.data:
                    this._tryConnect(<DataNeighbour>neighbour);
                    break;
            }
        };

        private _tryCall(neighbour: VideoNeighbour){
            var sources = neighbour.sources();
            var mediaConnection = this._peer.call(neighbour.peerID(), sources[0]);
            neighbour.setChannel(mediaConnection);
        }

        private _onRecvCall = (mediaConnection: PeerJs.MediaConnection)=> {
            var neighbourID = mediaConnection.peer;
            mediaConnection.answer(this._defaultStream[0]);

            var targets = this._targetNeighbours();

            if(targets.hasOwnProperty(neighbourID) && targets[neighbourID].type() === NeighbourTypeEnum.video){
                mediaConnection.close();
            } else{
                var neighbour = NeighbourFactory.createNeighbour(neighbourID, NeighbourTypeEnum.video);
                neighbour.setChannel(mediaConnection);
                this.emit(this.ON_LINK_FROM_NEIGHBOUR, neighbour);
            }
        };

        private _tryConnect(neighbour: DataNeighbour){
            var dataChannel = this._peer.connect(neighbour.peerID(), <any>{
                label: 'json',
                serialization: 'none',
                reliable: false
            });

            neighbour.setChannel(dataChannel);
        }

        private _onRecvConnect = (dataconnection: PeerJs.DataConnection)=> {
            var neighbourID = dataconnection.peer;
            var targets = this._targetNeighbours();

            if(targets.hasOwnProperty(neighbourID) && targets[neighbourID].type() === NeighbourTypeEnum.video){
                dataconnection.close();
            } else{
                var neighbour = NeighbourFactory.createNeighbour(neighbourID, NeighbourTypeEnum.data);
                neighbour.setChannel(dataconnection);
                this.emit(this.ON_LINK_FROM_NEIGHBOUR, neighbour);
            }
        };

        //=============establishing p2p link end=================
        //=============util start================================

        private _targetNeighbours(): NeighboursHash{
            return _.reduce(this._neighbourSources, (container: NeighboursArray, val: NeighboursSource, key: string)=>{
                return Array.prototype.push.apply(container, val());
            }, []);
        }
    }
}
