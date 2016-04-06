/// <reference path="../../typings/main.d.ts" />

import {PeerJsStateManager, PeerJsStateEnum} from '../../src/states/peerjs_state';
import OnlineState from '../../src/states/online_state';
import {PeerConnectOption, LinkComponentTemplate, DataLinkComponent, VideoLinkComponent, LinkComponentFactory} from '../src/link_component';
import {NeighbourTypeEnum} from '../../src/peer.io';
import * as chai from 'chai';
var expect = chai.expect;
declare var sinon;

describe('OnlineState', () => {
    var state: PeerJsStateManager;
    
    beforeEach((done) => {
        state = new PeerJsStateManager();
        state.setStateObject(new OnlineState());
        done();
    });
    
    it ("become offline", (done)=>{
        expect(state.state()).to.deep.equal(PeerJsStateEnum.online);
        state.onStateChanged(function(changedState){
            expect(changedState).to.deep.equal(PeerJsStateEnum.initial);
            done();
        });
        state.stateObject().network(state, false);
        expect(state.state()).to.deep.equal(PeerJsStateEnum.initial);
    });

    it ("become onOnline", (done)=>{
        expect(state.state()).to.deep.equal(PeerJsStateEnum.online);
        done();
    });

    it ("become peer off", (done)=>{
        expect(state.state()).to.deep.equal(PeerJsStateEnum.online);
        state.stateObject().peer(state, false);
        expect(state.state()).to.deep.equal(PeerJsStateEnum.online);
        done();
    });

    it ("become peer on", (done)=>{
        expect(state.state()).to.deep.equal(PeerJsStateEnum.online);
        state.onStateChanged(function(changedState){
            expect(changedState).to.deep.equal(PeerJsStateEnum.connected);
            done();
        });
        state.stateObject().peer(state, true);
        expect(state.state()).to.deep.equal(PeerJsStateEnum.connected);
    });
});