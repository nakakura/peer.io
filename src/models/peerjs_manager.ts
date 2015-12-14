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
/// <reference path="./offline.d.ts" />

module Model{
    export class PeerJsManager extends EventEmitter2{
        private _state: PeerJsStateManager;

        constructor(private _peer: PeerJs.Peer, private _targetNeighbours: TargetNeighbours) {
            super();

            this._state = new PeerJsStateManager();
            this._state.onStateChanged(this._onStateChanged);
            console.log("offlinestate");
            console.log(Offline.state);
            if(Offline.state === 'up'){
                console.log("up state");
                this._state.stateObject().network(this._state, true);
            }

            this._wrapPeerEvent();
        }

        //=============peer event and change state start=========

        private _wrapPeerEvent(){
            this._peer.on("open", this._onOpenPeer);
            this._peer.on('error', (err)=>{ console.log(err); });
            this._peer.on('disconnected', this._onClosePeer);
            this._peer.on('connection', this._onRecvConnect);
            this._peer.on('call', this._onRecvCall);
        }

        public online = (isOnline: boolean)=>{
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
                    console.log("online state====");
                    console.log(this._peer.disconnected);
                    if(!this._peer.disconnected) {
                        this._state.stateObject().peer(this._state, true);
                    }
                    break;
                case PeerJsStateEnum.connected:
                    console.log("connected state====");
                    setTimeout(this._establishPeer, this._waitTime(0, 2000));
                    break;
                case PeerJsStateEnum.wait_closing:
                    break;
                default:
                    break;
            }
        };

        //=============peer event and change state end===========
        //=============establishing p2p link start===============

        private _establishPeer = ()=>{
            console.log("establish peer");
            console.log(this._targetNeighbours.targetNeighbours());
            _.each(this._targetNeighbours.targetNeighbours(), (neighbour: NeighbourIf)=>{
                console.log(neighbour.peerID());
                switch(neighbour.type()){
                    case NeighbourTypeEnum.video:
                        this._tryCall(<VideoNeighbour>neighbour);
                        break;
                    case NeighbourTypeEnum.data:
                        this._tryConnect(<DataNeighbour>neighbour);
                        break;
                }
            });
        };

        private _tryCall(neighbour: VideoNeighbour){
            console.log("tryCall");
            var sources = neighbour.sources();
            var mediaConnection = this._peer.call(neighbour.peerID(), sources[0]);
            console.log((<any>mediaConnection).peerConnection);
            /*
            _(sources).tail().each((source: MediaStream)=>{
            }).value();
            */

            neighbour.setChannel(mediaConnection);
        }

        private _onRecvCall = (mediaStream: PeerJs.MediaConnection)=> {
            console.log("onrecvcall====");
            var neighborID = mediaStream.peer;
            mediaStream.answer((<any>window).localStream);

            var neighbor: NeighbourIf = _.find(this._targetNeighbours.targetNeighbours(), (neighbor: NeighbourIf)=> {
                return neighbor.peerID() === neighborID && neighbor.type() === NeighbourTypeEnum.video;
            });

            if (!neighbor) {
                console.log("none");
                neighbor = NeighbourFactory.createNeighbour(neighborID, NeighbourTypeEnum.video);
                this._targetNeighbours.addNeighbour(neighbor);
                neighbor.setChannel(mediaStream);
            } else {
                console.log("ある");
                mediaStream.close();
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
            console.log("recvconnect==============");
            var neighborID = dataconnection.peer;

            var neighbour: NeighbourIf = _.find(this._targetNeighbours.targetNeighbours(), (neighbor: NeighbourIf)=> {
                return neighbor.peerID() === neighborID && neighbor.type() === NeighbourTypeEnum.data;
            });

            if (!neighbour) {
                neighbour = NeighbourFactory.createNeighbour(neighborID, NeighbourTypeEnum.data);
                this._targetNeighbours.addNeighbour(neighbour);
                neighbour.setChannel(dataconnection);
            } else{
                dataconnection.close();
            }
        };

        //=============establishing p2p link end=================

        private _waitTime(min: number, max: number): number{
            return min + Math.random() * (max - min);
        }
    }
}
