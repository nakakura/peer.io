
module PeerIo {
    export class Util {
        static waitTime(min:number, max:number):number {
            return min + Math.random() * (max - min);
        }
    }
}