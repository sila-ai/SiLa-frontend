import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ScheduleComponent } from './schedule/schedule.component';
import { NbButtonModule, NbCardModule, NbDialogModule, NbInputModule, NbLayoutModule, NbTreeGridModule } from '@nebular/theme';
import { CustomerModule } from './customer/customer.module';
import { PlansModule } from './plans/plans.module';
import { PricesModule } from './prices/prices.module';
import { ProductsModule } from './products/products.module';
import { ScheduleModule } from './schedule/schedule.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { UpdatepaymentComponent } from './updatepayment/updatepayment.component';
import { PaymentformComponent } from './updatepayment/paymentform/paymentform.component';

@NgModule({
  declarations: [
    ScheduleComponent,
    UpdatepaymentComponent,
    PaymentformComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NbCardModule, 
    NbTreeGridModule,
    NbInputModule,
    NbLayoutModule,
    NbButtonModule,
    NbDialogModule,
    CustomerModule,
    PlansModule,
    PricesModule,
    ProductsModule,
    ScheduleModule,
    SubscriptionsModule
  ]
})
export class StripeModule { }

/**
 * Plans
 * Prices
 * Products
 * Subscriptions
 * Subscriptions Schedules
 */