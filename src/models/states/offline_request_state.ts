// オフライン Peer確立なし 接続要求あり

/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="./peerjs_state.ts" />
/// <reference path="./offline_state.ts" />
/// <reference path="./online_request_state.ts" />

module Model{
    export class OfflineRequestState implements PeerJsStateIf{
        state(){ return PeerJsStateEnum.offline_request };

        network(state: PeerJsStateManager, isOnline: boolean){
            if(isOnline) state.setStateObject(new OnlineRequestState());
        }

        peer(state: PeerJsStateManager, isConnected: boolean){
            //オフライン状態でpeerjsのステータスは変わらないので無視
        }

        request(state: PeerJsStateManager, isRequired: boolean){
            if(!isRequired) state.setStateObject(new OfflineState());
        }
    }
}

