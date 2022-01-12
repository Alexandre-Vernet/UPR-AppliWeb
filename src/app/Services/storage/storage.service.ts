import { Injectable } from '@angular/core';
import { addDoc, collection, getDocs, getFirestore, onSnapshot, query } from 'firebase/firestore';
import { deleteObject, getDownloadURL, getStorage, listAll, ref, uploadBytes } from 'firebase/storage';
import { User } from 'src/app/Classes/user';
import { File } from 'src/app/Classes/file';
import Swal from 'sweetalert2';

@Injectable({
    providedIn: 'root'
})
export class StorageService {
    storage = getStorage();
    db = getFirestore();

    user: User;
    files: File[] = [];

    constructor() {
    }

    async getFiles(): Promise<File[]> {
        let files: File[] = [];

        const q = query(collection(this.db, 'files'));
        onSnapshot(q, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === 'added') {
                    const id = change.doc.id;
                    const { name, url, extensionFile, size, date, email, firstName, lastName } = change.doc.data();
                    const user = new User(
                        firstName,
                        lastName,
                        email,
                        null,
                        null,
                        null,
                        null
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
                            firstName: 'Alex',
                            lastName: 'Vernet',
                            email: 'alexandre.vernet@g-mail.fr',
                            date: new Date(),
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

        // Delete the file
        deleteObject(fileRef)
            .then(() => {
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'File has been deleted successfully',
                    showConfirmButton: false,
                    timer: 1500,
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
