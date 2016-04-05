// オンライン Peer確立なし 接続要求もなし
// offlineでpeerjsがconnectedということはあり得ないので枝刈り

/// <reference path="../../typings/main.d.ts" />
import {PeerJsStateEnum, PeerJsStateManager, PeerJsStateIf} from './peerjs_state';
import OnlineState from './online_state';
import WaitClosingState from './wait_closing_state';

export default class ConnectedState implements PeerJsStateIf{
  state(){ return PeerJsStateEnum.connected };

  network(state: PeerJsStateManager, isOnline: boolean){
    if(!isOnline) state.setStateObject(new WaitClosingState());
  }

  peer(state: PeerJsStateManager, isConnected: boolean){
    if(!isConnected) state.setStateObject(new OnlineState());
  }
}
