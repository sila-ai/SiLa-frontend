import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { GoogleService } from '../services/google.service';
import { NotificationService } from '../services/notification.service';
import { TrafficService } from '../services/traffic.service';
import { Observable, Subject } from 'rxjs';
import { Socket } from 'ngx-socket-io';
import {
  NbDialogService,
  NbIconConfig,
  NbMenuItem,
  NbSidebarService,
  NbToastrService,
} from '@nebular/theme';

import jwt_decode from 'jwt-decode';
import { ConfirmDeleteComponent } from './components/confirm-delete/confirm-delete.component';
import { NgZone } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { array } from '@amcharts/amcharts4/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  campaigns = [];
  campaignsList = [];
  campaignLoad = false;
  slCmp = 'global';
  isShown = true;
  user: User;

  showNotification = false;
  userCount = 80;
  totalCount = 100;

  notificationList: any = [];

  totalClicks = 0;
  boughtClicks = 0;
  clickLog: any = [];
  constructor(
    private sidebarService: NbSidebarService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private googleService: GoogleService,
    private notificationService: NotificationService,
    private trafficService: TrafficService,
    private socket: Socket,
    public dialogService: NbDialogService,
    public toastrService: NbToastrService,
    public toastr: ToastrService,
    public zone: NgZone
  ) {
    const token = localStorage.getItem('token');
    try {
      const decoded: User = jwt_decode(token);
      this.user = decoded;
    } catch (err) {
      this.router.navigateByUrl('/login');
    }
  }
  private sendCp$ = new Subject();

  items: NbMenuItem[];

  change($event) {
    this.sendCp$.next();
  }

  get changeCp() {
    return this.sendCp$;
  }

  setCampaign(cmp) {
    this.campaigns = cmp.map((item) => item.campaign.id);
  }

  async ngOnInit() {
    if (this.user.role === 'USER') {
      this.createCustomerMenu();
    } else {
      this.createAdminMenu();
    }
    this.notificationService.getNotification().subscribe((item) => {
      this.notificationList = item;
    });

    this.trafficService.getLeftClicks().subscribe((clicks: any) => {
      this.totalClicks = clicks.clicks;
      this.boughtClicks = clicks.bought;
      this.socket.emit('adduser', { userId: clicks.userId });
    });

    this.socket.on('upcomingLog', (data: any) => {
      this.totalClicks = this.totalClicks + 1;
      this.clickLog = [data, ...this.clickLog];
      console.log('this.clickLog');
      console.log(this.clickLog);
    });
  }

  openNotification(state: boolean) {
    this.showNotification = !this.showNotification;
  }

  createCustomerMenu() {
    this.items = [
      {
        title: 'Setup',
        link: `/${this.user.role.toLowerCase()}/adwords`,
        // icon: 'settings'
        icon: { icon: 'Setup', pack: 'Menuicon' },
      },
      {
        title: 'Billing',
        link: `/${this.user.role.toLowerCase()}/billing`,
        // icon: 'message-circle'
        icon: { icon: 'Billing', pack: 'Menuicon' },
      },
      {
        title: 'FEATURES',
        group: true,
      },
      // {
      //   title: 'Dashboard',
      //   link: `/${this.user.role.toLowerCase()}/dashboard`,
      //   // icon: 'home'
      //   icon: { icon: 'dashboard', pack: 'Menuicon' },
      // },
      {
        title: 'Dashboard',
        link: `/${this.user.role.toLowerCase()}/dashboard`,
        // icon: 'home'
        icon: { icon: 'dashboard', pack: 'Menuicon' },
      },
      {
        title: 'Traffic control',
        link: `/${this.user.role.toLowerCase()}/traffic`,
        // icon: 'keypad'
        icon: { icon: 'Tracfic-control', pack: 'Menuicon' },
      },
      // {
      //   title: 'Conversion Tracking',
      //   link: `/${this.user.role.toLowerCase()}/connect`,
      //   //icon: 'shuffle-2'
      //   icon: { icon: 'conversion-tracking', pack: 'Menuicon' },
      // },
      // {
      //   title: 'Fraud Clicks',
      //   link: `/${this.user.role.toLowerCase()}/fraud`,
      //   //icon: 'text'
      //   icon: { icon: 'fraud-report', pack: 'Menuicon' },
      // },
      {
        title: 'Fraud Report',
        link: `/${this.user.role.toLowerCase()}/report`,
        // icon: 'text'
        icon: { icon: 'fraud-report', pack: 'Menuicon' },
      },
      // {
      //   title: 'Users',
      //   link: `/${this.user.role.toLowerCase()}/customer-user-list`,
      //   // icon: 'person',
      //   icon: { icon: 'User', pack: 'Menuicon' },
      // },

      // {
      //   title: 'Invoice',
      //   link: `/${this.user.role.toLowerCase()}/invoice`,
      //   icon: 'file-text'
      // },

      // {
      //   title: 'Create URL',
      //   link: `/${this.user.role.toLowerCase()}/setup`,
      //   // icon: 'settings'
      //   icon: { icon: 'Setup', pack: 'Menuicon' },
      // },
      // {
      //   title: 'URL List',
      //   link: `/${this.user.role.toLowerCase()}/setup/list`,
      //   // icon: 'settings'
      //   icon: { icon: 'Setup', pack: 'Menuicon' },
      // },
      // {
      //   title: 'Update Account',
      //   link: `/${this.user.role.toLowerCase()}/adaccount`,
      //   // icon: 'settings'
      //   icon: { icon: 'Setup', pack: 'Menuicon' },
      // },
      // {
      //   title: 'Tracking Pixel',
      //   link: `/${this.user.role.toLowerCase()}/tracking`,
      //   // icon: 'settings'
      //   icon: { icon: 'Setup', pack: 'Menuicon' },
      // },

      // {
      //   title: 'Change Password',
      //   link: `/${this.user.role.toLowerCase()}/changepassword/${this.user.id}`,
      //   icon: 'person',
      // },
      {
        title: 'Profile',
        link: `/${this.user.role.toLowerCase()}/profile/id`,
        // icon: 'settings'
        icon: { icon: 'User', pack: 'Menuicon' },
      },
      {
        title: 'Logout',
        link: '/login',
        // icon: 'settings'
        icon: { icon: 'logout', pack: 'Menuicon' },
      },
    ];
  }

  // tslint:disable-next-line:typedef
  createAdminMenu() {
    this.items = [
      {
        title: 'Chat',
        link: `/${this.user.role.toLowerCase()}/chat`,
        icon: 'message-circle',
      },
      {
        title: 'Lead Management ',
        link: `/${this.user.role.toLowerCase()}/management`,
        icon: 'layout',
      },
      {
        title: 'Users',
        link: `/${this.user.role.toLowerCase()}/admin-user-list`,
        icon: 'person',
      },
      {
        title: 'Change Password',
        link: `/${this.user.role.toLowerCase()}/changepassword/${this.user.id}`,
        icon: 'person',
      },
      {
        title: 'STRIPE',
        group: true,
      },
      {
        title: 'Products',
        link: `/${this.user.role.toLowerCase()}/product-list`,
        icon: 'layers',
      },
      /*{
        title: 'Prices',
        link: `/${this.user.role.toLowerCase()}/price-list`,
        icon: 'globe-2',
      },*/
      {
        title: 'Plans',
        link: `/${this.user.role.toLowerCase()}/plan-list`,
        icon: 'lock',
      },
      {
        title: 'Subscriptions',
        link: `/${this.user.role.toLowerCase()}/subscription-list`,
        icon: 'checkmark-circle',
      },
      // {
      //   title: 'Subscription Schedule',
      //   link: `/${this.user.role.toLowerCase()}/schedule-list`,
      //   icon: 'calendar',
      // },
      {
        title: 'Profile',
        link: `/${this.user.role.toLowerCase()}/profile/id`,
        // icon: 'settings'
        icon: { icon: 'User', pack: 'Menuicon' },
      },
      {
        title: 'Logout',
        link: '/login',
        // icon: 'settings'
        icon: { icon: 'logout', pack: 'Menuicon' },
      },
    ];
  }

  logout() {
    const data = this.dialogService.open(ConfirmDeleteComponent, {
      context: {
        title: 'Are you sure you want to logout?',
      },
    });
    data.onClose.toPromise().then((data) => {
      if (data) {
        this.toastr.success('Logged out successfully', 'Success');
        const accessToken = localStorage.getItem('accesstoken');
        const token = localStorage.getItem('token');
        if (accessToken) {
          this.authenticationService
            .auht2Logout(accessToken)
            .then((response) => {
              localStorage.removeItem('token');
              localStorage.removeItem('accesstoken');
              this.router.navigate(['/login']);
            });
        } else {
          localStorage.removeItem('token');

          this.router.navigate(['/login']);
        }
      }
    });
  }

  toggle() {
    this.isShown = true;
    this.sidebarService.toggle(true, 'left');
  }

  hideNavigationMenu(): void {
    this.isShown = false;
  }
}
