
describe("offline state", function() {
    var state;

    beforeEach(function(done) {
        state = new PeerIo.PeerJsStateManager();
        state.setStateObject(new PeerIo.OnlineState());
        done();
    });

    it ("become offline", function(done) {
        expect(state.state()).to.deep.equal(PeerIo.PeerJsStateEnum.online);
        state.onStateChanged(function(changedState){
            expect(changedState).to.deep.equal(PeerIo.PeerJsStateEnum.initial);
            done();
        });
        state.stateObject().network(state, false);
        expect(state.state()).to.deep.equal(PeerIo.PeerJsStateEnum.initial);
    });

    it ("become onOnline", function(done) {
        expect(state.state()).to.deep.equal(PeerIo.PeerJsStateEnum.online);
        done();
    });

    it ("become peer off", function(done) {
        expect(state.state()).to.deep.equal(PeerIo.PeerJsStateEnum.online);
        state.stateObject().peer(state, false);
        expect(state.state()).to.deep.equal(PeerIo.PeerJsStateEnum.online);
        done();
    });

    it ("become peer on", function(done) {
        expect(state.state()).to.deep.equal(PeerIo.PeerJsStateEnum.online);
        state.onStateChanged(function(changedState){
            expect(changedState).to.deep.equal(PeerIo.PeerJsStateEnum.connected);
            done();
        });
        state.stateObject().peer(state, true);
        expect(state.state()).to.deep.equal(PeerIo.PeerJsStateEnum.connected);
    });
});
