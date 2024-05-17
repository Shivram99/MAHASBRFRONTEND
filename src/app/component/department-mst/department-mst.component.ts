import { Component, OnInit } from '@angular/core';
import { DepartmentMst } from '../../model/department-mst';
import { DepartmentMstService } from '../../services/department-mst.service';

@Component({
  selector: 'app-department-mst',
  templateUrl: './department-mst.component.html',
  styleUrl: './department-mst.component.css'
})
export class DepartmentMstComponent implements OnInit {

  departments: DepartmentMst[] = [];
  newDepartment: DepartmentMst = new DepartmentMst(); // New department object to bind form inputs

  constructor(private departmentService: DepartmentMstService) { }

  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments(): void {
    this.departmentService.getAllDepartments().subscribe(
      departments => {
        this.departments = departments;
      },
      error => {
        console.log('Error fetching departments:', error);
      }
    );
  }

  createDepartment(department: DepartmentMst): void {
    this.departmentService.createDepartment(department).subscribe(
      newDepartment => {
        this.departments.push(newDepartment);
        this.resetForm();
      },
      error => {
        console.log('Error creating department:', error);
      }
    );
  }

  updateDepartment(department: DepartmentMst): void {
    this.departmentService.updateDepartment(department.departmentId, department).subscribe(
      updatedDepartment => {
        const index = this.departments.findIndex(d => d.departmentId === updatedDepartment.departmentId);
        if (index !== -1) {
          this.departments[index] = updatedDepartment;
        }
        this.resetForm();
      },
      error => {
        console.log('Error updating department:', error);
      }
    );
  }

  deleteDepartment(id: number): void {
    this.departmentService.deleteDepartment(id).subscribe(
      () => {
        this.departments = this.departments.filter(d => d.departmentId !== id);
      },
      error => {
        console.log('Error deleting department:', error);
      }
    );
  }

  onSubmit(): void {
    if (this.newDepartment.departmentId) {
      this.updateDepartment(this.newDepartment);
    } else {
      this.createDepartment(this.newDepartment);
    }
  }

  resetForm(): void {
    this.newDepartment = new DepartmentMst();
  }
}