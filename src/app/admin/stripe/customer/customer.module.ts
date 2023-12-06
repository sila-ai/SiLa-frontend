import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerFormComponent } from './customer-form/customer-form.component';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { NbButtonModule, NbCardModule, NbDialogModule, NbInputModule, NbLayoutModule, NbTreeGridModule } from '@nebular/theme';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [CustomerFormComponent, CustomerListComponent],
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
export class CustomerModule { }
