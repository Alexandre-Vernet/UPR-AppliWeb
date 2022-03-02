import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { User } from 'src/app/Classes/user';

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
    updateDoc
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

                if (docSnap.exists()) {
                    //  Set data
                    const id = docSnap.id;
                    const {
                        firstName,
                        lastName,
                        email,
                        role,
                        profilePicture,
                        dateCreation,
                    } = docSnap.data();

                    this.user = new User(
                        id,
                        firstName,
                        lastName,
                        email,
                        role,
                        true,
                        profilePicture,
                        dateCreation.toDate()
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
                    dateCreation: new Date()
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
                            `Error in creation of the data of the user ${ error.message }`
                        );

                        this.firebaseError = error.message;
                    });
            })
            .catch((error) => {
                console.log(`Error in creation of the user : ${ error.message }`);
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
                    icon: 'success',
                    title: `Un email a été envoyé à ${ emailAddress }`,
                    showConfirmButton: false,
                    timer: 1500
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
                console.log('User has been successfully updated');

                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Your account has been successfully updated',
                    showConfirmButton: false,
                    timer: 1500
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
                        position: 'top-end',
                        icon: 'success',
                        title: 'Your email has been successfully updated',
                        showConfirmButton: false,
                        timer: 1500
                    });
                });
            })
            .catch((error) => {
                // An error occurred
                Swal.fire({
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
                console.log('Password has been successfully updated');
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: `Password has been successfully updated`,
                    showConfirmButton: false,
                    timer: 1500
                });
            })
            .catch((error: string) => {
                console.log('error: ', error);
                Swal.fire({
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
                            timer: 1500
                        });

                        // Go to sign up
                        this.router.navigate(['/sign-up']);
                    })
                    .catch((error) => {
                        console.log(`Error while deleting the user : ${ error }`);

                        Swal.fire({
                            icon: 'error',
                            title: error,
                            showConfirmButton: true
                        });
                    });
            })
            .catch((error) => {
                console.error(`Error deleting data of user : ${ error }`);

                Swal.fire({
                    icon: 'error',
                    title: error,
                    showConfirmButton: true
                });
            });
    };
}
