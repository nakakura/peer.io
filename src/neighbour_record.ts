//NeighbourRecord is just a record.
//It shows an Neighbour which LinkGenerator should establish a link to.
//1. This object is created when user add an Neighbour.
//2. This object is destroyed when user remove it.
//3. This object has some delegated method.

/// <reference path="./typings/tsd.d.ts" />
/// <reference path="./link_component.ts" />
/// <reference path="./Util.ts" />

module PeerIo{
    export type NeighbourSource = ()=>NeighbourRecord[];
    export enum NeighbourTypeEnum{
        video = 1,
        data = 2
    }

    export class NeighbourRecord extends EventEmitter2{
        private sources_: {[key: string]: MediaStream} = {};
        private option_: PeerJs.PeerConnectOption = {
            label: 'json',
            serialization: 'none',
            reliable: false
        };

        constructor(private peerId_: string, private type_: NeighbourTypeEnum){
            super();
        }

        type(){ return this.type_; }

        peerID(): string{ return this.peerId_; }

        streams(): MediaStream[]{
            return _.reduce(this.sources_, (container: Array<NeighbourRecord>, stream: MediaStream, key: string)=>{
                return Array.prototype.push.apply(container, stream);
            }, []);
        }

        addStream(key: string, stream: MediaStream){
            this.sources_[key] = stream;
        }

        removeStream(key: string){
            if(key in this.sources_){
                delete this.sources_[key];
            }
        }

        dataChannelOption(): PeerJs.PeerConnectOption{
            return this.option_;
        }

        setDataChannelOption(option: PeerJs.PeerConnectOption){
            this.option_ = option;
        }

        //delegate
        isEstablished: ()=>boolean = ()=>{
            throw("this method should be overwrite.");
            return false;
        };

        //delegate
        addLink = (link: LinkComponentTemplate)=>{
            throw("this method should be overwrite.");
        };

        key(): string{
            return Util.key(this.peerId_, this.type_);
        }
    }
}
