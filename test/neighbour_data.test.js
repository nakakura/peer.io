
describe("DataNeighbour", function() {
    var peerID = "peerID";
    var dataChannel;

    beforeEach(function(done) {
        dataChannel = {
            on: function(event){},
            send: function(message){},
            close: function(){}
        };
        // 各テストごとの始まる前の処理
        done();
    });

    it ("constructor", function(done) {
        var dataNeighbour = new PeerIo.DataNeighbour(peerID);
        expect(dataNeighbour.peerID()).to.deep.equal(peerID);
        expect(dataNeighbour.type()).to.deep.equal(PeerIo.NeighbourTypeEnum.data);
        expect(dataNeighbour.connected()).to.deep.equal(false);
        done();
    });

    it ("source", function(done) {
        var dataNeighbour = new PeerIo.DataNeighbour(peerID);
        dataNeighbour.setSource({hoge: "hoge"});
        expect(dataNeighbour.sources()).to.deep.equal([]);
        done();
    });

    it ("setChannel-send", function(done) {
        var dataNeighbour = new PeerIo.DataNeighbour(peerID);
        var spy_on = sinon.spy(dataChannel, "on");
        var spy_send = sinon.spy(dataChannel, "send");
        dataNeighbour.setChannel(dataChannel);
        expect(spy_on.callCount).to.deep.equal(4);
        expect(spy_on.getCall(0).args[0]).to.deep.equal("open");
        expect(spy_on.getCall(1).args[0]).to.deep.equal("close");
        expect(spy_on.getCall(2).args[0]).to.deep.equal("error");
        expect(spy_on.getCall(3).args[0]).to.deep.equal("data");

        //send before onopen
        var sendMessage = "hoge";
        dataNeighbour.send(sendMessage);
        expect(spy_send.callCount).to.deep.equal(0);

        //send after onopen
        var onOpen = spy_on.getCall(0).args[1];
        onOpen();
        dataNeighbour.send(sendMessage);
        expect(spy_send.callCount).to.deep.equal(1);
        expect(spy_send.getCall(0).args[0]).to.deep.equal(sendMessage);

        done();
    });

    it ("setChannel-close", function(done) {
        var dataNeighbour = new PeerIo.DataNeighbour(peerID);
        var spy_on = sinon.spy(dataChannel, "on");
        var spy_send = sinon.spy(dataChannel, "send");
        dataNeighbour.setChannel(dataChannel);
        expect(spy_on.callCount).to.deep.equal(4);
        expect(spy_on.getCall(0).args[0]).to.deep.equal("open");
        expect(spy_on.getCall(1).args[0]).to.deep.equal("close");
        expect(spy_on.getCall(2).args[0]).to.deep.equal("error");
        expect(spy_on.getCall(3).args[0]).to.deep.equal("data");

        //send before onopen
        var sendMessage = "hoge";
        dataNeighbour.send(sendMessage);
        expect(spy_send.callCount).to.deep.equal(0);

        //send after onopen
        var onOpen = spy_on.getCall(0).args[1];
        onOpen();
        dataNeighbour.send(sendMessage);
        expect(spy_send.callCount).to.deep.equal(1);
        expect(spy_send.getCall(0).args[0]).to.deep.equal(sendMessage);

        //send after onclose
        var onClose = spy_on.getCall(1).args[1];
        onClose();
        dataNeighbour.send(sendMessage);
        expect(spy_send.callCount).to.deep.equal(1);

        done();
    });

    it ("setChannel-error", function(done) {
        var dataNeighbour = new PeerIo.DataNeighbour(peerID);
        var spy_on = sinon.spy(dataChannel, "on");
        var spy_send = sinon.spy(dataChannel, "send");
        dataNeighbour.setChannel(dataChannel);

        //send before onopen
        var sendMessage = "hoge";
        dataNeighbour.send(sendMessage);
        expect(spy_send.callCount).to.deep.equal(0);

        //send after onopen
        var onOpen = spy_on.getCall(0).args[1];
        onOpen();
        dataNeighbour.send(sendMessage);
        expect(spy_send.callCount).to.deep.equal(1);
        expect(spy_send.getCall(0).args[0]).to.deep.equal(sendMessage);

        //send after onerror
        var onClose = spy_on.getCall(1).args[1];
        onClose();
        dataNeighbour.send(sendMessage);
        expect(spy_send.callCount).to.deep.equal(1);

        done();
    });

    it ("setChannel-error", function(done) {
        var dataNeighbour = new PeerIo.DataNeighbour(peerID);
        var spy_on = sinon.spy(dataChannel, "on");
        var spy_send = sinon.spy(dataChannel, "send");
        dataNeighbour.setChannel(dataChannel);

        //send before onopen
        var sendMessage = "hoge";
        dataNeighbour.send(sendMessage);
        expect(spy_send.callCount).to.deep.equal(0);

        //send after onopen
        var onOpen = spy_on.getCall(0).args[1];
        onOpen();
        dataNeighbour.send(sendMessage);
        expect(spy_send.callCount).to.deep.equal(1);
        expect(spy_send.getCall(0).args[0]).to.deep.equal(sendMessage);

        //send after onerror
        var onClose = spy_on.getCall(1).args[1];
        onClose();
        dataNeighbour.send(sendMessage);
        expect(spy_send.callCount).to.deep.equal(1);

        done();
    });

    it ("setChannel-null", function(done) {
        var dataNeighbour = new PeerIo.DataNeighbour(peerID);
        var spy_on = sinon.spy(dataChannel, "on");
        var spy_send = sinon.spy(dataChannel, "send");
        dataNeighbour.setChannel(null);

        //send before onopen
        var sendMessage = "hoge";
        dataNeighbour.send(sendMessage);
        expect(spy_send.callCount).to.deep.equal(0);
        expect(spy_on.callCount).to.deep.equal(0);

        done();
    });

    it ("setChannel-data", function(done) {
        var dataNeighbour = new PeerIo.DataNeighbour(peerID);
        var spy_on = sinon.spy(dataChannel, "on");

        dataNeighbour.setChannel(dataChannel);
        var sendMessage = "hoge";

        expect(spy_on.getCall(3).args[0]).to.deep.equal("data");
        var onData = spy_on.getCall(3).args[1];
        dataNeighbour.on(PeerIo.OnData, function(data){
            expect(data).to.deep.equal(sendMessage);
            done();
        });
        onData(sendMessage);
    });
});

