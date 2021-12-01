import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/Services/storage/storage.service';
import { File } from 'src/app/Classes/file';
import { getStorage } from 'firebase/storage';

@Component({
	selector: 'app-storage',
	templateUrl: './storage.component.html',
	styleUrls: ['./storage.component.scss'],
})
export class StorageComponent implements OnInit {
	storage = getStorage();
	file: File;
	files: File[] = [];
	searchBar: string;

	constructor(private storageService: StorageService) {}

	ngOnInit(): void {
		this.getFiles();
	}

	getFiles() {
		this.storageService.getFiles().then((files: File[]) => {
			this.files = files;
		});
	}

	fileDetails(file: File) {
		this.file = file;
	}

	focusUpload = () => {
		document.getElementById('file_upload')?.click();
	};

	uploadFile = (event) => {
		this.storageService.uploadFile(event);
	};

	deleteFile(file: File) {
		this.storageService.deleteFile(file);
	}

	formatDate = (date) => {
		const option = {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
		};
		const time = date.toDate().toLocaleTimeString('fr-FR');

		return time;
	};

	formatDate2 = (date) => {
		// const now = new Date();
		// console.log('now: ', now);
		// const y = now.getFullYear();
		// const m = now.getMonth() + 1;
		// const d = now.getDate();
		// const formatedDate = `${y}-${m}-${d}`;
		// return formatedDate;
	};
}
