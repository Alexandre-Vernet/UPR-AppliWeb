import { Injectable } from '@angular/core';
import {
	addDoc,
	collection,
	getDocs,
	getFirestore,
	query,
} from 'firebase/firestore';
import {
	deleteObject,
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
	storage = getStorage();
	db = getFirestore();

	user: User;
	files: File[] = [];

	constructor() {}

	async getFiles(): Promise<File[]> {
		const filesRef = ref(this.storage, 'files');

		listAll(filesRef)
			.then((res) => {
				res.items.forEach((itemRef) => {
					const name = itemRef.name;

					// Get URL file
					getDownloadURL(ref(this.storage, `files/${name}`))
						.then(async (url) => {
							const q = query(collection(this.db, 'files'));

							// Get all files from firestore
							const querySnapshot = await getDocs(q);
							querySnapshot.forEach((doc) => {
								const name = doc.get('name');
								const extensionFile = name.split('.')[1];
								const size = doc.get('size');
								const date = doc.get('date');

								const file = new File(
									name,
									url,
									extensionFile,
									size,
									date
								);

								this.files.push(file);
							});
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
					timer: 4000,
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
				// Upload to firestore
				await addDoc(collection(this.db, 'files'), {
					name: file.name,
					url: image.ref.fullPath,
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
			})
			.catch((error) => {
				console.log('error: ', error);

				Swal.fire({
					position: 'top-end',
					icon: 'error',
					title: `Error ${error}`,
					showConfirmButton: false,
					timer: 4000,
				});
			});
	};

	async deleteFile(file: File) {
		// Create a reference to the file to delete
		const desertRef = ref(this.storage, `files/${file.name}`);

		// Delete the file
		deleteObject(desertRef)
			.then(() => {
				// File deleted successfully

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
					title: `Error while deleting file ${error}`,
					showConfirmButton: false,
					timer: 4000,
				});
			});
	}
}
