import { Injectable } from '@angular/core';
import { addDoc, collection, getFirestore } from 'firebase/firestore';
import { getStorage, listAll, ref, uploadBytes } from "firebase/storage";
import { User } from 'src/app/Classes/user';
import { File } from 'src/app/Classes/file';
import { AuthenticationService } from '../authentication/authentication.service';

@Injectable({
    providedIn: 'root'
})
export class StorageService {

    user: User;
    files: File[] = [];

    storage = getStorage();
    db = getFirestore();

    constructor(private auth: AuthenticationService) { }

    async getFiles(): Promise<File[]> {

        const filesRef = ref(this.storage, 'files');

        listAll(filesRef)
            .then((res) => {
                res.items.forEach((itemRef) => {
                    const name = itemRef.name;
                    const file = new File(name);

                    this.files.push(file);
                });
            }).catch((error) => {
                console.log('error: ', error);
            });

        return this.files;
    }

    /**
   * Send file
   * @param event
   */
    sendFile = (event) => {
        // Get file
        const file = event.target.files[0];
        console.log('file: ', file)


        const storageRef = ref(this.storage, `images/${file.name}`);

        uploadBytes(storageRef, file).then(async (image) => {
            console.log('image: ', image);

            await addDoc(collection(this.db, "messages"), {
                email: this.auth.user.email,
                firstName: this.auth.user.firstName,
                lastName: this.auth.user.lastName,
                image: image.ref.fullPath,
                date: new Date(),
            });
        });
    };


}
