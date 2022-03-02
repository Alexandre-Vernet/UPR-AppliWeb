import { Injectable } from '@angular/core';
import {collection, getFirestore, query, getDocs, doc, updateDoc, deleteDoc, startAfter, limit, orderBy } from 'firebase/firestore';
import { User } from 'src/app/Classes/user';
import Swal from "sweetalert2";
import {AuthenticationService} from "../authentication/authentication.service";

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  users: User[] = [];
  usersPaginated: User[] = [];

  db = getFirestore();

  constructor(private auth: AuthenticationService) {
  }

  async getUsersNumber() {
    const q = query(collection(this.db, 'users'));
    const querySnapshot = await getDocs(q);

    return Math.ceil(querySnapshot.size/2);
  }

  async getUsersPaginated(start: number): Promise<User[]> {
    console.log(start)

    let users = [];

    const q = query(collection(this.db, 'users'), orderBy('firstName'), startAfter(1), limit(2));

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {

      const id = doc.id;
      const {
        firstName,
        lastName,
        email,
        role,
        status,
        profilePicture,
        dateCreation,
      } = doc.data();

      const user = new User(
        id,
        firstName,
        lastName,
        email,
        role,
        status,
        profilePicture,
        dateCreation,
      );

      users.push(user);
    });

    this.usersPaginated = users;

    return this.usersPaginated;
  }

  async getUsers(): Promise<User[]> {
    let users = [];

    const q = query(collection(this.db, 'users'));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {

      const id = doc.id;
      const {
        firstName,
        lastName,
        email,
        role,
        status,
        profilePicture,
        dateCreation,
      } = doc.data();

      const user = new User(
        id,
        firstName,
        lastName,
        email,
        role,
        status,
        profilePicture,
        dateCreation,
      );

      users.push(user);
    });

    this.users = users;

    return this.users;
  }

  /**
   * Update profile
   * @param firstName
   * @param lastName
   * @param userId
   */
  updateProfile = async (firstName: string, lastName: string, userId: string) => {
    const userRef = doc(this.db, "users", userId);

    await updateDoc(userRef, {
      firstName: firstName,
      lastName: lastName
    })
      .then(() => {
        // User has been successfully updated
        console.log("User has been successfully updated");

        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Your account has been successfully updated",
          showConfirmButton: false,
          timer: 1500
        });

        // Update values
        this.auth.user.firstName = firstName;
        this.auth.user.lastName = lastName;
      })
      .catch((error) => {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);

        Swal.fire({
          icon: "error",
          title: error,
          showConfirmButton: true
        });
      });

    return this.auth.user;
  };

  async deleteUser(userId: string) {
    await deleteDoc(doc(this.db, "users", userId))
      .then(() => {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "L'utilisateur a bien été supprimé !",
          showConfirmButton: false,
          timer: 1500
        });
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: error,
          showConfirmButton: true
        });
      });
  }
}
