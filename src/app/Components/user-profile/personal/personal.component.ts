import {Component, Input, OnInit, ViewChild} from '@angular/core';
import { User } from '../../../Classes/user';
import { AuthenticationService } from '../../../Services/authentication/authentication.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StorageService } from '../../../Services/storage/storage.service';
import * as moment from "moment";

@Component({
    selector: 'app-personal',
    templateUrl: './personal.component.html',
    styleUrls: ['./personal.component.scss']
})
export class PersonalComponent implements OnInit {
    @Input() user: User;
    formUpdateProfile: FormGroup = new FormGroup({
        firstName: new FormControl('', [Validators.required]),
        lastName: new FormControl('', [Validators.required]),
    });

    @ViewChild('modalUpdateProfile') modalUpdateProfile;

    constructor(
        private storage: StorageService,
        private auth: AuthenticationService,
    ) {
    }

    ngOnInit(): void {
    }

    async updateProfile() {
        // Hide modal
        this.modalUpdateProfile.nativeElement.click();

        const firstName = this.formUpdateProfile.value.firstName;
        const lastName = this.formUpdateProfile.value.lastName;
        await this.auth.updateProfile(firstName, lastName);
    };

    uploadProfilePicture() {
        // document.getElementById('file_upload')?.click();
    }

    updateProfilePicture(event) {
        // this.storage.updateProfilePicture(event);
    }
}
