import { isPlatformBrowser } from '@angular/common';
import { DestroyRef, Directive, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import { PaginatedResponse } from '../interface/paginated-response';
import { MstRegistryDetailsPage } from '../model/mst-registry-details-page';

@Directive()
export abstract class RegistryRecordsPageBase implements OnInit {
  records: MstRegistryDetailsPage[] = [];
  selectComponent: string | undefined;
  currentPage = 0;
  pageSize = 10;
  totalPages = 0;
  totalElements = 0;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  sortBy = 'siNo';

  private readonly isBrowser: boolean;

  protected constructor(
    platformId: object,
    private readonly destroyRef: DestroyRef
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.loadRecords(this.currentPage, this.pageSize, this.sortBy);
  }

  protected abstract fetchRecords(
    page: number,
    size: number,
    sortBy: string
  ): Observable<PaginatedResponse<MstRegistryDetailsPage>>;

  protected loadRecords(page: number, size: number, sortBy: string): void {
    if (!this.isBrowser) {
      return;
    }

    this.fetchRecords(page, size, sortBy)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.records = response.content;
          this.totalPages = response.totalPages;
          this.totalElements = response.totalElements;
        }
      });
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadRecords(this.currentPage, this.pageSize, this.sortBy);
    }
  }

  onPageSizeChange(event: Event): void {
    const newPageSize = +(event.target as HTMLSelectElement).value;
    if (newPageSize !== this.pageSize) {
      this.pageSize = newPageSize;
      this.currentPage = 0;
      this.loadRecords(this.currentPage, this.pageSize, this.sortBy);
    }
  }

  onSortByChange(sortBy: string): void {
    if (sortBy !== this.sortBy) {
      this.sortBy = sortBy;
      this.currentPage = 0;
      this.loadRecords(this.currentPage, this.pageSize, this.sortBy);
    }
  }

  get pages(): number[] {
    const pagesToShow = 10;
    const pages: number[] = [];
    const startPage = Math.max(0, this.currentPage - Math.floor(pagesToShow / 2));
    const endPage = Math.min(this.totalPages, startPage + pagesToShow);
    const adjustedStartPage = Math.max(0, endPage - pagesToShow);

    for (let i = adjustedStartPage; i < endPage; i++) {
      pages.push(i);
    }

    if (pages.length > 0 && pages[pages.length - 1] < this.totalPages - 1) {
      pages.push(this.totalPages - 1);
    }

    return pages;
  }

  goToFirstPage(): void {
    this.goToPage(0);
  }

  goToLastPage(): void {
    this.goToPage(this.totalPages - 1);
  }

  goToPreviousPage(): void {
    if (this.currentPage > 0) {
      this.goToPage(this.currentPage - 1);
    }
  }

  goToNextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.goToPage(this.currentPage + 1);
    }
  }
}
