import { ACTION_HOST } from './../peer/host-actions';
import { PeerService } from './../service/peer.service';
import { Component, OnInit } from '@angular/core';

export interface ChatMessage {
  message: string,
  sender: string,
  date: Date,
  reply: boolean
}

@Component({
  selector: 'chat',
  template: `
  <nb-chat>
    <nb-chat-message *ngFor="let msg of getMessages()"
                    [reply]="msg.reply"
                    [message]="msg.message"
                    [sender]="msg.sender">
    </nb-chat-message>
    <nb-chat-form (send)="sendMessage($event)">
    </nb-chat-form>
  </nb-chat>
`
})

export class ChatComponent implements OnInit {

  constructor(private peer: PeerService) { }

  ngOnInit() { }

  getMessages(): ChatMessage[] {
    return this.peer.getClient()?.getChatMessages() || [];
  }

  sendMessage(event: any) {
    this.peer.getClient().send({
      action: ACTION_HOST.CHAT,
      data: event.message
    });
  }
}