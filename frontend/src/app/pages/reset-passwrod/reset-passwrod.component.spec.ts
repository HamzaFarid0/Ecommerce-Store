import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPasswrodComponent } from './reset-passwrod.component';

describe('ResetPasswrodComponent', () => {
  let component: ResetPasswrodComponent;
  let fixture: ComponentFixture<ResetPasswrodComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ResetPasswrodComponent]
    });
    fixture = TestBed.createComponent(ResetPasswrodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
