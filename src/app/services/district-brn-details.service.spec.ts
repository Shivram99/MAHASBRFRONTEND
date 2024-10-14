import { TestBed } from '@angular/core/testing';

import { DistrictBrnDetailsService } from './district-brn-details.service';

describe('DistrictBrnDetailsService', () => {
  let service: DistrictBrnDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DistrictBrnDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
