import { TestBed } from '@angular/core/testing';

import { VisitTrackerService } from './visit-tracker.service';

describe('VisitTrackerService', () => {
  let service: VisitTrackerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VisitTrackerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
