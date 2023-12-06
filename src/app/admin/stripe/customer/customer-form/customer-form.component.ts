import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbIconConfig, NbToastrService } from '@nebular/theme';
import { FormServerErrorHandler } from 'src/app/helpers/form-server-error.handler';
import { CustomerService } from 'src/app/services/customer.service';
import { NgZone } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.scss']
})
export class CustomerFormComponent implements OnInit {

  form: FormGroup = this.formBuilder.group({
    id: [null],
    name: [''],
    email: [''],
    description: ['']
  });

  get f() { return this.form.controls; }

  loading = false;
  isNewCustomer: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    public route: ActivatedRoute,
    public router: Router,
    private customerService: CustomerService,
    private toastrService: NbToastrService,
    public formError: FormServerErrorHandler,
    public toastr: ToastrService,
    public zone:NgZone
  ) { }

  ngOnInit(): void {
    if (this.route.snapshot.params.id !== undefined) {
      this.loading = true;
      this.customerService.getById(this.route.snapshot.params.id).then((response: any) => {
        this.isNewCustomer = false;
        this.form.patchValue({
          id: response.id,
          name: response.name,
          email: response.email,
          description: response.description
        })
      }).catch(error => {
        this.loading = false;
      })
    }else{
      this.isNewCustomer = true;
    }
  }

  onUpdate() {
    const data = this.form.value
    const id = data.id;
    const params = { name: data.name, email: data.email, description: data.description, phone: data.phone };
    this.loading = true;
    this.customerService.update(id, params).then(() => {
      this.toastr.success('Customer updated successfully', 'Success');
        this.router.navigateByUrl('/admin/customer-list')
    }).catch(err => {
      if (err.status === 400) {
        this.zone.run(() => { this.toastr.error('Please fill all required details', 'Error'); })
        this.formError.setFormErrors(this.form, err)
      }
      this.loading = false;
    })
  }

  onSubmit() {
    this.loading = true;
    const data = {
      name: this.form.value.name,
      email: this.form.value.email,
      description: this.form.value.description
    }
    this.customerService.create(data).then(() => {
      const status = 'Success'
      const iconConfig: NbIconConfig = { icon: 'checkmark-circle-outline', pack: 'eva' };
      this.toastrService.show(status, 'Customer created successfully', { status: status.toLowerCase(), icon: iconConfig })
    }).catch(err => {
      if (err.status === 400) {
        this.zone.run(() => { this.toastr.error('Please fill all required details', 'Error!'); })
        this.formError.setFormErrors(this.form, err);
      }
      this.loading = false;
    })
  }
}
