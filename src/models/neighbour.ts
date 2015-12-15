//接続相手(Neighbour)へのコネクションを保持することを目的としたクラス群
//1. 対外的にはNeighbourインタフェースを用いる
//2. 生成はFactoryのみが行う
//   相手との接続確立はPeerJsManagerで行うので、PeerJsManagerで生成されることになる。
//3. 相手との通信はこのクラスを通過する
//4. チャネルに関するイベントは全てこのクラスで拾う
//5. 切断後再接続が必要な場合は、PeerJsManagerの接続シーケンスの待ち行列に追加する形で行う
//6. 切断時のChannelのクロージングはこのクラスで行う

/// <reference path="../typings/tsd.d.ts" />

module Model{
    import MediaConnection = PeerJs.MediaConnection;

    export type NeighboursArray = Array<NeighbourIf>;
    export type NeighboursSource = ()=>NeighboursArray;
    export type DataCallback = (peerId: string, message: string)=>void;
    export type MediaCallback = (peerId: string, stream: MediaStream)=>void;

    export enum NeighbourTypeEnum{
        video = 1,
        data = 2
    }



    export interface NeighbourIf{
        type(): NeighbourTypeEnum;
        peerID(): string;
        connected(): boolean;
        sources(): Array<MediaStream>;
        setChannel(dataChannel: PeerJs.DataConnection | PeerJs.MediaConnection);
        setSource(source: MediaStream | Array<MediaStream>);
        send(message: string);
        close(): void;

        onStream: (callback: MediaCallback)=>void;
        onData: (callback: DataCallback)=>void;
    }

    export class DataNeighbour extends EventEmitter2 implements NeighbourIf{
        private _dataChannel: PeerJs.DataConnection = null;
        private _connected = false;
        private _callbacks: DataCallback[] = [];

        constructor(private _peerID: string) {
            super();
        }

        peerID(){ return this._peerID; }

        type(){ return NeighbourTypeEnum.data; }

        connected(){ return this._connected; }

        sources(){ return []; }

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
            });

            dataChannel.on('error', (error)=>{
                this._dataChannel = null;
                this._connected = false;
            });

            dataChannel.on('data', (data: string)=>{
                _.each(this._callbacks, (callback: DataCallback)=>{
                    callback(this._peerID, data);
                });
            });
        }

        setSource(source: MediaStream | Array<MediaStream>){}

        send(message: string){
            if(!this._connected || !this._dataChannel) return;

            this._dataChannel.send(message);
        }

        close(){
            this._dataChannel.close();
            this._dataChannel = null;
            this._connected = false;
        }

        onStream = (callback: MediaCallback)=>{};

        onData = (callback: DataCallback)=>{
            this._callbacks.push(callback);
        };
    }

    export class VideoNeighbour extends EventEmitter2 implements NeighbourIf{
        private _mediaConnection: PeerJs.MediaConnection = null;
        private _streamCount = 0;
        private _connected = false;
        private _sources: Array<MediaStream> = [];
        private _callbacks: Array<MediaCallback> = [];

        constructor(private _peerID: string) {
            super();
        }

        peerID(){ return this._peerID; }

        type(){ return NeighbourTypeEnum.video; }

        connected(){ return this._connected; }

        sources(){ return this._sources; }

        setChannel(call: PeerJs.MediaConnection){
            console.log("set channel");
            this._mediaConnection = call;
            this._connected = false;

            call.on('stream', (stream)=>{
                console.log("on stream");
                this._streamCount++;
                this._mediaConnection = stream;
                this._connected = true;
                console.log("callbacks");
                console.log(this._callbacks);
                _.each(this._callbacks, (callback: MediaCallback)=>{
                    console.log("on stream 1.1");
                    callback(this._peerID, stream);
                });
            });

            call.on('close', ()=>{
                this._mediaConnection = null;
                this._connected = false;
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

        send(message: string){}

        close(){
            this._mediaConnection.close();
            this._mediaConnection = null;
            this._connected = false;
        }

        onStream = (callback: MediaCallback)=>{
            console.log("先に格納してる");
            this._callbacks.push(callback);
            console.log(this._callbacks);
        };

        onData = (callback: DataCallback)=>{};
    }

    export class NeighbourFactory {
        static createNeighbour(peerID: string, type: NeighbourTypeEnum): NeighbourIf{
            switch (type){
                case NeighbourTypeEnum.video:
                    return new VideoNeighbour(peerID);
                case NeighbourTypeEnum.data:
                    return new DataNeighbour(peerID);
            }
        }
    }
}
