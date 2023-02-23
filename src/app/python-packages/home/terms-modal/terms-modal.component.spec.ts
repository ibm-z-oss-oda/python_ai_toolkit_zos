import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsModalComponent } from './terms-modal.component';

describe('TermsModalComponent', () => {
  let component: TermsModalComponent;
  let fixture: ComponentFixture<TermsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TermsModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TermsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
