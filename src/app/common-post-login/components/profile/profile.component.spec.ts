import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';

import { ProfileComponent } from './profile.component';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../interface/user';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  const currentUserSubject = new BehaviorSubject<User | null>(null);
  const authServiceMock = {
    currentUser$: currentUserSubject.asObservable(),
    getUserRoles: jasmine.createSpy('getUserRoles').and.returnValue([])
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfileComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should format and show user roles', () => {
    currentUserSubject.next({
      username: 'demo',
      email: 'demo@test.com',
      roles: ['ROLE_REG_AUTH_API', 'ROLE_DES_DISTRICT']
    });
    fixture.detectChanges();

    expect(component.userRolesDisplay).toBe('Reg Auth Api, Des District');
  });
});
