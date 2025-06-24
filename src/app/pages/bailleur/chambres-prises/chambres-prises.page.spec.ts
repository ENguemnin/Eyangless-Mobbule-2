import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChambresPrisesPage } from './chambres-prises.page';

describe('ChambresPrisesPage', () => {
  let component: ChambresPrisesPage;
  let fixture: ComponentFixture<ChambresPrisesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ChambresPrisesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
