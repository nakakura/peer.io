#peer.io

### これはなに？
SkyWayやPeer.jsのラッパー

### なぜつくった？
SkyWayやpeer.jsを利用していて、ネットワークが切れると、  
短い時間であればセッションサーバへの接続自体は張り直されるが、  
WebRTC接続は張り直してくれない。  

しかも、セッションサーバへの再接続が完全にfailするまで、  
peer.on("disconnect")は発火しない。
=> 自作コードではNetwork/WebRTCが切れたことに気付けない。

この辺のコーディングを毎回やるのが面倒なので、  
汎用的なライブラリを作った(/作っている)

### つかいかた

$bower install peer.io

**code**
	
	var peerIo = new PeerIo.PeerIo(peer); //peer jsをWrapして
	peerIo.addDefaultStream(mediaStream); // answerするためのMediaStreamを指定して
	peerIo.addNeighbour(相手のpeerID, Model.NeighbourTypeEnum.data); //DataChannelを開く
    peerIo.addNeighbour(相手のpeerID, Model.NeighbourTypeEnum.video, mediaStream); //MediaStreamを開く

これだけ。相手からのMediaやDataを受け取るのためにイベントを書いておくのを忘れずに。

	peerIo.on(PeerIo.OnRecvVideo, function(peerId, stream){
	    console.log("received video from " + peerId);
	    $("#leftVideo").get(0).src = window.URL.createObjectURL(stream);
	}); //相手から来たMediaを取得するイベント
	
	peerIo.OnRecvData, function(peerId, message){
	    console.log("received data from " + peerId);
	    console.log(message);
	}); //相手から来たDataを取得するイベント

