import { Player } from './../peer/host-actions';
import { sleep } from 'src/app/tools/promise';
import { Client } from '../peer/client';
import { Host } from '../peer/host';
import { Injectable, NgZone } from '@angular/core';

@Injectable({providedIn: 'root'})
export class PeerService {

  private host: Host;
  private client: Client;
  private zone: NgZone;

  constructor() { }

  public getClient(): Client { return this.client }
  public getHost(): Host { return this.host }

  public setZone(zone: NgZone) {
    this.zone = zone
  }

  public async createHost(player: Player) {
    if (this.host) throw Error('Your are already a host')
    this.host = new Host();
    while (!this.getHost()) await sleep(5)
    this.createClient(player)
    await sleep(50)
    this.connectClient(this.host.getId())
  }

  public async createClient(player: Player) {
    if (this.client) throw Error('Your are already a client')
    this.client = new Client(player);
  }

  public connectClient(hostId: string) {
    this.client.connect(hostId);
  }

}