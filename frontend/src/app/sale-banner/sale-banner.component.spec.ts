import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleBannerComponent } from './sale-banner.component';

describe('SaleBannerComponent', () => {
  let component: SaleBannerComponent;
  let fixture: ComponentFixture<SaleBannerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SaleBannerComponent]
    });
    fixture = TestBed.createComponent(SaleBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
