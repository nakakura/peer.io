
describe("connected state", function() {
    var state;

    beforeEach(function(done) {
        state = new Model.PeerJsStateManager();
        state.setStateObject(new Model.ConnectedState());
        done();
    });

    it ("become offline", function(done) {
        expect(state.state()).to.deep.equal(Model.PeerJsStateEnum.connected);
        state.stateObject().network(state, false);
        expect(state.state()).to.deep.equal(Model.PeerJsStateEnum.initial);
        done();
    });

    it ("become online", function(done) {
        state.stateObject().network(state, true);
        expect(state.state()).to.deep.equal(Model.PeerJsStateEnum.connected);
        done();
    });

    it ("become peer off", function(done) {
        expect(state.state()).to.deep.equal(Model.PeerJsStateEnum.connected);
        state.onStateChanged(function(changedState){
            expect(changedState).to.deep.equal(Model.PeerJsStateEnum.online);
            done();
        });
        state.stateObject().peer(state, false);
        expect(state.state()).to.deep.equal(Model.PeerJsStateEnum.online);
    });

    it ("become peer on", function(done) {
        expect(state.state()).to.deep.equal(Model.PeerJsStateEnum.connected);
        state.stateObject().peer(state, true);
        expect(state.state()).to.deep.equal(Model.PeerJsStateEnum.connected);
        done();
    });

    it ("remove request", function(done) {
        expect(state.state()).to.deep.equal(Model.PeerJsStateEnum.connected);
        state.stateObject().request(state, false);
        expect(state.state()).to.deep.equal(Model.PeerJsStateEnum.connected);
        done();
    });

    it ("add request", function(done) {
        expect(state.state()).to.deep.equal(Model.PeerJsStateEnum.connected);
        state.onStateChanged(function(changedState){
            expect(changedState).to.deep.equal(Model.PeerJsStateEnum.connected_request);
            done();
        });
        state.stateObject().request(state, true);
        expect(state.state()).to.deep.equal(Model.PeerJsStateEnum.connected_request);
        done();
    });
});
