import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  NbButtonModule,
  NbCardModule,
  NbListModule,
  NbSidebarModule,
  NbLayoutModule,
  NbUserModule,
  NbIconModule,
  NbSelectModule,
  NbRadioModule
} from '@nebular/theme';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PaymentComponent } from './payment.component';
import { PaymentRoutingModule } from './payment-routing.module';

@NgModule({
  declarations: [
    PaymentComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NbButtonModule,
    PaymentRoutingModule,
    NbCardModule,
    NbSidebarModule.forRoot(),
    NbListModule,
    NbLayoutModule,
    NbUserModule,
    NbIconModule,
    NbSelectModule,
    NbRadioModule
  ],
})

export class PaymentModule { }
