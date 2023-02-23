import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PythonPackagesComponent } from './python-packages.component';

describe('PythonPackagesComponent', () => {
  let component: PythonPackagesComponent;
  let fixture: ComponentFixture<PythonPackagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PythonPackagesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PythonPackagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
