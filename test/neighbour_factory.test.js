
describe("NeighbourFactory", function() {
    beforeEach(function(done) {
        // 各テストごとの始まる前の処理
        done();
    });

    it ("video", function(done) {
        var videoNeighbour = Model.NeighbourFactory.createNeighbour("peerID", Model.NeighbourTypeEnum.video);
        expect(videoNeighbour.peerID()).to.deep.equal("peerID");
        expect(videoNeighbour.type()).to.deep.equal(Model.NeighbourTypeEnum.video);
        done();
    });

    it ("data", function(done) {
        var videoNeighbour = Model.NeighbourFactory.createNeighbour("peerID", Model.NeighbourTypeEnum.data);
        expect(videoNeighbour.peerID()).to.deep.equal("peerID");
        expect(videoNeighbour.type()).to.deep.equal(Model.NeighbourTypeEnum.data);
        done();
    });
});

