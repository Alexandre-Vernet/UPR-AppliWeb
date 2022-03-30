import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../../Services/authentication/authentication.service';
import { PwaUpdateService } from '../../Services/pwa/pwa-update.service';
import { CryptoService } from '../../Services/crypto/crypto.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(
        private auth: AuthenticationService,
        private pwaUpdater: PwaUpdateService,
        private cryptoService: CryptoService,
        private router: Router,
    ) {
    }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return new Promise(async (resolve, reject) => {
            // Get local storage
            const email = localStorage.getItem('email');
            const password = localStorage.getItem('password');

            // Check connection
            if (email && password) {
                const hashPassword = this.cryptoService.decrypt(password);

                this.auth.signIn(email, hashPassword);
                resolve(true);
            } else {
                await this.router.navigateByUrl('/sign-up');
                reject(false);
            }
        });
    }

}
