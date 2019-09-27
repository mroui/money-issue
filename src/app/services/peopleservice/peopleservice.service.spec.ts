import { TestBed } from '@angular/core/testing';

import { PeopleserviceService } from './peopleservice.service';

describe('PeopleserviceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PeopleserviceService = TestBed.get(PeopleserviceService);
    expect(service).toBeTruthy();
  });
});
