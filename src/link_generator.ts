//LinkGenerator wraps PeerJs object and establish P2P Link
//1. This object is created when PeerIo is initialized
//2. This object is destroyed when PeerIo destroyed
//3. This object may be unique, I'll make it singleton.A
//4. This object has a State object that shows Online/Offline/PeerJsConnected status.
//5. This object doesn't have any Neighbour's information.
//    This object gets it through a delegate method in neighbourSourceArray_
//5. When client become online, it try to establish P2P link.
//6. When Neighbour request this client to establish Link,
//    this object create link object and hold it until 'onopen' event is fired.
//7. When 'onopen' event is fired, it creates LinkComponent object and pass it to NeighbourStore object.
//    NeighbourStore object may accept and decline this link.
//    LinkGenerator doesn't care for it.
//8. This object doesn't close Link. It only generates it.
//9. This object has some streams to answer to requests from Neighbour.

/// <reference path="./typings/tsd.d.ts" />
/// <reference path="./neighbour_record.ts" />
/// <reference path="./link_component.ts" />
/// <reference path="states/peerjs_state.ts" />

module PeerIo{
    export class LinkGenerator extends EventEmitter2{
        OnNewMediaStream = "on-new-mediastream-in-link_generator.ts";
        OnNewDataChannel = "on-new-datachannel-in-link_generator.ts";
        private state_: PeerJsStateManager;
        private neighbourSourceHash_: {[key: string]: NeighbourSource} = {};
        private defaultStream_: MediaStream;

        constructor(private peer_: PeerJs.Peer) {
            super();

            this.state_ = new PeerJsStateManager();
            this.state_.onStateChanged(this.onStateChanged_);

            this.checkNetworkStatus_();
            this.wrapPeerEvent_();
        }

        setDefaultStream(stream: MediaStream){
            this.defaultStream_ = stream;
        }

        addNeighbourSource(key: string, source: NeighbourSource){
            this.neighbourSourceHash_[key] = source;
        }

        removeNeighbourSource(key: string){
            if(key in this.neighbourSourceHash_) delete this.neighbourSourceHash_[key];
        }

        //=============Network and PeerJs state methods start=========

        private checkNetworkStatus_(){
            (<any>Offline).options = { checks: { xhr: { url: 'https://skyway.io/dist/0.3/peer.min.js' } } };

            Offline.on('up', ()=>{
                this.state_.stateObject().network(this.state_, true);
            });

            Offline.on('down', ()=>{
                this.state_.stateObject().network(this.state_, false);
            });

            if(Offline.state === 'up'){
                this.state_.stateObject().network(this.state_, true);
            }

            Offline.check();
        }

        private onStateChanged_ = (state: PeerJsStateEnum)=>{
            switch (state){
                case PeerJsStateEnum.initial:
                    break;
                case PeerJsStateEnum.online:
                    if(!this.peer_.disconnected) {
                        this.state_.stateObject().peer(this.state_, true);
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

        private wrapPeerEvent_(){
            this.peer_.on("open", ()=>{
                this.state_.stateObject().peer(this.state_, true);
            });
            this.peer_.on('error', (err)=>{ console.log(err); });
            this.peer_.on('disconnected', ()=>{
                this.state_.stateObject().peer(this.state_, false);
            });
            this.peer_.on('connection', this.onRecvConnect_);
            this.peer_.on('call', this.onRecvCall_);
        }

        //=============peer event and change state end===========

        //=============Link generation methods start===========

        establishLink = (neighbour: NeighbourRecord)=>{
            switch(neighbour.type()){
                case NeighbourTypeEnum.video:
                    this.tryCall_(neighbour);
                    break;
                case NeighbourTypeEnum.data:
                    this.tryConnect_(neighbour);
                    break;
            }
        };

        private findNeighbour_(key: string): NeighbourRecord{
            var source = _.find(this.neighbourSourceHash_, (item: NeighbourSource)=>{
                return key in item();
            });
            if(source) return source()[key];
            return null;
        }

        private neighbourArray_(): Array<NeighbourRecord>{
            return  _.reduce(this.neighbourSourceHash_, (container: Array<NeighbourRecord>, val: NeighbourSource, key: string)=>{
               return _.reduce(val(), (innerContainer: Array<NeighbourRecord>, record: NeighbourRecord, key: string)=>{
                   return innerContainer.concat(record);
               }, container);
           }, []);
        }

        private targetNeighbours_(): Array<NeighbourRecord>{
            var neighbours = this.neighbourArray_();
            return _.filter(neighbours, (neighbour: NeighbourRecord)=>{
                return !neighbour.isEstablished();
            });
        }

        private _establishAllPeer = ()=>{
            _.each(this.targetNeighbours_(), this.establishLink);
        };

        private tryCall_(neighbour: NeighbourRecord){
            var streams = neighbour.streams();
            var retStream = this.defaultStream_;
            if(streams && streams.length > 0) retStream = streams[0];
            var mediaConnection = this.peer_.call(neighbour.peerID(), retStream);
            if(!mediaConnection) return;
            mediaConnection.on("stream", (stream: MediaStream)=>{
                var link = LinkComponentFactory.createLinkComponent(neighbour.peerID(), mediaConnection);
                this.emit(this.OnNewMediaStream, link, stream);
            });
        }

        private onRecvCall_ = (mediaConnection: PeerJs.MediaConnection)=> {
            var neighbourID = mediaConnection.peer;
            var neighbour = this.findNeighbour_(Util.key(neighbourID, NeighbourTypeEnum.video));
            var retStream = this.defaultStream_;
            if(neighbour){
                var streams = neighbour.streams();
                if(streams && streams.length > 0) {
                    retStream = streams[0];
                }
            }
            mediaConnection.answer(retStream);
            mediaConnection.on("stream", (stream: MediaStream)=>{
                var link = LinkComponentFactory.createLinkComponent(neighbourID, mediaConnection);
                this.emit(this.OnNewMediaStream, link, stream);
            });
        };

        private tryConnect_(neighbour: NeighbourRecord){
            var dataConnection = this.peer_.connect(neighbour.peerID(), neighbour.dataChannelOption());
            if(!dataConnection) return;
            dataConnection.on('open', ()=>{
                var link = LinkComponentFactory.createLinkComponent(neighbour.peerID(), dataConnection);
                this.emit(this.OnNewDataChannel, link);
            });
        }

        private onRecvConnect_ = (dataConnection: PeerJs.DataConnection)=> {
            var neighbourID = dataConnection.peer;
            dataConnection.on('open', ()=>{
                var link = LinkComponentFactory.createLinkComponent(neighbourID, dataConnection);
                this.emit(this.OnNewDataChannel, link);
            });
        };
        //=============Link generation methods end===========
    }
}
