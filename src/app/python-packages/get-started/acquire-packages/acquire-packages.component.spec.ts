import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcquirePackagesComponent } from './acquire-packages.component';

describe('AcquirePackagesComponent', () => {
  let component: AcquirePackagesComponent;
  let fixture: ComponentFixture<AcquirePackagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcquirePackagesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcquirePackagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
