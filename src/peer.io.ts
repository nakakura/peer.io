// Main Controller

/// <reference path="typings/tsd.d.ts" />
/// <reference path="models/states/peerjs_state.ts" />
/// <reference path="models/states/offline_state.ts" />
/// <reference path="models/states/wait_closing_state.ts" />
/// <reference path="models/neighbour.ts" />
/// <reference path="models/target_neighbours.ts" />
/// <reference path="models/peerjs_manager.ts" />

module PeerIo{


    export enum EventTypeEnum{
        videoLinkUp = 1,
        recvVideo = 2,
        dataLinkUp = 3,
        recvData = 4
    }

    type DataListener = (peerId: string, message: string)=>void;
    type MediaListener = (peerId: string, stream: MediaStream)=>void;

    export class PeerIo extends EventEmitter2{
        private _peerJsManager: PeerJsManager;
        private _targetNeighbours: TargetNeighbours;

        //================= setup ==================
        constructor(peerJs: PeerJs.Peer){
            super();
            this._targetNeighbours = new TargetNeighbours();
            this._peerJsManager = new PeerJsManager(peerJs);
            this._peerJsManager.addNeighboursSource("targetNeighbours", this._targetNeighbours.targetNeighbours);
            this._peerJsManager.on(this._peerJsManager.ON_LINK_FROM_NEIGHBOUR, this._onLinkFromNeighbour);
            this._targetNeighbours.on(ON_NEED_ESTABLISH_LINK, this._peerJsManager.establishLink);
        }

        addDefaultStream(mediaStream: MediaStream | MediaStream[]){
            this._peerJsManager.addDefaultStream(mediaStream);
        }

        addNeighbour(peerId: string, type: NeighbourTypeEnum, stream?: MediaStream | MediaStream[]){
            var neighbour = NeighbourFactory.createNeighbour(peerId, type);
            if(stream) neighbour.setSource(stream);
            if(this._targetNeighbours.tryAddNeighbour(neighbour)){
                this._addCallbackToNeighbour(neighbour);
            }
        }
        //================= setup ==================

        private _onLinkFromNeighbour = (neighbour: NeighbourTemplate)=>{
            if(this._targetNeighbours.tryAddNeighbour(neighbour)){
                this._addCallbackToNeighbour(neighbour);
            }
        };

        private _addCallbackToNeighbour(neighbour: NeighbourTemplate){
            switch(neighbour.type()){
                case NeighbourTypeEnum.video:
                    neighbour.on(OnStartVideo, (stream)=>{ this.emit(OnStartVideo, neighbour.peerID(), stream); });
                    neighbour.on(OnStopVideo, ()=>{ this.emit(OnStopVideo, neighbour.peerID()); });
                    break;
                case NeighbourTypeEnum.data:
                    neighbour.on(OnRecvData, (stream)=>{ this.emit(OnRecvData, neighbour.peerID(), stream); });
                    neighbour.on(OnDataLinkUp, ()=>{ this.emit(OnDataLinkUp, neighbour.peerID()); });
                    neighbour.on(OnDataLinkDown, ()=>{ this.emit(OnDataLinkDown, neighbour.peerID()); });
                    break;
            }
        }

        //================= data channel ===========
        send(peerId: string, message: string){
            var target = this._targetNeighbours.findNeighbour(peerId + "-data");
            if(target) target.send(message);
        }

        broadcast(message: string){
            var neighbours = this._targetNeighbours.connectedNeighbours();
            _.each(neighbours, (neighbour)=>{
                neighbour.send(message);
            });
        }
        //================= data channel ===========
    }
}

