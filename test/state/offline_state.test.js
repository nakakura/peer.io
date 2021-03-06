
describe("onOnline state", function() {
    var state;

    beforeEach(function(done) {
        state = new PeerIo.PeerJsStateManager();
        done();
    });

    it ("become offline", function(done) {
        expect(state.state()).to.deep.equal(PeerIo.PeerJsStateEnum.initial);
        state.stateObject().network(state, false);
        expect(state.state()).to.deep.equal(PeerIo.PeerJsStateEnum.initial);
        done();
    });

    it ("become onOnline", function(done) {
        state.onStateChanged(function(changedState){
            expect(changedState).to.deep.equal(PeerIo.PeerJsStateEnum.online);
            done();
        });
        state.stateObject().network(state, true);
        expect(state.state()).to.deep.equal(PeerIo.PeerJsStateEnum.online);
    });

    it ("become peer off", function(done) {
        expect(state.state()).to.deep.equal(PeerIo.PeerJsStateEnum.initial);
        state.stateObject().peer(state, false);
        expect(state.state()).to.deep.equal(PeerIo.PeerJsStateEnum.initial);
        done();
    });

    it ("become peer on", function(done) {
        expect(state.state()).to.deep.equal(PeerIo.PeerJsStateEnum.initial);
        state.stateObject().peer(state, true);
        expect(state.state()).to.deep.equal(PeerIo.PeerJsStateEnum.initial);
        done();
    });
});
