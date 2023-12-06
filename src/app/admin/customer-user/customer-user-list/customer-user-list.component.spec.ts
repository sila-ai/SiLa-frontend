import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerUserListComponent } from './customer-user-list.component';

describe('CustomerUserListComponent', () => {
  let component: CustomerUserListComponent;
  let fixture: ComponentFixture<CustomerUserListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerUserListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerUserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
