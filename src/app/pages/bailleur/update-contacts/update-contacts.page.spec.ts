import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdateContactsPage } from './update-contacts.page';

describe('UpdateContactsPage', () => {
  let component: UpdateContactsPage;
  let fixture: ComponentFixture<UpdateContactsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateContactsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
