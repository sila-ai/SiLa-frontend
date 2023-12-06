import { DashboardV2Component } from './dashboard-v2/dashboard-v2.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PaymentComponent } from '../payment/payment.component';
import { AdminUserFormComponent } from './admin-user/admin-user-form/admin-user-form.component';
import { AdminUserListComponent } from './admin-user/admin-user-list/admin-user-list.component';
import { ChangepasswordComponent } from './changepassword/changepassword.component';
import { ContactListComponent } from './contact/contact-list/contact-list.component';
import { ProfileComponent } from './profile/profile.component';
import { CustomerFormComponent } from './stripe/customer/customer-form/customer-form.component';
import { CustomerListComponent } from './stripe/customer/customer-list/customer-list.component';
import { PlanFormComponent } from './stripe/plans/plan-form/plan-form.component';
import { PlanListComponent } from './stripe/plans/plan-list/plan-list.component';
import { ProductFormComponent } from './stripe/products/product-form/product-form.component';
import { ProductListComponent } from './stripe/products/product-list/product-list.component';
import { ScheduleListComponent } from './stripe/schedule/schedule-list/schedule-list.component';
import { SubscriptionListComponent } from './stripe/subscriptions/subscription-list/subscription-list.component';

const routes: Routes = [

      { path: 'dashboard', component: DashboardV2Component },
      { path: 'changepassword/:id', component: ChangepasswordComponent },
      { path: 'profile/:id', component: ProfileComponent },
      { path: 'payment', component: PaymentComponent },

      { path: 'management', component: ContactListComponent },

      { path: 'admin-user-list', component: AdminUserListComponent },
      { path: 'admin-user-form', component: AdminUserFormComponent },
      { path: 'admin-user-form/:id', component: AdminUserFormComponent },

      { path: 'subscription-list', component: SubscriptionListComponent },

      { path: 'plan-list', component: PlanListComponent },
      { path: 'plan-form', component: PlanFormComponent },
      { path: 'plan-form/:id', component: PlanFormComponent },

      { path: 'product-list', component: ProductListComponent },
      { path: 'product-form', component: ProductFormComponent },
      { path: 'product-form/:id', component: ProductFormComponent },

      { path: 'customer-list', component: CustomerListComponent },
      { path: 'customer-form', component: CustomerFormComponent },
      { path: 'customer-form/:id', component: CustomerFormComponent },

      { path: 'schedule-list', component: ScheduleListComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
