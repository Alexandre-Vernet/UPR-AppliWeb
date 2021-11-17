import { Injectable } from '@angular/core';
import { getFirestore } from 'firebase/firestore';
import { getDownloadURL, getStorage, list, listAll, ref, uploadBytes } from "firebase/storage";
import { User } from 'src/app/Classes/user';
import { File } from 'src/app/Classes/file';
import Swal from 'sweetalert2';

@Injectable({
    providedIn: 'root'
})
export class StorageService {

    user: User;
    files: File[] = [];

    storage = getStorage();
    db = getFirestore();

    constructor() { }

    async getFiles(): Promise<File[]> {

        const filesRef = ref(this.storage, 'files');

        const firstPage = await list(filesRef, { maxResults: 1 });
        //   processItems(firstPage.items)



        listAll(filesRef)
            .then((res) => {
                res.items.forEach((itemRef) => {
                    const name = itemRef.name;

                    // Get URL file
                    getDownloadURL(ref(this.storage, `files/${name}`))
                        .then(async (url) => {
                            const file = new File(name, url, new Date());
                            this.files.push(file);

                            // Pagination
                            if (firstPage.nextPageToken) {
                                const secondPage = await list(filesRef, {
                                    maxResults: 100,
                                    pageToken: firstPage.nextPageToken,
                                });
                                // processItems(secondPage.items)
                                // processPrefixes(secondPage.prefixes)
                            }
                        })
                        .catch((error) => {
                            console.log('error: ', error)

                            Swal.fire({
                                position: 'top-end',
                                icon: 'success',
                                title: `Error while getting URL files ${error}`,
                                showConfirmButton: false,
                                timer: 1500,
                            });
                        });

                });
            }).catch((error) => {
                console.log('error: ', error);

                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: `Error while getting files ${error}`,
                    showConfirmButton: false,
                    timer: 1500,
                });
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


        const storageRef = ref(this.storage, `files/${file.name}`);

        uploadBytes(storageRef, file).then(async (image) => {
            console.log('image: ', image);

            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'File has been uploaded successfully',
                showConfirmButton: false,
                timer: 1500,
            });

            // await addDoc(collection(this.db, "messages"), {
            //     email: this.auth.user.email,
            //     firstName: this.auth.user.firstName,
            //     lastName: this.auth.user.lastName,
            //     image: image.ref.fullPath,
            //     date: new Date(),
            // });

        }).catch((error) => {
            console.log('error: ', error);

            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: `Error ${error}`,
                showConfirmButton: false,
                timer: 1500,
            });
        })
    };
}
