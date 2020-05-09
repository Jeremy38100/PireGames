import { ACTION_HOST } from './peer/host-actions';
import { Component } from '@angular/core';
import { Client } from './peer/client';
import { Host } from './peer/host';


@Component({
  selector: 'app-root',
  template: `
    <p>My id : {{client?.getId()}}</p>
    <div>
      <label>Connect :</label>
      <input [(ngModel)]="connectId">
    </div>
    <button (click)="connect()">Connect</button>
    <button (click)="disconnect()">Disconnect</button>

    <p>Ping up{{client?.getHeartbeat()?.pingToHost()}}</p>
    <p>Ping down{{client?.getHeartbeat()?.pingToClient()}}</p>

    <br>
    <input [(ngModel)]="inputChat"><button (click)="sendChat()">OK</button>

    <br>
    <p>Connections</p>
    <ul>
    </ul>
    <router-outlet></router-outlet>
  `,
  styles: []
})
export class AppComponent {
  connectId = '';
  host: Host;
  client: Client;

  inputChat = '';

  constructor() {
    this.host = new Host();
    this.client = new Client();
    // const a = new Peer();
  }

  sendChat() {
    this.client.send({
      action: ACTION_HOST.CHAT,
      data: this.inputChat
    })
    this.inputChat = '';
  }
  connect() {
    this.client.connect(this.connectId);
  }

  disconnect() {
    this.client.disconnect();
  }
}
