import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { FormServerErrorHandler } from 'src/app/helpers/form-server-error.handler';
import { NbIconConfig, NbToastrService, } from '@nebular/theme';
import jwt_decode from "jwt-decode";
import { NgZone } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.scss']
})
export class ResetpasswordComponent implements OnInit {

  loading = false;

  passwordForm: FormGroup = this.formBuilder.group({
    password: [''],
    confirmPassword: ['']
  });

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    public formError: FormServerErrorHandler,
    private toastrService: NbToastrService,
    public toastr: ToastrService,
    public zone:NgZone
  ) { }

  get f() { return this.passwordForm.controls; }

  ngOnInit(): void {
  }

  onSubmit() {
    if (this.passwordForm.valid) {
      this.loading = true;
      const token = this.route.snapshot.params.id;
      const user: any = jwt_decode(token);

      const formData: any = {
        password: this.passwordForm.value.password,
        confirmPassword: this.passwordForm.value.confirmPassword
      };

      const id = user.id;
      this.authenticationService.updatePassword(id, formData)
        .then((res) => {
          if (res['status'] === 400) {
            this.zone.run(() => { this.toastr.error('Password not updated', 'Error'); })
            this.formError.setFormErrors(this.passwordForm, res['error']);
          } else {
            this.toastr.success('Password updated successfully', 'Success');
            this.loading = false;
              this.router.navigate(['/login'], { relativeTo: this.route });
          }
        })
        .catch(error => {
          if (error.status === 400) {
            this.zone.run(() => { this.toastr.error('Please fill all required details', 'Error'); })
            this.formError.setFormErrors(this.passwordForm, error);
          }else if (error.status === 401) {
            this.zone.run(() => { this.toastr.error('Password token expired', 'Error'); })
            this.passwordForm.reset();
          }
          this.loading = false;
        });
    }
  }

  login() {
    this.router.navigate(['./login']);
  }
}
