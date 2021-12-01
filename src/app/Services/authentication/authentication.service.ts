import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import Swal from 'sweetalert2';
import { User } from 'src/app/Classes/user';

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateEmail,
  updatePassword,
  deleteUser,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  getFirestore,
  updateDoc,
  deleteDoc,
  getDocs,
  collection,
  query,
} from 'firebase/firestore';

declare var $: any;
@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  user: User;
  _firebaseError: string = '';

  db = getFirestore();
  auth = getAuth();

  provider = new GoogleAuthProvider();

  constructor(private router: Router, private cookieService: CookieService) {}

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
        console.log(user);

        // Get user datas
        const docRef = doc(this.db, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          console.log('Document data:', docSnap.data());

          //  Set data
          let firstName = docSnap.data()?.firstName;
          let lastName = docSnap.data()?.lastName;
          let email = docSnap.data()?.email;
          let role = docSnap.data()?.role;
          let profilePicture = docSnap.data()?.profilePicture;
          let dateCreation = docSnap.data()?.dateCreation;

          this.user = new User(
            firstName,
            lastName,
            email,
            role,
            true,
            profilePicture,
            dateCreation.toDate()
          );

          // Set cookie
          this.cookieService.set('email', email, 365);
          this.cookieService.set('password', password, 365);

          // Clear error
          this.firebaseError = '';

          //set status to connected
          const userRef = doc(this.db, 'users', user.uid);
          await updateDoc(userRef, {
            status: true,
          });

          let url = window.location.pathname;
          if (url != '/sign-in') this.router.navigate([url]);
          else this.router.navigate(['/home']);
        } else {
          // doc.data() will be undefined in this case
          console.log('No such document!');
        }
      })
      .catch((error) => {
        console.log('error: ', error);
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
          role: 'USER',
          status: false,
          email: email,
          dateCreation: new Date(),
        })
          .then(() => {
            //  User data has been created
            console.log('User data has been saved !');

            // Clear error
            this.firebaseError = '';

            this.signIn(email, password);
          })
          .catch((error) => {
            console.log(
              `Error in creation of the data of the user ${error.message}`
            );

            this.firebaseError = error.message;
          });
      })
      .catch((error) => {
        console.log(`Error in creation of the user : ${error.message}`);
        this.firebaseError = error.message;
      });

    return this.firebaseError;
  };

  // /**
  //  * Google connexion
  //  */
  googleSignUp = () => {
    signInWithPopup(this.auth, this.provider)
      .then(async (result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        console.log('token: ', token);
        // The signed-in user info.
        const user = result.user;
        console.log('user: ', user);

        // Get data from google account
        const firstName = result.user?.displayName?.split(' ')[0];
        const lastName = result.user?.displayName?.split(' ')[1];
        const email = result.user?.email;
        const profilePicture = result.user?.photoURL;

        // Set users data
        this.user = new User(
          firstName,
          lastName,
          email,
          null,
          true,
          profilePicture,
          new Date()
        );
        
        const q = query(collection(this.db, 'users'));

        const querySnapshot = await getDocs(q);
        let found = false;
        // Add duplicate file to array 'documents'
        querySnapshot.forEach((doc) => {
            if (doc.id === user.uid) { 
                found = true;
                return;
            }
        });

        // If file already exists
        if (!found) {
            await setDoc(doc(this.db, 'users', user.uid), {
                firstName: firstName,
                lastName: lastName,
                role: 'USER',
                status: true,
                email: email,
                dateCreation: new Date(),
                })
                .then((user) => {
                    //  User data has been created
                    console.log('User is logged with google account');

                    // Clear error
                    this.firebaseError = '';

                    // Navigate to home
                    this.router.navigate(['home']);
                })
                .catch((error) => {
                    console.log(
                    `Error in creation of the data of the user ${error.message}`
                    );
                    this.firebaseError = error.message;
                });
        }
        else {
            await setDoc(doc(this.db, 'users', user.uid), {
                    firstName: firstName,
                    lastName: lastName,
                    status: true,
                    email: email,
                    dateCreation: new Date(),
                    })
                    .then((user) => {
                        //  User data has been created
                        console.log('User is logged with google account');

                        // Clear error
                        this.firebaseError = '';

                        // Navigate to home
                        this.router.navigate(['home']);
                    })
                    .catch((error) => {
                        console.log(
                        `Error in creation of the data of the user ${error.message}`
                        );
                        this.firebaseError = error.message;
                    });
        }
        
      })
      .catch((error) => {
        console.log('error: ', error);
        const errorMessage = error.message;
        this.firebaseError = errorMessage;
      });
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
          icon: 'success',
          title: `Un email a été envoyé à ${emailAddress}`,
          showConfirmButton: false,
          timer: 1500,
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
          icon: 'error',
          title: errorCode,
          showConfirmButton: true,
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
      lastName: lastName,
    })
      .then(() => {
        // User has been successfully updated
        console.log('User has been successfully updated');

        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Your account has been successfully updated',
          showConfirmButton: false,
          timer: 1500,
        });

        // Update values
        this.user.firstName = firstName;
        this.user.lastName = lastName;
      })
      .catch((error) => {
        // The document probably doesn't exist.
        console.error('Error updating document: ', error);

        Swal.fire({
          icon: 'error',
          title: error,
          showConfirmButton: true,
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
          email: email,
        }).then(() => {
          // Disconnect
          this.signOut();

          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Your email has been successfully updated',
            showConfirmButton: false,
            timer: 1500,
          });
        });
      })
      .catch((error) => {
        // An error occurred
        Swal.fire({
          icon: 'error',
          title: error,
          showConfirmButton: true,
        });
      });
  };

  /**
   * Update password
   * @param password
   */
  updatePassword = (newPassword: string) => {
    const user = this.auth.currentUser;

    updatePassword(user, newPassword)
      .then(() => {
        console.log('Password has been successfully updated');
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: `Password has been successfully updated`,
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch((error: string) => {
        console.log('error: ', error);
        Swal.fire({
          icon: 'error',
          title: error,
          showConfirmButton: true,
        });
      });
  };

  /**
   * Sign out the user
   */
  signOut = () => {
    signOut(this.auth)
      .then(async () => {
        // Delete cookie
        this.cookieService.delete('password');

        //set status to connected
        const userRef = doc(this.db, 'users', this.auth.currentUser.uid);
        await updateDoc(userRef, {
          status: false,
        });

        this.router.navigate(['/sign-in']);
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
        console.log('All data of the user has been deleted');

        await deleteDoc(doc(this.db, 'users', userId))
          .then(() => {
            // User deleted.
            console.log('User has been deleted');

            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: `User has been deleted`,
              showConfirmButton: false,
              timer: 1500,
            });

            // Go to sign up
            this.router.navigate(['/sign-up']);
          })
          .catch((error) => {
            console.log(`Error while deleting the user : ${error}`);

            Swal.fire({
              icon: 'error',
              title: error,
              showConfirmButton: true,
            });
          });
      })
      .catch((error) => {
        console.error(`Error deleting data of user : ${error}`);

        Swal.fire({
          icon: 'error',
          title: error,
          showConfirmButton: true,
        });
      });
  };
}
