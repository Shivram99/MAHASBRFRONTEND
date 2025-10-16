import { TestBed } from '@angular/core/testing';

import { MarathiInputService } from './marathi-input.service';

describe('MarathiInputService', () => {
  let service: MarathiInputService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MarathiInputService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
