/// <reference path="../typings/main.d.ts" />

import {PeerConnectOption, LinkComponentTemplate, DataLinkComponent, VideoLinkComponent, LinkComponentFactory} from '../src/link_component';
import {NeighbourTypeEnum} from '../src/peer.io';
import * as chai from 'chai';
var expect = chai.expect;
declare var sinon;

describe('VideoLinkComponent', () => {
    var videoLinkComp: LinkComponentTemplate;
    var link: any;
    var neighbourID: string;
    
    beforeEach((done)=>{
        link = {
            answer: function(stream){},
            on: function(event){},
            close: function(){},
            localStream: "hoge",
            open: true
        };

        neighbourID = "neighbour1";
        done();
    });

    it ("initialize", (done)=>{
        var spy_on = sinon.spy(link, 'on');
        videoLinkComp = LinkComponentFactory.createLinkComponent(neighbourID, link);
        expect(spy_on.callCount).to.deep.equal(2);
        expect(videoLinkComp.type()).to.deep.equal(NeighbourTypeEnum.video);
        expect(videoLinkComp.peerID()).to.deep.equal(neighbourID);
        expect(videoLinkComp.key()).to.deep.equal(neighbourID + '-video');
        expect(videoLinkComp.isEstablished()).to.deep.equal(true);
        done();
    });
   
    //=======================send========================
    it ("send to established link", (done)=>{
        videoLinkComp = LinkComponentFactory.createLinkComponent(neighbourID, link);
        expect(videoLinkComp.isEstablished()).to.deep.equal(true);
        videoLinkComp.send("hoge");
        // no error occurred
        done();
    });

    it ("send to not established link", (done)=>{
        link.open = false;
        videoLinkComp = LinkComponentFactory.createLinkComponent(neighbourID, link);
        expect(videoLinkComp.isEstablished()).to.deep.equal(false);
        videoLinkComp.send("hoge");
        // no error occurred
        done();
    });

    it ("send to undefined link", (done)=>{
        link.open = false;
        videoLinkComp = LinkComponentFactory.createLinkComponent(neighbourID, link);
        link = null;
        expect(videoLinkComp.isEstablished()).to.deep.equal(false);
        videoLinkComp.send("hoge");
        // no error occurred
        done();
    });
    //=======================send========================

    //=======================close========================
    it ("on close", (done)=>{
        var spy_on = sinon.spy(link, 'on');
        var callback = sinon.spy();
        videoLinkComp = LinkComponentFactory.createLinkComponent(neighbourID, link);
        videoLinkComp.on(LinkComponentTemplate.OnStopVideo, callback);
        expect(callback.callCount).to.deep.equal(0);
        expect(spy_on.getCall(0).args[0]).to.deep.equal('close');
        var onClose = spy_on.getCall(0).args[1];
        onClose();
        expect(callback.callCount).to.deep.equal(1);
        expect(videoLinkComp.isEstablished()).to.deep.equal(false);

        done();
    });

    it ("close", (done)=>{
        var spy_on = sinon.spy(link, 'on');
        var callback = sinon.spy();
        videoLinkComp = LinkComponentFactory.createLinkComponent(neighbourID, link);
        videoLinkComp.on(LinkComponentTemplate.OnStopVideo, callback);
        videoLinkComp.close();
        expect(callback.callCount).to.deep.equal(0);
        expect(videoLinkComp.isEstablished()).to.deep.equal(false);

        done();
    });
    //=======================close========================
});

