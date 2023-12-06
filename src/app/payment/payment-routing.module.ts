import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerGuard } from '../helpers/customer.guard';
import { PaymentComponent } from './payment.component';

const routes: Routes = [
  {
    path: 'payment',
    component: PaymentComponent,
    canActivate: [CustomerGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentRoutingModule {}
