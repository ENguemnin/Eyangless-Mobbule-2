import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChambresPage } from './chambres.page';

describe('ChambresPage', () => {
  let component: ChambresPage;
  let fixture: ComponentFixture<ChambresPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ChambresPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
