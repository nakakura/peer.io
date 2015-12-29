//NeighbourStore has records and links
//1. This object is created when PeerIo is initialized
//2. This object is destroyed when PeerIo destroyed
//3. This object may be unique, I'll make it singleton.

/// <reference path="./typings/tsd.d.ts" />
/// <reference path="./neighbour_record.ts" />
/// <reference path="./link_component.ts" />

module PeerIo{
    export class NeighbourStore extends EventEmitter2{
        NEED_ESTABLISH_LINK = "need-establish-link-in-neighbourstore";
        private recordsHash_: NeighbourHash = {};
        private linksHash_: {[key: string]: LinkComponentTemplate} = {};

        constructor(){
            super();
        }

        private addRecord_(record: NeighbourRecord){
            record.isEstablished = this.isEstablished_.bind(this, record.key());
            record.addLink = this.addLink_.bind(this, record.key());
            this.recordsHash_[record.key()] = record;
        }

        addRecord(record: NeighbourRecord){
           if(record.key() in this.recordsHash_) {
               if(this.recordsHash_[record.key()].isEstablished()){
                   // already connected to the peer
                   // ignore addrecord in this case
               } else{
                   this.emit(this.NEED_ESTABLISH_LINK, this.recordsHash_[record.key()]);
               }
           } else{
               this.addRecord_(record);
               this.emit(this.NEED_ESTABLISH_LINK, record);
           }
        }
        
        removeRecord(record: NeighbourRecord){
            if(record.key() in this.linksHash_){
                this.linksHash_[record.key()].close();
                delete this.linksHash_[record.key()];
            }

            if(record.key() in this.recordsHash_){
                delete this.recordsHash_[record.key()];
            }
        }

        addLink(link: LinkComponentTemplate){
            if(!(link.key() in this.recordsHash_)){
                var record = new NeighbourRecord(link.peerID(), link.type());
                this.addRecord_(record);
            }
            this.linksHash_[link.key()] = link;
        }

        findLink(key: string): LinkComponentTemplate{
            return this.linksHash_[key];
        }

        links(): Array<LinkComponentTemplate>{
            return _.reduce(this.linksHash_, (innerContainer: Array<NeighbourRecord>, record: NeighbourRecord, key: string)=>{
                return innerContainer.concat(record);
            }, []);
        }

        neighbours:()=>NeighbourHash = ()=>{
            return this.recordsHash_;
        };

        private addLink_(key: string, link: LinkComponentTemplate){
            if(this.isEstablished_(key)) this.linksHash_[key].close();
            this.linksHash_[key] = link;
        }

        private isEstablished_(key: string): boolean{
            if(!(key in this.linksHash_)) return false;
            return this.linksHash_[key].isEstablished();
        }
    }
}
