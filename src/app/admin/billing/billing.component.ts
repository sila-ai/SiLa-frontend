import { Component, OnInit, TemplateRef } from '@angular/core';
import {
  NbIconConfig,
  NbSortDirection,
  NbSortRequest,
  NbToastrService,
  NbTreeGridDataSource,
  NbTreeGridDataSourceBuilder,
  NbDialogService,
} from '@nebular/theme';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import jwt_decode from 'jwt-decode';
import { SubscriptionsService } from 'src/app/services/subscriptions.service';
import { CustomerService } from 'src/app/services/customer.service';
import { ConfigDialogComponent } from './../core/modelwindow/config-dialog/config-dialog.component';
import { ConfirmDeleteComponent } from '../components/confirm-delete/confirm-delete.component';
import { PlansService } from '../../services/plans.service';
import { NgZone } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
interface TreeNode<T> {
  data: T;
  subscriptionData: T;
  children?: TreeNode<T>[];
  expanded?: boolean;
}

interface BEntry {
  id: string;
  status: string;
  nickname: string;
  amount: number;
  current_period_start: string;
  current_period_end: string;
}
@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss'],
})
export class BillingComponent implements OnInit {
  public data: TreeNode<BEntry>[];
  public subscriptionData: TreeNode<BEntry>[];
  public invoiceData: TreeNode<BEntry>[];

  dataSource: NbTreeGridDataSource<BEntry>;
  subscriptionSource: NbTreeGridDataSource<BEntry>;
  AddonlistSource: NbTreeGridDataSource<BEntry>;
  customColumns: any;
  defaultColumns: any;
  allColumns: any;

