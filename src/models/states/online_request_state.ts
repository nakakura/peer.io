// オンライン Peer確立なし 接続要求あり

/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="./peerjs_state.ts" />
/// <reference path="./offline_request_state.ts" />
/// <reference path="./online_state.ts" />
/// <reference path="./connected_request_state.ts" />

module Model{
    export class OnlineRequestState implements PeerJsStateIf{
        state(){ return PeerJsStateEnum.online_request };

        network(state: PeerJsStateManager, isOnline: boolean){
            if(!isOnline) state.setStateObject(new OfflineRequestState());
        }

        peer(state: PeerJsStateManager, isConnected: boolean){
            if(isConnected) state.setStateObject(new ConnectedRequestState());
        }

        request(state: PeerJsStateManager, isRequired: boolean){
            if(!isRequired) state.setStateObject(new OnlineState());
        }
    }
}

