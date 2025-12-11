import { TestBed } from '@angular/core/testing';

import { NICClassService } from './nicclass.service';

describe('NICClassService', () => {
  let service: NICClassService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NICClassService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
