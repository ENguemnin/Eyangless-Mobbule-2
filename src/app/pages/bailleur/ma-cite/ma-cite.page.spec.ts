import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MaCitePage } from './ma-cite.page';

describe('MaCitePage', () => {
  let component: MaCitePage;
  let fixture: ComponentFixture<MaCitePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MaCitePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
