import { ChatComponent } from './component/chat';
import { PeerService } from './service/peer.service';
import { Component, NgZone, OnInit } from '@angular/core';
import { Client } from './peer/client';
import { Host } from './peer/host';
import { ACTION_HOST } from './peer/host-actions';
import { NbWindowService, NbWindowRef, NbWindowState } from '@nebular/theme';

@Component({
  selector: 'app-root',
  template: `
  <nb-layout>
    <nb-layout-header>
      <div style="display: flex; flex-grow: 1; justify-content: space-between; align-items: baseline;">
        <h2>Peer Games 🕹</h2>
        <nb-alert *ngIf="getHostId()" style="display: block">
          <nb-icon icon="clipboard-outline" class="m-r"></nb-icon>{{getHostId()}}
        </nb-alert>
      </div>
    </nb-layout-header>


    <nb-layout-column>
      <div class="row">
        <div class="col-12">
          <label class="label">Edit Profile</label>
          <input nbInput fullWidth placeholder="Pseudo">
          <hr/>
          <br/>
        </div>
        <div class="col-6">
          <input nbInput fullWidth placeholder="Enter room ID">
          <br/><br/>
          <button nbButton fullWidth status="success">Join room</button>
        </div>
        <div class="col-6">
          <button nbButton fullWidth status="primary" (click)="startHost()">Create room</button>
        </div>
      </div>
    </nb-layout-column>
  </nb-layout>
    <!-- <p>My id : {{client?.getId()}}</p>
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
    <img [src]="img" alt="Red dot" /> -->
  `,
  styles: []
})
export class AppComponent implements OnInit {
  connectId = '';
  host: Host;
  client: Client;
  img = ''

  inputChat = '';
  windowChat: NbWindowRef;

  constructor(private zone: NgZone,
              private peer: PeerService,
              private windowService: NbWindowService) {
  }
  ngOnInit(): void {
    this.windowChat = this.windowService.open(ChatComponent, { title: `Chat` });
    this.windowChat.minimize()
    document.querySelector('nb-window').querySelector('nb-card-header')
      .addEventListener('click', () => {
        const current = this.windowChat.state;
        if (current === NbWindowState.MINIMIZED) this.windowChat.maximize()
        else this.windowChat.minimize()
      })
  }

  startHost() {
    this.peer.createHost({
      pseudo: 'Pseudo',
    });
  }

  getHostId(): string {
    return this.peer.getHost()?.getId()
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
