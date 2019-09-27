import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchproductsPage } from './searchproducts.page';

describe('SearchproductsPage', () => {
  let component: SearchproductsPage;
  let fixture: ComponentFixture<SearchproductsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchproductsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchproductsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
