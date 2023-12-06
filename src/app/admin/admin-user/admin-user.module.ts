import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbButtonModule, NbCardModule, NbDialogModule, NbInputModule, NbLayoutModule, NbTreeGridModule } from '@nebular/theme';
import { ReactiveFormsModule } from '@angular/forms';
import { AdminUserFormComponent } from './admin-user-form/admin-user-form.component';
import { AdminUserListComponent } from './admin-user-list/admin-user-list.component';

@NgModule({
  declarations: [AdminUserFormComponent, AdminUserListComponent],
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
export class AdminUserModule { }
