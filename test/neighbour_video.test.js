
describe("videoNeighbour", function() {
    var peerID = "peerID";
    var mediastream;

    beforeEach(function(done) {
        mediastream = {
            on: function(event){},
            close: function(){},
            send: function () {} // ホントはこんなのはない．Spy用
        };
        // 各テストごとの始まる前の処理
        done();
    });

    it ("constructor", function(done) {
        var videoNeighbour = new Model.VideoNeighbour(peerID);
        expect(videoNeighbour.peerID()).to.deep.equal(peerID);
        expect(videoNeighbour.type()).to.deep.equal(Model.NeighbourTypeEnum.video);
        done();
    });

    it ("single source", function(done) {
        var videoNeighbour = new Model.VideoNeighbour(peerID);
        videoNeighbour.setSource({hoge: "hoge"});
        expect(videoNeighbour.sources()).to.deep.equal([{hoge: "hoge"}]);
        done();
    });

    it ("multiple sources", function(done) {
        var videoNeighbour = new Model.VideoNeighbour(peerID);
        var sources = [];
        sources.push({hoge: "hoge"});
        sources.push({hoge: "moge"});
        videoNeighbour.setSource(sources);
        expect(videoNeighbour.sources()).to.deep.equal(sources);
        done();
    });

    it ("setChannel-send", function(done) {
        var videoNeighbour = new Model.VideoNeighbour(peerID);
        var spy_on = sinon.spy(mediastream, "on");
        var spy_send = sinon.spy(mediastream, "send");
        videoNeighbour.setChannel(mediastream);
        expect(spy_on.callCount).to.deep.equal(3);
        expect(spy_on.getCall(0).args[0]).to.deep.equal("stream");
        expect(spy_on.getCall(1).args[0]).to.deep.equal("close");
        expect(spy_on.getCall(2).args[0]).to.deep.equal("error");

        //send before onopen
        var sendMessage = "hoge";
        videoNeighbour.send(sendMessage);
        expect(spy_send.callCount).to.deep.equal(0);

        done();
    });

    it ("setChannel-null", function(done) {
        var dataNeighbour = new Model.DataNeighbour(peerID);
        var spy_on = sinon.spy(mediastream, "on");
        var spy_send = sinon.spy(mediastream, "send");
        dataNeighbour.setChannel(null);

        //send before onopen
        var sendMessage = "hoge";
        dataNeighbour.send(sendMessage);
        expect(spy_send.callCount).to.deep.equal(0);
        expect(spy_on.callCount).to.deep.equal(0);

        done();
    });
});
