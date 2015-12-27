
describe("NeighbourStore", function() {
    var neighbourStore;

    beforeEach(function(done) {
        neighbourStore = new PeerIo.NeighbourStore();
        done();
    });

    it ("when adding neighbour, there is no stored neighbour.", function(done) {
        var key = "moge";
        var record = {};
        record.key = sinon.stub().returns(key);
        var callback = sinon.spy();
        neighbourStore.on(neighbourStore.NEED_ESTABLISH_LINK, callback);
        neighbourStore.addRecord(record);

        //NEED_ESTABLISH_LINK fired
        assert(callback.calledOnce);
        expect(callback.getCall(0).args[0]).to.deep.equal(record);

        //link established successfully
        var link = "hoge";

        //addlink and check successfully added link
        record.addLink(link);
        expect(neighbourStore.linksHash_).to.deep.equal({moge: link});

        done();
    });


    it ("when adding link, a link has already been added", function(done) {
        var key = "moge";
        var record = {};
        record.key = sinon.stub().returns(key);
        var callback = sinon.spy();
        neighbourStore.on(neighbourStore.NEED_ESTABLISH_LINK, callback);
        neighbourStore.addRecord(record);

        //NEED_ESTABLISH_LINK fired
        assert(callback.calledOnce);
        expect(callback.getCall(0).args[0]).to.deep.equal(record);

        //link established successfully
        var link = "hoge";

        //before addlink, other link has beed added
        var oldLink = {isEstablished: function(){return true}, close: function(){}};
        neighbourStore.linksHash_ = {moge: oldLink};
        var spy_close = sinon.spy(oldLink, "close");
        //addlink and check successfully added link
        record.addLink(link);
        expect(neighbourStore.linksHash_).to.deep.equal({moge: link});
        //if the old link is established, neighbourstore has to close it.
        assert(spy_close.calledOnce);

        done();
    });

    it ("when adding neighbour, there is an established neighbour.", function(done) {
        var key = "moge";
        var oldRecord = {isEstablished: function(){return true}};
        neighbourStore.recordsHash_ = {moge: oldRecord};

        var record = {};
        record.key = sinon.stub().returns(key);
        var callback = sinon.spy();
        neighbourStore.on(neighbourStore.NEED_ESTABLISH_LINK, callback);
        neighbourStore.addRecord(record);

        //NEED_ESTABLISH_LINK not fired
        expect(callback.callCount).to.deep.equal(0);

        done();
    });

    it ("when adding neighbour, there is an not-established neighbour.", function(done) {
        var oldRecord = {key: function(){ return "moge"}, isEstablished: function(){return false}};
        neighbourStore.addRecord(oldRecord);

        var key = "moge";
        var record = {};
        record.key = sinon.stub().returns(key);
        var callback = sinon.spy();
        neighbourStore.on(neighbourStore.NEED_ESTABLISH_LINK, callback);
        neighbourStore.addRecord(record);

        //NEED_ESTABLISH_LINK fired
        assert(callback.calledOnce);
        expect(callback.getCall(0).args[0]).to.deep.equal(oldRecord); //oldRecord will come back

        //link established successfully
        var link = "hoge";

        //addlink and check successfully added link
        oldRecord.addLink(link);
        expect(neighbourStore.linksHash_).to.deep.equal({moge: link});

        done();
    });

    it ("remove record", function(done) {
        var key = "moge";
        var record = {key: function(){return "moge"}};
        neighbourStore.recordsHash_ = {moge: record};
        var oldLink = {isEstablished: function(){return true}, close: function(){}};
        var spy_close = sinon.spy(oldLink, "close");

        neighbourStore.linksHash_ = {moge: oldLink};
        neighbourStore.removeRecord(record);

        //addlink and check successfully added link
        expect(neighbourStore.recordsHash_).to.deep.equal({});
        expect(neighbourStore.linksHash_).to.deep.equal({});
        //if the old link is established, neighbourstore has to close it.
        assert(spy_close.calledOnce);

        done();
    });
});
