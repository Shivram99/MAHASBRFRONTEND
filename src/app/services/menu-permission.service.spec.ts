import { TestBed } from '@angular/core/testing';

import { MenuPermissionService } from './menu-permission.service';

describe('MenuPermissionService', () => {
  let service: MenuPermissionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MenuPermissionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
