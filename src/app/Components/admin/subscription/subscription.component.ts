import { Component, OnInit } from '@angular/core';
import {User} from "../../../Classes/user";
import {FirestoreService} from "../../../Services/firestore/firestore.service";

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent implements OnInit {

  users: User[];

  step = 1;
  numberStep;

  constructor(private firestoreService: FirestoreService) { }

  ngOnInit(): void {
    this.firestoreService.getUsersNumber(false).then(res => {
      this.numberStep = res;
    })
    this.firestoreService.getUsersPaginated(this.step, false).then((res) => {
      this.users = res
    });
  }

  acceptValidation(userId: string) {
    this.firestoreService.validateUser(userId).then(
      () => {
        this.firestoreService.getUsersPaginated(this.step, false).then((res) => {
          this.users = res
        });
      });
  }

  refuseValidation(userId: string) {
    this.firestoreService.deleteUser(userId).then(
      () => {
        this.firestoreService.getUsersPaginated(this.step, false).then((res) => {
          this.users = res
        });
      });
  }

  selectPage(step: number) {
    this.firestoreService.getUsersPaginated(step, false).then((res) => {
      this.users = res
    });
    this.step = step;
  }

  stepToArray(step: number) {
    return Array(step);
  }
}
