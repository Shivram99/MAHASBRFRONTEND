import { TestBed } from '@angular/core/testing';

import { SerachBrnService } from './serach-brn.service';

describe('SerachBrnService', () => {
  let service: SerachBrnService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SerachBrnService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
