import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import jwt_decode from 'jwt-decode';
import { NbToastrService, NbIconConfig } from '@nebular/theme';
import { FormServerErrorHandler } from 'src/app/helpers/form-server-error.handler';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { NgZone } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.scss'],
  providers: [DatePipe]
})
export class ChangepasswordComponent implements OnInit {

  loading = false;

  passwordForm: FormGroup = this.formBuilder.group({
    password: [''],
    confirmPassword: ['']
  });

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    public datePipe: DatePipe,
    private authenticationService: AuthenticationService,
    public toastrService: NbToastrService,
    public formError: FormServerErrorHandler,
    public zone:NgZone,
    public toastr: ToastrService
  ) {
  }

  get f() { return this.passwordForm.controls; }

  ngOnInit(): void {
  }

  onSubmit() {
    if (this.passwordForm.valid) {
      this.loading = true;
      const token = localStorage.getItem('token');
      const user: any = jwt_decode(token);

      const formData: any = {
        password: this.passwordForm.value.password,
        confirmPassword: this.passwordForm.value.confirmPassword
      };

      const id = user.id;
      this.authenticationService.updatePassword(id, formData)
        .then((res) => {
          if (res['error']) {
            this.zone.run(() => { this.toastr.error(res['error'], 'Error');  })
            this.formError.setFormErrors(this.passwordForm, res['error']);
          } else {
            this.toastr.success("Password updated successfully", 'Success');
            this.loading = false;
            this.passwordForm.reset();
          }
        })
        .catch((error) => {
          if (error.status === 400) {
            this.zone.run(() => { this.toastr.error('Please fill all required details', 'Error');  })
            this.formError.setFormErrors(this.passwordForm, error);
          }
          this.loading = false;
        });
    }
  }
}
