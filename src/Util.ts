/// <reference path="./neighbour_record.ts" />

type Link = PeerJs.DataConnection | PeerJs.MediaConnection;

module PeerIo {
    export class Util {
        static waitTime(min:number, max:number):number {
            return min + Math.random() * (max - min);
        }

        static key(peerID: string, type: NeighbourTypeEnum){
            switch(type){
                case NeighbourTypeEnum.video:
                    return peerID + "-video";
                case NeighbourTypeEnum.data:
                    return peerID + "-data";
            }
        }

        static isDataChannel(link: Link): link is PeerJs.DataConnection{
            return link && link.hasOwnProperty('send');
        }

        static isMediaConnection(link: Link): link is PeerJs.MediaConnection{
            return link && link.hasOwnProperty('answer');
        }
    }
}
