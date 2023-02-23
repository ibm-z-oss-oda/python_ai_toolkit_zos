import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageInfoComponent } from './package-info.component';

describe('PackageInfoComponent', () => {
  let component: PackageInfoComponent;
  let fixture: ComponentFixture<PackageInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PackageInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PackageInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
