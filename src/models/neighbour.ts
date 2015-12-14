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
    }

    export class DataNeighbour extends EventEmitter2 implements NeighbourIf{
        private _dataChannel: PeerJs.DataConnection = null;
        private _connected = false;
        OnDataReceivedEvent = "DataFromNeighbour";

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

            dataChannel.on('data', (data)=>{
                this.emit(this.OnDataReceivedEvent, data);
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
    }

    export class VideoNeighbour extends EventEmitter2 implements NeighbourIf{
        private _mediaConnection: PeerJs.MediaConnection = null;
        private _streamCount = 0;
        private _connected = false;
        private _sources: Array<MediaStream> = [];
        OnMediaReceivedEvent = "MediaFromNeighbour";

        constructor(private _peerID: string) {
            super();
        }

        peerID(){ return this._peerID; }

        type(){ return NeighbourTypeEnum.video; }

        connected(){ return this._connected; }

        sources(){ return this._sources; }

        setChannel(call: PeerJs.MediaConnection){
            this._mediaConnection = call;
            this._connected = false;

            call.on('stream', (stream)=>{
                console.log("on stream");
                this._streamCount++;
                this._mediaConnection = stream;
                this._connected = true;
                this.emit(this.OnMediaReceivedEvent, this._streamCount, stream);
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
            if(source instanceof Array) this._setMultipleSources(<Array<MediaStream>> source);
            else this._setSingleSource(<MediaStream> source);
        }

        _setSingleSource(source: MediaStream){
            this._sources.push(source);
        }

        _setMultipleSources(sources: Array<MediaStream>){
            _.each(sources, (source)=>{
                this._setSingleSource(source);
            });
        }

        send(message: string){}

        close(){
            this._mediaConnection.close();
            this._mediaConnection = null;
            this._connected = false;
        }
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
