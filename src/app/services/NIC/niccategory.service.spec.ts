import { TestBed } from '@angular/core/testing';

import { NICCategoryService } from './niccategory.service';

describe('NICCategoryService', () => {
  let service: NICCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NICCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
