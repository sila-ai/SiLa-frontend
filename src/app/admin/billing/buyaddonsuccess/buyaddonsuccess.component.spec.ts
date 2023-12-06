import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyaddonsuccessComponent } from './buyaddonsuccess.component';

describe('BuyaddonsuccessComponent', () => {
  let component: BuyaddonsuccessComponent;
  let fixture: ComponentFixture<BuyaddonsuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuyaddonsuccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyaddonsuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
