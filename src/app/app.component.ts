import { ACTION_HOST } from './peer/host-actions';
import { Component, NgZone } from '@angular/core';
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
    <br>
    <p>Chat</p>
    <p *ngFor="let chat of client.getChatMessages()">{{chat.pseudo}}: {{chat.message}}</p>
    <paste-image (onPaste)="onImage($event)"></paste-image>
    <img [src]="img" alt="Red dot" />
    <router-outlet></router-outlet>
  `,
  styles: []
})
export class AppComponent {
  connectId = '';
  host: Host;
  client: Client;
  img = ''

  inputChat = '';

  constructor(private zone: NgZone) {
    this.host = new Host();
    this.client = new Client({pseudo: 'jeremy'}, zone);
  }

  onImage(image64: string) {
    this.img = image64
    this.client.send({
      action:ACTION_HOST.CHAT,
      data: image64
    });
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
