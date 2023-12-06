import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbButtonModule, NbCardModule, NbDialogModule, NbInputModule, NbLayoutModule, NbTreeGridModule } from '@nebular/theme';
import { ReactiveFormsModule } from '@angular/forms';
import { CustomerUserFormComponent } from './customer-user-form/customer-user-form.component';
import { CustomerUserListComponent } from './customer-user-list/customer-user-list.component';

@NgModule({
  declarations: [CustomerUserFormComponent, CustomerUserListComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NbCardModule, 
    NbTreeGridModule,
    NbInputModule,
    NbButtonModule,
    NbLayoutModule,
    NbDialogModule.forRoot()
  ]
})
export class CustomerUserModule { }
