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
    export type NeighboursArray = Array<NeighbourTemplate>;
    export type NeighboursSource = ()=>NeighboursArray;
    export type DataCallback = (message: string)=>void;
    export type MediaCallback = (stream: MediaStream)=>void;

    export var OnNeighbourDown = "onNeighbourDown-in-neighbour.ts";
    export var OnStream = "onStream-in-neighbour.ts";
    export var OnData = "onData-in-neighbour.ts";

    export enum NeighbourTypeEnum{
        video = 1,
        data = 2
    }

    export class NeighbourTemplate extends EventEmitter2{
        protected _connected = false;

        constructor(protected _peerID: string) {
            super();
        }

        connected(){ return this._connected; }
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

        type(){ return NeighbourTypeEnum.data; }

        setChannel(dataChannel: PeerJs.DataConnection){
            if(!dataChannel) return;

            this._dataChannel = dataChannel;
            this._connected = false;

            dataChannel.on('open', ()=>{
                this._connected = true;
            });

            dataChannel.on('close', ()=>{
                this._dataChannel = null;
                this._connected = false;
                this.emit(OnNeighbourDown);
            });

            dataChannel.on('error', (error)=>{
                this._dataChannel = null;
                this._connected = false;
            });

            dataChannel.on('data', (data: string)=>{
                this.emit(OnData, data);
            });
        }

        send(message: string){
            if(!this._connected || !this._dataChannel) return;

            this._dataChannel.send(message);
        }

        close(){
            this._dataChannel.close();
            this._dataChannel = null;
            this._connected = false;
        }
    }

    export class VideoNeighbour extends NeighbourTemplate{
        private _mediaConnection: PeerJs.MediaConnection = null;
        private _sources: Array<MediaStream> = [];

        type(){ return NeighbourTypeEnum.video; }

        sources(){ return this._sources; }

        setChannel(call: PeerJs.MediaConnection){
            this._mediaConnection = call;
            this._connected = false;

            call.on('stream', (stream)=>{
                this._mediaConnection = stream;
                this._connected = true;
                this.emit(OnStream, stream);
            });

            call.on('close', ()=>{
                this._mediaConnection = null;
                this._connected = false;
                this.emit(OnNeighbourDown);
            });

            call.on('error', (error)=>{
                this._mediaConnection = null;
                this._connected = false;
            });
        }

        setSource(source: MediaStream | Array<MediaStream>){
            if(source instanceof Array) Array.prototype.push.apply(this._sources, source);
            else this._sources.push(<MediaStream>source);
        }

        close(){
            this._mediaConnection.close();
            this._mediaConnection = null;
            this._connected = false;
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