  subCustomColumns: any;
  subDefaultColumns: any;
  subAllColumns: any;
  AddonCustomColumns: any;
  AddonDefaultColumns: any;
  AddonAllColumns: any;
  sortColumn: string;
  sortDirection: NbSortDirection = NbSortDirection.NONE;
  customerId: string;
  customer: string;
  id:string;
  email:string;
  loading = false;
  activeSubscription: boolean = false;
  page = 1;
  count = 0;
  tableSize = 7;
  tableSizes = [3, 6, 9, 12];
  subscriberName;
  productName;
  subscriberStartDate;
  subscriberEndDate;
  subscriptionStatus;
  subscriberId;
  plans;
  upgradePlan;
  remainingDays;
  currentsubscription;
  planId;
  cancel_at_period_end;
  price: any;
  addon;
  totalClick;
  subCancel = false;
  public stripe_key: string = 'pk_test_51IbW5vJeWvg2Q9bCDq99fYZx6vPbO7rcRCnxZGhSMi99oYBzVAQ5KfgXKFg4F1TARJJQvfitQ92KwG7rrKayEPHK00iBBbivg1';
  public stripe_table: string = 'prctbl_1NxADmJeWvg2Q9bCUjffmPbt'
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private subscriptionService: SubscriptionsService,
    private customerService: CustomerService,
    public toastrService: NbToastrService,
    private dataSourceBuilder: NbTreeGridDataSourceBuilder<BEntry>,
    private subscriptionSourceBuilder: NbTreeGridDataSourceBuilder<BEntry>,
    private addonsourceBuilder: NbTreeGridDataSourceBuilder<BEntry>,
    private dialogService: NbDialogService,
    private plansService: PlansService,
    public zone: NgZone,
    public toastr: ToastrService
  ) {}

  ngOnInit(): void {
    // Get User Detail
    const token = localStorage.getItem('token');
    if (token !== null && token !== undefined) {
      const user: any = jwt_decode(token);
      this.customer = user.customerId;
      this.email=user.email;
      this.id=user.id;
      // Getting customer ID from customer's stripe
      this.customerService
        .getStripeId(user.customerId)
        .then((response: any) => {
          this.customerId = response.customerId;
          this.getCliks(this.customerId);
        });
    }

    this.getSubscription();
    this.getInvoice();
    this.currentSubscription();
    this.getAllPlans();
    this.getAllprice();
    this.getAlladdon();
  }

  getSubscription() {
    this.subscriptionService
      .getCustomerSubscription(this.customer)
      .then((response: any) => {
        // console.log('response');
        console.log(response);
        const subscriptionData = [];
        let sno: number = 1;

        for (const row of response.data) {
          let nf = new Intl.NumberFormat();
          subscriptionData.push({
            data: {
              SNo: sno,
              Plan: row.product_name,
              cancel_at_period_end: row.cancel_at_period_end,
              sub_id: row.id,
              Amount: `${row.plan.currency.toUpperCase()} ${
                row.plan.amount / 100
              }`,
              Clicks: nf.format(row.plan.nickname),
              Status: row.status,
              StartDate: moment
                .unix(row.current_period_start)
                .format('DD/MM/YYYY'),
              EndDate: moment.unix(row.current_period_end).format('DD/MM/YYYY'),
            },
          });
          sno++;
        }
        this.subscriptionData = subscriptionData;
        this.subCustomColumns = [' '];
        this.subDefaultColumns = [
          'SNo',
          'Plan',
          'Amount',
          'Clicks',
          'Status',
          'StartDate',
          'EndDate',
        ];
        this.subAllColumns = [
          ...this.subDefaultColumns,
          ...this.subCustomColumns,
        ];
        this.subscriptionSource = this.subscriptionSourceBuilder.create(
          this.subscriptionData
        );
      })
      .catch((error) => {
        this.zone.run(() => {
          this.toastr.error('Subscription not found', 'Error');
        });
        this.loading = false;
      });
  }

  getInvoice() {
    this.subscriptionService
      .getInvoiceList(this.customer)
      .then((response: any) => {
        const Invoicelist = response.data;
        const data = [];
        let sno: number = 1;
        Invoicelist.map((x) => {
          x.lines.data.map((y) => {
            let nf = new Intl.NumberFormat();
            data.push({
              data: {
                SNo: sno,
                Id: x.id,
                'Purchase Date': moment
                  .unix(x.period_start)
                  .format('DD/MM/YYYY H:mm:ss A'),
                Clicks: nf.format(y.plan.nickname),
                Amount: `${y.plan.currency.toUpperCase()} ${
                  y.plan.amount / 100
                }`,
              },
            });
            sno++;
          });
        });

        this.invoiceData = data;
        this.customColumns = [' '];
        this.defaultColumns = ['SNo', 'Purchase Date', 'Clicks', 'Amount'];
        this.allColumns = [...this.defaultColumns, ...this.customColumns];
        this.dataSource = this.dataSourceBuilder.create(this.invoiceData);
      })
      .catch((error) => {
        this.zone.run(() => {
          this.toastr.error('Invoice not found', 'Error');
        });
        this.loading = false;
      });
  }

  getShowOn(index: number) {
    const minWithForMultipleColumns = 400;
    const nextColumnStep = 100;
    return minWithForMultipleColumns + nextColumnStep * index;
  }

  updateSort(sortRequest: NbSortRequest): void {
    this.sortColumn = sortRequest.column;
    this.sortDirection = sortRequest.direction;
  }

  getSortDirection(column: string): NbSortDirection {
    if (this.sortColumn === column) {
      return this.sortDirection;
    }
    return NbSortDirection.NONE;
  }

  changePage(page: string) {
    this.router.navigateByUrl(page);
  }
  onTableDataChange(event) {
    this.page = event;
  }

  onTableSizeChange(event): void {
    this.tableSize = event.target.value;
    this.page = 1;
  }

  open(dialog: TemplateRef<any>) {
    /*this.dialogService.open(dialog, {
      context: 'this is some additional data passed to dialog',
    });*/
    window.open(`https://billing.stripe.com/p/login/test_aEU1703SVgQ21JS8ww?prefilled_email=${this.email}`, "_blank");
    
  }

  currentSubscription() {
    this.subscriptionService
      .getcurrentSubcription(this.customer)
      .then((response: any) => {
        if (response.length > 0) {
          let cancel_at = 0;
          let current_period_end = 0;

          for (const row of response) {
            this.subscriberId = row.id;
            this.planId = row.plan.id;
            this.subscriberName = parseInt(row.plan.nickname);
            this.productName = row.product_name;
            this.subscriptionStatus = row.status;
            this.subscriberStartDate = moment
              .unix(row.trial_start)
              .format('DD/MM/YYYY');
            this.subscriberEndDate = moment
              .unix(row.trial_end)
              .format('DD/MM/YYYY ');
            this.remainingDays = row.remaining_days;
            this.cancel_at_period_end = row.cancel_at_period_end;
            this.activeSubscription = true;

            console.log(row);
            if (!row.cancel_at) {
              current_period_end = row.current_period_end;
            }

            if (row.cancel_at >= cancel_at) {
              cancel_at = row.cancel_at;
            }

            if (this.subscriptionStatus == 'trialing' && !row.cancel_at) {
              this.toastr.error(
                'This subscription is just for trial, you can cancel anytime.',
                ''
              );
            }
          }

          this.subCancel = current_period_end < cancel_at && true;
        }

        // if (row.customer === this.customerId && !row.cancel_at_period_end) {
        //   this.subscriberId = row.id;
        //   this.planId = row.plan.id;
        //   this.subscriberName = parseInt(row.plan.nickname);
        //   this.productName = row.product_name;
        //   this.subscriptionStatus = row.status;
        //   this.subscriberStartDate = moment.unix(row.trial_start).format('DD/MM/YYYY');
        //   this.subscriberEndDate = moment.unix(row.trial_end).format('DD/MM/YYYY ');
        //   this.remainingDays = row.remaining_days;
        //   this.cancel_at_period_end = row.cancel_at_period_end;
        //   this.activeSubscription = true;
        // }
        // if (this.subscriptionStatus == "trialing") {
        //   this.toastr.error('This subscription is just for trial, you can cancel anytime.', '');
        // }
      });
  }

  cancelSubscription() {
    const data = this.dialogService.open(ConfirmDeleteComponent, {
      context: {
        title: 'Are you sure you want to Cancel Subscription?',
      },
    });
    data.onClose.toPromise().then((data) => {
      if (data) {
        this.subscriptionService
          .delete(this.subscriberId)
          .then((response: any) => {
            if (response.cancel_at) {
              this.subCancel = true;
            }
            // this.currentSubscription();
            // this.getSubscription();
            // location.reload();
          });
      }
    });
  }

  getAllPlans() {
    this.plansService
      .getAll()
      .then((response: any) => {
        this.plans = [{}];
        console.log(response)
        response.data.map((x, i) => {
          let nf = new Intl.NumberFormat();
          /*this.plans.push({
            id: x.id,
            product_name: x.product_name,
            currency: x.currency,
            amount: x.amount,
            interval: x.interval,
            nickname: nf.format(x.nickname),
          });*/
          if (x.id === this.planId) {
            this.plans[i].upgradePlan = true;
          } else {
            this.plans[i].upgradePlan = false;
          }
        });
      })
      .catch((error) => {
        console.log(error);
      });

    console.log(this.plans);
  }

  viewInvoice(data) {
    this.router.navigate(['user/invoice'], {
      queryParams: {
        id: data.Id,
      },
    });
  }

  getFreeTrail(data) {
    const token = localStorage.getItem('token');
    if (token) {
      this.router.navigate(['/login'], {
        queryParams: {
          id: data.id,
          amount: data.amount,
          interval: data.interval,
          name: data.product_name,
          currency: data.currency,
        },
      });
    } else {
      this.router.navigate(['/register'], {
        queryParams: {
          id: data.id,
          amount: data.amount,
          interval: data.interval,
          name: data.product_name,
          currency: data.currency,
        },
      });
    }
  }

  reActivateSubscription(id) {
    const data = this.dialogService.open(ConfirmDeleteComponent, {
      context: {
        title: 'Are you sure you want to reactivate?',
      },
    });
    data.onClose.toPromise().then((data) => {
      if (data) {
        this.subscriptionService
          .reactivateSubcription(id)
          .then(() => {
            this.toastr.success('Reactivate successfully', 'Success');
            location.reload();
          })
          .catch((error) => {
            this.zone.run(() => {
              this.toastr.error("Can't be reactivate", 'Error');
            });
          });
      }
    });
  }

  updatePaymentinfo() {
    this.router.navigate(['user/update-payment-information']);
  }

  buyNow(priceid) {
    const addOn = {
      customer: this.customerId,
      price: priceid,
    };
    this.plansService
      .buyAddon(addOn)
      .then((response: any) => {
        if (response) {
          window.location.href = response.url;
        }
      })
      .catch((err) => {
        if (err.status === 400) {
          this.zone.run(() => {
            this.toastr.error('Something Went Wrong', 'Error!');
          });
        }
      });
  }
  getAllprice() {
    this.plansService
      .getAllprice()
      .then((response: any) => {
        this.price = response.data;
        this.addon = [];
        this.price.map((x, i) => {
          let id = x.id;
          id = id.split('_');
          if (id[0] === 'price') {
            let nf = new Intl.NumberFormat();
            this.addon.push({
              amount: x.unit_amount,
              currency: x.currency,
              id: x.id,
              click: nf.format(x.nickname),
              type: x.type,
            });
          }
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getAlladdon() {
    this.subscriptionService
      .getAddonList()
      .then((response: any) => {
        const Addonlist = response.data;
        const data = [];
        let sno: number = 1;
        Addonlist.map((x) => {
          if (this.customerId === x.customer) {
            data.push({
              data: {
                SNo: sno,
                'Purchase Amount': `${
                  x.amount_subtotal / 100
                }  ${x.currency.toUpperCase()}`,
                Status: x.payment_status,
                id: x.payment_intent,
                cust_id: x.id,
              },
            });
            sno++;
          }
        });

        this.data = data;
        this.AddonCustomColumns = [' '];
        this.AddonDefaultColumns = ['SNo', 'Purchase Amount', 'Status'];
        this.AddonAllColumns = [
          ...this.AddonDefaultColumns,
          ...this.AddonCustomColumns,
        ];
        this.AddonlistSource = this.addonsourceBuilder.create(this.data);
      })
      .catch((error) => {
        this.zone.run(() => {
          this.toastr.error('Addon not found', 'Error');
        });
        this.loading = false;
      });
  }

  viewAddon(data) {
    this.router.navigate(['user/add-on'], {
      queryParams: {
        id: data.id,
        cust_id: data.cust_id,
      },
    });
  }

  getCliks(id) {
    this.plansService.getAllClick(id).then((response) => {
      this.totalClick = response;
    });
  }
}
