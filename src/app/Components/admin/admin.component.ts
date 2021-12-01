import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from 'src/app/Classes/user';
import { FirestoreService } from 'src/app/Services/firestore/firestore.service';
import { Observable } from 'tinymce';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  users: User[];

  constructor(private firestoreService: FirestoreService) { }

  ngOnInit(): void {
    this.firestoreService.getUsers().then((res) => {
      this.users = res
    });
  }
}
