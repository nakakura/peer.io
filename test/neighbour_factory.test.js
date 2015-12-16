
describe("NeighbourFactory", function() {
    beforeEach(function(done) {
        // 各テストごとの始まる前の処理
        done();
    });

    it ("video", function(done) {
        var videoNeighbour = PeerIo.NeighbourFactory.createNeighbour("peerID", PeerIo.NeighbourTypeEnum.video);
        expect(videoNeighbour.peerID()).to.deep.equal("peerID");
        expect(videoNeighbour.type()).to.deep.equal(PeerIo.NeighbourTypeEnum.video);
        done();
    });

    it ("data", function(done) {
        var videoNeighbour = PeerIo.NeighbourFactory.createNeighbour("peerID", PeerIo.NeighbourTypeEnum.data);
        expect(videoNeighbour.peerID()).to.deep.equal("peerID");
        expect(videoNeighbour.type()).to.deep.equal(PeerIo.NeighbourTypeEnum.data);
        done();
    });
});

