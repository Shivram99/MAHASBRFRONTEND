import { TestBed } from '@angular/core/testing';

import { NICGroupService } from './nicgroup.service';

describe('NICGroupService', () => {
  let service: NICGroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NICGroupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
