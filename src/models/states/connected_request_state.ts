// オンライン Peer確立あり 接続要求あり

/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="./peerjs_state.ts" />
/// <reference path="./offline_request_state.ts" />
/// <reference path="./online_request_state.ts" />
/// <reference path="./connected_state.ts" />

module Model{
    export class ConnectedRequestState implements PeerJsStateIf{
        state(){ return PeerJsStateEnum.connected_request };

        network(state: PeerJsStateManager, isOnline: boolean){
            if(!isOnline) state.setStateObject(new OfflineRequestState());
        }

        peer(state: PeerJsStateManager, isConnected: boolean){
            if(!isConnected) state.setStateObject(new OnlineRequestState());
        }

        request(state: PeerJsStateManager, isRequired: boolean){
            if(!isRequired) state.setStateObject(new ConnectedState());
        }
    }
}

