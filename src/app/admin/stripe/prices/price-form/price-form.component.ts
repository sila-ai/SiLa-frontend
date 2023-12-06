import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbIconConfig, NbToastrService } from '@nebular/theme';
import { FormServerErrorHandler } from 'src/app/helpers/form-server-error.handler';
import { PricesService } from 'src/app/services/prices.service';

@Component({
  selector: 'app-price-form',
  templateUrl: './price-form.component.html',
  styleUrls: ['./price-form.component.scss']
})
export class PriceFormComponent implements OnInit {

  form: FormGroup = this.formBuilder.group({
    id: [null],
    amount: [''],
    currency: [''],
    recurring: [''],
    product: [''],
    nickname: ['']
  });

  get f() { return this.form.controls; }

  loading = false;
  isNewPrice: boolean = true;

  constructor(private formBuilder: FormBuilder, public route: ActivatedRoute, public router: Router,
    private priceService: PricesService, private toastrService: NbToastrService, public formError: FormServerErrorHandler) { }

  ngOnInit(): void {
    if (this.route.snapshot.params.id !== undefined) {
      this.loading = true;
      this.priceService.getById(this.route.snapshot.params.id).then((response: any) => {
        this.isNewPrice = false;
        this.form.patchValue({
          id: response.id,
          nickname: response.nickname,
          amount: response.amount,
          currency: response.currency,
          recurring: response.recurring,
          product: response.product,
        })
      }).catch(error => {
        this.loading = false;
      })
    }else{
      this.isNewPrice = true;
    }
  }

  onUpdate() {
    const data = this.form.value
    const id = data.id;
    const params = { nickname: data.nickname, amount: data.amount, currency: data.currency, recurring: data.recurring, product: data.product };
    this.loading = true;
    this.priceService.update(id, params).then(() => {
      const status = 'Success'
      const iconConfig: NbIconConfig = { icon: 'checkmark-circle-outline', pack: 'eva' };
      this.toastrService.show(status, 'Price updated successfully', { status: status.toLowerCase(), icon: iconConfig })
        this.router.navigateByUrl('/admin/price-list')
    }).catch(err => {
      if (err.status === 400) {
        const status = 'Warning'
        const iconConfig: NbIconConfig = { icon: 'alert-triangle-outline', pack: 'eva' };
        this.toastrService.show(status, 'Submitted form has errors', { status: status.toLowerCase(), icon: iconConfig });
        this.formError.setFormErrors(this.form, err)
      }
      this.loading = false;
    })
  }

  onSubmit() {
    this.loading = true;
    const data = {
      nickname: this.form.value.nickname,
      amount: this.form.value.amount,
      currency: this.form.value.currency,
      recurring: this.form.value.recurring,
      product: this.form.value.product,
    }
    this.priceService.create(data).then(() => {
      const status = 'Success'
      const iconConfig: NbIconConfig = { icon: 'checkmark-circle-outline', pack: 'eva' };
      this.toastrService.show(status, 'Price created successfully', { status: status.toLowerCase(), icon: iconConfig })
        this.router.navigateByUrl('/admin/price-list')
    }).catch(err => {
      if (err.status === 400) {
        const status = 'Warning'
        const iconConfig: NbIconConfig = { icon: 'alert-triangle-outline', pack: 'eva' };
        this.toastrService.show(status, 'Submitted form has errors', { status: status.toLowerCase(), icon: iconConfig });
        this.formError.setFormErrors(this.form, err)
      }
      this.loading = false;
    })
  }

}
