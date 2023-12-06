import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import {
  NbAlertModule,
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbIconModule,
  NbInputModule,
  NbLayoutModule, NbToastrModule, NbTooltipModule
} from '@nebular/theme';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FormServerErrorHandler } from '../helpers/form-server-error.handler';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { CallbackComponent } from './callback/callback.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { AuthRoutingModule } from './auth-routing.module';

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    ForgotpasswordComponent,
    CallbackComponent,
    ResetpasswordComponent,
  ],
  imports: [
    CommonModule,
    NbLayoutModule,
    NbIconModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    NbCardModule,
    NbInputModule,
    NbToastrModule.forRoot({ destroyByClick: true }),
    NbCheckboxModule,
    RouterModule,
    NbButtonModule,
    NbTooltipModule,
  ],
  providers: [FormServerErrorHandler],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})

export class AuthModule { }
