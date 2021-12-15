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
		// Get all files from firestore
		const q = query(collection(this.db, 'files'));
		const querySnapshot = await getDocs(q);

		querySnapshot.forEach((doc) => {
			const filesRef = ref(this.storage, 'files');

			listAll(filesRef)
				.then((res) => {
					res.items.forEach((itemRef) => {
						const name = itemRef.name;
						console.log('name: ', name);

						// Get URL file
						getDownloadURL(ref(this.storage, `files/${name}`))
							.then(async (url) => {
								const id = doc.get('id');
								const name = doc.get('name');
								const extensionFile = name.split('.')[1];
								const size = doc.get('size');
								const date = doc.get('date');

								const email = doc.get('email');
								const firstName = doc.get('firstName');
								const lastName = doc.get('lastName');
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

								this.files.push(file);
							})
							.catch((error) => {
								console.log('error: ', error);

								Swal.fire({
									position: 'top-end',
									icon: 'success',
									title: `Error while getting URL files ${error}`,
									showConfirmButton: false,
									timer: 4000,
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
		});

		return this.files;
	}

	/**
	 * Upload file
	 * @param event
	 */
	uploadFile = async (event) => {
		// Get file
		const file = event.target.files[0];
		const storageRef = ref(this.storage, `files/${file.name}`);

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
			// Upload file
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
		}
	};

	async deleteFile(file: File) {
		// Create a reference to the file to delete
		const fileRef = ref(this.storage, `files/${file.name}`);

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
					title: `Error while deleting file ${error}`,
					showConfirmButton: false,
					timer: 4000,
				});
			});
	}
}
