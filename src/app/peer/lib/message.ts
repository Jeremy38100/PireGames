export enum ACTION {
  'HEARTBEAT',
  'BROADCAST',
}

export class Message<T, ACTION_ENUM>{
  action: ACTION | ACTION_ENUM
  data: T
}

export interface Timestamps {
  sendFromHost: number,
  sendFromClient: number,
  receiveAtHost: number,
  receiveAtClient: number,
}

export const defaultTimestamps: Timestamps = {
  sendFromHost: 0,
  sendFromClient: 0,
  receiveAtHost: 0,
  receiveAtClient: 0,
}

export class MessageTimestamps extends Message<Timestamps, ACTION>{
  readonly action = ACTION.HEARTBEAT
  readonly data = defaultTimestamps
}

export class MessageBroadcast<T> extends Message<T, ACTION> {
  readonly action = ACTION.BROADCAST
  readonly data: T
}

export class Heartbeat {
  constructor(private readonly timestamps: Timestamps) { }

  pingToHost(): number {
    const {receiveAtHost, sendFromClient} = this.timestamps;
    if (!receiveAtHost || !sendFromClient) return 0;
    return receiveAtHost - sendFromClient
  }

  pingToClient(): number {
    const {receiveAtClient, sendFromHost} = this.timestamps;
    if (!receiveAtClient || ! sendFromHost) return 0;
    return receiveAtClient - sendFromHost
  }
}