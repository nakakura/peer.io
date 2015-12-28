// オンライン Peer確立なし 接続要求もなし
// offlineでpeerjsがconnectedということはあり得ないので枝刈り

/// <reference path="../typings/tsd.d.ts" />
/// <reference path="./peerjs_state.ts" />
/// <reference path="./offline_state.ts" />
/// <reference path="./connected_state.ts" />

module PeerIo{
    export class OnlineState implements PeerJsStateIf{
        state(){ return PeerJsStateEnum.online };

        network(state: PeerJsStateManager, isOnline: boolean){
            if(!isOnline) state.setStateObject(new OfflineState());
        }

        peer(state: PeerJsStateManager, isConnected: boolean){
            if(isConnected) state.setStateObject(new ConnectedState());
        }
    }
}

