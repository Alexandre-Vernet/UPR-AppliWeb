import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StorageRoutingModule } from './storage-routing.module';
import { StorageComponent } from './storage.component';
import { SearchPipe } from '../../Pipes/search.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
    declarations: [
        StorageComponent,
        SearchPipe
    ],
    imports: [
        CommonModule,
        StorageRoutingModule,
        FormsModule,
        ReactiveFormsModule
    ]
})
export class StorageModule {
}
