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
    
    //=======================send========================
    it ("send to established link", function(done) {
        var spy_send = sinon.spy(link, 'send');
        dataLinkComp = LinkComponentFactory.createLinkComponent(neighbourID, link);
        expect(dataLinkComp.isEstablished()).to.deep.equal(true);
        dataLinkComp.send("hoge");
        expect(spy_send.callCount).to.deep.equal(1);
        expect(spy_send.getCall(0).args[0]).to.deep.equal('hoge');

        done();
    });

    it ("send to not established link", function(done) {
        link.open = false;
        var spy_send = sinon.spy(link, 'send');
        dataLinkComp = LinkComponentFactory.createLinkComponent(neighbourID, link);
        expect(dataLinkComp.isEstablished()).to.deep.equal(false);
        dataLinkComp.send("hoge");
        expect(spy_send.callCount).to.deep.equal(0);

        done();
    });

    it ("send to undefined link", function(done) {
        link.open = false;
        var spy_send = sinon.spy(link, 'send');
        dataLinkComp = LinkComponentFactory.createLinkComponent(neighbourID, link);
        link = null;
        expect(dataLinkComp.isEstablished()).to.deep.equal(false);
        dataLinkComp.send("hoge");
        expect(spy_send.callCount).to.deep.equal(0);

        done();
    });
    //=======================send========================

    //=======================recv========================
    it ("recv data", function(done) {
        var spy_on = sinon.spy(link, 'on');
        var callback = sinon.spy();

        dataLinkComp = LinkComponentFactory.createLinkComponent(neighbourID, link);
        dataLinkComp.on(LinkComponentTemplate.OnRecvData, callback);
        expect(callback.callCount).to.deep.equal(0);
        var onData = spy_on.getCall(2).args[1];
        onData('hoge');
        expect(callback.callCount).to.deep.equal(1);
        expect(callback.getCall(0).args[0]).to.deep.equal('hoge');

        done();
    });
    //=======================recv========================

    //=======================close========================
    it ("on close", function(done) {
        var spy_on = sinon.spy(link, 'on');
        var callback = sinon.spy();
        dataLinkComp = LinkComponentFactory.createLinkComponent(neighbourID, link);
        dataLinkComp.on(LinkComponentTemplate.OnDataLinkDown, callback);
        expect(callback.callCount).to.deep.equal(0);
        var onClose = spy_on.getCall(0).args[1];
        onClose();
        expect(callback.callCount).to.deep.equal(1);
        expect(dataLinkComp.isEstablished()).to.deep.equal(false);

        done();
    });

    it ("close", function(done) {
        var spy_on = sinon.spy(link, 'on');
        var callback = sinon.spy();
        dataLinkComp = LinkComponentFactory.createLinkComponent(neighbourID, link);
        dataLinkComp.on(LinkComponentTemplate.OnDataLinkDown, callback);
        dataLinkComp.close();
        expect(callback.callCount).to.deep.equal(0);
        expect(dataLinkComp.isEstablished()).to.deep.equal(false);

        done();
    });
    //=======================close========================

    
});

