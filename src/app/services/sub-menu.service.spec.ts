import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { MstSubMenuService } from './sub-menu.service';

describe('MstSubMenuService', () => {
  let service: MstSubMenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(MstSubMenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
