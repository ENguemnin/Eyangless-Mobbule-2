import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdateCitePage } from './update-cite.page';

describe('UpdateCitePage', () => {
  let component: UpdateCitePage;
  let fixture: ComponentFixture<UpdateCitePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateCitePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
