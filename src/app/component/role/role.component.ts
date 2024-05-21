import { Component, OnInit } from '@angular/core';
import { RoleService } from '../../services/role.service';
import { Role } from '../../model/role';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrl: './role.component.css'
})
export class RoleComponent implements OnInit {

  roles: Role[] = [];
  newRole: Role = { id: 0, name: '' };
  constructor(private roleService: RoleService) { }

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles(): void {
    this.roleService.getAllRoles().subscribe(
      roles => {
        this.roles = roles;
      },
      error => {
        console.log('Error fetching roles:', error);
      }
    );
  }

  createRole(): void {
    this.roleService.createRole(this.newRole).subscribe(
      newRole => {
        this.roles.push(newRole);
        this.newRole = { name: '' }; // Reset new role object
      },
      error => {
        console.log('Error creating role:', error);
      }
    );
  }

  updateRole(role: Role): void {
    if (role.id !== undefined) {
      this.roleService.updateRole(role.id, role).subscribe(
        updatedRole => {
          // Optional: Handle success response
        },
        error => {
          console.log('Error updating role:', error);
        }
      );
    }
  }

  deleteRole(role: Role): void {
    if (role.id !== undefined) {
      this.roleService.deleteRole(role.id).subscribe(
        () => {
          this.roles = this.roles.filter(r => r.id !== role.id);
        },
        error => {
          console.log('Error deleting role:', error);
        }
      );
    }
  }

}