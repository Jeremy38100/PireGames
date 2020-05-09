import Peer, { DataConnection } from 'peerjs';
import { Connection } from './connection';
import { ACTION, Message } from './message';

export interface Client<ACTION_CLIENT> {
  clientPeer: HostClient<ACTION_CLIENT>;
}

export type ClientId = string;

export class HostClient<ACTION_CLIENT> extends Connection<any, ACTION_CLIENT> {

  constructor(connection: DataConnection) {
    super(true);
    this.connection = connection;
  }

  async onMessage(message: Message<any, ACTION_CLIENT>) {}

  public getId(): string {
    return this.connection.peer
  }
}

export abstract class PeerHost<ACTION_HOST, ACTION_CLIENT> {

  private peer: Peer;
  clients: Map<ClientId, Client<ACTION_CLIENT>> = new Map()

  constructor(private readonly heartbeatTimeout = 2000) {
    this.peer = new Peer();
    this.peer.on('open', id => {console.log('open', id); this.startCleaner()});
    this.peer.on('connection', c => this.onConnection(c));

    this.peer.on('call', d => console.log('connection', d));
    this.peer.on('close', () => console.log('close'));
    this.peer.on('disconnected', () => console.log('disconnected'));
    this.peer.on('error', err => console.log('error', err));
  }

  getClientsId(): ClientId[] {
    return Array.from(this.clients.keys())
  }

  private getClient(id: ClientId): Client<ACTION_CLIENT> {
    return this.clients.get(id);
  }

  private getPeer(id: ClientId): HostClient<ACTION_CLIENT> {
    return this.getClient(id).clientPeer
  }

  private onConnection(connection: DataConnection) {
    console.log('onConnection', connection)
    const id = connection.peer;
    connection.on('data', (message: Message<any, ACTION_HOST>) => {
      if (message.action === ACTION.HEARTBEAT) {
        this.getPeer(id).onHeartbeat(message.data)
        return
      }
      console.log('onData', message)
      this.onMessage(id, message)
    });
    connection.on('open', () => console.log('open'));
    connection.on('close', () => console.log('close'));
    connection.on('error', e => console.log('error', e));
    this.clients.set(id, {clientPeer: new HostClient(connection)})
  }

  private onDisconnection(id: ClientId) {
    console.log('onDisconnection', id)
    this.clients.delete(id)
  }

  private startCleaner() {
    setInterval(() => {
      console.log('cleaner');
      this.cleanClients()
    }, this.heartbeatTimeout)
  }

  private cleanClients() {
    let isUpdate = false;
    for (const id of this.clients.keys()) {
      const client = this.getPeer(id);
      const heartbeat = client.getHeartbeat();
      if (heartbeat.getLastPingInMs() > this.heartbeatTimeout * 1.2) {
        this.clients.delete(id);
        isUpdate = true;
      }
    }
    if (isUpdate) this.updateClients();
  }

  protected abstract async onMessage(id: string, message: Message<any, ACTION_HOST>): Promise<any>;
  protected abstract async updateClients(): Promise<any>;

  protected sendClient(id: ClientId, message: Message<any, ACTION_CLIENT>) {
    this.getPeer(id).send(message)
  }

  protected sendAll(message: Message<any, ACTION_CLIENT>) {
    this.getClientsId().forEach(id => this.sendClient(id, message))
  }
}