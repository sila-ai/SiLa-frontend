import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { FormServerErrorHandler } from 'src/app/helpers/form-server-error.handler';
import { NbIconConfig, NbToastrService,  } from '@nebular/theme';
import { NgZone } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.scss']
})
export class ForgotpasswordComponent implements OnInit {

  loading = false;

  form: FormGroup = this.formBuilder.group({
    email: [''],
  })

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    public formError: FormServerErrorHandler,
    private toastrService: NbToastrService,
    public toastr: ToastrService,
    public zone:NgZone
  ) {}

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  ngOnInit(): void {
  }

  onSubmit() {
    if (this.form.valid) {
      this.loading = true;
      this.authenticationService.forgotPassword(this.f.email.value)
        .then((response: any) => {
          if (response.status === true) {
            this.toastr.show('Email sent successfully', 'Success');
            this.loading = false;
            this.form.reset();
          } else {
            this.toastr.error(response['message'],'Warning');
            this.formError.setFormErrors(this.form, response['message']);
          }
        }).catch((err) => {
          if (err.status === 400) {
            this.zone.run(() => { this.toastr.error('Please Enter Valid Email-id', 'Error!'); })
            this.formError.setFormErrors(this.form, err);
          }else if (err.error.statusCode === 404) {
            this.toastr.error(err.error.message,'Warning');
          }
          this.loading = false;
        });
    }
  }

  login() {
    this.router.navigate(['./login']);
  }
}
