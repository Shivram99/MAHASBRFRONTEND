import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RoleService } from '../../../services/role.service';
import { Role } from '../../../model/role';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-role-list',
  standalone: false,
  templateUrl: './role-list.component.html',
  styleUrl: './role-list.component.css'
})
export class RoleListComponent implements OnInit {

  roles: Role[] = [];
  filteredRoles: Role[] = [];
  pagedRoles: Role[] = [];

  searchText = "";
  loading = true;

  // Pagination
  currentPage = 1;
  pageSize = 5;
  totalItems = 0;

  // Add/Edit form
  showForm = false;
  isEditMode = false;
  roleForm!: FormGroup;

  constructor(
    private roleService: RoleService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.initForm();
    this.loadRoles();
  }

  initForm() {
    this.roleForm = this.fb.group({
      id: [''],
      name: ['', Validators.required]
    });
  }

  loadRoles() {
    this.loading = true;

    this.roleService.getAll().subscribe({
      next: (res) => {
        if (res.success) {
          this.roles = res.data;
          this.filteredRoles = [...this.roles];
          this.totalItems = this.filteredRoles.length;
          this.setPage(1);
        }
        this.loading = false;
      },
      error: () => (this.loading = false)
    });
  }

  // Search
  onSearch() {
    const text = this.searchText.toLowerCase();

    this.filteredRoles = this.roles.filter(r =>
      r.name.toLowerCase().includes(text)
    );

    this.totalItems = this.filteredRoles.length;
    this.setPage(1);
  }

  // Pagination
  setPage(page: number) {
    this.currentPage = page;
    const start = (page - 1) * this.pageSize;
    this.pagedRoles = this.filteredRoles.slice(start, start + this.pageSize);
  }

  // Add
  startAdd() {
    this.showForm = true;
    this.isEditMode = false;
    this.roleForm.reset();
  }

  // Edit
  edit(role: Role) {
    this.showForm = true;
    this.isEditMode = true;
    this.roleForm.patchValue(role);
  }

  // Cancel
  cancel() {
    this.showForm = false;
  }

  // Save
  save() {
    if (this.roleForm.invalid) return;

    const dto = this.roleForm.value;

    const request = this.isEditMode
      ? this.roleService.update(dto.id, dto)
      : this.roleService.create(dto);

    request.subscribe({
      next: () => {
        Swal.fire("Success", `Role ${this.isEditMode ? 'updated' : 'created'} successfully`, "success");
        this.showForm = false;
        this.loadRoles();
      },
      error: () => Swal.fire("Error", "Something went wrong", "error")
    });
  }

  // Delete
  delete(role: Role) {
    Swal.fire({
      title: "Are you sure?",
      text: `Delete role: ${role.name}?`,
      icon: "warning",
      showCancelButton: true
    }).then(result => {
      if (result.isConfirmed) {
        this.roleService.delete(role.id!).subscribe({
          next: () => {
            Swal.fire("Deleted!", "Role deleted successfully", "success");
            this.loadRoles();
          }
        });
      }
    });
  }
}