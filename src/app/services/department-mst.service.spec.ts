import { TestBed } from '@angular/core/testing';

import { DepartmentMstService } from './department-mst.service';

describe('DepartmentMstService', () => {
  let service: DepartmentMstService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DepartmentMstService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
