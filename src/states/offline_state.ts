// オフライン Peer確立なし 接続要求もなし
// 初期状態

/// <reference path="../typings/tsd.d.ts" />
/// <reference path="./peerjs_state.ts" />
/// <reference path="./online_state.ts" />

module PeerIo{
    export class OfflineState implements PeerJsStateIf{
        state(){ return PeerJsStateEnum.initial };

        network(state: PeerJsStateManager, isOnline: boolean){
            if(isOnline) state.setStateObject(new OnlineState());
        }

        peer(state: PeerJsStateManager, isConnected: boolean){
            //オフライン状態でpeerjsのステータスは変わらないので無視
        }
    }
}

