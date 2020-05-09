import Peer from 'peerjs';
import { sleep } from 'src/app/tools/promise';
import { Connection } from './connection';
import { ACTION, Message, MessageTimestamps } from './message';

export abstract class PeerClient<ACTION_CLIENT, ACTION_HOST> extends Connection<ACTION_CLIENT, ACTION_HOST> {

  private peer: Peer
  private clientId = ''

  constructor() {
    super(false)
    this.peer = new Peer();
    this.peer.on('open', id => this.clientId = id)
  }

  public getId() { return this.clientId }

  public async connect(id: string) {
    if (this.connection) await this.disconnect()
    this.connection = this.peer.connect(id)
    this.connection.on('data', (message: Message<any, ACTION_CLIENT>) => {
      if (message.action === ACTION.HEARTBEAT) {
        this.onHeartbeat(message.data)
        return
      }
      console.log('onData', message)
      this.onMessage(message)
    });
    this.connection.on('open', () => this.onConnectionToHost(id));
    this.connection.on('close', () => console.log('conn_close'));
    this.connection.on('error', err => console.log('error', err));
  }

  private async onConnectionToHost(id: string) {
    console.log('onConnect', id)
    if (this.connection.peer !== id) throw Error('Connected to wrong id')
    await sleep(1000)
    this.send(new MessageTimestamps())
  }

  async abstract onMessage(message: Message<any, ACTION_CLIENT>): Promise<any>

  public async disconnect() {
    // TODO
    // Send message to host
    // Kill connection
  }
}