import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbIconConfig, NbToastrService } from '@nebular/theme';
import { FormServerErrorHandler } from 'src/app/helpers/form-server-error.handler';
import { ProductsService } from 'src/app/services/products.service';
import { NgZone } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {

  form: FormGroup = this.formBuilder.group({
    id: [null],
    name: [''],
    description: [''],
  });

  get f() { return this.form.controls; }

  loading = false;
  isNewProduct: boolean = true;

  constructor(private formBuilder: FormBuilder, public route: ActivatedRoute, public router: Router,
    private productService: ProductsService, private toastrService: NbToastrService, public formError: FormServerErrorHandler, public toastr: ToastrService,
    public zone:NgZone) { }

  ngOnInit(): void {
    if (this.route.snapshot.params.id !== undefined) {
      this.loading = true;
      this.productService.getById(this.route.snapshot.params.id).then((response: any) => {
        this.isNewProduct = false;
        this.form.patchValue({
          id: response.id,
          name: response.name,
          description: response.description
        })
      }).catch(error => {
        this.loading = false;
      })
    }else{
      this.isNewProduct = true;
    }
  }

  onUpdate() {
    if (this.form.valid) {
      const data = this.form.value
      const id = data.id;
      const params = { name: data.name ,description : data.description};
      this.loading = true;
      this.productService.update(id, params).then(() => {
        this.toastr.success('Product updated successfully','Success')
          this.router.navigateByUrl('/admin/product-list')
      }).catch(err => {
        if (err.status === 400) {
          this.zone.run(() => { this.toastr.error('Please fill all required details', 'Error'); })
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
        name: this.form.value.name,
        description : this.form.value.description
      }
      this.productService.create(data).then(() => {
        this.toastr.success('Product created successfully', 'Success');
          this.router.navigateByUrl('/admin/product-list')
      }).catch(err => {
        if (err.status === 400) {
          this.zone.run(() => { this.toastr.error('Please fill all required details', 'Error!'); })
          this.formError.setFormErrors(this.form, err)
        }
        this.loading = false;
      })
    }
  }

  onCancel() {
    this.router.navigate(['/admin/product-list']);
  }
}
