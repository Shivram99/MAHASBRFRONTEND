import { TestBed } from '@angular/core/testing';

import { RegionBrnDetailsService } from './region-brn-details.service';

describe('RegionBrnDetailsService', () => {
  let service: RegionBrnDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegionBrnDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
