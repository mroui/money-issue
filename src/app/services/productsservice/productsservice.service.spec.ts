import { TestBed } from '@angular/core/testing';

import { ProductsserviceService } from './productsservice.service';

describe('ProductsserviceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProductsserviceService = TestBed.get(ProductsserviceService);
    expect(service).toBeTruthy();
  });
});
