
describe("DataLinkComponent", function() {
    var dataLinkComp;
    var link;
    var neighbourID;

    beforeEach(function(done) {
        link = {
            send: function(message){},
            on: function(event){},
            close: function(){},
            open: true
        };

        neighbourID = "neighbour1";
        done();
    });

    it ("constructor", function(done) {
        var spy_on = sinon.spy(link, 'on');
        dataLinkComp = PeerIo.LinkComponentFactory.createLinkComponent(neighbourID, link);
        expect(spy_on.callCount).to.deep.equal(3);
        expect(dataLinkComp.type()).to.deep.equal(PeerIo.NeighbourTypeEnum.data);
        expect(dataLinkComp.peerID()).to.deep.equal(neighbourID);
        expect(dataLinkComp.key()).to.deep.equal(neighbourID + '-data');
        expect(dataLinkComp.isEstablished()).to.deep.equal(true);
        done();
    });

    //=======================send========================
    it ("send to established link", function(done) {
        var spy_send = sinon.spy(link, 'send');
        dataLinkComp = PeerIo.LinkComponentFactory.createLinkComponent(neighbourID, link);
        expect(dataLinkComp.isEstablished()).to.deep.equal(true);
        dataLinkComp.send("hoge");
        expect(spy_send.callCount).to.deep.equal(1);
        expect(spy_send.getCall(0).args[0]).to.deep.equal('hoge');

        done();
    });

    it ("send to not established link", function(done) {
        link.open = false;
        var spy_send = sinon.spy(link, 'send');
        dataLinkComp = PeerIo.LinkComponentFactory.createLinkComponent(neighbourID, link);
        expect(dataLinkComp.isEstablished()).to.deep.equal(false);
        dataLinkComp.send("hoge");
        expect(spy_send.callCount).to.deep.equal(0);

        done();
    });

    it ("send to undefined link", function(done) {
        link.open = false;
        var spy_send = sinon.spy(link, 'send');
        dataLinkComp = PeerIo.LinkComponentFactory.createLinkComponent(neighbourID, link);
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

        dataLinkComp = PeerIo.LinkComponentFactory.createLinkComponent(neighbourID, link);
        dataLinkComp.on(PeerIo.OnRecvData, callback);
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
        dataLinkComp = PeerIo.LinkComponentFactory.createLinkComponent(neighbourID, link);
        dataLinkComp.on(PeerIo.OnDataLinkDown, callback);
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
        dataLinkComp = PeerIo.LinkComponentFactory.createLinkComponent(neighbourID, link);
        dataLinkComp.on(PeerIo.OnDataLinkDown, callback);
        dataLinkComp.close();
        expect(callback.callCount).to.deep.equal(0);
        expect(dataLinkComp.isEstablished()).to.deep.equal(false);

        done();
    });
    //=======================close========================

});
