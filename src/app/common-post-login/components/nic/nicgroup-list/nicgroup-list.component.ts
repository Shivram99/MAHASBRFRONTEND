import { Component, OnInit } from '@angular/core';
import { NICGroup } from '../../../../interface/nicgroup';
import { NICDivision } from '../../../../interface/nicdivision';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NICDivisionService } from '../../../../services/NIC/nicdivision.service';
import Swal from 'sweetalert2';
import { NICGroupService } from '../../../../services/NIC/nicgroup.service';

@Component({
  selector: 'app-nicgroup-list',
  standalone: false,
  templateUrl: './nicgroup-list.component.html',
  styleUrl: './nicgroup-list.component.css'
})
export class NICGroupListComponent implements OnInit {

  groups: NICGroup[] = [];
  filteredGroups: NICGroup[] = [];
  pagedGroups: NICGroup[] = [];

  divisions: NICDivision[] = [];

  // ui state
  loading = true;
  showForm = false;
  isEditMode = false;

  // paging / search / filter
  searchText = '';
  selectedDivision = '';
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;

  // form
  groupForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private groupService: NICGroupService,
    private divisionService: NICDivisionService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadDivisions();
    this.loadGroups();
  }

  private initForm(): void {
    this.groupForm = this.fb.group({
      groupCode: ['', Validators.required],
      description: ['', Validators.required],
      divisionCode: ['', Validators.required],
      isActive: ['Y']
    });
  }

  // --------- Load data ----------
  loadDivisions(): void {
    this.divisionService.getAll().subscribe({
      next: (res) => { if (res.success) this.divisions = res.data; },
      error: () => {}
    });
  }

  loadGroups(): void {
    this.loading = true;
    this.groupService.getAll().subscribe({
      next: (res) => {
        if (res.success && Array.isArray(res.data)) {
          // console.log("Groups JSON:", JSON.stringify(res.data, null, 2));
          this.groups = res.data;
          this.applyFilters();
        }
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  // --------- Add / Edit ----------
  startAdd(): void {
    this.showForm = true;
    this.isEditMode = false;
    this.groupForm.reset({ isActive: 'Y' });
  }

  editGroup(item: NICGroup): void {
    this.showForm = true;
    this.isEditMode = true;
    this.groupForm.patchValue({
      groupCode: item.groupCode,
      description: item.description,
      divisionCode: item.divisionCode,
      isActive: item.isActive
    });
  }

  cancelForm(): void {
    this.showForm = false;
  }

  saveGroup(): void {
    if (this.groupForm.invalid) {
      this.groupForm.markAllAsTouched();
      return;
    }

    const dto: NICGroup = this.groupForm.value;

    const request = this.isEditMode
      ? this.groupService.update(dto.groupCode, dto)
      : this.groupService.create(dto);

    this.loading = true;
    request.subscribe({
      next: () => {
        Swal.fire('Success', `Group ${this.isEditMode ? 'updated' : 'created'} successfully`, 'success');
        this.showForm = false;
        this.loadGroups();
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        Swal.fire('Error', 'Operation failed', 'error');
      }
    });
  }

  // --------- Search / Filter ----------
  onSearchChange(): void {
    this.applyFilters();
  }

  filterByDivision(): void {
    this.applyFilters();
  }

  private applyFilters(): void {
    const q = this.searchText?.trim().toLowerCase() || '';
    this.filteredGroups = this.groups.filter(g => {
      const matchesDivision = !this.selectedDivision || g.divisionCode === this.selectedDivision;
      const matchesSearch = !q ||
        g.groupCode.toLowerCase().includes(q) ||
        g.description.toLowerCase().includes(q);
      return matchesDivision && matchesSearch;
    });

    this.totalItems = this.filteredGroups.length;
    this.setPage(1);
  }

  // --------- Pagination ----------
  setPage(page: number): void {
    if (page < 1) return;
    this.currentPage = page;
    const start = (page - 1) * this.pageSize;
    this.pagedGroups = this.filteredGroups.slice(start, start + this.pageSize);
  }

  onPageChanged(page: number): void {
    this.setPage(page);
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
    this.setPage(1);
  }

  // --------- Toggle status ----------
  toggleStatus(item: NICGroup): void {
    const action = item.isActive === 'Y' ? 'deactivate' : 'activate';
    Swal.fire({
      title: `Are you sure you want to ${action}?`,
      text: `Group: ${item.groupCode}`,
      icon: 'warning',
      showCancelButton: true
    }).then(result => {
      if (result.isConfirmed) {
        this.groupService.toggleStatus(item.groupCode).subscribe({
          next: () => {
            Swal.fire('Success', `Group ${action}d`, 'success');
            this.loadGroups();
          },
          error: (err) => {
            console.error(err);
            Swal.fire('Error', 'Operation failed', 'error');
          }
        });
      }
    });
  }

  // optional hard delete (call only if you intend)
  deleteGroup(item: NICGroup): void {
    Swal.fire({
      title: `Delete group ${item.groupCode}?`,
      text: 'This will permanently delete the group.',
      icon: 'warning',
      showCancelButton: true
    }).then(result => {
      if (result.isConfirmed) {
        this.groupService.delete(item.groupCode).subscribe({
          next: () => {
            Swal.fire('Deleted', 'Group removed', 'success');
            this.loadGroups();
          },
          error: (err) => {
            console.error(err);
            Swal.fire('Error', 'Delete failed', 'error');
          }
        });
      }
    });
  }
}