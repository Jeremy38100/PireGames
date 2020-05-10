import { NgZone } from '@angular/core';

export function forceRefresh(zone: NgZone) {
  zone.run(() => {})
}