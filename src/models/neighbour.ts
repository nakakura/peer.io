//接続相手(Neighbour)へのコネクションを保持することを目的としたクラス群
//1. 対外的にはNeighbourインタフェースを用いる
//2. 生成はFactoryのみが行う
//   相手との接続確立はPeerJsManagerで行うので、PeerJsManagerで生成されることになる。
//3. 相手との通信はこのクラスを通過する
//4. チャネルに関するイベントは全てこのクラスで拾う
//5. 切断後再接続が必要な場合は、PeerJsManagerの接続シーケンスの待ち行列に追加する形で行う
//6. 切断時のChannelのクロージングはこのクラスで行う

/// <reference path="../typings/tsd.d.ts" />
/// <reference path="./util.ts" />

module PeerIo{
    import MediaConnection = PeerJs.MediaConnection;
    export type NeighboursHash = {[key: string]: NeighbourTemplate};
    export type NeighboursArray = Array<NeighbourTemplate>;
    export type NeighboursSource = ()=>NeighboursArray;

    export var OnStartVideo = "onStartVideo-in-peer.io.ts";
    export var OnStopVideo = "onStopVideo-in-peer.io.ts";
    export var OnDataLinkUp = "onDataLinkUp";
    export var OnDataLinkDown = "onDataLinkDown";
    export var OnRecvData = "onRecvData";

    export enum NeighbourTypeEnum{
        video = 1,
        data = 2
    }

    export class NeighbourTemplate extends EventEmitter2{
        constructor(protected _peerID: string) {
            super();
        }

        key(): string{ return "this must not called"; };
        active(){ return false; }
        connected(){ return false; }
        type(): NeighbourTypeEnum{ return null; }
        peerID(){ return this._peerID; }
        sources(): Array<MediaStream>{ return [] };
        setChannel(dataChannel: PeerJs.DataConnection | PeerJs.MediaConnection){}
        setSource(source: MediaStream | Array<MediaStream>){}
        send(message: string){}
        close(){}
    }

    export class DataNeighbour extends NeighbourTemplate{
        private _dataChannel: PeerJs.DataConnection = null;
        private _connecting = false;
        private _startTime = -1;

        type(){ return NeighbourTypeEnum.data; }

        key(){
            return this._peerID + "-data";
        }

        active(){ //接続済み or 接続開始してから1秒たってない
            var currentTime = new Date().getTime();
            return this.connected() || (this._connecting && currentTime - this._startTime < 2000);
        }

        connected(): boolean{
            if(!this._dataChannel) return false;
            if(!this._dataChannel.open) return false;
            return this._dataChannel.open;
        }

        setChannel(dataChannel: PeerJs.DataConnection){
            if(!dataChannel) return;
            this._startTime = new Date().getTime();

            this._dataChannel = dataChannel;
            this._connecting = true;

            dataChannel.on('open', ()=>{
                this._connecting = false;
                this.emit(OnDataLinkUp);
            });

            dataChannel.on('close', ()=>{
                this._connecting = false;
                this._dataChannel = null;
                this.emit(OnDataLinkDown);
            });

            dataChannel.on('error', (error)=>{
                this._connecting = false;
                this._dataChannel = null;
            });

            dataChannel.on('data', (data: string)=>{
                this.emit(OnRecvData, data);
            });
        }

        send(message: string){
            if(!this.connected() || !this._dataChannel) return;

            this._dataChannel.send(message);
        }

        close(){
            this._connecting = false;
            this._dataChannel = null;
        }
    }

    export class VideoNeighbour extends NeighbourTemplate{
        private _mediaConnection: PeerJs.MediaConnection = null;
        private _sources: Array<MediaStream> = [];
        private _connecting = false;
        private _startTime = -1;

        type(){ return NeighbourTypeEnum.video; }

        key(){
            return this._peerID + "-video";
        }

        active(){ //接続済み or 接続開始してから1秒たってない
            var currentTime = new Date().getTime();
            return this.connected() || (this._connecting && currentTime - this._startTime < 2000);
        }

        connected(): boolean{
            if(!this._mediaConnection) return false;
            if(!this._mediaConnection.open) return false;
            return this._mediaConnection.open;
        }

        sources(){ return this._sources; }

        setChannel(call: PeerJs.MediaConnection){
            if(!call) return;
            this._connecting = true;
            this._startTime = new Date().getTime();
            this._mediaConnection = call;

            call.on('stream', (stream)=>{
                this._connecting = false;
                this.emit(OnStartVideo, stream);
            });

            call.on('close', ()=>{
                this._connecting = false;
                this._mediaConnection = null;
                this.emit(OnStopVideo);
            });

            call.on('error', (error)=>{
                this._connecting = false;
                this._mediaConnection = null;
            });
        }

        setSource(source: MediaStream | Array<MediaStream>){
            if(source instanceof Array) Array.prototype.push.apply(this._sources, source);
            else this._sources.push(<MediaStream>source);
        }

        close(){
            if(this._mediaConnection) this._mediaConnection.close();
            this._connecting = false;
            this._mediaConnection = null;
        }
    }

    export class NeighbourFactory {
        static createNeighbour(peerID: string, type: NeighbourTypeEnum): NeighbourTemplate{
            switch (type){
                case NeighbourTypeEnum.video:
                    return new VideoNeighbour(peerID);
                case NeighbourTypeEnum.data:
                    return new DataNeighbour(peerID);
            }
        }
    }
}
