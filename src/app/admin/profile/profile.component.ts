import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { NbIconConfig, NbToastrService } from '@nebular/theme';
import { FormServerErrorHandler } from 'src/app/helpers/form-server-error.handler';
import { AuthenticationService } from "../../services/authentication.service";
import { AlertService } from "../../services/alert.service";
import { NgZone } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  form: FormGroup = this.formBuilder.group({
    id: [null],
    name: [''],
    email: [''],
    role: ['']
  });

  loading = false;
  isEditProfile: boolean = true;
  customerData: any;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private alertService: AlertService,
    private toastrService: NbToastrService,
    public formError: FormServerErrorHandler,
    public zone:NgZone,
    public toastr: ToastrService
  ) { }

  get f() { return this.form.controls; }

  ngOnInit(): void {

    if (this.route.snapshot.params.id !== undefined) {
      this.loading = true;
      this.authenticationService.getById(this.route.snapshot.params.id).then((response: any) => {
        this.isEditProfile = false;
        this.customerData = response;
        this.form.patchValue({
          id: response.id,
          name: response.name,
          email: response.email,
          role: response.role
        })
      }).catch(error => {
        this.loading = false;
      })
    } else {
      this.isEditProfile = true;
    }
  }

  onUpdate() {
    if (this.form.valid) {
      const data = this.form.value
      const id = data.id;
      const params = { name: data.name, email: data.email };
      this.loading = true;
      this.authenticationService.update(id, params).then(() => {
        this.toastr.success('Profile updated successfully', 'Success');
          this.router.navigate(['/user/dashboard'])
      }).catch((err) => {
        if (err.status === 400) {
         this.zone.run(() => { this.toastr.error('Please fill all required details', 'Error');  })
         this.formError.setFormErrors(this.form, err)
        }
        this.loading = false;
      })
    }
  }
}
