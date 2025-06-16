import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdateCaracteristiquesPage } from './update-caracteristiques.page';

describe('UpdateCaracteristiquesPage', () => {
  let component: UpdateCaracteristiquesPage;
  let fixture: ComponentFixture<UpdateCaracteristiquesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateCaracteristiquesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
