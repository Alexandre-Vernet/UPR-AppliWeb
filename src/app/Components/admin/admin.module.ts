import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { IndexUserComponent } from './index-user/index-user.component';
import { SubscriptionComponent } from './subscription/subscription.component';


@NgModule({
  declarations: [AdminComponent, IndexUserComponent, SubscriptionComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
  ]
})
export class AdminModule { }
