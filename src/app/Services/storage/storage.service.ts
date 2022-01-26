import { Injectable } from '@angular/core';
import { addDoc, collection, deleteDoc, doc, getDocs, getFirestore, onSnapshot, query } from 'firebase/firestore';
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { User } from 'src/app/Classes/user';
import { File } from 'src/app/Classes/file';
import Swal from 'sweetalert2';
import { AuthenticationService } from '../authentication/authentication.service';
import * as moment from 'moment';

@Injectable({
    providedIn: 'root'
})
export class StorageService {
    storage = getStorage();
    db = getFirestore();

    user: User;
    files: File[] = [];

    constructor(private auth: AuthenticationService) {
        setTimeout(() => {
            this.auth.getAuth().then(user => {
                this.user = user;
            });
        }, 1500);
    }

    async getFiles(): Promise<File[]> {
        let files: File[] = [];

        const q = query(collection(this.db, 'files'));
        onSnapshot(q, (snapshot) => {
            snapshot.docChanges().forEach(async (change) => {
                if (change.type === 'added') {
                    const id = change.doc.id;
                    const { name, url, size, userId } = change.doc.data();
                    const extensionFile = name.split('.')[1];

                    moment.locale('fr-FR');
                    const date = moment(change.doc.data().date.toDate()).startOf('minutes').fromNow();  /* il a 12 minutes*/

                    await this.auth.getById(userId).then((userData) => {
                        const user = new User(
                            userData.id,
                            userData.firstName,
                            userData.lastName,
                            userData.email,
                            userData.role,
                            userData.status,
                            userData.profilePicture,
                            userData.dateCreation
                        );


                        const file = new File(
                            id,
                            name,
                            url,
                            extensionFile,
                            size,
                            user,
                            date
                        );

                        files.push(file);
                    });

                }
                if (change.type === 'modified') {
                    console.log('Modified city: ', change.doc.data());
                }
                if (change.type === 'removed') {
                    console.log('Removed city: ', change.doc.data());
                }
            });
        });
        this.files = files;
        return this.files;
    }

    /**
     * Upload file
     * @param event
     */
    uploadFile = async (event) => {
        // Get file
        const file = event.target.files[0];
        const q = query(collection(this.db, 'files'));

        const querySnapshot = await getDocs(q);
        const documents = [];
        // Add duplicate file to array 'documents'
        querySnapshot.forEach((doc) => {
            const name = doc.get('name');
            documents.push(name);
        });

        // If file already exists
        if (documents.includes(file.name)) {
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'File already exists',
                showConfirmButton: false,
                timer: 1500,
            });
        } else {

            // Set file source
            const fileSource = `files/${ file.name }`;

            // Upload file
            const storageRef = ref(this.storage, fileSource);
            uploadBytes(storageRef, file).then(() => {
                getDownloadURL(ref(this.storage, fileSource))
                    .then(async (url) => {
                        // Upload to firestore
                        await addDoc(collection(this.db, 'files'), {
                            name: file.name,
                            url: url,
                            size: file.size,
                            date: new Date(),
                            userId: this.user.id,
                        });

                        Swal.fire({
                            position: 'top-end',
                            icon: 'success',
                            title: 'File has been uploaded successfully',
                            showConfirmButton: false,
                            timer: 1500,
                        });
                    });
            })
                .catch((error) => {
                    console.log('error: ', error);

                    Swal.fire({
                        position: 'top-end',
                        icon: 'error',
                        title: `Error ${ error }`,
                        showConfirmButton: false,
                        timer: 4000,
                    });
                });
        }
    };

    async deleteFile(file: File) {
        // Create a reference to the file to delete
        const fileRef = ref(this.storage, `files/${ file.name }`);

        // Delete file in storage
        deleteObject(fileRef)
            .then(async () => {
                // Delete file details
                deleteDoc(doc(this.db, 'files', file.id)).then(() => {
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: 'File has been deleted successfully',
                        showConfirmButton: false,
                        timer: 1500,
                    });
                }).catch((error) => {
                    console.log('error: ', error);

                    Swal.fire({
                        position: 'top-end',
                        icon: 'error',
                        title: `Error ${ error }`,
                        showConfirmButton: false,
                        timer: 4000,
                    });
                });
            })
            .catch((error) => {
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: `Error while deleting file ${ error }`,
                    showConfirmButton: false,
                    timer: 4000,
                });
            });
    }
}
