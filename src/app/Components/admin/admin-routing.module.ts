import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import {AddUserComponent} from "./add-user/add-user.component";
import {IndexUserComponent} from "./index-user/index-user.component";

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        component: IndexUserComponent,
      },
      {
        path: 'add-user',
        component: AddUserComponent
      }
    ]
  },
  {
    path: 'edit-user',
    loadChildren: () => import("../../Components/user-profile/user-profile.module").then(module => module.UserProfileModule)
  },
  {

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
