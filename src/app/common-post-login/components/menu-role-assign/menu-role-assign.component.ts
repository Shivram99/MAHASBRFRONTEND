import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Menu } from '../../../interface/menu';
import { User } from '../../../model/user';
import { RoleService } from '../../../services/role.service';
import { MenuService } from '../../../services/menu.service';
import { MenuPermissionService } from '../../../services/menu-permission.service';
import { Role } from '../../../model/role';
import { AssignMenuDTO } from '../../../interface/assign-menu-dto';
import { forkJoin } from 'rxjs';
import { ApiResponse } from '../../../interface/api-response';

@Component({
  selector: 'app-menu-role-assign',
  standalone: false,
  templateUrl: './menu-role-assign.component.html',
  styleUrl: './menu-role-assign.component.css'
})
export class MenuRoleAssignComponent implements OnInit {
roles: Role[] = [];
  menus: Menu[] = [];
  assignedMenuIds: number[] = [];
  selectedMenuIds: number[] = [];

  selectedRoleId?: number;

  isLoading = true;
  isSubmitting = false;

  constructor(
    private roleService: RoleService,
    private menuService: MenuService,
    private permissionService: MenuPermissionService
  ) { }

  ngOnInit(): void {
    this.loadInitialData();
  }

  /** Load roles and menus */
  private loadInitialData(): void {
    this.isLoading = true;
    forkJoin([this.roleService.getAllRoles(), this.menuService.getAllMenus()])
      .subscribe({
        next: ([roles, menus]) => {
          this.roles = roles;
          this.menus = menus;
        },
        error: err => console.error('Initialization Error: ', err),
        complete: () => this.isLoading = false
      });
  }

  /** Load menus already assigned to selected role */
  onRoleChange(): void {
    if (!this.selectedRoleId) {
      this.assignedMenuIds = [];
      this.selectedMenuIds = [];
      return;
    }

    this.permissionService.getMenusForRole(this.selectedRoleId)
      .subscribe({
        next: (res: ApiResponse<Menu[]>) => {
          const menuList = res.data ?? [];
          this.assignedMenuIds = menuList.map((m: Menu) => m.id);
          this.selectedMenuIds = [...this.assignedMenuIds];
        },
        error: err => {
          console.error(err);
          this.assignedMenuIds = [];
          this.selectedMenuIds = [];
        }
      });
  }

  /** Checkbox toggle handler */
  onMenuToggle(menuId: number, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;

    if (checked) {
      if (!this.selectedMenuIds.includes(menuId)) {
        this.selectedMenuIds.push(menuId);
      }
    } else {
      this.selectedMenuIds = this.selectedMenuIds.filter(id => id !== menuId);
    }
  }

  /** Assign selected menus to role */
  save(): void {
    if (!this.selectedRoleId) {
      alert('Please select a role');
      return;
    }

    this.isSubmitting = true;

    const dto: AssignMenuDTO = {
      roleId: this.selectedRoleId,
      menuIds: this.selectedMenuIds
    };

    this.permissionService.assignMenusToRole(dto)
      .subscribe({
        next: () => {
          alert('Menus assigned successfully.');
          this.onRoleChange();
        },
        error: err => console.error(err),
        complete: () => this.isSubmitting = false
      });
  }

  /** Remove selected menus from role */
  remove(): void {
  if (!this.selectedRoleId) {
    alert('Role not selected');
    return;
  }

  const dto: AssignMenuDTO = {
    roleId: this.selectedRoleId,
    menuIds: this.selectedMenuIds
  };

  this.isSubmitting = true;

  this.permissionService.removeMenusFromRole(dto).subscribe({
    next: () => {
      alert('Menus removed successfully.');
      this.onRoleChange();  // reload assigned menus
      this.isSubmitting = false;
    },
    error: err => {
      console.error(err);
      this.isSubmitting = false;
    }
  });
}
}