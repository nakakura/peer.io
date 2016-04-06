/// <reference path="../../typings/main.d.ts" />

import {PeerJsStateManager, PeerJsStateEnum} from '../../src/states/peerjs_state';
import ConnectedState from '../../src/states/connected_state';
import {PeerConnectOption, LinkComponentTemplate, DataLinkComponent, VideoLinkComponent, LinkComponentFactory} from '../src/link_component';
import {NeighbourTypeEnum} from '../../src/peer.io';
import * as chai from 'chai';
var expect = chai.expect;
declare var sinon;

describe('ConnectedState', () => {
    var state: PeerJsStateManager;
    
    beforeEach((done) => {
        state = new PeerJsStateManager();
        state.setStateObject(new ConnectedState());
        done();
    });
    
    it ("become offline", (done)=>{
        expect(state.state()).to.deep.equal(PeerJsStateEnum.connected);
        state.stateObject().network(state, false);
        expect(state.state()).to.deep.equal(PeerJsStateEnum.wait_closing);
        done();
    });

    it ("become onOnline", (done)=>{
        state.stateObject().network(state, true);
        expect(state.state()).to.deep.equal(PeerJsStateEnum.connected);
        done();
    });

    it ("become peer off", (done)=>{
        expect(state.state()).to.deep.equal(PeerJsStateEnum.connected);
        state.onStateChanged(function(changedState){
            expect(changedState).to.deep.equal(PeerJsStateEnum.online);
            done();
        });
        state.stateObject().peer(state, false);
        expect(state.state()).to.deep.equal(PeerJsStateEnum.online);
    });

    it ("become peer on", (done)=>{
        expect(state.state()).to.deep.equal(PeerJsStateEnum.connected);
        state.stateObject().peer(state, true);
        expect(state.state()).to.deep.equal(PeerJsStateEnum.connected);
        done();
    });
});