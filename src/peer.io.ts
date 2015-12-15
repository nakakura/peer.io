// Main Controller

/// <reference path="typings/tsd.d.ts" />
/// <reference path="models/states/peerjs_state.ts" />
/// <reference path="models/states/offline_state.ts" />
/// <reference path="models/states/wait_closing_state.ts" />
/// <reference path="models/neighbour.ts" />
/// <reference path="models/target_neighbours.ts" />
/// <reference path="models/peerjs_manager.ts" />

module PeerIo{
    import NeighbourIf = Model.NeighbourIf;
    export class PeerIo extends EventEmitter2{
        private _peerJsManager: Model.PeerJsManager;
        private _targetNeighbours: Model.TargetNeighbours;

        constructor(peerJs: PeerJs.Peer){
            super();

            this._targetNeighbours = new Model.TargetNeighbours();
            this._peerJsManager = new Model.PeerJsManager(peerJs);
            this._peerJsManager.addNeighboursSource("targetNeighbours", this._targetNeighbours.targetNeighbours);
            this._peerJsManager.onLinkEstablished = this.onLinkEstablish;
        }

        addDefaultStream(mediaStream: MediaStream | MediaStream[]){
            this._peerJsManager.addDefaultStream(mediaStream);
        }

        addNeighbour(peerId: string, type: Model.NeighbourTypeEnum, stream?: MediaStream | MediaStream[]){
            var neighbour = Model.NeighbourFactory.createNeighbour(peerId, type);
            if(stream) neighbour.setSource(stream);
            this._targetNeighbours.addNeighbour(neighbour);
        }

        onLinkEstablish = (neighbour: NeighbourIf)=>{
            if(neighbour.type() === Model.NeighbourTypeEnum.video){
                neighbour.onStream(this.onStream);
            }
        };

        onStream = (peerId: string, stream: MediaStream)=>{};
    }
}

