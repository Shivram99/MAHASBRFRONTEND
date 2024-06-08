import { TestBed } from '@angular/core/testing';

import { DistrictServiceService } from './district-service.service';

describe('DistrictServiceService', () => {
  let service: DistrictServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DistrictServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
