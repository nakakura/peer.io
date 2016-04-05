/// <reference path="../typings/main.d.ts" />

import {PeerConnectOption, LinkComponentTemplate, DataLinkComponent, VideoLinkComponent, LinkComponentFactory} from '../src/link_component';
import {NeighbourTypeEnum} from '../src/peer.io';
import * as chai from 'chai';
var expect = chai.expect;
declare var sinon;

describe('DataLinkComponent', () => {
    var dataLinkComp: LinkComponentTemplate;
    var link: any;
    var neighbourID: string;
    
    beforeEach((done) => {
        link = {
            send: function(message){},
            on: function(event){},
            close: function(){},
            reliable: false,
            open: true
        };

        neighbourID = "neighbour1";
        done();
    });

    it ("initialize", (done)=>{
        var spy_on = sinon.spy(link, 'on');
        dataLinkComp = LinkComponentFactory.createLinkComponent(neighbourID, link);
        expect(spy_on.callCount).to.deep.equal(3);
        expect(dataLinkComp.type()).to.deep.equal(NeighbourTypeEnum.data);
        expect(dataLinkComp.peerID()).to.deep.equal(neighbourID);
        expect(dataLinkComp.key()).to.deep.equal(neighbourID + '-data');
        expect(dataLinkComp.isEstablished()).to.deep.equal(true);
        done();
    });
    
    
});

