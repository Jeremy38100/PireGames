import { Message } from './lib/message';
export enum ACTION_HOST {
  CHAT = 'CHAT',
  SET_PLAYER = 'SET_PLAYER'
}

export interface Player {
  pseudo: string
}

export class SetPlayer extends Message<Player, ACTION_HOST.SET_PLAYER> {
  constructor(readonly data: Player) {
    super(); this.action = ACTION_HOST.SET_PLAYER
  }
}