import { ACTION_CLIENT } from './client-actions';
import { ACTION_HOST } from './host-actions';
import { Message } from './lib/message';
import { PeerClient } from './lib/peer-client';

export class Client extends PeerClient<ACTION_CLIENT, ACTION_HOST> {
  constructor() {
    super()
  }

  async onMessage(message: Message<any, ACTION_CLIENT>) {
    console.log(message)
  }
}