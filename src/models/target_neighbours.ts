//接続相手のNeighbour一覧を管理する。
//1. このクラスには完成形のリストが入っている
//2. このクラスは周囲からの要求によって書き換えられ、自身の更新意欲を持たない
//3. 異常な値が入ってきたら弾く
//   - 同じPeerへの複数のNeighbour登録

/// <reference path="../typings/tsd.d.ts" />
/// <reference path="./neighbour.ts" />

module PeerIo{
    export var ON_NEED_ESTABLISH_LINK = "onNeedEstablishLink-in-targetneighbours.ts";
    export var ON_NEED_CLOSE_LINK = "onNeedCloseLink-in-targetneighbours.ts";

    export class TargetNeighbours extends EventEmitter2{
        private _neighbours: NeighboursHash = {};

        constructor(){
            super();
        }

        tryAddNeighbour(neighbour: NeighbourTemplate): boolean{
            this.removeNeighbour(neighbour.key());
            this._neighbours[neighbour.key()] = neighbour;
            if(!neighbour.active()) {
                this.emit(ON_NEED_ESTABLISH_LINK, neighbour);
            }
            return true;
        }

        removeNeighbour(neighbourName: string){
            if(!(neighbourName in this._neighbours)) return;
            this._neighbours[neighbourName].close();
            delete this._neighbours[neighbourName];
        }

        targetNeighbours: ()=>NeighboursArray = ()=>{
            var neighbours = _.filter(this._neighbours, (neighbour: NeighbourTemplate, key: string)=>{
                return !neighbour.active();
            });

            return neighbours;
        };

        findNeighbour = (key: string)=>{
            return this._neighbours[key];
        };

        connectedNeighbours: ()=>NeighboursArray = ()=>{
            var neighbours = _.filter(this._neighbours, (neighbour: NeighbourTemplate, key: string)=>{
                return neighbour.connected();
            });

            return neighbours;
        };
    }
}
