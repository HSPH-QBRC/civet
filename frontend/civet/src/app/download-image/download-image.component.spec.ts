import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadImageComponent } from './download-image.component';

describe('DownloadImageComponent', () => {
  let component: DownloadImageComponent;
  let fixture: ComponentFixture<DownloadImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DownloadImageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
