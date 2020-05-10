import { NgZone } from '@angular/core';
import { forceRefresh } from '../tools/force-refresh';
import { jsonToMap } from '../tools/map';
import { ACTION_CLIENT } from './client-actions';
import { ACTION_HOST, Player, SetPlayer } from './host-actions';
import { Message } from './lib/message';
import { PeerClient } from './lib/peer-client';
import { ClientId } from './lib/peer-host';

export interface ChatMessage {
  pseudo: string
  message: string
}

export class Client extends PeerClient<ACTION_CLIENT, ACTION_HOST> {

  private players: Map<ClientId, Player> = new Map()
  private chat: ChatMessage[] = []

  constructor(private readonly player: Player,
              private readonly zone: NgZone) {
    super()
  }

  public getPlayers(): Map<ClientId, Player> { return this.players }

  public getChatMessages(): ChatMessage[] { return [...this.chat] }

  async onMessage(message: Message<any, ACTION_CLIENT>) {
    console.log(message)
    const {action, data} = message;
    if (action === ACTION_CLIENT.PLAYERS_LIST) this.onPlayerList(data)
    if (action === ACTION_CLIENT.CHAT) this.onChat(data)
    forceRefresh(this.zone)
  }

  private onChat(chatMessage: ChatMessage) {
    this.chat.push(chatMessage)
  }

  private onPlayerList(json: string) {
    this.players = jsonToMap(json);
    console.log(this.players);
  }

  async onConnected() {
    this.send(new SetPlayer(this.player))
  }
}