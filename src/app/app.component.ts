import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "./Services/authentication/authentication.service";
import {User_Roles} from "./Classes/user";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  logged: boolean = false;
  admin: boolean = false;

    constructor(
      private authService: AuthenticationService
    ) {
    }

    ngOnInit() {
      this.logged = !(window.location.pathname === '/sign-in' || window.location.pathname === '/sign-up');
      if (this.logged && this.authService.user.role === User_Roles.admin) this.admin = true;
    }

    getRoute() {
        return window.location.pathname;
    }
}

