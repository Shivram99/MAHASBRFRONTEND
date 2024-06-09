import { TestBed } from '@angular/core/testing';

import { MenuRoleMappingService } from './menu-role-mapping.service';

describe('MenuRoleMappingService', () => {
  let service: MenuRoleMappingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MenuRoleMappingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
