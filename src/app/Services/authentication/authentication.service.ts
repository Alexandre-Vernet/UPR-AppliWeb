import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { User, User_Roles } from 'src/app/Classes/user';

import {
  createUserWithEmailAndPassword,
  deleteUser,
  getAuth,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateEmail,
  updatePassword
} from 'firebase/auth';
import {
  deleteDoc,
  doc,
  getDoc,
  getFirestore,
  setDoc,
  updateDoc, where
} from 'firebase/firestore';
import { CryptoService } from '../crypto/crypto.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  user: User;
  db = getFirestore();
  auth = getAuth();
  provider = new GoogleAuthProvider();

  constructor(private router: Router,
              private cryptoService: CryptoService) {
  }

  _firebaseError: string = '';

  /**
   * Getter firebaseError
   * @return {string }
   */
  public get firebaseError(): string {
    return this._firebaseError;
  }

  /**
   * Setter firebaseError
   * @param {string } value
   */
  public set firebaseError(value: string) {
    this._firebaseError = value;
  }

  async getAuth(): Promise<User> {
    return this.user;
  }

  async getById(userId: string) {
    const docRef = doc(this.db, 'users', userId);
    const docSnap = await getDoc(docRef);
    let user: User;

    if (docSnap.exists()) {
      const id = docSnap.id;
      const {
        firstName,
        lastName,
        email,
        role,
        status,
        profilePicture,
        dateCreation,
        validated
      } = docSnap.data();

      user = new User(
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
    } else {
      // doc.data() will be undefined in this case
      console.log('No such document!');
    }

    return user;
  }


  /**
   * Sign in
   * @param email
   * @param password
   */
  signIn = (email: string, password: string) => {
    signInWithEmailAndPassword(this.auth, email, password)
      .then(async (userCredential) => {
        // Signed in
        const user = userCredential.user;

        // Get user data
        const docRef = doc(this.db, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists() && docSnap.data().validated == true) {
          //  Set data
          const id = docSnap.id;
          const {
            firstName,
            lastName,
            email,
            role,
            profilePicture,
            dateCreation,
            validated
          } = docSnap.data();

          this.user = new User(
            id,
            firstName,
            lastName,
            email,
            role,
            true,
            profilePicture,
            dateCreation.toDate(),
            validated
          );

          // Store user in local storage
          const hashPassword = this.cryptoService.encrypt(password);
          localStorage.setItem('email', email);
          localStorage.setItem('password', hashPassword);

          // Clear error
          this.firebaseError = '';

          //set status to connected
          const userRef = doc(this.db, 'users', user.uid);
          await updateDoc(userRef, {
            status: true
          });

          let url = window.location.pathname;
          if (url != '/sign-in') this.router.navigate([url]);
          else window.location.assign('/home');
        } else {
          Swal.fire({
            position: "center",
            icon: 'error',
            title: "Ce compte n'existe pas ou il n'a pas été validé",
            showConfirmButton: false,
            timer: 2500
          });
        }
      })
      .catch((error) => {
        Swal.fire({
          position: "center",
          icon: 'error',
          title: "Ce compte n'existe pas ou il n'a pas été validé",
          showConfirmButton: false,
          timer: 2500
        });
        this.firebaseError = error.message;
      });

    return this.firebaseError;
  };

  /**
   * Sign up
   * @param firstName
   * @param lastName
   * @param email
   * @param password
   */
  signUp = (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => {
    createUserWithEmailAndPassword(this.auth, email, password)
      .then(async (userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log('user: ', user.uid);

        await setDoc(doc(this.db, 'users', user.uid), {
          firstName: firstName,
          lastName: lastName,
          role: User_Roles.prod,
          status: false,
          email: email,
          dateCreation: new Date(),
          validated: false
        })
          .then(() => {
            //  User data has been created

            // Clear error
            this.firebaseError = '';

            Swal.fire({
              position: "center",
              icon: 'success',
              title: 'Inscription réussi, un administrateur doit maintenant la valider',
              showConfirmButton: false,
              timer: 2500
            });
          })
          .catch((error) => {

            this.firebaseError = error.message;
          });
      })
      .catch((error) => {
        this.firebaseError = error.message;
      });

    return this.firebaseError;
  };

  /**
   * Reset password
   * @param emailAddress
   */
  resetPassword = (emailAddress: string) => {
    sendPasswordResetEmail(this.auth, emailAddress)
      .then(() => {
        // Email sent
        console.log('Email envoyer !');
        Swal.fire({
          position: "center",
          icon: 'success',
          title: `Un email a été envoyé à ${ emailAddress }`,
          showConfirmButton: false,
          timer: 2500
        });
      })
      .catch((error) => {
        let errorCode = '';
        // An error occurred
        switch (error.message) {
          case 'Firebase: Error (auth/user-not-found).':
            errorCode = 'Utilisateur Introuvable';
            break;
        }
        console.log('error: ', error.message);
        Swal.fire({
          position: "center",
          icon: 'error',
          title: errorCode,
          showConfirmButton: true
        });
      });
  };

  /**
   * Update profile
   * @param firstName
   * @param lastName
   */
  updateProfile = async (firstName: string, lastName: string) => {
    const userId = this.auth.currentUser.uid;
    const userRef = doc(this.db, 'users', userId);

    await updateDoc(userRef, {
      firstName: firstName,
      lastName: lastName
    })
      .then(() => {
        // User has been successfully updated

        Swal.fire({
          position: "center",
          icon: 'success',
          title: "L'utilisateur a bien été modifié !",
          showConfirmButton: false,
          timer: 2500
        });

        // Update values
        this.user.firstName = firstName;
        this.user.lastName = lastName;
      })
      .catch((error) => {
        // The document probably doesn't exist.

        Swal.fire({
          position: "center",
          icon: 'error',
          title: error,
          showConfirmButton: true
        });
      });
  };

  /**
   * Update email
   * @param email
   */
  updateEmail = (email: string) => {
    const userId = this.auth.currentUser.uid;
    const userRef = doc(this.db, 'users', userId);

    updateEmail(this.auth.currentUser, email)
      .then(async () => {
        await updateDoc(userRef, {
          email: email
        }).then(() => {
          // Disconnect
          this.signOut();

          Swal.fire({
            position: "center",
            icon: 'success',
            title: 'L\'email a bien été modifié !',
            showConfirmButton: false,
            timer: 2500
          });
        });
      })
      .catch((error) => {
        // An error occurred
        Swal.fire({
          position: "center",
          icon: 'error',
          title: error,
          showConfirmButton: true
        });
      });
  };

  /**
   * Update password
   * @param newPassword
   */
  updatePassword = (newPassword: string) => {
    const user = this.auth.currentUser;

    updatePassword(user, newPassword)
      .then(() => {
        Swal.fire({
          position: "center",
          icon: 'success',
          title: `Le mot de passe a bien été modifié !`,
          showConfirmButton: false,
          timer: 2500
        });
      })
      .catch((error: string) => {
        Swal.fire({
          position: "center",
          icon: 'error',
          title: error,
          showConfirmButton: true
        });
      });
  };

  /**
   * Sign out the user
   */
  signOut = () => {
    signOut(this.auth)
      .then(async () => {
        // Clear local storage
        localStorage.clear();

        this.user = null;

        //set status to connected
        // const userRef = doc(this.db, "users", this.auth.currentUser.uid);
        // await updateDoc(userRef, {
        // 	status: false
        // });

        window.location.assign('/sign-in');
      })
      .catch((error) => {
        console.log('error: ', error);
      });
  };

  /**
   * Delete account
   */
  deleteAccount = () => {
    const user = this.auth.currentUser;
    const userId = this.auth.currentUser.uid;

    deleteUser(user)
      .then(async () => {

        await deleteDoc(doc(this.db, 'users', userId))
          .then(() => {
            // User deleted.

            Swal.fire({
              position: "center",
              icon: 'success',
              title: `L'utilisateur a bien été supprimé !`,
              showConfirmButton: false,
              timer: 2500
            });

            // Go to sign up
            this.router.navigate(['/sign-up']);
          })
          .catch((error) => {

            Swal.fire({
              position: "center",
              icon: 'error',
              title: error,
              showConfirmButton: true
            });
          });
      })
      .catch((error) => {

        Swal.fire({
          position: "center",
          icon: 'error',
          title: error,
          showConfirmButton: true
        });
      });
  };
}
