// Main Controller

/// <reference path="typings/tsd.d.ts" />
/// <reference path="util.ts" />
/// <reference path="neighbour_record.ts" />
/// <reference path="neighbour_store.ts" />
/// <reference path="link_component.ts" />
/// <reference path="link_generator.ts" />

module PeerIo{
    import PeerConnectOption = PeerJs.PeerConnectOption;
    export var OnStartVideo = "onStartVideo-in-peer.io.ts";
    export var OnStopVideo = "onStopVideo-in-peer.io.ts";
    export var OnDataLinkUp = "onDataLinkUp";
    export var OnDataLinkDown = "onDataLinkDown";
    export var OnRecvData = "onRecvData";

    export class PeerIo extends EventEmitter2{
        private linkGenerator_: LinkGenerator;
        private neighbourStore_: NeighbourStore;

        //================= setup ==================
        constructor(private peerJs_: PeerJs.Peer){
            super();
            this.neighbourStore_ = new NeighbourStore();
            this.linkGenerator_ = new LinkGenerator(peerJs_);
            this.linkGenerator_.addNeighbourSource("neighbourSource", this.neighbourStore_.neighbours);
            this.linkGenerator_.on(this.linkGenerator_.OnNewDataChannel, this.newDataChannel_);
            this.linkGenerator_.on(this.linkGenerator_.OnNewMediaStream, this.newMediaStream_);
            this.neighbourStore_.on(this.neighbourStore_.NEED_ESTABLISH_LINK, this.linkGenerator_.establishLink);
        }

        private newDataChannel_ = (link: DataLinkComponent)=>{
            this.neighbourStore_.addLink(link);
            this.emit(OnDataLinkUp, link.peerID(), link.options());
            link.on(link.OnRecvData, (data)=>{
                this.emit(OnRecvData, link.peerID(), data);
            });

            link.on(link.OnDataLinkDown, () =>{
                this.emit(OnStopVideo, link.peerID());
            });
        };

        private newMediaStream_ = (link: VideoLinkComponent, stream: MediaStream)=>{
            this.neighbourStore_.addLink(link);
            this.emit(OnStartVideo, link.peerID(), stream);
            link.on(link.OnStopVideo, ()=>{
                this.emit(OnStopVideo, link.peerID());
            });
        };

        addDefaultStream(mediaStream: MediaStream){
            this.linkGenerator_.setDefaultStream(mediaStream);
        }

        addVideoNeighbour(peerId: string, stream?: MediaStream | MediaStream[]){
            var neighbour = new NeighbourRecord(peerId, NeighbourTypeEnum.video);
            if(stream) neighbour.setStream(stream);
            this.neighbourStore_.addRecord(neighbour);
        }

        addDataNeighbour(peerId: string, option?: PeerConnectOption){
            var neighbour = new NeighbourRecord(peerId, NeighbourTypeEnum.data);
            if(option) neighbour.setDataChannelOption(option);
            this.neighbourStore_.addRecord(neighbour);
        }

        removeVideoNeighbour(peerId: string){
            this.neighbourStore_.removeRecord(new NeighbourRecord(peerId, NeighbourTypeEnum.video));
        }

        removeDataNeighbour(peerId: string){
            this.neighbourStore_.removeRecord(new NeighbourRecord(peerId, NeighbourTypeEnum.data));
        }

        //================= setup ==================

        //================= data channel ===========
        send(peerId: string, message: string){
            var target = this.neighbourStore_.findLink(peerId + "-data");
            if(target) target.send(message);
        }

        broadcast(message: string){
            var neighbours = this.neighbourStore_.links();
            _.each(neighbours, (link)=>{
                link.send(message);
            });
        }
        //================= data channel ===========
    }
}

