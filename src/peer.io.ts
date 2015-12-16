// Main Controller

/// <reference path="typings/tsd.d.ts" />
/// <reference path="models/states/peerjs_state.ts" />
/// <reference path="models/states/offline_state.ts" />
/// <reference path="models/states/wait_closing_state.ts" />
/// <reference path="models/neighbour.ts" />
/// <reference path="models/target_neighbours.ts" />
/// <reference path="models/peerjs_manager.ts" />

module PeerIo{
    export var OnVideoLinkUp = "onVideoLinkUp";
    export var OnVideoLinkDown = "onVideoLinkDown";
    export var OnRecvVideo = "onRecvVideo";
    export var OnDataLinkUp = "onDataLinkUp";
    export var OnDataLinkDown = "onDataLinkDown";
    export var OnRecvData = "onRecvData";

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

        constructor(peerJs: PeerJs.Peer){
            super();
            this._targetNeighbours = new TargetNeighbours();
            this._peerJsManager = new PeerJsManager(peerJs);
            this._peerJsManager.addNeighboursSource("targetNeighbours", this._targetNeighbours.targetNeighbours);
            this._peerJsManager.on(this._peerJsManager.ON_LINK_ESTABLISHED, this._onLinkEstablish);
        }

        addDefaultStream(mediaStream: MediaStream | MediaStream[]){
            this._peerJsManager.addDefaultStream(mediaStream);
        }

        addNeighbour(peerId: string, type: NeighbourTypeEnum, stream?: MediaStream | MediaStream[]){
            var neighbour = NeighbourFactory.createNeighbour(peerId, type);
            if(stream) neighbour.setSource(stream);
            this._targetNeighbours.addNeighbour(neighbour);
        }

        private _onLinkEstablish = (neighbour: NeighbourTemplate)=>{
            switch(neighbour.type()){
                case NeighbourTypeEnum.video:
                    this.emit(OnVideoLinkUp, neighbour.peerID());
                    neighbour.on(OnStream, (stream)=>{ this.emit(OnRecvVideo, neighbour.peerID(), stream); });
                    neighbour.on(OnNeighbourDown, ()=>{ this.emit(OnVideoLinkDown, neighbour.peerID()); });
                    break;
                case NeighbourTypeEnum.data:
                    this.emit(OnDataLinkUp, neighbour.peerID());
                    neighbour.on(OnData, (stream)=>{ this.emit(OnRecvData, neighbour.peerID(), stream); });
                    neighbour.on(OnNeighbourDown, ()=>{ this.emit(OnDataLinkDown, neighbour.peerID()); });
                    break;
            }
        };
    }
}

