import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SignInComponent } from "./Components/sign-in/sign-in.component";
import { SignUpComponent } from "./Components/sign-up/sign-up.component";
import { HomeComponent } from "./Components/home/home.component";
import { AdminGuard } from "./Guards/Admin/admin.guard";

const routes: Routes = [
	{ path: "sign-up", component: SignUpComponent },
	{ path: "sign-in", component: SignInComponent },
	{
		path: "storage",
		loadChildren: () => import("./Components/storage/storage.module").then(module => module.StorageModule)
	},
	{
		path: "admin",
		loadChildren: () => import("./Components/admin/admin.module").then(module => module.AdminModule),
		canLoad: [AdminGuard]
	},
  {
    path: "user-profile",
    loadChildren: () => import("./Components/user-profile/user-profile.module").then(module => module.UserProfileModule)
  },
	{ path: "**", component: HomeComponent }
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
