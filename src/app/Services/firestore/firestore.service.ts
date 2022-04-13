import { Injectable } from '@angular/core';
import {collection, getFirestore, query, getDocs, doc, updateDoc, deleteDoc, where, startAfter, limit, orderBy } from 'firebase/firestore';
import { User } from 'src/app/Classes/user';
import Swal from "sweetalert2";
import {AuthenticationService} from "../authentication/authentication.service";

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  users: User[] = [];
  usersPaginated: User[] = [];
  limit = 2;

  db = getFirestore();

  constructor(private auth: AuthenticationService) {
  }

  async getUsersNumber(validatedBool: boolean) {
    const q = query(collection(this.db, 'users'), where('validated', '==', validatedBool));
    const querySnapshot = await getDocs(q);

    return Math.ceil(querySnapshot.size/this.limit);
  }

  async getUsersPaginated(start: number, validatedBool: boolean): Promise<User[]> {
    let users = [];

    let limit = this.limit;
    let index = 0;
    let limited = 0;

    const allUsers = query(collection(this.db, 'users'), where('validated', '==', validatedBool));
    const querySnapshot = await getDocs(allUsers);

    querySnapshot.forEach((doc) => {
      if (limited < limit) {
        if (index >= ((start - 1) * limit) && index < ((start - 1) * limit + limit)) {
          limited += 1;

          const id = doc.id;
          const {
            firstName,
            lastName,
            email,
            role,
            status,
            profilePicture,
            dateCreation,
            validated
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
            validated
          );

          users.push(user);
        }
      }
      index += 1;
    });

    this.usersPaginated = users;

    return this.usersPaginated;
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

        Swal.fire({
          position: "center",
          icon: "success",
          title: "Votre compte a bien été modifié !",
          showConfirmButton: false,
          timer: 2500
        });

        // Update values
        this.auth.user.firstName = firstName;
        this.auth.user.lastName = lastName;
      })
      .catch((error) => {
        // The document probably doesn't exist.

        Swal.fire({
          position: "center",
          icon: "error",
          title: error,
          showConfirmButton: true
        });
      });

    return this.auth.user;
  };

  validateUser = async (userId: string) => {
    const userRef = doc(this.db, "users", userId);

    await updateDoc(userRef, {
      validated: true
    })
      .then(() => {

        Swal.fire({
          position: "center",
          icon: "success",
          title: "L'utilisateur a bien été validé !",
          showConfirmButton: false,
          timer: 2500
        });

        // Update values
        this.auth.user.validated = true;
      })
      .catch((error) => {
        // The document probably doesn't exist.

        Swal.fire({
          position: "center",
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
          position: "center",
          icon: "success",
          title: "L'utilisateur a bien été supprimé !",
          showConfirmButton: false,
          timer: 2500
        });
      })
      .catch((error) => {
        Swal.fire({
          position: "center",
          icon: "error",
          title: error,
          showConfirmButton: true
        });
      });
  }
}
