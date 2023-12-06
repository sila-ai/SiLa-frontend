import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyaddonFailedComponent } from './buyaddon-failed.component';

describe('BuyaddonFailedComponent', () => {
  let component: BuyaddonFailedComponent;
  let fixture: ComponentFixture<BuyaddonFailedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuyaddonFailedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyaddonFailedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
