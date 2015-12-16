
describe("wait closing state", function() {
    var state;

    beforeEach(function(done) {
        state = new PeerIo.PeerJsStateManager();
        state.setStateObject(new PeerIo.WaitClosingState());
        done();
    });

    it ("become offline", function(done) {
        expect(state.state()).to.deep.equal(PeerIo.PeerJsStateEnum.wait_closing);
        state.stateObject().network(state, false);
        expect(state.state()).to.deep.equal(PeerIo.PeerJsStateEnum.wait_closing);
        done();
    });

    it ("become onOnline", function(done) {
        state.onStateChanged(function(changedState){
            expect(changedState).to.deep.equal(PeerIo.PeerJsStateEnum.connected);
            done();
        });
        state.stateObject().network(state, true);
    });

    it ("become peer off", function(done) {
        expect(state.state()).to.deep.equal(PeerIo.PeerJsStateEnum.wait_closing);
        state.onStateChanged(function(changedState){
            expect(changedState).to.deep.equal(PeerIo.PeerJsStateEnum.initial);
            done();
        });
        state.stateObject().peer(state, false);
    });

    it ("become peer on", function(done) {
        expect(state.state()).to.deep.equal(PeerIo.PeerJsStateEnum.wait_closing);
        state.stateObject().peer(state, true);
        expect(state.state()).to.deep.equal(PeerIo.PeerJsStateEnum.wait_closing);
        done();
    });
});
