import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerUserFormComponent } from './customer-user-form.component';

describe('CustomerUserFormComponent', () => {
  let component: CustomerUserFormComponent;
  let fixture: ComponentFixture<CustomerUserFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerUserFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerUserFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
