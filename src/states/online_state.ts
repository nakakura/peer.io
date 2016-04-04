// オンライン Peer確立なし 接続要求もなし
// offlineでpeerjsがconnectedということはあり得ないので枝刈り

/// <reference path="../../typings/tsd.d.ts" />
import {PeerJsStateEnum, PeerJsStateManager, PeerJsStateIf} from './peerjs_state';
import OfflineState from './offline_state';
import ConnectedState from './connected_state';

export default class OnlineState implements PeerJsStateIf{
  state(){ return PeerJsStateEnum.online };

  network(state: PeerJsStateManager, isOnline: boolean){
    if(!isOnline) state.setStateObject(new OfflineState());
  }

  peer(state: PeerJsStateManager, isConnected: boolean){
    if(isConnected) state.setStateObject(new ConnectedState());
  }
}
