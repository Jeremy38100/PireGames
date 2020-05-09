import { ClientId } from './lib/peer-host';
import { ACTION_CLIENT } from './client-actions';
import { ACTION_HOST, SetPlayer, Player } from './host-actions';
import { Message } from './lib/message';
import { PeerClient } from './lib/peer-client';
import { jsonToMap } from '../tools/map';

export class Client extends PeerClient<ACTION_CLIENT, ACTION_HOST> {

  private players: Map<ClientId, Player> = new Map();

  constructor(private readonly player: Player) {
    super()
  }

  public getPlayers(): Map<ClientId, Player> { return this.players }

  async onMessage(message: Message<any, ACTION_CLIENT>) {
    console.log(message)
    const {action, data} = message;
    if (action === ACTION_CLIENT.PLAYERS_LIST) this.onPlayerList(data)
  }

  private onPlayerList(json: string) {
    this.players = jsonToMap(json);
    console.log(this.players);
  }

  async onConnected() {
    this.send(new SetPlayer(this.player))
  }
}