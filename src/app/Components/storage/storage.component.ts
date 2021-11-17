import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/Services/storage/storage.service';
import { File } from 'src/app/Classes/file';
import { getStorage } from 'firebase/storage';

@Component({
    selector: 'app-storage',
    templateUrl: './storage.component.html',
    styleUrls: ['./storage.component.scss']
})
export class StorageComponent implements OnInit {

    files: File[] = [];

    storage = getStorage();

    query: string;
    constructor(private storageService: StorageService) { }

    ngOnInit(): void {
        this.getFiles();
    }

    getFiles() {
        this.storageService.getFiles().then((files: File[]) => {
            this.files = files;
        });
    }

    focusUpload = () => {
        document.getElementById('file_upload')?.click();
    };

    uploadFile = (event) => {
        this.storageService.sendFile(event);
    };
}
