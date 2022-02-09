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

  constructor(private firestoreService: FirestoreService) { }

  ngOnInit(): void {
    this.firestoreService.getUsers().then((res) => {
      this.users = res
    });
  }

}
