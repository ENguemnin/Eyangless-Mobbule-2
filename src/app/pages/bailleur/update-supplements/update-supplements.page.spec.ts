import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdateSupplementsPage } from './update-supplements.page';

describe('UpdateSupplementsPage', () => {
  let component: UpdateSupplementsPage;
  let fixture: ComponentFixture<UpdateSupplementsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateSupplementsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
