import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuRoleAssignComponent } from './menu-role-assign.component';

describe('MenuRoleAssignComponent', () => {
  let component: MenuRoleAssignComponent;
  let fixture: ComponentFixture<MenuRoleAssignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MenuRoleAssignComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuRoleAssignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
