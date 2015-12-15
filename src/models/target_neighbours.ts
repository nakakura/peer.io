//接続相手のNeighbour一覧を管理する。
//1. このクラスには完成形のリストが入っている
//2. このクラスは周囲からの要求によって書き換えられ、自身の更新意欲を持たない
//3. 異常な値が入ってきたら弾く
//   - 同じPeerへの複数のNeighbour登録

/// <reference path="../typings/tsd.d.ts" />
/// <reference path="./neighbour.ts" />

module Model{
    export class TargetNeighbours extends EventEmitter2{
        private _neighbours: NeighboursArray = [];
        private _ON_NEED_ESTABLISH_P2P = "onNeedEstablishP2P";
        private _ON_NEED_CLOSE_P2P = "onNeedCloseP2P";

        constructor(){
            super();
        }

        onNeedEstablishLink(callback: (neighbour: NeighbourIf)=>void){
            this.on(this._ON_NEED_ESTABLISH_P2P, callback);
        }

        onNeedCloseLink(callback: (neighbour: NeighbourIf)=>void){
            this.on(this._ON_NEED_CLOSE_P2P, callback);
        }

        addNeighbour(neighbour: NeighbourIf){
            var lastOne = _.find(this._neighbours, (item: NeighbourIf)=>{
                return item.peerID() === neighbour.peerID() && item.type() === neighbour.type();
            });

            if(lastOne) {
                this.emit(this._ON_NEED_CLOSE_P2P, neighbour);
                return;
            }

            this._neighbours.push(neighbour);
            if(!neighbour.connected()) this.emit(this._ON_NEED_ESTABLISH_P2P, neighbour);
        }

        removeNeighbour(neighbourName: string){
            var removeNeighbours = _.remove(this._neighbours, (n: NeighbourIf)=>{
                return n.peerID() === neighbourName;
            });

            _.each(removeNeighbours, (neighbour: NeighbourIf)=>{
                if(neighbour.connected()) this.emit(this._ON_NEED_CLOSE_P2P, neighbour);
            });
        }

        targetNeighbours = ()=>{
            var neighbours = _.filter(this._neighbours, (neighbour: NeighbourIf)=>{
                return !neighbour.connected();
            });

            return neighbours;
        };
    }
}
