import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from './Components/sign-in/sign-in.component';
import { SignUpComponent } from './Components/sign-up/sign-up.component';
import { StorageComponent } from './Components/storage/storage.component';
import { HomeComponent } from './Components/home/home.component';

const routes: Routes = [
	{ path: 'sign-up', component: SignUpComponent },
	{ path: 'sign-in', component: SignInComponent },
	{ path: 'storage', component: StorageComponent },
	{ path: '**', component: HomeComponent },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
