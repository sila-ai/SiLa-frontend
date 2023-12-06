import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminRoutingModule } from './admin-routing.module';
import { ToastrModule } from 'ngx-toastr';

import {
  NbActionsModule,
  NbButtonModule,
  NbCardModule,
  NbIconLibraries,
  NbIconModule,
  NbLayoutModule,
  NbMenuModule,
  NbSelectModule,
  NbSidebarModule,
  NbTooltipModule,
} from '@nebular/theme';

import { NgxChartsModule } from '@swimlane/ngx-charts';

import { AdminUserModule } from './admin-user/admin-user.module';
import { AdminComponent } from './admin.component';
import { BillingModule } from './billing/billing.module';
import { ChangepasswordComponent } from './changepassword/changepassword.component';
import { ConfirmDeleteComponent } from './components/confirm-delete/confirm-delete.component';
import { ContactModule } from './contact/contact.module';
import { ConfigDialogComponent } from './core/modelwindow/config-dialog/config-dialog.component';
import { CustomerUserModule } from './customer-user/customer-user.module';
import { FraudModule } from './fraud/fraud.module';
import { TableModule } from './fraud/table/table.module';
import { InvoiceComponent } from './invoice/invoice.component';
import { ProfileModule } from './profile/profile.module';
import { StripeModule } from './stripe/stripe.module';
import { TrafficModule } from './traffic/traffic.module';
import { GoogleModule } from './google/google.module';
import { TokenModule } from './google/token/token.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { DashboardV2Component } from './dashboard-v2/dashboard-v2.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSliderModule } from '@angular/material/slider';

import { NgxEchartsModule } from 'ngx-echarts';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';

