import { TestBed } from '@angular/core/testing';

import { RegistryServiceService } from './registry-service.service';

describe('RegistryServiceService', () => {
  let service: RegistryServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegistryServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
