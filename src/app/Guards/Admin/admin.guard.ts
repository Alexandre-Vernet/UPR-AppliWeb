import {Injectable} from '@angular/core';
import {CanLoad, Route, UrlSegment} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthenticationService} from 'src/app/Services/authentication/authentication.service';
import {User_Roles} from "../../Classes/user";

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanLoad {
  constructor(private authService: AuthenticationService) {
  }

  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
      if (!this.authService.user) return false
      if (this.authService.user.role === User_Roles.admin) return true;
      return false;
  }

}
