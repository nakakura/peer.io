/// <reference path="../../typings/main.d.ts" />

import {PeerJsStateManager, PeerJsStateEnum} from '../../src/states/peerjs_state';
import ConnectedState from '../../src/states/connected_state';
import {PeerConnectOption, LinkComponentTemplate, DataLinkComponent, VideoLinkComponent, LinkComponentFactory} from '../src/link_component';
import {NeighbourTypeEnum} from '../../src/peer.io';
import * as chai from 'chai';
var expect = chai.expect;
declare var sinon;

describe('OfflineState', () => {
    var state: PeerJsStateManager;
    
    beforeEach((done) => {
        state = new PeerJsStateManager();
        done();
    });
    
    it ("become offline", (done)=> {
        expect(state.state()).to.deep.equal(PeerJsStateEnum.initial);
        state.stateObject().network(state, false);
        expect(state.state()).to.deep.equal(PeerJsStateEnum.initial);
        done();
    });

    it ("become onOnline", (done)=> {
        state.onStateChanged(function(changedState){
            expect(changedState).to.deep.equal(PeerJsStateEnum.online);
            done();
        });
        state.stateObject().network(state, true);
        expect(state.state()).to.deep.equal(PeerJsStateEnum.online);
    });

    it ("become peer off", (done)=> {
        expect(state.state()).to.deep.equal(PeerJsStateEnum.initial);
        state.stateObject().peer(state, false);
        expect(state.state()).to.deep.equal(PeerJsStateEnum.initial);
        done();
    });

    it ("become peer on", (done)=> {
        expect(state.state()).to.deep.equal(PeerJsStateEnum.initial);
        state.stateObject().peer(state, true);
        expect(state.state()).to.deep.equal(PeerJsStateEnum.initial);
        done();
    });
});
});