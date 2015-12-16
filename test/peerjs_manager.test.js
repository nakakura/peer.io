
/*
describe("PeerJsManager", function() {
    var peer;
    var targetNeighbors;

    beforeEach(function(done) {
        peer = {
            disconnected: false,
            on: function(event, callback){},
            send: function(message){},
            close: function(){},
            connect: function(peerID, option){
                return "channel object";
            },
            call: function(peerID, option){
                return "media stream";
            }
        };

        targetNeighbors = {
            onNeedEstablishLink: function(event, callback){},
            onNeedCloseLink: function(event, callback){},
        };
        // 各テストごとの始まる前の処理
        done();
    });

    it ("connect in offline - onOnline - connected", function(done) {
        var spy_peer_on = sinon.spy(peer, "on");
        var peerJsManager = new PeerIo.PeerJsManager(peer, targetNeighbors);

        expect(spy_target_onEstablish.callCount).to.deep.equal(0);
        expect(spy_target_onClose.callCount).to.deep.equal(0);
        //open
        expect(spy_peer_on.callCount).to.deep.equal(5);  //open, disconnected, error, connection, call

        var onOpen = spy_peer_on.getCall(0).args[1];
        //onOpenを送ると、peer.disconnectedがfalseなので接続を開始する
        onOpen();

        //onopenのあとNeedsEstablishを送る
        var neighbor = {
            type: function(){
                return PeerIo.NeighborTypeEnum.data;
            },
            setChannel: function(channel){  },
            peerID: function(){ return "hoge"}
        };
        var spy_neighbor_setChannel = sinon.spy(neighbor, "setChannel");


        done();
    });

    it ("call", function(done) {
        var spy_peer_on = sinon.spy(peer, "on");
        var spy_target_on = sinon.spy(targetNeighbors, "on");

        var peerJsManager = new PeerIo.PeerJsManager(peer, targetNeighbors);

        expect(spy_target_on.callCount).to.deep.equal(0);
        //open
        expect(spy_peer_on.callCount).to.deep.equal(1);

        //open, disconnected, error, connection, call
        var onOpen = spy_peer_on.getCall(0).args[1];
        onOpen();
        expect(spy_peer_on.callCount).to.deep.equal(5);

        //onopenのあとNeedsEstablishを送る
        var neighbor = {
            type: function () {
                return PeerIo.NeighborTypeEnum.video;
            },
            setChannel: function (channel) {
                console.log("channel");
                console.log(channel);
            },
            peerID: function () {
                return "hoge"
            }
        };
        var spy_neighbor_setChannel = sinon.spy(neighbor, "setChannel");

        //onNeedsEstablishP2P
        expect(spy_target_on.callCount).to.deep.equal(1);
        expect(spy_target_on.getCall(0).args[0]).to.deep.equal(targetNeighbors.OnNeedEstablishP2P);
        var onNeedEstablish = spy_target_on.getCall(0).args[1];

        //onNeedsEstablishを発火
        onNeedEstablish(neighbor);

        expect(spy_neighbor_setChannel.callCount).to.deep.equal(1);
        var channel = spy_neighbor_setChannel.getCall(0).args[0];

        //ダミーのdatachannelが入っている
        expect(channel).to.deep.equal("media stream");

        done();
    });
});
*/
