import { Component, OnInit } from '@angular/core';
import {User} from "../../../Classes/user";
import {FirestoreService} from "../../../Services/firestore/firestore.service";
import {AuthenticationService} from "../../../Services/authentication/authentication.service";

@Component({
  selector: 'app-index-user',
  templateUrl: './index-user.component.html',
  styleUrls: ['./index-user.component.scss']
})
export class IndexUserComponent implements OnInit {

  users: User[];

  step = 1;
  numberStep;

  constructor(
    private firestoreService: FirestoreService,
    private authService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.firestoreService.getUsersNumber(true).then(res => {
      this.numberStep = res;
    })
    this.firestoreService.getUsersPaginated(this.step, true).then((res) => {
      this.users = res
    });
  }

  deleteUser(userId: string) {
    this.firestoreService.deleteUser(userId).then(
      () => {
        this.firestoreService.getUsersPaginated(this.step, true).then((res) => {
          this.users = res
        })
      }
    );
  }

  selectPage(step: number) {
    this.firestoreService.getUsersPaginated(step, true).then((res) => {
      this.users = res
    });
    this.step = step;
  }

  stepToArray(step: number) {
    return Array(step);
  }

  resetPass(email) {
    this.authService.resetPassword(email);
  }
}
