import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckboxPlotsComponent } from './checkbox-plots.component';

describe('CheckboxPlotsComponent', () => {
  let component: CheckboxPlotsComponent;
  let fixture: ComponentFixture<CheckboxPlotsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckboxPlotsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckboxPlotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
