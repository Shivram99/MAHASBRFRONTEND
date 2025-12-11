import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NICDivision } from '../../../../interface/nicdivision';
import { NICCategory } from '../../../../interface/niccategory';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NICCategoryService } from '../../../../services/NIC/niccategory.service';
import { NICDivisionService } from '../../../../services/NIC/nicdivision.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-nicdivision-list',
  standalone: false,
  templateUrl: './nicdivision-list.component.html',
  styleUrl: './nicdivision-list.component.css'
})
export class NICDivisionListComponent implements OnInit {
  
  divisions: NICDivision[] = [];
  filteredDivisions: NICDivision[] = [];
  pagedDivisions: NICDivision[] = [];

  categories: NICCategory[] = [];

  loading = true;
  searchText = "";
  currentPage = 1;
  pageSize = 5;
  totalItems = 0;

  showForm = false;
  isEditMode = false;
  divisionForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private divisionService: NICDivisionService,
    private categoryService: NICCategoryService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCategories();
    this.loadDivisions();
  }

  // ------------------ FORM ------------------

  initForm(): void {
    this.divisionForm = this.fb.group({
      divisionCode: ['', Validators.required],
      description: ['', Validators.required],
      categoryCode: ['', Validators.required],
      isActive: ['Y']
    });
  }

  startAdd(): void {
    this.showForm = true;
    this.isEditMode = false;
    this.divisionForm.reset({ isActive: 'Y' });
  }

  editDivision(item: NICDivision): void {
    this.showForm = true;
    this.isEditMode = true;

    this.divisionForm.patchValue({
      divisionCode: item.divisionCode,
      description: item.description,
      categoryCode: item.categoryCode,
      isActive: item.isActive
    });
  }

  cancelForm(): void {
    this.showForm = false;
  }

  saveDivision(): void {
    if (this.divisionForm.invalid) {
      this.divisionForm.markAllAsTouched();
      return;
    }

    const dto = this.divisionForm.value;

    const request = this.isEditMode
      ? this.divisionService.update(dto.divisionCode, dto)
      : this.divisionService.create(dto);

    request.subscribe({
      next: () => {
        Swal.fire('Success', `Division ${this.isEditMode ? 'updated' : 'created'} successfully`, 'success');
        this.showForm = false;
        this.loadDivisions();
      },
      error: () => Swal.fire('Error', 'Operation failed', 'error')
    });
  }

  // ------------------ LOAD DATA ------------------

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe(res => {
      if (res.success) this.categories = res.data;
    });
  }

  loadDivisions(): void {
    this.loading = true;

    this.divisionService.getAll().subscribe({
      next: (res) => {
        if (res.success) {
          this.divisions = res.data;
          this.filteredDivisions = [...this.divisions];
          this.totalItems = this.filteredDivisions.length;
          this.setPage(1);
        }
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  // ------------------ SEARCH ------------------

  onSearchChange(): void {
    const f = this.searchText.toLowerCase();

    this.filteredDivisions = this.divisions.filter(
      x =>
        x.divisionCode.toLowerCase().includes(f) ||
        x.description.toLowerCase().includes(f)
    );

    this.totalItems = this.filteredDivisions.length;
    this.setPage(1);
  }

  // ------------------ PAGINATION ------------------

  setPage(page: number): void {
    this.currentPage = page;

    const start = (page - 1) * this.pageSize;
    const end = start + this.pageSize;

    this.pagedDivisions = this.filteredDivisions.slice(start, end);
  }

  // Called by pagination component
  onPageChanged(page: number): void {
    this.setPage(page);
  }

  // ------------------ STATUS TOGGLE ------------------

  toggleStatus(item: NICDivision): void {
    const action = item.isActive === 'Y' ? 'deactivate' : 'activate';

    Swal.fire({
      title: `Are you sure you want to ${action}?`,
      text: `Division Code: ${item.divisionCode}`,
      icon: 'warning',
      showCancelButton: true
    }).then(result => {
      if (result.isConfirmed) {
        this.divisionService.toggleStatus(item.divisionCode).subscribe({
          next: () => {
            Swal.fire('Success', `Division ${action}d`, 'success');
            this.loadDivisions();
          }
        });
      }
    });
  }

  selectedCategory: string = "";

  filterByCategory(): void {
  let filterText = this.searchText.toLowerCase();

  this.filteredDivisions = this.divisions.filter(div => {

    const matchesCategory =
      !this.selectedCategory ||
      div.categoryCode === this.selectedCategory;

    const matchesSearch =
      div.divisionCode.toLowerCase().includes(filterText) ||
      div.description.toLowerCase().includes(filterText);

    return matchesCategory && matchesSearch;
  });

  this.totalItems = this.filteredDivisions.length;
  this.setPage(1);
}

}