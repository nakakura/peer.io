// オンライン Peer確立あり 接続要求なし

/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="./peerjs_state.ts" />
/// <reference path="./offline_state.ts" />
/// <reference path="./online_state.ts" />
/// <reference path="./connected_request_state.ts" />

module Model{
    export class ConnectedState implements PeerJsStateIf{
        state(){ return PeerJsStateEnum.connected };

        network(state: PeerJsStateManager, isOnline: boolean){
            if(!isOnline) state.setStateObject(new OfflineState());
        }

        peer(state: PeerJsStateManager, isConnected: boolean){
            if(!isConnected) state.setStateObject(new OnlineState());
        }

        request(state: PeerJsStateManager, isRequired: boolean){
            if(isRequired) state.setStateObject(new ConnectedRequestState());
        }
    }
}

