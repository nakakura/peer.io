//NeighbourRecord is just a record.
//It shows an Neighbour which LinkGenerator should establish a link to.
//1. This object is created when user add an Neighbour.
//2. This object is destroyed when user remove it.
//3. This object has some delegated method.

/// <reference path="./typings/tsd.d.ts" />
/// <reference path="./link_component.ts" />
/// <reference path="./Util.ts" />

module PeerIo{
    export enum NeighbourTypeEnum{
        video = 1,
        data = 2
    }

    export class NeighbourRecord extends EventEmitter2{
        constructor(private _peerId: string, private _type: NeighbourTypeEnum){
            super();
        }

        //delegate
        isEstablished: ()=>boolean = ()=>{
            throw("this method should be overwrite.");
            return false;
        };

        //delegate
        addLink = (link: LinkComponentTemplate)=>{
            throw("this method should be overwrite.");
        };

        key(): string{
            return Util.key(this._peerId, this._type);
        }
    }
}
