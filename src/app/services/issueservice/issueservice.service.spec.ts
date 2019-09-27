import { TestBed } from '@angular/core/testing';

import { Issueservice } from './issueservice.service';

describe('IssueserviceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: Issueservice = TestBed.get(Issueservice);
    expect(service).toBeTruthy();
  });
});
