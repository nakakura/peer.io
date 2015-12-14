//PeerJSをラップしてP2Pを確立するクラス
//1. TargetNeighboursをobserveして、必要であれば接続・再接続する
//2. 他のPeerからの接続を待ち受け、接続されたらNeighbourを生成し、TargetNeighboursに格納する
//3. Peerサーバへの接続が切れたら再接続する
//   その際Neighbourへの接続も切れていたらそちらも再接続する

/// <reference path="../typings/tsd.d.ts" />
/// <reference path="./neighbour.ts" />
/// <reference path="./target_neighbours.ts" />

module Model{
    export class PeerJsState extends EventEmitter2{
        constructor(private _peer:PeerJs.Peer, private _targetNeighbours: TargetNeighbours) {
            super();
            if(!_peer.disconnected){
                this._onOpen();
            }

            _peer.on("open", this._onOpen);
        }

        private _onOpen = ()=>{

        };
    }
}
