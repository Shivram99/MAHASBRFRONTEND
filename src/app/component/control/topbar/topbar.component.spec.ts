import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { TopbarComponent } from './topbar.component';
import { AccessibilityService } from '../../../core/services/accessibility.service';
import { LanguageService } from '../../../core/services/language.service';
import { AuthService } from '../../../services/auth.service';

describe('TopbarComponent', () => {
  let component: TopbarComponent;
  let fixture: ComponentFixture<TopbarComponent>;
  const accessibilityServiceMock = {
    getFontScaleObservable: jasmine.createSpy('getFontScaleObservable').and.returnValue(of(1)),
    decreaseFontSize: jasmine.createSpy('decreaseFontSize'),
    resetFontSize: jasmine.createSpy('resetFontSize'),
    increaseFontSize: jasmine.createSpy('increaseFontSize')
  };
  const languageServiceMock = {
    getLanguageObservable: jasmine.createSpy('getLanguageObservable').and.returnValue(of('en')),
    setLanguage: jasmine.createSpy('setLanguage')
  };
  const authServiceMock = {
    getIsLoggedIn: jasmine.createSpy('getIsLoggedIn').and.returnValue(of(true)),
    getCurrentUser: jasmine.createSpy('getCurrentUser').and.returnValue(of({
      username: 'admin',
      email: 'admin@test.com',
      roles: ['ROLE_ADMIN'],
      activeRole: 'ROLE_ADMIN'
    }))
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TopbarComponent],
      providers: [
        { provide: AccessibilityService, useValue: accessibilityServiceMock },
        { provide: LanguageService, useValue: languageServiceMock },
        { provide: AuthService, useValue: authServiceMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should prefer active role when present', () => {
    expect(component.getDisplayedRole({
      username: 'admin',
      email: 'admin@test.com',
      roles: ['ROLE_ADMIN', 'ROLE_USER'],
      activeRole: 'ROLE_ADMIN'
    })).toBe('ROLE_ADMIN');
  });

  it('should fallback to full name when available', () => {
    expect(component.getDisplayedName({
      username: 'admin',
      fullName: 'Jitendra Ghasle',
      email: 'admin@test.com',
      roles: ['ROLE_ADMIN'],
      activeRole: 'ROLE_ADMIN'
    })).toBe('Jitendra Ghasle');
  });
});
