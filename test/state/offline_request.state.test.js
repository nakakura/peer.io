
describe("offline request state", function() {
    var state;

    beforeEach(function(done) {
        state = new Model.PeerJsStateManager();
        state.setStateObject(new Model.OfflineRequestState());
        done();
    });

    it ("become offline", function(done) {
        expect(state.state()).to.deep.equal(Model.PeerJsStateEnum.offline_request);
        state.stateObject().network(state, false);
        expect(state.state()).to.deep.equal(Model.PeerJsStateEnum.offline_request);
        done();
    });

    it ("become online", function(done) {
        state.onStateChanged(function(changedState){
            expect(changedState).to.deep.equal(Model.PeerJsStateEnum.online_request);
            done();
        });
        state.stateObject().network(state, true);
        expect(state.state()).to.deep.equal(Model.PeerJsStateEnum.online_request);
    });

    it ("become peer off", function(done) {
        expect(state.state()).to.deep.equal(Model.PeerJsStateEnum.offline_request);
        state.stateObject().peer(state, false);
        expect(state.state()).to.deep.equal(Model.PeerJsStateEnum.offline_request);
        done();
    });

    it ("become peer on", function(done) {
        expect(state.state()).to.deep.equal(Model.PeerJsStateEnum.offline_request);
        state.stateObject().peer(state, true);
        expect(state.state()).to.deep.equal(Model.PeerJsStateEnum.offline_request);
        done();
    });

    it ("remove request", function(done) {
        expect(state.state()).to.deep.equal(Model.PeerJsStateEnum.offline_request);
        state.onStateChanged(function(changedState){
            expect(changedState).to.deep.equal(Model.PeerJsStateEnum.initial);
            done();
        });
        state.stateObject().request(state, false);
        expect(state.state()).to.deep.equal(Model.PeerJsStateEnum.initial);
    });

    it ("add request", function(done) {
        expect(state.state()).to.deep.equal(Model.PeerJsStateEnum.offline_request);
        state.stateObject().request(state, true);
        expect(state.state()).to.deep.equal(Model.PeerJsStateEnum.offline_request);
        done();
    });
});
