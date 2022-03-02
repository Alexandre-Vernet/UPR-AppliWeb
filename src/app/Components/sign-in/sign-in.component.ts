import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { AuthenticationService } from 'src/app/Services/authentication/authentication.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-sign-in',
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
    firebaseError: string = '';
    _viewPassword: boolean = false;

    email!: string;
    form = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [
            Validators.required,
            Validators.minLength(6)
        ])
    });

    formReset = new FormGroup({
        emailReset: new FormControl('', [
            Validators.required,
            Validators.email,
        ]),
    });

    @ViewChild('modalResetPassword') modalResetPassword;

    constructor(
        private auth: AuthenticationService,
        private cookieService: CookieService
    ) {
    }

    ngOnInit() {

        const cookieEmail = this.cookieService.get('email');
        if (cookieEmail) {
            this.email = cookieEmail;
        }

        this.firebaseError = this.auth.firebaseError;
    }

    signIn = () => {
        // Get email & pswd
        const email = this.form.value.email;
        const password = this.form.value.password;

        // Sign-in
        this.firebaseError = this.auth.signIn(email, password);
    };


    resetPassword = () => {
        Swal.fire({
            title: 'Reinitialisation de mot de passe',
            input: 'email',
            inputPlaceholder: 'john.doe@gmail.com',
            showCancelButton: true
        }).then((result) => {
            if (result.value) {
                const userEmail = JSON.parse(JSON.stringify(result.value));
                console.log(userEmail);
                this.auth.resetPassword(userEmail);
            }
        });
    };

    viewPassword = () => {
        this._viewPassword = !this._viewPassword;
    };
}
