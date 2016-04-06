/// <reference path="../typings/main.d.ts" />

import LinkGenerator from '../src/link_generator';
import {NeighbourTypeEnum} from '../src/peer.io';
import {LinkComponentFactory} from '../src/link_component';
import * as chai from 'chai';
var expect = chai.expect;
declare var sinon;
declare var Offline;

describe('LinkGenerator', () => {
    var spy_offline_on = sinon.spy(Offline, "on");
    var spy_offline_check = sinon.spy(Offline, "check");
    var clock;
    
    before((done)=>{
        clock = sinon.useFakeTimers();
        done();
    });

    after(()=>{
        clock.restore();
    });
   
    beforeEach((done)=>{
        spy_offline_on.reset();
        spy_offline_check.reset();
        done();
    });
    
    it("initialize", (done)=>{
        var peer: any = {on: function(){}};
        var spy_peer_on = sinon.spy(peer, "on");

        var linkGenerator = new LinkGenerator(peer);
        expect(spy_peer_on.callCount).to.deep.equal(5);
        expect(spy_offline_on.callCount).to.deep.equal(2);
        expect(spy_offline_check.callCount).to.deep.equal(1);

        done();
    });
    
    it("on state change to call", function (done) {
        //this test will fail if test client is offline.
        var link = {
            answer: function(stream){},
            localStream: "hoge",
            on: function(event){},
            close: function(){},
            open: true
        };
        var localStream = "hoge";
        var spy_stream_on = sinon.spy();
        var peer: any = {
            on: function(){},
            disconnected: true,
            call: function(peerId, localStream_){
                expect(peerId).to.deep.equal("neighbour");
                expect(localStream_).to.deep.equal(localStream);
                var stream: any = {};
                stream.on = spy_stream_on;
                stream.answer = function(){  };
                stream.localStream = "hoge";
                return stream;
            }
        };
        var spy_peer_on = sinon.spy(peer, "on");
        var source: any = function(){
            var neighbour = LinkComponentFactory.createLinkComponent("neighbour", link);
            neighbour.streams = function(){ return [localStream] };
            neighbour.isEstablished = function(){ return false; };
            return {neighbour: neighbour};
        };
        var linkGenerator = new LinkGenerator(peer);
        linkGenerator.addNeighbourSource("source", source);

        var onOfflineUp = spy_offline_on.getCall(0).args[1];
        var onPeerOpen = spy_peer_on.getCall(0).args[1];
        onOfflineUp();
        onPeerOpen();
        clock.tick(5000);

        linkGenerator.on(LinkGenerator.OnNewMediaStream, function(link, stream){
            expect(link.type()).to.deep.equal(NeighbourTypeEnum.video);
            expect(stream).to.deep.equal("new stream");
            done();
        });

        expect(spy_stream_on.callCount).to.deep.equal(1);
        var onStream = spy_stream_on.getCall(0).args[1];
        onStream("new stream");
    });

    it("on call from neighbour", function (done) {
        //this test will fail if test client is offline.
        var link = {
            answer: function(stream){},
            localStream: "hoge",
            on: function(event){},
            close: function(){},
            open: true
        };
        var localStream = "hoge";
        var peer: any = {
            on: function(){},
            disconnected: false,
            call: function(peerId, localStream_){
                expect(peerId).to.deep.equal("neighbour");
                expect(localStream_).to.deep.equal(localStream);
                var stream: any = {};
                stream.answer = function(){  };
                stream.localStream = "hoge";
                return stream;
            }
        };
        var spy_peer_on = sinon.spy(peer, "on");
        var linkGenerator = new LinkGenerator(peer);
        linkGenerator.setDefaultStream(<any>"default stream");

        linkGenerator.on(LinkGenerator.OnNewMediaStream, function(link, stream){
            expect(link.type()).to.deep.equal(NeighbourTypeEnum.video);
            expect(stream).to.deep.equal("new stream");
            done();
        });

        var onCall = spy_peer_on.getCall(4).args[1];
        var mediaConnection = {peer: "neighbour", on: function(){}, answer: function(){}, localStream: "hoge"};
        var spy_mediaconnection_answer = sinon.spy(mediaConnection, "answer");
        var spy_mediaconnection_on = sinon.spy(mediaConnection, "on");
        onCall(mediaConnection);
        expect(spy_mediaconnection_answer.callCount).to.deep.equal(1);
        var answeredStream = spy_mediaconnection_answer.getCall(0).args[0];
        expect(answeredStream).to.deep.equal("default stream");
        var onStream = spy_mediaconnection_on.getCall(0).args[1];
        onStream("new stream");
    });

    it("on state change to connect", function (done) {
        //this test will fail if test client is offline.
        var link: any = {
            on: function(event){},
            close: function(){},
            reliable: false,
            open: true
        };
        var option = "hoge";
        var spy_stream_on = sinon.spy();
        var peer: any = {
            on: function(){},
            disconnected: true,
            connect: function(peerId, option_){
                expect(peerId).to.deep.equal("neighbour");
                expect(option_).to.deep.equal(option);
                var dataChannel: any = {};
                dataChannel.on = spy_stream_on;
                dataChannel.reliable = false;
                return dataChannel;
            }
        };
        var spy_peer_on = sinon.spy(peer, "on");
        var source: any = function(){
            var neighbour: any = LinkComponentFactory.createLinkComponent("neighbour", link);
            neighbour.dataChannelOption = function(){ return option };
            neighbour.isEstablished = function(){ return false; };
            return {neighbour: neighbour};
        };
        var linkGenerator = new LinkGenerator(peer);
        linkGenerator.addNeighbourSource("source", source);

        var onOfflineUp = spy_offline_on.getCall(0).args[1];
        var onPeerOpen = spy_peer_on.getCall(0).args[1];
        onOfflineUp();
        onPeerOpen();
        clock.tick(5000);

        linkGenerator.on(LinkGenerator.OnNewDataChannel, function(link){
            expect(link.type()).to.deep.equal(NeighbourTypeEnum.data);
            done();
        });

        var onDataOpen = spy_stream_on.getCall(0).args[1];
        onDataOpen();
    });

    it("on connect from neighbour", function (done) {
        //this test will fail if test client is offline.
        var link = {
            on: function(event){},
            close: function(){},
            reliable: false,
            open: true
        };
        var localStream = "hoge";
        var peer: any = {
            on: function(){},
            disconnected: false,
            connect: function(peerId, localStream_){
                expect(peerId).to.deep.equal("neighbour");
                expect(localStream_).to.deep.equal(localStream);
                var dataChannel: any = {};
                dataChannel.reliable = false;
                return dataChannel;
            }
        };
        var spy_peer_on = sinon.spy(peer, "on");
        var linkGenerator = new LinkGenerator(peer);

        linkGenerator.on(LinkGenerator.OnNewDataChannel, function(link){
            expect(link.type()).to.deep.equal(NeighbourTypeEnum.data);
            done();
        });

        var onConnection = spy_peer_on.getCall(3).args[1];
        var spy_dataconnection_on = sinon.spy(link, "on");
        onConnection(link);
        var onDataOpen = spy_dataconnection_on.getCall(0).args[1];
        onDataOpen();
    });
});

