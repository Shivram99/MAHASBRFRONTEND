import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { NICClassService } from '../../../../services/NIC/nicclass.service';
import { NICGroupService } from '../../../../services/NIC/nicgroup.service';
import { NICGroup } from '../../../../interface/nicgroup';
import { NICClass } from '../../../../interface/nicclass';

@Component({
  selector: 'app-nicclass-list',
  standalone: false,
  templateUrl: './nicclass-list.component.html',
  styleUrl: './nicclass-list.component.css'
})
export class NICClassListComponent implements OnInit {

  classes: NICClass[] = [];
  filteredClasses: NICClass[] = [];
  pagedClasses: NICClass[] = [];

  groups: NICGroup[] = [];

  searchText = '';
  selectedGroup = '';

  showForm = false;
  isEditMode = false;
  classForm!: FormGroup;

  currentPage = 1;
  pageSize = 10;
  totalItems = 0;

  constructor(
    private fb: FormBuilder,
    private classService: NICClassService,
    private groupService: NICGroupService
  ) {}

  ngOnInit() {
    this.initForm();
    this.loadGroups();
    this.loadClasses();
  }

  initForm() {
    this.classForm = this.fb.group({
      classCode: ['', Validators.required],
      description: ['', Validators.required],
      groupCode: ['', Validators.required],
      isActive: ['Y']
    });
  }

  loadGroups() {
    this.groupService.getAll().subscribe(res => {
      if (res.success) this.groups = res.data;
    });
  }

  loadClasses() {
    this.classService.getAll().subscribe(res => {
      if (res.success) {
        this.classes = res.data;
        this.applyFilters();
      }
    });
  }

  applyFilters() {
    let data = [...this.classes];

    if (this.searchText) {
      const f = this.searchText.toLowerCase();
      data = data.filter(x =>
        x.classCode.toLowerCase().includes(f) ||
        x.description.toLowerCase().includes(f)
      );
    }

    if (this.selectedGroup) {
      data = data.filter(x => x.groupCode === this.selectedGroup);
    }

    this.filteredClasses = data;
    this.totalItems = data.length;
    this.setPage(1);
  }

  startAdd() {
    this.showForm = true;
    this.isEditMode = false;
    this.classForm.reset({ isActive: 'Y' });
  }

  editClass(item: NICClass) {
    this.showForm = true;
    this.isEditMode = true;
    this.classForm.patchValue(item);
  }

  cancelForm() {
    this.showForm = false;
  }

  saveClass() {
    if (this.classForm.invalid) {
      this.classForm.markAllAsTouched();
      return;
    }

    const dto = this.classForm.value;

    const apiCall = this.isEditMode
      ? this.classService.update(dto.classCode, dto)
      : this.classService.create(dto);

    apiCall.subscribe({
      next: () => {
        Swal.fire('Success', 'Saved successfully', 'success');
        this.showForm = false;
        this.loadClasses();
      },
      error: () => Swal.fire('Error', 'Operation failed', 'error')
    });
  }

  toggleStatus(item: NICClass) {
    const action = item.isActive === 'Y' ? 'deactivate' : 'activate';

    Swal.fire({
      title: `Are you sure to ${action}?`,
      text: `Class: ${item.classCode}`,
      icon: 'warning',
      showCancelButton: true
    }).then(result => {
      if (result.isConfirmed) {
        this.classService.toggleStatus(item.classCode).subscribe(() => {
          Swal.fire('Updated', `Class ${action}d`, 'success');
          this.loadClasses();
        });
      }
    });
  }

  setPage(page: number) {
    this.currentPage = page;
    const start = (page - 1) * this.pageSize;
    this.pagedClasses = this.filteredClasses.slice(start, start + this.pageSize);
  }
}
