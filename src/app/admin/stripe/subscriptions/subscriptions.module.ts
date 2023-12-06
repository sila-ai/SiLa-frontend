import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbButtonModule, NbCardModule, NbDialogModule, NbInputModule, NbLayoutModule, NbTreeGridModule } from '@nebular/theme';
import { ReactiveFormsModule } from '@angular/forms';
import { SubscriptionListComponent } from './subscription-list/subscription-list.component';

@NgModule({
  declarations: [SubscriptionListComponent],
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
export class SubscriptionsModule { }
