import { DashboardV2Component } from '../dashboard-v2/dashboard-v2.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BillingComponent } from '../billing/billing.component';
import { BuyaddonFailedComponent } from '../billing/buyaddon-failed/buyaddon-failed.component';
import { BuyaddonsuccessComponent } from '../billing/buyaddonsuccess/buyaddonsuccess.component';
import { ViewaddonComponent } from '../billing/viewaddon/viewaddon.component';
import { ChangepasswordComponent } from '../changepassword/changepassword.component';
import { CustomerUserFormComponent } from '../customer-user/customer-user-form/customer-user-form.component';
import { CustomerUserListComponent } from '../customer-user/customer-user-list/customer-user-list.component';
import { GoogleComponent } from '../google/google.component';
import { TokenComponent } from '../google/token/token.component';
import { InvoiceComponent } from '../invoice/invoice.component';
import { ProfileComponent } from '../profile/profile.component';
import { PaymentformComponent } from '../stripe/updatepayment/paymentform/paymentform.component';
import { UpdatepaymentComponent } from '../stripe/updatepayment/updatepayment.component';
import { TrafficComponent } from '../traffic/traffic.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardV2Component },
  { path: 'billing', component: BillingComponent },
  { path: 'invoice', component: InvoiceComponent },
  { path: 'traffic', component: TrafficComponent },
  {
    path: 'fraud',
    loadChildren: () =>
      import('../fraud/fraud.module').then((m) => m.FraudModule),
  },
  {
    path: 'report',
    loadChildren: () =>
      import('../fraud/table/table.module').then((m) => m.TableModule),
  },
  { path: 'adwords', component: GoogleComponent },
  { path: 'ads/token', component: TokenComponent },
  { path: 'profile/:id', component: ProfileComponent },
  { path: 'customer-user-list', component: CustomerUserListComponent },
  { path: 'customer-user-form', component: CustomerUserFormComponent },
  { path: 'customer-user-form/:id', component: CustomerUserFormComponent },
  { path: 'changepassword/:id', component: ChangepasswordComponent },
  { path: 'update-payment-information', component: UpdatepaymentComponent },
  { path: 'update-payment/:id', component: PaymentformComponent },
  { path: 'add-on', component: ViewaddonComponent },
  { path: 'success/:status', component: BuyaddonsuccessComponent },
  { path: 'failed/:status', component: BuyaddonFailedComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
