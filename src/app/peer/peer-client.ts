import Peer, {DataConnection} from 'peerjs';
import { Message, MESSAGE, PingResponse } from './peer-actions';
import { now } from 'src/app/tools/date';
import { sleep } from 'src/app/tools/promise'

export interface Connection {
  lastHeartbeat: Date;
  id: string,
  lastPing: {
    fromClient: number;
    toClient: number;
  };
  connection: Peer.DataConnection;
}

export type ConnectionMap = Map<string, Connection>;

function send<T>(conn: DataConnection, msg: Message<T>) {
  conn.send(msg);
}

export interface Handler<T> {
  connection: DataConnection,
  id: string,
  message: Message<T>,
}

export class PeerClient {

  private peer: Peer;
  private conn: DataConnection

  private id = '';
  private hostId = '';

  // HOST
  private connections: ConnectionMap = new Map();

  constructor() {
    this.peer = new Peer();
    this.peer.on('open', id => this.onPeerOpen(id));
    this.peer.on('connection', c => this.onConnectionFromClient(c));

    this.peer.on('call', d => console.log('connection', d));
    this.peer.on('close', () => console.log('close'));
    this.peer.on('disconnected', () => console.log('disconnected'));
    this.peer.on('error', err => console.log('error', err));
  }

  public getId(): string { return this.id }
  public getConnections():ConnectionMap { return this.connections; }

  public async connect(id: string) {
    if (this.conn) await this.disconnect();
    this.hostId = id;
    this.conn = this.peer.connect(id);
    this.conn.on('data', message => this.onData({connection: this.conn, id, message}));
    this.conn.on('open', () => this.onConnectionToHost(id));
    this.conn.on('close', () => console.log('conn_close'));
    this.conn.on('error', (err: any) => console.log('conn_error', err));
  }



  public async disconnect() {
    send(this.conn, {type: MESSAGE.DISCONNECT, data: ''});
    await sleep(300);
    this.conn.close();
    this.hostId = ''
    this.conn = null;
  }

  public send(data: Message) {
    send(this.conn, data);
  }

  private onConnectionFromClient(connection: DataConnection) {
    const id = connection.peer;
    console.log('New Connection', id);
    this.connections.set(id, {
      lastHeartbeat: new Date(),
      id,
      lastPing: null,
      connection
    });

    connection.on('data', message => this.onData({connection, id, message}));
  }

  private onConnectionToHost(id: string) {
    if (this.hostId !== id) {
      this.disconnect();
      return;
    }
    console.log('Connected to', id);
    const handler: Handler<PingResponse> = {
      connection: this.conn, id,
      message: {
        type: MESSAGE.HEARTBEAT_RESPONSE,
        data: {
          receiveClientTimeout: 0, receiveHostTimeout: 0,
          sendClientTimeout: 0, sendHostTimeout: 0
        }
      }
    }
    console.log('startHeartbeat')
    this.onHeartbeatResponse(handler);
  }

  private onData(handler: Handler<any>) {
    const {id, message} = handler;
    const type = message.type;
    console.log(id, message);
    if (type === MESSAGE.PING) this.onPing(handler);
    if (type === MESSAGE.PING_RESPONSE) this.onPingResponse(handler);

    if (type === MESSAGE.HEARTBEAT) this.onHeartbeat(handler);
    if (type === MESSAGE.HEARTBEAT_RESPONSE) this.onHeartbeatResponse(handler);
  }

  private onPeerOpen(id: string) {
    this.id = id;
  }

  private onPing(handler: Handler<number>) {
    const data: PingResponse = {
      sendClientTimeout: handler.message.data,
      receiveHostTimeout: now(),
      sendHostTimeout: 0,
      receiveClientTimeout: 0,
    }
    // TODO store One way ping
    data.sendHostTimeout = now();
    send(handler.connection, {
      type: MESSAGE.PING_RESPONSE,
      data
    });
  }

  private onPingResponse(handler: Handler<PingResponse>) {
    const data = handler.message.data;
    data.receiveClientTimeout = now();
    console.log('> Up', data.receiveHostTimeout - data.sendClientTimeout);
    console.log('< Down', data.receiveClientTimeout - data.sendHostTimeout);
  }

  private onHeartbeat(handler: Handler<PingResponse>) {
    const data = handler.message.data;
    data.receiveHostTimeout = now();
    const toClient = data.receiveClientTimeout - data.sendHostTimeout;
    const fromClient = data.receiveHostTimeout - data.sendClientTimeout;
    console.log(handler.id, fromClient, toClient);
    this.connections.get(handler.id).lastPing = { fromClient, toClient }
    data.sendHostTimeout = now();
    send(handler.connection, { type: MESSAGE.HEARTBEAT_RESPONSE, data });
  }

  private async onHeartbeatResponse(handler: Handler<PingResponse>) {
    const data = handler.message.data;
    data.receiveClientTimeout = now();
    const toClient = data.receiveClientTimeout - data.sendHostTimeout;
    const fromClient = data.receiveHostTimeout - data.sendClientTimeout;
    console.log(handler.id, fromClient, toClient);
    await sleep(1000);
    data.sendClientTimeout = now();
    send(handler.connection, { type: MESSAGE.HEARTBEAT, data });
  }

}