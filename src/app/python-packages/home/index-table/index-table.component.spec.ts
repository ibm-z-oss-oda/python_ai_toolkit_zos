import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexTableComponent } from './index-table.component';

describe('IndexTableComponent', () => {
  let component: IndexTableComponent;
  let fixture: ComponentFixture<IndexTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndexTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndexTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
