
describe("Target NeighbourTemplate", function() {
    beforeEach(function(done) {
        done();
    });

    it ("add not connected neighbours twice", function(done) {
        var neighbour = {
            connected: function(){ return false; },
            active: function(){ return false; },
            peerID: function () {
                return "addNeighbour-needConnect";
            },
            type: function(){
                return PeerIo.NeighbourTypeEnum.video;
            },
            key: function(){
                return "hoge";
            }
        };
        var targetNeighbours = new PeerIo.TargetNeighbours();
        //1回目add
        targetNeighbours.on(PeerIo.ON_NEED_ESTABLISH_LINK, function(callbackedOne){
            expect(callbackedOne).to.equal(neighbour);
        });
        targetNeighbours.on(PeerIo.ON_NEED_CLOSE_LINK, function(callbackedOne){
            assert.fail("not called here");
        });

        targetNeighbours.tryAddNeighbour(neighbour);

        var neighbour2 = {
            connected: function(){ return false; },
            active: function(){ return false; },
            peerID: function () {
                return "addNeighbour-needConnect";
            },
            type: function(){
                return PeerIo.NeighbourTypeEnum.video;
            },
            key: function(){
                return "hige";
            }
        };
        //2回目add
        targetNeighbours.removeAllListeners();
        targetNeighbours.on(PeerIo.ON_NEED_ESTABLISH_LINK, function(callbackedOne){
            expect(callbackedOne).to.equal(neighbour2);
            done();
        });
        targetNeighbours.on(PeerIo.ON_NEED_CLOSE_LINK, function(callbackedOne){
            assert.fail("not called here");
        });
        targetNeighbours.tryAddNeighbour(neighbour2);
    });
});