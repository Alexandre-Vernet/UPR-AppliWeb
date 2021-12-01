import { Component } from '@angular/core';
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../config";
import {PwaUpdateService} from "./Services/pwa/pwa-update.service";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'UPR-AppliWeb';
    app = initializeApp(firebaseConfig);
    public url = ''

    constructor(
      private pwaUpdater: PwaUpdateService
    ) {}


    getRoute() {
      return window.location.pathname;
    }
}

