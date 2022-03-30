import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfileRoutingModule } from './user-profile-routing.module';
import { UserProfileComponent } from './user-profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { PersonalComponent } from './personal/personal.component';
import { SecurityComponent } from './security/security.component';


@NgModule({
  declarations: [
    UserProfileComponent,
    PersonalComponent,
    SecurityComponent],
  imports: [
    CommonModule,
    UserProfileRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [UserProfileComponent]
})
export class UserProfileModule { }
