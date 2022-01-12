import { Injectable } from '@angular/core';
import { addDoc, collection, getFirestore, doc, getDoc, query, where, getDocs } from 'firebase/firestore';
import { BehaviorSubject } from 'rxjs';
import { User } from 'src/app/Classes/user';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  users: User[] = [];

  db = getFirestore();

  constructor() { }

  async getUsers(): Promise<User[]> {
    let users = [];

    const q = query(collection(this.db, 'users'));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      const user = new User(
        doc.data().firstName,
        doc.data().lastName,
        doc.data().email,
        doc.data().role,
        doc.data().status,
        null,
        doc.data().dateCreation
      );
      users.push(user);
    })

    this.users = users;

    return this.users;
  }
}
