
describe("Target NeighbourTemplate", function() {
    beforeEach(function(done) {
        done();
    });

    it ("addNeighbour-needConnect", function(done) {
        var neighbor = {
            connected: function(){ return false; },
            peerID: function () {
                return "addNeighbour-needConnect";
            },
            type: function(){
                return PeerIo.NeighbourTypeEnum.video;
            }
        };
        var targetNeighbours = new PeerIo.TargetNeighbours();
        //1回目add
        targetNeighbours.onNeedEstablishLink(function(neighbor){
            expect(neighbor).to.equal(neighbor);
        });
        targetNeighbours.onNeedCloseLink(function(neighbor){
            assert.fail("not called here");
        });

        targetNeighbours.addNeighbour(neighbor);

        //2回目add
        targetNeighbours.removeAllListeners();
        targetNeighbours.onNeedEstablishLink(function(neighbor){
            assert.fail("not called here");
        });
        targetNeighbours.onNeedCloseLink(function(neighbor){
            done();
        });
        targetNeighbours.addNeighbour(neighbor);
    });

    it ("addNeighbour-noNeedConnect", function(done) {
        var neighbor = {
            connected: function(){ return true; },
            peerID: function () {
                return "addNeighbour-noNeedConnect";
            },
            type: function(){
                return PeerIo.NeighbourTypeEnum.video;
            }
        };
        var targetNeighbours = new PeerIo.TargetNeighbours();

        //1回目add
        targetNeighbours.onNeedEstablishLink(function(neighbor){
            assert.fail("not called here");
        });
        targetNeighbours.onNeedCloseLink(function(neighbor){
            assert.fail("not called here");
        });
        targetNeighbours.addNeighbour(neighbor);

        //2回目add
        targetNeighbours.removeAllListeners();
        targetNeighbours.onNeedEstablishLink(function(neighbor){
            assert.fail("not called here");
        });
        targetNeighbours.onNeedCloseLink(function(neighbor){
            done();
        });

        targetNeighbours.addNeighbour(neighbor);
    });

    it ("removeNeighbour-needConnect", function() {
        var neighbor = {
            connected: function(){ return false; },
            peerID: function () {
                return "removeNeighbour-needConnect";
            },
            type: function(){
                return PeerIo.NeighbourTypeEnum.video;
            }
        };
        var targetNeighbours = new PeerIo.TargetNeighbours();

        //1回目remove
        targetNeighbours.onNeedEstablishLink(function(neighbor){
            assert.fail("not called here");
        });
        targetNeighbours.onNeedCloseLink(function(neighbor){
            assert.fail("not called here");
        });

        //2回目remove
        targetNeighbours.removeAllListeners();
        targetNeighbours.removeNeighbour(neighbor.peerID);
        targetNeighbours.onNeedEstablishLink(function(neighbor){
            assert.fail("not called here");
        });
        targetNeighbours.onNeedCloseLink(function(neighbor){
            assert.fail("not called here");
        });
        targetNeighbours.removeNeighbour(neighbor.peerID);

        //addして
        targetNeighbours.removeAllListeners();
        targetNeighbours.onNeedEstablishLink(function(neighbor){
        });
        targetNeighbours.onNeedCloseLink(function(neighbor){
            assert.fail("not called here");
        });
        targetNeighbours.addNeighbour(neighbor);

        //addしてremove
        targetNeighbours.removeAllListeners();
        targetNeighbours.onNeedEstablishLink(function(neighbor){
            assert.fail("not called here");
        });
        targetNeighbours.onNeedCloseLink(function(neighbor){
            assert.fail("not called here");
        });
        targetNeighbours.removeNeighbour(neighbor.peerID);
    });

    it ("removeNeighbour-noNeedConnect", function(done) {
        var neighbor = {
            connected: function(){ return true },
            peerID: function () {
                return "removeNeighbour-noNeedConnect";
            },
            type: function(){
                return PeerIo.NeighbourTypeEnum.video;
            }
        };
        var targetNeighbours = new PeerIo.TargetNeighbours();

        //1回目remove
        targetNeighbours.onNeedEstablishLink(function(neighbor){
            assert.fail("not called here");
        });
        targetNeighbours.onNeedCloseLink(function(neighbor){
            assert.fail("not called here");
        });

        //2回目remove
        targetNeighbours.removeAllListeners();
        targetNeighbours.removeNeighbour(neighbor.peerID());
        targetNeighbours.onNeedEstablishLink(function(neighbor){
            assert.fail("not called here");
        });
        targetNeighbours.onNeedCloseLink(function(neighbor){
            assert.fail("not called here");
        });
        targetNeighbours.removeNeighbour(neighbor.peerID());


        //addしてremove
        targetNeighbours.removeAllListeners();
        targetNeighbours.addNeighbour(neighbor);
        targetNeighbours.onNeedEstablishLink(function(neighbor){
            assert.fail("not called here");
        });
        targetNeighbours.onNeedCloseLink(function(neighbor){
            done();
        });
        targetNeighbours.removeNeighbour(neighbor.peerID());
    });

    it ("targetNeighbours", function() {
        var targetNeighbours = new PeerIo.TargetNeighbours();
        expect(targetNeighbours.targetNeighbours()).to.deep.equal([]);

        var connected = {
            connected: function(){ return true; },
            peerID: function () {
                return "connected"
            },
            type: function(){
                return PeerIo.NeighbourTypeEnum.video;
            }
        };
        targetNeighbours.addNeighbour(connected);
        expect(targetNeighbours.targetNeighbours()).to.deep.equal([]);

        var notConnected = {
            connected: function(){ return false; },
            peerID: function () {
                return "disconnected";
            },
            type: function(){
                return PeerIo.NeighbourTypeEnum.video;
            }
        };
        targetNeighbours.addNeighbour(notConnected);
        expect(targetNeighbours.targetNeighbours()).to.deep.equal([notConnected]);

        targetNeighbours.removeNeighbour(notConnected.peerID());
        expect(targetNeighbours.targetNeighbours()).to.deep.equal([]);
    });
});