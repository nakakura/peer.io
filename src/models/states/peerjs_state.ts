// NetworkのOn/Off, PeerJsのcon/disconnect, neighbourへの接続要求を管理するstate
// offlineでpeerjsがconnectedということはあり得ないので枝刈り

/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="./offline_state.ts" />

module Model{
    export enum PeerJsStateEnum{
        initial = 1,
        offline_request = 2,
        online = 4,
        online_request = 3,
        connected = 8,
        connected_request = 7
    }

    export class PeerJsStateManager extends EventEmitter2{
        private _state: PeerJsStateIf;
        private _ON_STATE_CHANGED = "onStateCahnged";

        constructor(){
            super();
            this._state = new OfflineState();
        }

        state(): PeerJsStateEnum{
            return this._state.state();
        }

        stateObject(): PeerJsStateIf{
            return this._state;
        }

        setStateObject(state: PeerJsStateIf){
            this._state = state;
            this.emit(this._ON_STATE_CHANGED, state.state());
        }

        onStateChanged(callback: (status: PeerJsStateEnum)=>void){
            this.on(this._ON_STATE_CHANGED, callback);
        }
    }

    export interface PeerJsStateIf{
        state(): PeerJsStateEnum;
        network(state: PeerJsStateManager, isOnline: boolean): void;
        peer(state: PeerJsStateManager, isConnected: boolean): void;
        request(state: PeerJsStateManager, isRequired: boolean): void;
    }
}
