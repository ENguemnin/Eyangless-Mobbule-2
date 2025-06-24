import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdateCartePage } from './update-carte.page';

describe('UpdateCartePage', () => {
  let component: UpdateCartePage;
  let fixture: ComponentFixture<UpdateCartePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateCartePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
