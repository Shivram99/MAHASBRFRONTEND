import { Component, OnInit } from '@angular/core';
import { NICCategory } from '../../../../interface/niccategory';
import { NICCategoryService } from '../../../../services/NIC/niccategory.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-niccategory-list',
  standalone: false,
  templateUrl: './niccategory-list.component.html',
  styleUrl: './niccategory-list.component.css'
})
export class NICCategoryListComponent implements OnInit {

  categories: NICCategory[] = [];
  filteredCategories: NICCategory[] = [];
  pagedCategories: NICCategory[] = [];

  loading = true;
  searchText = "";
  currentPage = 1;
  pageSize = 5;
  totalItems = 0;

  // ➕ NEW: Add/Edit Form
  showForm = false;
  isEditMode = false;
  categoryForm!: FormGroup;

  constructor(
    private categoryService: NICCategoryService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCategories();
  }

  /** Initialize Reactive Form */
  initForm() {
    this.categoryForm = this.fb.group({
      categoryCode: ['', Validators.required],
      description: ['', Validators.required],
      isActive: ['Y']
    });
  }

  /** Load all categories */
  loadCategories(): void {
    this.loading = true;

    this.categoryService.getAllCategories().subscribe({
      next: (res) => {
        if (res.success && Array.isArray(res.data)) {
          this.categories = [...res.data];
          this.filteredCategories = [...this.categories];
          this.totalItems = this.filteredCategories.length;
          this.setPage(1);
        }
        this.loading = false;
      },
      error: (err) => {
        console.error("Error loading categories:", err);
        this.loading = false;
      }
    });
  }

  /** Start Adding New Category */
  startAdd() {
    this.showForm = true;
    this.isEditMode = false;
    this.categoryForm.reset({ isActive: 'Y' });
  }

  /** Edit Existing Category */
  editCategory(category: NICCategory): void {
    this.showForm = true;
    this.isEditMode = true;
    this.categoryForm.patchValue(category);
  }

  /** Cancel Add/Edit Form */
  cancelForm() {
    this.showForm = false;
  }

  /** Save Category (Add or Update) */
  saveCategory() {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    const dto = this.categoryForm.value;

    const request = this.isEditMode
      ? this.categoryService.updateCategory(dto.categoryCode, dto)
      : this.categoryService.createCategory(dto);

    request.subscribe({
      next: () => {
        Swal.fire(
          'Success',
          `Category ${this.isEditMode ? 'updated' : 'created'} successfully`,
          'success'
        );
        this.showForm = false;
        this.loadCategories();
      },
      error: () => Swal.fire('Error', 'Operation failed', 'error')
    });
  }

  /** Search Filter */
  onSearchChange(): void {
    const filter = this.searchText.toLowerCase();

    this.filteredCategories = this.categories.filter(item =>
      item.categoryCode.toLowerCase().includes(filter) ||
      item.description.toLowerCase().includes(filter)
    );

    this.totalItems = this.filteredCategories.length;
    this.setPage(1);
  }

  /** Pagination */
  setPage(page: number): void {
    this.currentPage = page;

    const start = (page - 1) * this.pageSize;
    this.pagedCategories = this.filteredCategories.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  /** Activate / Deactivate Category */
  toggleStatus(category: NICCategory): void {

    const action = category.isActive === 'Y' ? 'deactivate' : 'activate';

    Swal.fire({
      title: `Are you sure you want to ${action}?`,
      text: `Category: ${category.categoryCode}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: `Yes, ${action}!`,
    }).then((result) => {

      if (result.isConfirmed) {

        this.loading = true;

        this.categoryService.toggleStatus(category.categoryCode).subscribe({
          next: () => {
            Swal.fire('Success!', `Category ${action}d successfully`, 'success');
            this.loadCategories();
          },
          error: () => {
            this.loading = false;
            Swal.fire("Error", "Something went wrong", "error");
          }
        });

      }

    });
  }
}