#peer.io

### What's this?
Wrapper library of SkyWay and PeerJs

### Why is it needed?
SkyWay and PeerJs don't re-establish P2P links.  
They don't emit disconnect-event until their reconnecting process completely failed.  
Third party library cannot detect and start reconnecting process.
peer.io wraps them and re-establish P2P links.

### How to use it?

$bower install peer.io

**code**
	
	var peerIo = new PeerIo.PeerIo(peer); //wrap peer js object
	peerIo.addDefaultStream(mediaStream); //set stream
	peerIo.addNeighbour(相手のpeerID, Model.NeighbourTypeEnum.data); //register neighbour to establish data lilnk
    peerIo.addNeighbour(相手のpeerID, Model.NeighbourTypeEnum.video, mediaStream); //register neighbour to establish video link

And you can get events about P2P links.

	peerIo.on(PeerIo.OnStartVideo, function(peerId, stream){
	    console.log("received video from " + peerId);
	    $("#video").get(0).src = window.URL.createObjectURL(stream);
	}); //get video stream
	
	peerIo.OnRecvData, function(peerId, message){
	    console.log("received data from " + peerId);
	    console.log(message);
	}); //get data from neighbour
	
	
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

	peerIo.on(PeerIo.OnStartVideo, function(peerId, stream){
	    console.log("received video from " + peerId);
	    $("#video").get(0).src = window.URL.createObjectURL(stream);
	}); //相手から来たVideoを取得するイベント
	
	peerIo.OnRecvData, function(peerId, message){
	    console.log("received data from " + peerId);
	    console.log(message);
	}); //相手から来たDataを取得するイベント

