import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { UserListComponent } from './user-list.component';
import { UserService } from '../../../services/user.service';
import { RegistryServiceService } from '../../../services/registry-master/registry-service.service';
import { DivisionService } from '../../../services/divison/division.service';
import { DistrictService } from '../../../services/district/district.service';
import { FilterUsersPipe } from '../../../pipes/filter-users.pipe';

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  const userServiceMock = {
    getUsers: jasmine.createSpy('getUsers').and.returnValue(of([])),
    getRoles: jasmine.createSpy('getRoles').and.returnValue(of([])),
    createUser: jasmine.createSpy('createUser').and.returnValue(of({})),
    updateUser: jasmine.createSpy('updateUser').and.returnValue(of({})),
    deleteUser: jasmine.createSpy('deleteUser').and.returnValue(of(void 0))
  };
  const registryServiceMock = {
    getAll: jasmine.createSpy('getAll').and.returnValue(of([]))
  };
  const divisionServiceMock = {
    getAllDivisions: jasmine.createSpy('getAllDivisions').and.returnValue(of([]))
  };
  const districtServiceMock = {
    getAll: jasmine.createSpy('getAll').and.returnValue(of([]))
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserListComponent, FilterUsersPipe],
      imports: [ReactiveFormsModule, FormsModule],
      providers: [
        { provide: UserService, useValue: userServiceMock },
        { provide: RegistryServiceService, useValue: registryServiceMock },
        { provide: DivisionService, useValue: divisionServiceMock },
        { provide: DistrictService, useValue: districtServiceMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should require division and district for district role', () => {
    component.rolesControl.setValue(['ROLE_DES_DISTRICT']);

    expect(component.isLocationFieldVisible('divisionCode')).toBeTrue();
    expect(component.isLocationFieldVisible('districtId')).toBeTrue();
    expect(component.userForm.get('divisionCode')?.enabled).toBeTrue();
    expect(component.userForm.get('districtId')?.enabled).toBeTrue();
  });

  it('should clear hidden location fields when roles change', () => {
    component.rolesControl.setValue(['ROLE_REG_AUTH_API']);
    component.userForm.patchValue({ registryId: 7 });

    component.rolesControl.setValue([]);

    expect(component.isLocationFieldVisible('registryId')).toBeFalse();
    expect(component.userForm.get('registryId')?.value).toBeNull();
    expect(component.userForm.get('registryId')?.disabled).toBeTrue();
  });
});
