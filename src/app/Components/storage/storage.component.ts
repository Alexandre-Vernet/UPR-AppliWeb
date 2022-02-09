import { Component, OnInit, ViewChild } from '@angular/core';
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

    @ViewChild('modalCloseRenameFile') modalCloseRenameFile;

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

    // Convert octets to Ko, Mo, Go
    convertOctets(fileSize: number) {
        if (fileSize < 1024) {
            return `${ fileSize } octets`;
        } else if (fileSize < 1048576) {
            return `${ Math.round(fileSize / 1024) } Ko`;
        } else if (fileSize < 1073741824) {
            return `${ Math.round(fileSize / 1048576) } Mo`;
        } else {
            return `${ Math.round(fileSize / 1073741824) } Go`;
        }
    }

    async renameFile() {
        const newFile = this.formRenameFile.value.file;
        this.storageService.renameFile(this.file, newFile).then(() => {
            // Close modal
            this.modalCloseRenameFile.nativeElement.click();

            // Update file name
            this.files.map((file: File) => {
                if (file.id === this.file.id) {
                    file.name = newFile;
                }
            });
        });
    }
}
