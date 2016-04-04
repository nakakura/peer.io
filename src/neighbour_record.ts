//NeighbourRecord is just a record.
//It shows an Neighbour which LinkGenerator should establish a link to.
//1. This object is created when user add an Neighbour.
//2. This object is destroyed when user remove it.
//3. This object has some delegated method.

/// <reference path="../typings/tsd.d.ts" />
import {PeerConnectOption, LinkComponentTemplate, DataLinkComponent, VideoLinkComponent, LinkComponentFactory} from './link_component';
import {Util} from './Util';
import {NeighbourTypeEnum} from './peer.io';
import {EventEmitter2} from 'eventemitter2';

export type NeighbourHash = {[key: string]: NeighbourRecord};
export type NeighbourSource = ()=>NeighbourHash;

export class NeighbourRecord extends EventEmitter2{
  private sources_: MediaStream[] = [];
  private option_: PeerJs.PeerConnectOption = {
    label: 'json',
    serialization: 'none',
    reliable: false
  };

  constructor(private peerId_: string, private type_: NeighbourTypeEnum){
    super();
    console.log("create neighbour record " + peerId_ + " type " + type_);
  }

  type(){ return this.type_; }

  peerID(): string{ return this.peerId_; }

  streams(): MediaStream[]{
    return this.sources_;
  }

  setStream(stream: MediaStream | MediaStream[]){
    console.log('setstream');
    if(stream instanceof Array){
      console.log("array");
      console.log(stream[0].getVideoTracks());
      Array.prototype.push.apply(this.sources_, stream);
    } else if(Util.isMediaStream(stream)){
      console.log("stream");
      console.log(stream.getVideoTracks());
      this.sources_.push(stream);
    }
  }

  dataChannelOption(): PeerJs.PeerConnectOption{
    return this.option_;
  }

  setDataChannelOption(option: PeerJs.PeerConnectOption){
    this.option_ = option;
  }

  //delegate
  isEstablished: ()=>boolean = ()=>{
    //throw("this method should be overwrite.");
    return false;
  };

  //delegate
  addLink = (link: LinkComponentTemplate)=>{
    throw("this method should be overwrite.");
  };

  key(): string{
    return Util.key(this.peerId_, this.type_);
  }
}
