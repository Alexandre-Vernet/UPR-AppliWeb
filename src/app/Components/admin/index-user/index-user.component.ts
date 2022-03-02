import { Component, OnInit } from '@angular/core';
import {User} from "../../../Classes/user";
import {FirestoreService} from "../../../Services/firestore/firestore.service";

@Component({
  selector: 'app-index-user',
  templateUrl: './index-user.component.html',
  styleUrls: ['./index-user.component.scss']
})
export class IndexUserComponent implements OnInit {

  users: User[];

  step = 1;
  numberStep;

  constructor(private firestoreService: FirestoreService) { }

  ngOnInit(): void {
    this.firestoreService.getUsersNumber().then(res => {
      this.numberStep = res;
    })
    this.firestoreService.getUsersPaginated(1).then((res) => {
      this.users = res
    });
  }

  deleteUser(userId: string) {
    this.firestoreService.deleteUser(userId).then(res => console.log(res));
  }

  selectPage(step: number) {
    this.firestoreService.getUsersPaginated(step).then((res) => {
      console.log(res)
      this.users = res
    });
  }

  stepToArray(step: number) {
    return Array(step);
  }
}
