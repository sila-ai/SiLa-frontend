import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewaddonComponent } from './viewaddon.component';

describe('ViewaddonComponent', () => {
  let component: ViewaddonComponent;
  let fixture: ComponentFixture<ViewaddonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewaddonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewaddonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
