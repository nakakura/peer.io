
describe("online state", function() {
    var state;

    beforeEach(function(done) {
        state = new Model.PeerJsStateManager();
        done();
    });

    it ("become offline", function(done) {
        expect(state.state()).to.deep.equal(Model.PeerJsStateEnum.initial);
        state.stateObject().network(state, false);
        expect(state.state()).to.deep.equal(Model.PeerJsStateEnum.initial);
        done();
    });

    it ("become online", function(done) {
        state.onStateChanged(function(changedState){
            expect(changedState).to.deep.equal(Model.PeerJsStateEnum.online);
            done();
        });
        state.stateObject().network(state, true);
        expect(state.state()).to.deep.equal(Model.PeerJsStateEnum.online);
    });

    it ("become peer off", function(done) {
        expect(state.state()).to.deep.equal(Model.PeerJsStateEnum.initial);
        state.stateObject().peer(state, false);
        expect(state.state()).to.deep.equal(Model.PeerJsStateEnum.initial);
        done();
    });

    it ("become peer on", function(done) {
        expect(state.state()).to.deep.equal(Model.PeerJsStateEnum.initial);
        state.stateObject().peer(state, true);
        expect(state.state()).to.deep.equal(Model.PeerJsStateEnum.initial);
        done();
    });

    it ("remove request", function(done) {
        expect(state.state()).to.deep.equal(Model.PeerJsStateEnum.initial);
        state.stateObject().request(state, false);
        expect(state.state()).to.deep.equal(Model.PeerJsStateEnum.initial);
        done();
    });

    it ("add request", function(done) {
        expect(state.state()).to.deep.equal(Model.PeerJsStateEnum.initial);
        state.onStateChanged(function(changedState){
            expect(changedState).to.deep.equal(Model.PeerJsStateEnum.offline_request);
            done();
        });
        state.stateObject().request(state, true);
        expect(state.state()).to.deep.equal(Model.PeerJsStateEnum.offline_request);
        done();
    });
});
