import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarsDetailPage } from './cars-detail.page';

describe('CarsDetailPage', () => {
  let component: CarsDetailPage;
  let fixture: ComponentFixture<CarsDetailPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CarsDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
