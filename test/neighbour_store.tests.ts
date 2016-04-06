/// <reference path="../typings/main.d.ts" />

import NeighbourStore from '../src/neighbour_store';
import * as chai from 'chai';
var expect = chai.expect;
declare var sinon;

describe('NeighbourStore', () => {
    var neighbourStore: NeighbourStore;

    beforeEach((done) => {
        neighbourStore = new NeighbourStore();
        done();
    });
    
    it ("when adding neighbour, there is no stored neighbour.", (done)=>{
        var key = "moge";
        var record: any = {};
        record.key = sinon.stub().returns(key);
        var callback = sinon.spy();
        neighbourStore.on(NeighbourStore.OnNeedEstablishLink, callback);
        neighbourStore.addRecord(record);

        //NEED_ESTABLISH_LINK fired
        chai.assert(callback.calledOnce);
        expect(callback.getCall(0).args[0]).to.deep.equal(record);

        //link established successfully
        var link = "hoge";

        //addlink and check successfully added link
        record.addLink(link);
        expect((<any>neighbourStore).linksHash_).to.deep.equal({moge: link});

        done();
    });
    
    it ("when adding link, a link has already been added", (done)=>{
        var key = "moge";
        var record: any = {};
        record.key = sinon.stub().returns(key);
        var callback = sinon.spy();
        neighbourStore.on(NeighbourStore.OnNeedEstablishLink, callback);
        neighbourStore.addRecord(record);

        //NEED_ESTABLISH_LINK fired
        chai.assert(callback.calledOnce);
        expect(callback.getCall(0).args[0]).to.deep.equal(record);

        //link established successfully
        var link = "hoge";

        //before addlink, other link has beed added
        var oldLink = {isEstablished: function(){return true}, close: function(){}};
        (<any>neighbourStore).linksHash_ = {moge: oldLink};
        var spy_close = sinon.spy(oldLink, "close");
        //addlink and check successfully added link
        record.addLink(link);
        chai.expect((<any>neighbourStore).linksHash_).to.deep.equal({moge: link});
        //if the old link is established, neighbourstore has to close it.
        chai.assert(spy_close.calledOnce);

        done();
    });
    
    it ("when adding neighbour, there is an established neighbour.", (done)=>{
        var key = "moge";
        var oldRecord = {isEstablished: function(){return true}};
        (<any>neighbourStore).recordsHash_ = {moge: oldRecord};

        var record: any = {};
        record.key = sinon.stub().returns(key);
        var callback = sinon.spy();
        neighbourStore.on(NeighbourStore.OnNeedEstablishLink, callback);
        neighbourStore.addRecord(record);

        //NEED_ESTABLISH_LINK not fired
        expect(callback.callCount).to.deep.equal(0);

        done();
    });

    it ("when adding neighbour, there is an not-established neighbour.", (done)=>{
        var oldRecord: any = {key: function(){ return "moge"}, isEstablished: function(){return false}};
        neighbourStore.addRecord(oldRecord);

        var key = "moge";
        var record: any = {};
        record.key = sinon.stub().returns(key);
        var callback = sinon.spy();
        neighbourStore.on(NeighbourStore.OnNeedEstablishLink, callback);
        neighbourStore.addRecord(record);

        //NEED_ESTABLISH_LINK fired
        chai.assert(callback.calledOnce);
        expect(callback.getCall(0).args[0]).to.deep.equal(oldRecord); //oldRecord will come back

        //link established successfully
        var link = "hoge";

        //addlink and check successfully added link
        oldRecord.addLink(link);
        expect((<any>neighbourStore).linksHash_).to.deep.equal({moge: link});

        done();
    });

    it ("remove record", (done)=>{
        var key = "moge";
        var record: any = {key: function(){return "moge"}};
        (<any>neighbourStore).recordsHash_ = {moge: record};
        var oldLink = {isEstablished: function(){return true}, close: function(){}};
        var spy_close = sinon.spy(oldLink, "close");

        (<any>neighbourStore).linksHash_ = {moge: oldLink};
        neighbourStore.removeRecord(record);

        //addlink and check successfully added link
        expect((<any>neighbourStore).recordsHash_).to.deep.equal({});
        expect((<any>neighbourStore).linksHash_).to.deep.equal({});
        //if the old link is established, neighbourstore has to close it.
        chai.assert(spy_close.calledOnce);

        done();
    });
});

