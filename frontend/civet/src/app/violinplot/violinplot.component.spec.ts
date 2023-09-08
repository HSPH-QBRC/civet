import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViolinplotComponent } from './violinplot.component';

describe('ViolinplotComponent', () => {
  let component: ViolinplotComponent;
  let fixture: ComponentFixture<ViolinplotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViolinplotComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViolinplotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
