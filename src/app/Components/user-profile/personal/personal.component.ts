import {Component, Input, OnInit, ViewChild} from '@angular/core';
import { User } from '../../../Classes/user';
import { AuthenticationService } from '../../../Services/authentication/authentication.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StorageService } from '../../../Services/storage/storage.service';
import * as moment from "moment";
import {FirestoreService} from "../../../Services/firestore/firestore.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.scss']
})
export class PersonalComponent implements OnInit{

  userId: string = '';

  @Input() user: User;
  formUpdateProfile: FormGroup = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
  });

  @ViewChild('modalUpdateProfile') modalUpdateProfile;

  constructor(
    private storage: StorageService,
    private auth: AuthenticationService,
    private firestore: FirestoreService,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.userId = params['id'];
    });
  }

  async updateProfile() {
    // Hide modal
    this.modalUpdateProfile.nativeElement.click();

    const firstName = this.formUpdateProfile.value.firstName;
    const lastName = this.formUpdateProfile.value.lastName;
    await this.firestore.updateProfile(firstName, lastName, this.userId);
  };

  uploadProfilePicture() {
    // document.getElementById('file_upload')?.click();
  }

  updateProfilePicture(event) {
    // this.storage.updateProfilePicture(event);
  }
}

