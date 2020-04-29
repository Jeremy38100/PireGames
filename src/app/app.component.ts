import { PeerClient, Connection } from './peer/peer-client';
import { Component } from '@angular/core';
import { MESSAGE } from './peer/peer-actions';


@Component({
  selector: 'app-root',
  template: `
    <p>My id : {{client.getId()}}</p>
    <div>
      <label>Connect :</label>
      <input [(ngModel)]="connectId">
    </div>
    <button (click)="connect()">Connect</button>
    <button (click)="disconnect()">Disconnect</button>

    <br>
    <button (click)="sendDate()">Send date</button>


    <br>
    <p>Connections</p>
    <ul>
      <li *ngFor="let c of getConnections()">[{{c.lastPing.fromClient}}, {{c.lastPing.toClient}}]{{c.id}}</li>
    </ul>
    <router-outlet></router-outlet>
  `,
  styles: []
})
export class AppComponent {
  connectId = '';
  client: PeerClient;

  constructor() {
    this.client = new PeerClient();
    console.log(this.client)
    // const a = new Peer();
  }

  getConnections(): Connection[] {
    return Array.from(this.client.getConnections().values());
  }

  sendDate() {
    // this.client.send(new Date().getTime());
    this.client.send({
      type: MESSAGE.PING,
      data: new Date().getTime()
    });
  }

  connect() {
    this.client.connect(this.connectId);
  }

  disconnect() {
    this.client.disconnect();
  }
}
