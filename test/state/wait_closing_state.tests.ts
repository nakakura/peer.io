/// <reference path="../../typings/main.d.ts" />

import {PeerJsStateManager, PeerJsStateEnum} from '../../src/states/peerjs_state';
import WaitClosingState from '../../src/states/wait_closing_state';
import {PeerConnectOption, LinkComponentTemplate, DataLinkComponent, VideoLinkComponent, LinkComponentFactory} from '../src/link_component';
import {NeighbourTypeEnum} from '../../src/peer.io';
import * as chai from 'chai';
var expect = chai.expect;
declare var sinon;

describe('WaitClosingState', () => {
    var state: PeerJsStateManager;
    
    beforeEach((done)=>{
        state = new PeerJsStateManager();
        state.setStateObject(new WaitClosingState());
        done();
    });

    it ("become offline", (done)=>{
        expect(state.state()).to.deep.equal(PeerJsStateEnum.wait_closing);
        state.stateObject().network(state, false);
        expect(state.state()).to.deep.equal(PeerJsStateEnum.wait_closing);
        done();
    });

    it ("become onOnline", (done)=>{
        state.onStateChanged(function(changedState){
            expect(changedState).to.deep.equal(PeerJsStateEnum.connected);
            done();
        });
        state.stateObject().network(state, true);
    });

    it ("become peer off", (done)=>{
        expect(state.state()).to.deep.equal(PeerJsStateEnum.wait_closing);
        state.onStateChanged(function(changedState){
            expect(changedState).to.deep.equal(PeerJsStateEnum.initial);
            done();
        });
        state.stateObject().peer(state, false);
    });

    it ("become peer on", (done)=>{
        expect(state.state()).to.deep.equal(PeerJsStateEnum.wait_closing);
        state.stateObject().peer(state, true);
        expect(state.state()).to.deep.equal(PeerJsStateEnum.wait_closing);
        done();
    });
});