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

    export enum EventTypeEnum{
        video = 1,
        data = 2
    }

    type DataListener = (peerId: string, message: string)=>void;
    type MediaListener = (peerId: string, stream: MediaStream)=>void;

    export class PeerIo{
        private _peerJsManager: Model.PeerJsManager;
        private _targetNeighbours: Model.TargetNeighbours;
        private _dataListener: Array<DataListener> = [];
        private _mediaListener: Array<MediaListener> = [];

        constructor(peerJs: PeerJs.Peer){
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
            switch(neighbour.type()){
                case Model.NeighbourTypeEnum.video:
                    neighbour.onStream(this._notifyMedia);
                    break;
                case Model.NeighbourTypeEnum.data:
                    neighbour.onData(this._notifyData);
                    break;
            }
        };

        on(event: EventTypeEnum, listener: MediaListener | DataListener) {
            switch(event){
                case EventTypeEnum.video:
                    this._mediaListener.push(<MediaListener>listener);
                    break;
                case EventTypeEnum.data:
                    this._dataListener.push(<DataListener>listener);
                    break;
            }
        }

        off(event: EventTypeEnum, listener: MediaListener | DataListener){
            var array: Array<MediaListener | DataListener> = [];

            switch(event){
                case EventTypeEnum.video:
                    array = this._mediaListener;
                    break;
                case EventTypeEnum.data:
                    array = this._dataListener;
                    break;
            }

            var index = _.findIndex(array, (item)=>{
                return item == listener;
            });

            if(index !== -1) array.splice(index, 1);
        }

        private _notifyMedia(neighbourID: string, stream: MediaStream){
            _.each(this._mediaListener, (listener)=>{
                listener(neighbourID, stream);
            });
        }

        private _notifyData(neighbourID: string, message: string){
            _.each(this._dataListener, (listener)=>{
                listener(neighbourID, message);
            });
        }
    }
}

