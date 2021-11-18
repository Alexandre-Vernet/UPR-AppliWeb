import { Component, OnInit } from '@angular/core';
import { PwaUpdateService} from "../../Services/pwa/pwa-update.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    public pwaUpdateService: PwaUpdateService
  ) { }

  ngOnInit(): void {
  }

  installPwa(): void {
    this.pwaUpdateService.promptEvent.prompt();
  }
}
