import { DataConnection } from 'peerjs';
import { now } from 'src/app/tools/date';
import { sleep } from 'src/app/tools/promise';
import { ACTION, Heartbeat, Message, Timestamps } from './message';

export abstract class Connection<ACTION_RECEIVE, ACTION_SEND> {
  protected heartbeat: Heartbeat
  protected connection: DataConnection;

  constructor(private readonly isHost: boolean) { }

  public getHeartbeat(): Heartbeat { return this.heartbeat}

  public send(message: Message<any, ACTION_SEND>) {
    return this.connection.send(message)
  }

  protected async abstract onMessage(message: Message<any, ACTION_RECEIVE>): Promise<any>

  public async onHeartbeat(data: Timestamps) {
    if (this.isHost) {
      data.receiveAtHost = now();
      this.heartbeat = new Heartbeat({...data});
      data.sendFromHost = now();
    } else {
      data.receiveAtClient = now()
      this.heartbeat = new Heartbeat({...data});
      await sleep(5000);
      data.sendFromClient = now()
    }
    this.send({action: ACTION.HEARTBEAT, data});
  }

}