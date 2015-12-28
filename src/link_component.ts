//It is a component which wraps Link(MediaStream of DataChannel)
//1. This object is created when Link is established.
//2. This object is created only by LinkComponentFactory
//3. When Link become down, this component is destroyed

/// <reference path="./typings/tsd.d.ts" />
/// <reference path="./neighbour_record.ts" />
/// <reference path="./Util.ts" />

module PeerIo {
    export var OnStartVideo = "onStartVideo-in-peer.io.ts";
    export var OnStopVideo = "onStopVideo-in-peer.io.ts";
    export var OnDataLinkUp = "onDataLinkUp-in-link_component.ts";
    export var OnDataLinkDown = "onDataLinkDown-in-link_component.ts";
    export var OnRecvData = "onRecvData-in-link_component.ts";

    export class LinkComponentTemplate extends EventEmitter2 {
        constructor(protected peerID_:string, protected link_: Link) {
            super();
        }

        type():NeighbourTypeEnum { return null; }

        peerID(): string { return this.peerID_; };

        key(): string { return Util.key(this.peerID_, this.type()); }

        isEstablished(): boolean { return false; }

        send(message:string): void { }

        close(): void { }
    }

    export class DataLinkComponent extends LinkComponentTemplate {
        constructor(protected peerID_, protected link_: PeerJs.DataConnection){
            super(peerID_, link_);

            link_.on('close', ()=> {
                this.link_ = null;
                this.emit(OnDataLinkDown);
            });

            link_.on('error', (error)=> {
                this.link_ = null;
            });

            link_.on('data', (data:string)=> {
                this.emit(OnRecvData, data);
            });
        }

        type() {
            return NeighbourTypeEnum.data;
        }

        isEstablished():boolean {
            if (!this.link_) return false;
            if (!this.link_.open) return false;
            return this.link_.open;
        }

        send(message:string) {
            if (!this.isEstablished() || !this.link_) return;
            this.link_.send(message);
        }

        close() {
            if(this.link_) this.link_.close();
            this.link_ = null;
        }
    }

    export class VideoLinkComponent extends LinkComponentTemplate {
        private _sources:Array<MediaStream> = [];

        constructor(protected peerID_, protected link_: PeerJs.MediaConnection){
            super(peerID_, link_);

            link_.on('stream', (stream)=> {
                this.emit(OnStartVideo, stream);
            });

            link_.on('close', ()=> {
                this.link_ = null;
                this.emit(OnStopVideo);
            });

            link_.on('error', (error)=> {
                this.link_ = null;
            });
        }

        type() {
            return NeighbourTypeEnum.video;
        }

        isEstablished(): boolean {
            if (!this.link_) return false;
            if (!this.link_.open) return false;
            return this.link_.open;
        }

        sources() {
            return this._sources;
        }

        setSource(source:MediaStream | Array<MediaStream>) {
            if (source instanceof Array) Array.prototype.push.apply(this._sources, source);
            else this._sources.push(<MediaStream>source);
        }

        close() {
            if (this.link_) this.link_.close();
            this.link_ = null;
        }
    }

    export class LinkComponentFactory {
        static createLinkComponent(peerID:string, link: Link):LinkComponentTemplate {
            if (Util.isDataChannel(link)) {
                return new DataLinkComponent(peerID, link);
            } else if (Util.isMediaConnection(link)) {
                return new VideoLinkComponent(peerID, link);
            }
            return null;
        }
    }
}
