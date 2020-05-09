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

    <p>↑ {{client?.getHeartbeat()?.pingToHost()}} ↓ {{client?.getHeartbeat()?.pingToClient()}}</p>

    <br>
    <input [(ngModel)]="inputChat"><button (click)="sendChat()">OK</button>

    <br>
    <p>Players</p>
    <ul>
      <li *ngFor="let playerKV of client?.getPlayers() | keyvalue">{{playerKV.key}} - {{playerKV.value.pseudo}}</li>
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
    this.client = new Client({pseudo: 'jeremy'});
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
