
describe("DataLinkComponent", function() {
    var videoLinkComp;
    var link;
    var neighbourID;

    beforeEach(function(done) {
        link = {
            answer: function(stream){},
            on: function(event){},
            close: function(){},
            open: true
        };

        neighbourID = "neighbour1";
        done();
    });

    it ("constructor", function(done) {
        var spy_on = sinon.spy(link, 'on');
        videoLinkComp = PeerIo.LinkComponentFactory.createLinkComponent(neighbourID, link);
        expect(spy_on.callCount).to.deep.equal(2);
        expect(videoLinkComp.type()).to.deep.equal(PeerIo.NeighbourTypeEnum.video);
        expect(videoLinkComp.peerID()).to.deep.equal(neighbourID);
        expect(videoLinkComp.key()).to.deep.equal(neighbourID + '-video');
        expect(videoLinkComp.isEstablished()).to.deep.equal(true);
        done();
    });


    //=======================send========================
    it ("send to established link", function(done) {
        videoLinkComp = PeerIo.LinkComponentFactory.createLinkComponent(neighbourID, link);
        expect(videoLinkComp.isEstablished()).to.deep.equal(true);
        videoLinkComp.send("hoge");
        // no error occurred
        done();
    });

    it ("send to not established link", function(done) {
        link.open = false;
        videoLinkComp = PeerIo.LinkComponentFactory.createLinkComponent(neighbourID, link);
        expect(videoLinkComp.isEstablished()).to.deep.equal(false);
        videoLinkComp.send("hoge");
        // no error occurred
        done();
    });

    it ("send to undefined link", function(done) {
        link.open = false;
        videoLinkComp = PeerIo.LinkComponentFactory.createLinkComponent(neighbourID, link);
        link = null;
        expect(videoLinkComp.isEstablished()).to.deep.equal(false);
        videoLinkComp.send("hoge");
        // no error occurred
        done();
    });
    //=======================send========================

    //=======================close========================
    it ("on close", function(done) {
        var spy_on = sinon.spy(link, 'on');
        var callback = sinon.spy();
        videoLinkComp = PeerIo.LinkComponentFactory.createLinkComponent(neighbourID, link);
        videoLinkComp.on(PeerIo.OnStopVideo, callback);
        expect(callback.callCount).to.deep.equal(0);
        expect(spy_on.getCall(0).args[0]).to.deep.equal('close');
        var onClose = spy_on.getCall(0).args[1];
        onClose();
        expect(callback.callCount).to.deep.equal(1);
        expect(videoLinkComp.isEstablished()).to.deep.equal(false);

        done();
    });

    it ("close", function(done) {
        var spy_on = sinon.spy(link, 'on');
        var callback = sinon.spy();
        videoLinkComp = PeerIo.LinkComponentFactory.createLinkComponent(neighbourID, link);
        videoLinkComp.on(PeerIo.OnStopVideo, callback);
        videoLinkComp.close();
        expect(callback.callCount).to.deep.equal(0);
        expect(videoLinkComp.isEstablished()).to.deep.equal(false);

        done();
    });
    //=======================close========================

});
