
describe("connected state", function() {
    var state;

    beforeEach(function(done) {
        state = new PeerIo.PeerJsStateManager();
        state.setStateObject(new PeerIo.ConnectedState());
        done();
    });

    it ("become offline", function(done) {
        expect(state.state()).to.deep.equal(PeerIo.PeerJsStateEnum.connected);
        state.stateObject().network(state, false);
        expect(state.state()).to.deep.equal(PeerIo.PeerJsStateEnum.wait_closing);
        done();
    });

    it ("become onOnline", function(done) {
        state.stateObject().network(state, true);
        expect(state.state()).to.deep.equal(PeerIo.PeerJsStateEnum.connected);
        done();
    });

    it ("become peer off", function(done) {
        expect(state.state()).to.deep.equal(PeerIo.PeerJsStateEnum.connected);
        state.onStateChanged(function(changedState){
            expect(changedState).to.deep.equal(PeerIo.PeerJsStateEnum.online);
            done();
        });
        state.stateObject().peer(state, false);
        expect(state.state()).to.deep.equal(PeerIo.PeerJsStateEnum.online);
    });

    it ("become peer on", function(done) {
        expect(state.state()).to.deep.equal(PeerIo.PeerJsStateEnum.connected);
        state.stateObject().peer(state, true);
        expect(state.state()).to.deep.equal(PeerIo.PeerJsStateEnum.connected);
        done();
    });
});
