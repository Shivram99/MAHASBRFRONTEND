import { TestBed } from '@angular/core/testing';

import { NICServiceService } from './nicservice.service';

describe('NICServiceService', () => {
  let service: NICServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NICServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
