import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/Services/storage/storage.service';
import { File } from 'src/app/Classes/file';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-storage',
    templateUrl: './storage.component.html',
    styleUrls: ['./storage.component.scss']
})
export class StorageComponent implements OnInit {
    file: File;
    files: File[] = [];
    searchBar: string;

    // Rename file
    formRenameFile = new FormGroup({
        file: new FormControl('', [Validators.required]),
    });

    constructor(private storageService: StorageService) {
    }

    ngOnInit(): void {
        this.getFiles();
    }

    getFiles() {
        this.storageService.getFiles().then((files: File[]) => {
            this.files = files;
        });
    }

    getIcon(file: File): string {
        const source = 'assets/images/icons';
        switch (file.extension) {
            case 'png':
            case 'jpg':
            case 'jpeg':
                return `${ source }/jpg.png`;
            case 'pdf':
                return `${ source }/pdf.png`;
            default:
                return `${ source }/bat.png`;
        }
    }

    fileDetails(file: File) {
        this.file = file;

        // Set message in modal
        this.formRenameFile.get('file').setValue(file.name);
    }

    focusUpload() {
        document.getElementById('file_upload')?.click();
    }

    async uploadFile(event) {
        await this.storageService.uploadFile(event);
    }

    async deleteFile(file: File) {
        await this.storageService.deleteFile(file);
    }

    // Convert octets to kilo octets
    convertOctets(fileSize: number) {
        return fileSize / 1000;
    }

    async renameFile() {
        const newFile = this.formRenameFile.value.file;
        await this.storageService.renameFile(this.file, newFile);
    }
}
