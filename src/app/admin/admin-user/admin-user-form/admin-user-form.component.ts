import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbIconConfig, NbToastrService } from '@nebular/theme';
import { FormServerErrorHandler } from 'src/app/helpers/form-server-error.handler';
import { AdminUserService } from 'src/app/services/admin-user.service';
import { NgZone } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-admin-user-form',
  templateUrl: './admin-user-form.component.html',
  styleUrls: ['./admin-user-form.component.scss']
})
export class AdminUserFormComponent implements OnInit {

  form: FormGroup = this.formBuilder.group({
    id: [null],
    name: [''],
    email: [''],
    password: [''],
    role: ['']
  });

  loading = false;
  isNewAdminUser: boolean = true;

  constructor(private formBuilder: FormBuilder, public route: ActivatedRoute, public router: Router,
    private adminUserService: AdminUserService, private toastrService: NbToastrService, public formError: FormServerErrorHandler,
    public zone:NgZone,
    public toastr: ToastrService) { }

  get f() { return this.form.controls; }

  ngOnInit(): void {
    if (this.route.snapshot.params.id !== undefined) {
      this.loading = true;
      this.adminUserService.getById(this.route.snapshot.params.id).then((response: any) => {
        this.isNewAdminUser = false;
        this.form.patchValue({
          id: response.id,
          name: response.name,
          email: response.email,
          password: response.password,
          role: response.role
        })
      }).catch(error => {
        this.loading = false;
      })
    }else{
      this.isNewAdminUser = true;
    }
  }

  onUpdate() {
    if (this.form.valid) {
      const data = this.form.value
      const id = data.id;
      const params = { name: data.name, email: data.email, role: "ADMIN" };
      this.loading = true;
      this.adminUserService.update(id, params).then(() => {
      this.toastr.success('Admin User updated successfully', 'Success');
          this.router.navigateByUrl('/admin/admin-user-list')
      }).catch((err) => {
        if (err.status === 400) {
          this.zone.run(() => { this.toastr.error('Please fill all required details', 'Error');  });
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
        email: this.form.value.email,
        password: this.form.value.password,
        is_agree: true,
        role: "ADMIN"
      }
      this.adminUserService.create(data).then(() => {
        this.toastr.success('Admin User created successfully', 'Success');
          this.router.navigateByUrl('/admin/admin-user-list')
      }).catch((err) => {
        if (err.status === 400) {
          this.zone.run(() => { this.toastr.error('Please fill all required details', 'Error');  })
          this.formError.setFormErrors(this.form, err)
        }
        this.loading = false;
      })
    }
  }
  onCancel() {
    this.router.navigate(['/admin/admin-user-list']);
  }
}
