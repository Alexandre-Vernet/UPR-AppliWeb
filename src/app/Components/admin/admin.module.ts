import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { AdminComponent } from './admin.component';


@NgModule({
  declarations: [AdminComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
  ]
})
export class AdminModule { }
