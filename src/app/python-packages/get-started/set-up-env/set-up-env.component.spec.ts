import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetUpEnvComponent } from './set-up-env.component';

describe('SetUpEnvComponent', () => {
  let component: SetUpEnvComponent;
  let fixture: ComponentFixture<SetUpEnvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetUpEnvComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SetUpEnvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
