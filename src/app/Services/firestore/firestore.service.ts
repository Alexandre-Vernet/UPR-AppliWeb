import { Injectable } from '@angular/core';
import { collection, getFirestore, query, getDocs } from 'firebase/firestore';
import { User } from 'src/app/Classes/user';

@Injectable({
    providedIn: 'root'
})
export class FirestoreService {

    users: User[] = [];

    db = getFirestore();

    constructor() {
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
}
