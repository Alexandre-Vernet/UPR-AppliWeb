import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';


@Injectable({
  providedIn: 'root'
})
export class PwaUpdateService {

  public  promptEvent: any

  constructor(private swUpdate: SwUpdate) {

    window.addEventListener('beforeinstallprompt', event => {
      this.promptEvent = event;
    });

  }

  askUserToUpdate() {
    this.swUpdate.available.subscribe(event => {
      if (confirm("Voulez-vous mettre l'application à jour ?")) {
        window.location.reload();
      }
    });
  }
}
