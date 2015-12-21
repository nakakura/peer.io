
describe("Target NeighbourTemplate", function() {
    beforeEach(function(done) {
        done();
    });

    it ("add not connected two neighbours", function(done) {
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

    it ("add not active neighbour twice", function(done) {
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
            },
            close: function () {
            }
        };

        var spy_close = sinon.spy(neighbour, "close");
        var targetNeighbours = new PeerIo.TargetNeighbours();
        //1回目add
        targetNeighbours.on(PeerIo.ON_NEED_ESTABLISH_LINK, function(callbackedOne){
            expect(callbackedOne).to.equal(neighbour);
        });

        targetNeighbours.tryAddNeighbour(neighbour);
        expect(spy_close.callCount).to.deep.equal(0);

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
                return "hoge";
            },
            close: function(){}
        };

        var spy_close2 = sinon.spy(neighbour2, "close");
        //2回目add
        targetNeighbours.removeAllListeners();
        targetNeighbours.on(PeerIo.ON_NEED_ESTABLISH_LINK, function(callbackedOne){
            expect(callbackedOne).to.equal(neighbour2);
        });
        targetNeighbours.tryAddNeighbour(neighbour2);
        expect(spy_close.callCount).to.deep.equal(1);
        expect(spy_close2.callCount).to.deep.equal(0);

        done();
    });

    it ("add connected neighbour twice", function(done) {
        var neighbour = {
            connected: function(){ return true; },
            active: function(){ return true; },
            peerID: function () {
                return "addNeighbour-needConnect";
            },
            type: function(){
                return PeerIo.NeighbourTypeEnum.video;
            },
            key: function(){
                return "hoge";
            },
            close: function () {
            }
        };

        var spy_close = sinon.spy(neighbour, "close");
        var targetNeighbours = new PeerIo.TargetNeighbours();
        //1回目add
        targetNeighbours.on(PeerIo.ON_NEED_ESTABLISH_LINK, function(callbackedOne){
            assert.fail("not called here");
        });

        targetNeighbours.tryAddNeighbour(neighbour);
        expect(spy_close.callCount).to.deep.equal(0);

        var neighbour2 = {
            connected: function(){ return true; },
            active: function(){ return true; },
            peerID: function () {
                return "addNeighbour-needConnect";
            },
            type: function(){
                return PeerIo.NeighbourTypeEnum.video;
            },
            key: function(){
                return "hoge";
            },
            close: function(){}
        };

        var spy_close2 = sinon.spy(neighbour2, "close");
        //2回目add
        targetNeighbours.removeAllListeners();
        targetNeighbours.on(PeerIo.ON_NEED_ESTABLISH_LINK, function(callbackedOne){
            assert.fail("not called here");
        });
        targetNeighbours.tryAddNeighbour(neighbour2);
        expect(spy_close.callCount).to.deep.equal(1);
        expect(spy_close2.callCount).to.deep.equal(0);

        done();
    });

    it ("connectedNeighbour(), findNeighbour(), targetNeighbours()", function(done) {
        var notActiveNeighbour = {
            connected: function(){ return false; },
            active: function(){ return false; },
            peerID: function () {
                return "addNeighbour-needConnect";
            },
            type: function(){
                return PeerIo.NeighbourTypeEnum.video;
            },
            key: function(){
                return "not active";
            },
            close: function () {
            }
        };

        var activeNeighbour = {
            connected: function(){ return false; },
            active: function(){ return true; },
            peerID: function () {
                return "addNeighbour-needConnect";
            },
            type: function(){
                return PeerIo.NeighbourTypeEnum.video;
            },
            key: function(){
                return "active";
            },
            close: function () {
            }
        };

        var connectedNeighbour = {
            connected: function(){ return true; },
            active: function(){ return true; },
            peerID: function () {
                return "addNeighbour-needConnect";
            },
            type: function(){
                return PeerIo.NeighbourTypeEnum.video;
            },
            key: function(){
                return "connected";
            },
            close: function () {
            }
        };

        var targetNeighbours = new PeerIo.TargetNeighbours();
        targetNeighbours.tryAddNeighbour(notActiveNeighbour);
        targetNeighbours.tryAddNeighbour(activeNeighbour);
        targetNeighbours.tryAddNeighbour(connectedNeighbour);
        expect(targetNeighbours.targetNeighbours()).to.deep.equal([notActiveNeighbour]);
        expect(targetNeighbours.connectedNeighbours()).to.deep.equal([connectedNeighbour]);

        expect(targetNeighbours.findNeighbour(notActiveNeighbour.key())).to.deep.equal(notActiveNeighbour);
        expect(targetNeighbours.findNeighbour(activeNeighbour.key())).to.deep.equal(activeNeighbour);
        expect(targetNeighbours.findNeighbour(connectedNeighbour.key())).to.deep.equal(connectedNeighbour);

        targetNeighbours.removeNeighbour(notActiveNeighbour.key());
        targetNeighbours.removeNeighbour(activeNeighbour.key());
        targetNeighbours.removeNeighbour(connectedNeighbour.key());

        expect(targetNeighbours.targetNeighbours()).to.deep.equal([]);
        expect(targetNeighbours.connectedNeighbours()).to.deep.equal([]);

        expect(targetNeighbours.findNeighbour(notActiveNeighbour.key())).to.deep.equal(null);
        expect(targetNeighbours.findNeighbour(activeNeighbour.key())).to.deep.equal(null);
        expect(targetNeighbours.findNeighbour(connectedNeighbour.key())).to.deep.equal(null);

        done();
    });
});