import { TestBed } from '@angular/core/testing';

import { RegistryApiAuthService } from './registry-api-auth.service';

describe('RegistryApiAuthService', () => {
  let service: RegistryApiAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegistryApiAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
