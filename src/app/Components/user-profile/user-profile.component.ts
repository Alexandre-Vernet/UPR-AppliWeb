import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/Classes/user';
import { AuthenticationService } from 'src/app/Services/authentication/authentication.service';
import {ActivatedRoute, Router} from "@angular/router";
import * as moment from 'moment';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  user: User;
  userLogged: User;
  admin: boolean = false;

  constructor(
    private auth: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.admin = this.router.url.includes('admin');
    this.route.params.subscribe(params => {
      this.auth.getById(params['id']).then((user) => {
        moment.locale('fr-FR');
        this.user = user;
        this.user.dateCreation = new Date(this.user.dateCreation['seconds'] * 1000).toDateString();
      });
    });
  }
}
