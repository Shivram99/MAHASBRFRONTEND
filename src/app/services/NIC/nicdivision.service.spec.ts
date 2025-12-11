import { TestBed } from '@angular/core/testing';

import { NICDivisionService } from './nicdivision.service';

describe('NICDivisionService', () => {
  let service: NICDivisionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NICDivisionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
