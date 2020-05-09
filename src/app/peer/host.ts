import { ACTION_CLIENT } from './client-actions';
import { ACTION_HOST } from './host-actions';
import { ACTION, Message } from './lib/message';
import { PeerHost } from './lib/peer-host';

export class Host extends PeerHost<ACTION_HOST, ACTION_CLIENT> {
  constructor() {
    super()
  }

  protected async onMessage(message: Message<any, ACTION_HOST>) {
    console.log(message)
  }
}