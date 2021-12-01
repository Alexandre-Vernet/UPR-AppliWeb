import { Injectable } from '@angular/core';
import { addDoc, collection, getFirestore } from 'firebase/firestore';
import {
	getDownloadURL,
	getStorage,
	listAll,
	ref,
	uploadBytes,
} from 'firebase/storage';
import { User } from 'src/app/Classes/user';
import { File } from 'src/app/Classes/file';
import Swal from 'sweetalert2';

@Injectable({
	providedIn: 'root',
})
export class StorageService {
	user: User;
	files: File[] = [];

	storage = getStorage();
	db = getFirestore();

	constructor() {}

	async getFiles(): Promise<File[]> {
		const filesRef = ref(this.storage, 'files');

		listAll(filesRef)
			.then((res) => {
				res.items.forEach((itemRef) => {
					const name = itemRef.name;
					const extensionFile = name.split('.')[1];

					// Get URL file
					getDownloadURL(ref(this.storage, `files/${name}`))
						.then(async (url) => {
							const file = new File(
								name,
								url,
								extensionFile,
								new Date()
							);
							this.files.push(file);
						})
						.catch((error) => {
							console.log('error: ', error);

							Swal.fire({
								position: 'top-end',
								icon: 'success',
								title: `Error while getting URL files ${error}`,
								showConfirmButton: false,
								timer: 1500,
							});
						});
				});
			})
			.catch((error) => {
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
		console.log('file: ', file);

		const storageRef = ref(this.storage, `files/${file.name}`);

		// Upload to storage
		uploadBytes(storageRef, file)
			.then(async (image) => {
				Swal.fire({
					position: 'top-end',
					icon: 'success',
					title: 'File has been uploaded successfully',
					showConfirmButton: false,
					timer: 1500,
				});

				// Upload to firestore
				await addDoc(collection(this.db, 'files'), {
					name: file.name,
					size: file.size,
					firstName: 'Alex',
					lastName: 'Vernet',
					email: 'alexandre.vernet@g-mail.fr',
					date: new Date(),
				});
			})
			.catch((error) => {
				console.log('error: ', error);

				Swal.fire({
					position: 'top-end',
					icon: 'error',
					title: `Error ${error}`,
					showConfirmButton: false,
					timer: 1500,
				});
			});
	};
}
