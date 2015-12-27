/// <reference path="./typings/tsd.d.ts" />
/// <reference path="./neighbour_record.ts" />
/// <reference path="./neighbour_link.ts" />

module PeerIo{
    export class NeighbourStore extends EventEmitter2{
        private recordsHash_: {[key: string]: NeighbourRecord} = {};
        private linksHash_: {[key: string]: NeighbourLinkComponent} = {};
        private NEED_ESTABLISH_LINK = "need-establish-link-in-neighbourstore";

        constructor(){
            super();
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
               record.isEstablished = this.isEstablished_.bind(this, record.key());
               record.addLink = this.addLink_.bind(this, record.key());
               this.recordsHash_[record.key()] = record;
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

        private addLink_(key: string, link: NeighbourLinkComponent){
            if(this.isEstablished_(key)) this.linksHash_[key].close();
            this.linksHash_[key] = link;
        }

        private isEstablished_(key: string): boolean{
            if(!(key in this.linksHash_)) return false;
            return this.linksHash_[key].isEstablished();
        }
    }
}
