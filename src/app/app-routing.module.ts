import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from './Components/sign-in/sign-in.component';
import { SignUpComponent } from './Components/sign-up/sign-up.component';
import { HomeComponent } from './Components/home/home.component';
import { AuthGuard } from './Guards/auth/auth.guard';
import {CalendarComponent} from "./Components/calendar/calendar.component";

const routes: Routes = [
  { path: 'sign-up', component: SignUpComponent },
  { path: 'sign-in', component: SignInComponent },
  { path: 'calendar', component: CalendarComponent },
  {
        path: 'storage',
        loadChildren: () => import('./Components/storage/storage.module').then(module => module.StorageModule),
        canActivate: [AuthGuard],
    },
    {
        path: 'admin',
        loadChildren: () => import('./Components/admin/admin.module').then(module => module.AdminModule),
        canActivate: [AuthGuard],
    },
    {
        path: 'user-profile',
        loadChildren: () => import('./Components/user-profile/user-profile.module').then(module => module.UserProfileModule),
        canActivate: [AuthGuard],
    },
    {
        path: '**',
        component: HomeComponent,
        canActivate: [AuthGuard],
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {
}
