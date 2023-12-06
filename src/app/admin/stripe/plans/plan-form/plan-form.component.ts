import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbIconConfig, NbToastrService } from '@nebular/theme';
import { FormServerErrorHandler } from 'src/app/helpers/form-server-error.handler';
import { PlansService } from 'src/app/services/plans.service';
import { ProductsService } from 'src/app/services/products.service';
import { NgZone } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-plan-form',
  templateUrl: './plan-form.component.html',
  styleUrls: ['./plan-form.component.scss'],
})
export class PlanFormComponent implements OnInit {
  form: FormGroup = this.formBuilder.group({
    id: [null],
    amount: [''],
    currency: [''],
    interval: ['month'],
    product: [''],
    nickname: [''],
    interval_count: ['1'],
  });

  products: any[] = [];

  get f() {
    return this.form.controls;
  }

  loading = false;
  isNewPlan: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    public route: ActivatedRoute,
    public router: Router,
    private planService: PlansService,
    private toastrService: NbToastrService,
    public formError: FormServerErrorHandler,
    public toastr: ToastrService,
    public zone: NgZone,
    private productService: ProductsService
  ) {}

  ngOnInit(): void {
    this.productService.getAll().then((response: any) => {
      this.products = response.data;
    });

    if (this.route.snapshot.params.id !== undefined) {
      this.loading = true;
      this.planService
        .getById(this.route.snapshot.params.id)
        .then((response: any) => {
          console.log(response);
          this.isNewPlan = false;
          this.form.patchValue({
            id: response.id,
            nickname: response.nickname,
            amount: response.amount,
            currency: response.currency,
            interval: response.interval,
            product: response.product,
            interval_count: response.interval_count,
          });
        })
        .catch((error) => {
          this.loading = false;
        });
    } else {
      this.isNewPlan = true;
    }
  }

  onUpdate() {
    if (this.form.valid) {
      const data = this.form.value;
      const id = data.id;
      const params = { nickname: data.nickname };
      this.loading = true;
      this.planService
        .update(id, params)
        .then(() => {
          this.toastr.success('Plan updated successfully', 'Success');
          this.router.navigateByUrl('/admin/plan-list');
        })
        .catch((err) => {
          if (err.status === 400) {
            this.zone.run(() => {
              this.toastr.error('Please fill all required details', 'Error');
            });
            this.formError.setFormErrors(this.form, err);
          }
          this.loading = false;
        });
    }
  }

  onSubmit() {
    if (this.form.valid) {
      this.loading = true;
      const data = {
        nickname: this.form.value.nickname,
        amount: Number(this.form.value.amount),
        currency: this.form.value.currency,
        interval: this.form.value.interval,
        product: this.form.value.product,
        interval_count: this.form.value.interval_count,
      };
      this.planService
        .create(data)
        .then(() => {
          const status = 'Success';
          this.toastr.success('Plan created successfully', 'Success');
          this.router.navigateByUrl('/admin/plan-list');
        })
        .catch((err) => {
          if (err.status === 400) {
            this.zone.run(() => {
              this.toastr.error('Please fill all required details', 'Error!');
            });
            this.formError.setFormErrors(this.form, err);
          }
          this.loading = false;
        });
    }
  }

  onCancel() {
    this.router.navigate(['/admin/plan-list']);
  }

  // Only Integer Numbers
  keyPressNumbers(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    // Only Numbers 0-9
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }
}
