import { TestBed } from '@angular/core/testing';

import { RequestFormService } from './request-form.service';

describe('RequestFormService', () => {
  let service: RequestFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RequestFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
