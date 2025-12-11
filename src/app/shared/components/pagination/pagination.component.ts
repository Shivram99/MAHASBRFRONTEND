import { Component, EventEmitter, Input, Output } from '@angular/core';


@Component({
  selector: 'app-pagination',
  standalone: false,
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent {

  @Input() totalItems: number = 0;
  @Input() pageSize: number = 10;
  @Input() currentPage: number = 1;
  @Input() windowSize: number = 5;

  @Output() pageChanged = new EventEmitter<number>();

  jumpPage: any = ""; // for input box

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  // Dynamic sliding window
  get pageWindow(): number[] {
    const pages: number[] = [];
    const half = Math.floor(this.windowSize / 2);

    let start = Math.max(1, this.currentPage - half);
    let end = Math.min(this.totalPages, start + this.windowSize - 1);

    if (end - start + 1 < this.windowSize) {
      start = Math.max(1, end - this.windowSize + 1);
    }

    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }

  setPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.pageChanged.emit(page);
  }

  goToFirst() { this.setPage(1); }
  goToLast() { this.setPage(this.totalPages); }
  goToPrev() { this.setPage(this.currentPage - 1); }
  goToNext() { this.setPage(this.currentPage + 1); }

  // Jump-To-Page Handler
  jumpToPage(): void {
    let page = Number(this.jumpPage);

    if (!page || page < 1) page = 1;
    if (page > this.totalPages) page = this.totalPages;

    this.jumpPage = "";
    this.setPage(page);
  }
}
