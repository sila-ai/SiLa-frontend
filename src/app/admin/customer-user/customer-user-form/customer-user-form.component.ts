import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbIconConfig, NbToastrService } from '@nebular/theme';
import { FormServerErrorHandler } from 'src/app/helpers/form-server-error.handler';
import { CustomerUserService } from 'src/app/services/customer-user.service';
import jwt_decode from "jwt-decode";
import { NgZone } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-customer-user-form',
  templateUrl: './customer-user-form.component.html',
  styleUrls: ['./customer-user-form.component.scss']
})
export class CustomerUserFormComponent implements OnInit {

  form: FormGroup = this.formBuilder.group({
    id: [null],
    customerId: [''],
    name: [''],
    email: [''],
    password: [''],
    role: ['USER']
  });

  get f() { return this.form.controls; }

  loading = false;
  isNewCustomerUser: boolean = true;

  constructor(private formBuilder: FormBuilder, public route: ActivatedRoute, public router: Router,
    private customerUserService: CustomerUserService, private toastrService: NbToastrService, public formError: FormServerErrorHandler,
    public zone:NgZone,
    public toastr: ToastrService) { }

  onCancel() {
    this.router.navigate(['/user/customer-user-list']);
  }

  ngOnInit(): void {
    if (this.route.snapshot.params.id !== undefined) {
      this.loading = true;
      this.customerUserService.getById(this.route.snapshot.params.id).then((response: any) => {
        this.isNewCustomerUser = false;
        this.form.patchValue({
          id: response.id,
          customerId: response.customerId,
          name: response.name,
          email: response.email,
          password: response.password,
          role: response.role
        })
      }).catch(error => {
        this.loading = false;
      })
    } else {
      this.isNewCustomerUser = true;
    }

    const token = localStorage.getItem('token')
    if (token !== null || token !== undefined) {
      try {
        const user: any = jwt_decode(token);
        this.form.patchValue({
          customerId: user.customerId
        })
      } catch (err) {

      }
    }
  }

  onUpdate() {
    if (this.form.valid) {
      const data = this.form.value
      const id = data.id;
      const params = { name: data.name, email: data.email };
      this.loading = true;
      this.customerUserService.update(id, params).then(() => {
       this.toastr.success('Customer User updated successfully', 'Success');
          this.router.navigate(['/user/customer-user-list']);
      }).catch((err) => {
        if (err.status === 400) {
          this.zone.run(() => { this.toastr.error('Please fill all required details', 'Error');  })
          this.formError.setFormErrors(this.form, err)
        }
        this.loading = false;
      })
    }
  }

  onSubmit() {
    if (this.form.valid) {
      this.loading = true;
      const data = {
        customerId: this.form.value.customerId,
        name: this.form.value.name,
        email: this.form.value.email,
        password: this.form.value.password,
        is_agree: true,
        role: "USER"
      }
      this.customerUserService.create(data).then(() => {
       this.toastr.success('Customer User created successfully', 'Success');
       this.router.navigate(['/user/customer-user-list']);
      }).catch(err => {
        if (err.status === 400) {
         this.toastr.error('Please fill all required details', 'Error');
          this.formError.setFormErrors(this.form, err)
        }
        this.loading = false;
      })
    }
  }
}