@NgModule({
  declarations: [
    AdminComponent,
    ConfirmDeleteComponent,
    InvoiceComponent,
    ChangepasswordComponent,
    ConfigDialogComponent,
    DashboardV2Component,
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgxPaginationModule,
    AdminRoutingModule,
    ReactiveFormsModule,
    BillingModule,
    FraudModule,
    TableModule,
    ProfileModule,
    GoogleModule,
    TokenModule,
    TrafficModule,
    NbSelectModule,
    NbLayoutModule,
    NbIconModule,
    NbActionsModule,
    NbTooltipModule,
    NbButtonModule,
    NbSidebarModule.forRoot(),
    NbCardModule,
    NbMenuModule.forRoot(),
    RouterModule,
    MatCardModule,
    MatIconModule,
    StripeModule,
    AdminUserModule,
    CustomerUserModule,
    ContactModule,
    NgxChartsModule,

    MatDividerModule,
    NgxEchartsModule,
    MatSliderModule,
    MatListModule,
    MatMenuModule,
    MatBadgeModule,
    ToastrModule.forRoot({
      timeOut: 10000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
  ],
})
export class AdminModule {
  constructor(iconsLibrary: NbIconLibraries) {
    iconsLibrary.registerSvgPack('Menuicon', {
      dashboard:
        '<svg xmlns="http://www.w3.org/2000/svg" width="27.006" height="22.048" viewBox="0 0 27.006 22.048"><path d="M27.006,13.5A13.375,13.375,0,0,1,24.28,21.63,1.055,1.055,0,0,1,22.6,20.357,11.391,11.391,0,1,0,2.11,13.5a11.282,11.282,0,0,0,2.3,6.86A1.055,1.055,0,0,1,2.726,21.63,13.5,13.5,0,0,1,13.5,0a13.493,13.493,0,0,1,13.5,13.5ZM20.188,7.144a1.055,1.055,0,0,1,0,1.492l-3.439,3.439a3.692,3.692,0,1,1-1.492-1.492L18.7,7.144a1.055,1.055,0,0,1,1.492,0Zm-5.1,6.684a1.58,1.58,0,1,0-1.58,1.58A1.582,1.582,0,0,0,15.083,13.828Zm0,0" transform="translate(0 0)"/></svg>',
      Billing:
        '<svg xmlns="http://www.w3.org/2000/svg" width="30" height="36" viewBox="0 0 30 36"><g id="Group_1250" data-name="Group 1250" transform="translate(-1390 -2127)"><g id="Rectangle_450" data-name="Rectangle 450" transform="translate(1390 2127)" fill="none" stroke="#000" stroke-width="2"><rect width="30" height="36" rx="7" stroke="none"/><rect x="1" y="1" width="28" height="34" rx="6" fill="none"/></g><line id="Line_84" data-name="Line 84" x2="18.967" transform="translate(1396.164 2137.906)" fill="none" stroke="#000" stroke-width="2"/><line id="Line_85" data-name="Line 85" x2="18.967" transform="translate(1396.164 2145.493)" fill="none" stroke="#000" stroke-width="2"/><line id="Line_86" data-name="Line 86" x2="18.967" transform="translate(1396.164 2153.08)" fill="none" stroke="#000" stroke-width="2"/></g></svg>',
      'Tracfic-control':
        '<svg xmlns="http://www.w3.org/2000/svg" width="20.732" height="20.732" viewBox="0 0 20.732 20.732"><path d="M41.873,26.86v1.517L35.439,34.81v8.85a1.072,1.072,0,0,1-2.145,0V34.81L26.86,28.376V26.86h1.517l5.99,5.99,5.99-5.99ZM26.145,30.792V26.145h4.647a1.072,1.072,0,1,0,0-2.145H25.072A1.072,1.072,0,0,0,24,25.072v5.719a1.072,1.072,0,0,0,2.145,0Zm18.588,0V25.072A1.072,1.072,0,0,0,43.66,24H37.941a1.072,1.072,0,1,0,0,2.145h4.647v4.647a1.072,1.072,0,0,0,2.145,0Z" transform="translate(-24 -24)"/></svg> ',
      'fraud-report':
        '<svg xmlns="http://www.w3.org/2000/svg" width="23.663" height="23.666" viewBox="0 0 23.663 23.666"><g transform="translate(1192.002 -1619.124)"><path class="a" d="M30.341,42.046h.682V40.682h.341V40H30v.682h.341Z" transform="translate(-1210.853 1594.3)"/><path class="a" d="M46,39h.682v.682H46Z" transform="translate(-1220.621 1594.762)"/><path class="a" d="M46,35h.682v.682H46Z" transform="translate(-1220.621 1597.191)"/><path class="a" d="M16,35h.682v.682H16Z" transform="translate(-1202.403 1597.191)"/><path class="a" d="M16,43h.682v.682H16Z" transform="translate(-1202.403 1592.333)"/><path class="a" d="M19.023,22.681h2.046v1.28h-.682a.391.391,0,0,0-.341.427v5.121a.391.391,0,0,0,.341.427h4.774a.391.391,0,0,0,.341-.427V24.388a.391.391,0,0,0-.341-.427h-.682v-1.28h2.046a1.175,1.175,0,0,0,1.023-1.28V16.28A1.175,1.175,0,0,0,26.525,15h-7.5A1.175,1.175,0,0,0,18,16.28V21.4A1.175,1.175,0,0,0,19.023,22.681Zm5.8,6.4H20.728V24.815H24.82ZM23.8,23.961H21.751v-1.28H23.8Zm2.728-2.134H21.814a1.067,1.067,0,0,1,.96-.853v-.853A1.856,1.856,0,0,0,21.1,21.828h-2.08a.392.392,0,0,1-.341-.427V19.267h8.184V21.4A.392.392,0,0,1,26.525,21.828Zm-7.843-3.414V17.56h8.184v.853Zm.341-2.56h7.5a.392.392,0,0,1,.341.427v.427H18.682V16.28A.392.392,0,0,1,19.023,15.853Z" transform="translate(-1202.945 1608.664)"/><path class="a" d="M42,39h.682v.682H42Z" transform="translate(-1218.192 1594.762)"/><path class="a" d="M20,39h.682v.682H20Z" transform="translate(-1204.832 1594.762)"/><path class="a" d="M16,39h.682v.682H16Z" transform="translate(-1202.403 1594.762)"/><path class="a" d="M2.356,6.693a.391.391,0,0,0-.347.47l1.318,6.26A16.421,16.421,0,0,0,13.592,25.435a.393.393,0,0,0,.278,0A16.421,16.421,0,0,0,24.134,13.423l1.318-6.26a.391.391,0,0,0-.347-.47l-.565-.052A15.786,15.786,0,0,1,17.772,4.4L13.935,2.057a.392.392,0,0,0-.408,0L9.69,4.4a15.791,15.791,0,0,1-6.768,2.24ZM10.1,5.07,13.73,2.849,17.364,5.07a16.578,16.578,0,0,0,7.1,2.351l.128.011-1.227,5.83A15.641,15.641,0,0,1,13.73,24.65,15.641,15.641,0,0,1,4.092,13.262L2.864,7.432l.127-.011A16.592,16.592,0,0,0,10.1,5.07Z" transform="translate(-1193.901 1617.231)"/><path class="a" d="M46,43h.682v.682H46Z" transform="translate(-1220.621 1592.333)"/></g></svg>',
      'conversion-tracking':
        '<svg xmlns="http://www.w3.org/2000/svg" width="27.007" height="27.006" viewBox="0 0 27.007 27.006"><g transform="translate(1194.083 -1708.36)"><path d="M185.116,362a4.116,4.116,0,1,0,4.116,4.116A4.121,4.121,0,0,0,185.116,362Zm0,6.585a2.47,2.47,0,1,1,2.47-2.469A2.472,2.472,0,0,1,185.116,368.585Z" transform="translate(-1365.696 1365.135)"/><path d="M0,0H1.646V1.646H0Z" transform="translate(-1181.748 1731.25) rotate(-45)"/><path d="M61,60h4.939v1.646H61Z" transform="translate(-1251.736 1651.653)"/><path d="M361,60h4.939v1.646H361Z" transform="translate(-1536.364 1651.653)"/><path d="M27.007,0H15.877V6.585H11.13V0H0V8.232H3.218v.24A4.1,4.1,0,0,0,5.7,12.293l5.425,2.258V18.11h4.747V14.551L21.3,12.293a4.1,4.1,0,0,0,2.487-3.821v-.24h3.218ZM1.582,1.646H9.547V6.585H7.965V7.723L5.778,6.585h-4.2ZM22.207,8.472a2.459,2.459,0,0,1-1.492,2.293l-6.42,2.672v3.027H12.712V13.437l-6.42-2.672A2.459,2.459,0,0,1,4.8,8.472v-.24h.6l4.143,2.155V8.232h7.912v2.155L21.6,8.232h.6Zm3.218-1.887h-4.2L19.042,7.723V6.585H17.459V1.646h7.965Z" transform="translate(-1194.083 1708.36)"/></g></svg>',
      User: '<svg xmlns="http://www.w3.org/2000/svg" width="22.223" height="19.851" viewBox="0 0 22.223 19.851"><path d="M18.017,35.166a5.545,5.545,0,0,0-6.9-8.657,5.548,5.548,0,0,0-6.909,8.657A7.882,7.882,0,0,0,0,42.17v2.381a.794.794,0,0,0,.794.794H21.429a.794.794,0,0,0,.794-.794V42.17A7.882,7.882,0,0,0,18.017,35.166Zm-3.73-8.075a3.963,3.963,0,0,1,1.631,7.576c-.061.028-.122.053-.184.079a3.89,3.89,0,0,1-.6.188c-.04.009-.079.013-.12.021a3.969,3.969,0,0,1-.7.071c-.106,0-.212-.008-.317-.017A.6.6,0,0,1,13.875,35a4.009,4.009,0,0,1-1.3-.383c-.015-.007-.033-.006-.048-.013-.079-.038-.159-.071-.229-.114.006-.008.01-.017.017-.025a5.567,5.567,0,0,0,.85-1.548l.025-.067a5.6,5.6,0,0,0,.21-.817c.007-.04.013-.079.019-.123a5.066,5.066,0,0,0,0-1.7c-.006-.041-.012-.079-.019-.123a5.6,5.6,0,0,0-.21-.817l-.025-.067a5.569,5.569,0,0,0-.85-1.548c-.006-.008-.01-.017-.017-.025A3.943,3.943,0,0,1,14.286,27.091ZM3.969,31.059a3.958,3.958,0,0,1,6.7-2.867c.046.044.091.089.136.135a4.081,4.081,0,0,1,.376.456c.035.049.067.1.1.152a3.9,3.9,0,0,1,.291.536c.02.045.035.091.052.136a3.88,3.88,0,0,1,.2.635c.006.024.007.048.012.072a3.736,3.736,0,0,1,0,1.494c0,.025-.006.048-.012.072a3.87,3.87,0,0,1-.2.635c-.017.045-.033.091-.052.136a3.918,3.918,0,0,1-.291.535c-.033.051-.064.1-.1.152a4.072,4.072,0,0,1-.376.456c-.044.046-.09.09-.136.135a3.961,3.961,0,0,1-1.1.74c-.064.029-.129.056-.2.079a3.992,3.992,0,0,1-.589.183c-.05.011-.1.017-.152.026a3.938,3.938,0,0,1-.653.066H7.894a3.933,3.933,0,0,1-.653-.066c-.051-.009-.1-.015-.152-.026A3.99,3.99,0,0,1,6.5,34.75l-.2-.079A3.968,3.968,0,0,1,3.969,31.059Zm10.317,12.7H1.588V42.17a6.309,6.309,0,0,1,4.221-5.981,5.538,5.538,0,0,0,4.257,0,6.377,6.377,0,0,1,.773.342c.165.085.317.182.476.279.1.064.208.127.307.2.153.109.3.227.44.348.091.079.182.159.267.238.131.124.254.255.372.389.085.1.167.2.246.3.1.133.2.27.3.41.079.119.15.243.22.367s.152.273.219.415.125.3.183.449c.05.132.1.263.144.4.056.184.094.375.133.565.024.113.055.223.072.337a6.564,6.564,0,0,1,.072.949v1.587Zm6.349,0H15.874V42.17c0-.248-.014-.494-.037-.738-.006-.071-.017-.142-.025-.213-.021-.175-.046-.349-.079-.521q-.021-.11-.045-.221-.057-.265-.133-.525c-.017-.057-.032-.115-.049-.171a7.864,7.864,0,0,0-.956-2.006l-.031-.045q-.2-.3-.437-.588l-.006-.007a7.2,7.2,0,0,0-.512-.569H13.6a5.617,5.617,0,0,0,.675.048h.044a5.612,5.612,0,0,0,.625-.04c.065-.008.129-.02.194-.03q.253-.039.5-.1c.047-.012.094-.023.142-.037a5.4,5.4,0,0,0,.635-.216,6.31,6.31,0,0,1,4.224,5.983v1.587Z" transform="translate(-0.001 -25.494)"/></svg>',
      Setup:
        '<svg xmlns="http://www.w3.org/2000/svg" width="26.188" height="26.188" viewBox="0 0 26.188 26.188"><path d="M24.848,10.346l-1.838-.312a10.379,10.379,0,0,0-.739-1.783l1.083-1.515a1.613,1.613,0,0,0-.175-2.084l-1.63-1.63a1.606,1.606,0,0,0-1.143-.476,1.59,1.59,0,0,0-.935.3L17.949,3.929a10.271,10.271,0,0,0-1.849-.76l-.306-1.816A1.616,1.616,0,0,0,14.2,0h-2.3a1.616,1.616,0,0,0-1.6,1.351l-.317,1.86A10.123,10.123,0,0,0,8.2,3.962L6.7,2.879a1.616,1.616,0,0,0-2.084.175L2.976,4.684A1.619,1.619,0,0,0,2.8,6.768L3.9,8.305a10.138,10.138,0,0,0-.728,1.789L1.351,10.4A1.616,1.616,0,0,0,0,12v2.3a1.616,1.616,0,0,0,1.351,1.6l1.86.317a10.123,10.123,0,0,0,.749,1.778l-1.078,1.5a1.613,1.613,0,0,0,.175,2.084l1.63,1.63a1.606,1.606,0,0,0,1.143.476,1.59,1.59,0,0,0,.935-.3L8.3,22.288A10.349,10.349,0,0,0,10.033,23l.306,1.838a1.616,1.616,0,0,0,1.6,1.351h2.309a1.616,1.616,0,0,0,1.6-1.351L16.155,23a10.379,10.379,0,0,0,1.783-.739l1.515,1.083a1.606,1.606,0,0,0,.941.3h0a1.606,1.606,0,0,0,1.143-.476l1.63-1.63a1.619,1.619,0,0,0,.175-2.084L22.26,17.934A10.3,10.3,0,0,0,23,16.15l1.838-.306a1.616,1.616,0,0,0,1.351-1.6v-2.3A1.6,1.6,0,0,0,24.848,10.346Zm-.126,3.9a.142.142,0,0,1-.12.142l-2.3.383a.734.734,0,0,0-.591.542,8.757,8.757,0,0,1-.952,2.292.74.74,0,0,0,.033.8l1.351,1.9a.149.149,0,0,1-.016.186L20.5,22.13a.139.139,0,0,1-.1.044.134.134,0,0,1-.082-.027l-1.9-1.351a.739.739,0,0,0-.8-.033,8.758,8.758,0,0,1-2.292.952.726.726,0,0,0-.542.591l-.388,2.3a.142.142,0,0,1-.142.12h-2.3a.142.142,0,0,1-.142-.12l-.383-2.3a.734.734,0,0,0-.542-.591,9.094,9.094,0,0,1-2.243-.919.757.757,0,0,0-.372-.1.72.72,0,0,0-.427.137L5.919,22.2a.163.163,0,0,1-.082.027.147.147,0,0,1-.1-.044L4.1,20.549a.148.148,0,0,1-.016-.186l1.346-1.887a.749.749,0,0,0,.033-.81A8.675,8.675,0,0,1,4.5,15.379a.749.749,0,0,0-.591-.542L1.6,14.443a.142.142,0,0,1-.12-.142V12a.142.142,0,0,1,.12-.142l2.281-.383a.74.74,0,0,0,.6-.547,8.749,8.749,0,0,1,.935-2.3.73.73,0,0,0-.038-.8L4.01,5.915a.149.149,0,0,1,.016-.186L5.657,4.1a.139.139,0,0,1,.1-.044.134.134,0,0,1,.082.027L7.73,5.428a.749.749,0,0,0,.81.033A8.675,8.675,0,0,1,10.826,4.5a.749.749,0,0,0,.542-.591l.394-2.314a.142.142,0,0,1,.142-.12h2.3a.142.142,0,0,1,.142.12l.383,2.281a.74.74,0,0,0,.547.6,8.88,8.88,0,0,1,2.347.963.74.74,0,0,0,.8-.033l1.887-1.357a.163.163,0,0,1,.082-.027.147.147,0,0,1,.1.044l1.63,1.63a.148.148,0,0,1,.016.186L20.8,7.775a.739.739,0,0,0-.033.8,8.758,8.758,0,0,1,.952,2.292.726.726,0,0,0,.591.542l2.3.388a.142.142,0,0,1,.12.142v2.3Z" transform="translate(0 -0.001)"/><path d="M141.761,136a5.661,5.661,0,1,0,5.661,5.661A5.665,5.665,0,0,0,141.761,136Zm0,9.842a4.181,4.181,0,1,1,4.181-4.181A4.184,4.184,0,0,1,141.761,145.843Z" transform="translate(-128.664 -128.571)"/></svg>',
      logout:
        '<svg xmlns="http://www.w3.org/2000/svg" width="21.486" height="23.18" viewBox="0 0 21.486 23.18"><path d="M28.3,21.852H21.826a3.09,3.09,0,0,1-3.186-2.976V4.3a3.09,3.09,0,0,1,3.186-2.976H28.4a.686.686,0,0,0,.711-.664A.686.686,0,0,0,28.4,0H21.826a4.468,4.468,0,0,0-4.607,4.3V18.876a4.469,4.469,0,0,0,4.607,4.3H28.3a.666.666,0,1,0,0-1.328Z" transform="translate(-17.219)"/><path d="M137.868,141.052l-4.518-4.518a.711.711,0,0,0-1.006,1.006l3.307,3.307H121.23a.711.711,0,0,0,0,1.422h14.422l-3.307,3.307a.713.713,0,0,0,.5,1.216.694.694,0,0,0,.5-.211l4.518-4.518A.71.71,0,0,0,137.868,141.052Z" transform="translate(-116.591 -129.963)"/></svg>',
    });
  }
}
