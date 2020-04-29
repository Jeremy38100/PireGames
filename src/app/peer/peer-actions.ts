export interface Message<T = any> {
  type: MESSAGE
  data: T
}

export interface PingResponse {
  sendClientTimeout: number
  receiveHostTimeout: number
  sendHostTimeout: number
  receiveClientTimeout: number
}

export enum MESSAGE {
  PING,
  PING_RESPONSE,

  HEARTBEAT,
  HEARTBEAT_RESPONSE,

  DISCONNECT,
}