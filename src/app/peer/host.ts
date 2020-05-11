import { mapToJson } from 'src/app/tools/map';
import { ACTION_CLIENT } from './client-actions';
import { ACTION_HOST, Player } from './host-actions';
import { Message } from './lib/message';
import { ClientId, PeerHost } from './lib/peer-host';
import { PeerChat } from './client';

export class Host extends PeerHost<ACTION_HOST, ACTION_CLIENT> {

  private players: Map<ClientId, Player> = new Map();

  constructor() {
    super()
  }

  protected async onMessage(id: string, message: Message<any, ACTION_HOST>) {
    console.log(id, message)
    const {action, data} = message;
    if (action === ACTION_HOST.SET_PLAYER) this.onSetPlayer(id, data)
    if (action === ACTION_HOST.CHAT) this.onChat(id, data)
  }

  private onChat(senderId: string, message: string) {
    const senderPseudo = this.getPlayer(senderId)?.pseudo;
    if (!senderPseudo) return
    const data: PeerChat = {senderId, senderPseudo, message}
    this.sendAll({action: ACTION_CLIENT.CHAT, data})
  }

  protected async updateClients() {
    for (const id of this.players.keys()) {
      if (!this.clients.get(id)) this.players.delete(id)
    }
    this.sendPlayers()
  }

  private onSetPlayer(id: string, player: Player) {
    this.players.set(id, player)
    this.sendPlayers()
  }

  private sendPlayers() {
    this.sendAll({action: ACTION_CLIENT.PLAYERS_LIST, data: mapToJson(this.players)})
  }

  private getPlayer(id: string): Player {
    return this.players.get(id)
  }

}