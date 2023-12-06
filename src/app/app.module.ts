import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpClientModule,
} from '@angular/common/http';
import { NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { NgxEchartsModule } from 'ngx-echarts';
import { NgxMatTagInputModule } from 'ngx-mat-tag-input';
import { NgxPaginationModule } from 'ngx-pagination';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { ToastrModule } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

import { JWT_OPTIONS, JwtModule } from '@auth0/angular-jwt';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import {
  NbCardModule,
  NbLayoutModule,
  NbSidebarModule,
  NbTabsetModule,
  NbTagModule,
  NbThemeModule,
  NbToastrModule,
  NbUserModule,
} from '@nebular/theme';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AdminUserModule } from './admin/admin-user/admin-user.module';
import { AdminModule } from './admin/admin.module';
import { CustomerModule } from './admin/stripe/customer/customer.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { ErrorInterceptor } from './helpers/error.interceptor';
import { JwtInterceptor } from './helpers/jwt.interceptor';
import { PaymentModule } from './payment/payment.module';
import { AuthenticationService } from './services/authentication.service';
import { ChatService } from './services/chat.service';
import { PaymentService } from './services/payment.service';
import { ServiceModule } from './services/service.module';
import { SharedModule } from './shared/shared.module';
import { MAT_DATE_LOCALE } from '@angular/material/core';
const config: SocketIoConfig = { url: `${environment.apiUrl}`, options: {} };

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

// called on every request to retrieve the token
export function jwtOptionsFactory(authService: AuthenticationService) {
  return {
    tokenGetter: () => authService.getToken(),
    whitelistedDomains: ['54.247.18.64', '34.247.167.239'],
  };
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    PaymentModule,
    SharedModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AuthModule,

    AdminModule,
    SocketIoModule.forRoot(config),
    NbThemeModule.forRoot({ name: 'default' }),
    NbEvaIconsModule,
    NgbModule,
    NbCardModule,
    NbSidebarModule,
    NbLayoutModule,
    NgxPaginationModule,
    RouterModule,
    NbUserModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
        deps: [AuthenticationService],
      },
    }),
    NbTabsetModule,
    NbTagModule,
    NgxMatTagInputModule,
    ServiceModule,
    AdminUserModule,
    CustomerModule,
    NbToastrModule.forRoot({ destroyByClick: true }),
    ToastrModule.forRoot({
      timeOut: 10000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    ChatService,
    PaymentService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
