/// <reference path="./typings/tsd.d.ts" />
/// <reference path="./link_component.ts" />

module PeerIo{
    export enum NeighbourTypeEnum{
        video = 1,
        data = 2
    }

    export class NeighbourRecord extends EventEmitter2{
        constructor(private _peerId: string, private _type: NeighbourTypeEnum){
            super();
        }

        isEstablished = ()=>{
            return false;
        };

        addLink = (link: LinkComponentTemplate)=>{};

        key(): string{
            return this._peerId + this._type.toString();
        }
    }
}
