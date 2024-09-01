import { Component } from '@angular/core';
import { MstRegistryDetailsPage } from '../../model/mst-registry-details-page';
import { FileUploadService } from '../../services/file-upload.service';
import { Router } from '@angular/router';
import { PaginatedResponse } from '../../interface/paginated-response';

@Component({
  selector: 'app-concerndetails',
  templateUrl: './concerndetails.component.html',
  styleUrl: './concerndetails.component.css'
})
export class ConcerndetailsComponent {
  concernDetails: MstRegistryDetailsPage[]=[];
  selectComponent: string | undefined;
  currentPage: number = 0;
  pageSize: number = 10; // Default page size
  totalPages: number = 0;
  totalElements: number = 0;
  pageSizeOptions: number[] = [5, 10, 20, 50]; // Options for page size
  sortBy: string = 'siNo'; // Default sorting parameter
  constructor(private fileUploadService:FileUploadService,private router: Router) {}
  ngOnInit(): void {

    this.loadConcernDetails(this.currentPage, this.pageSize, this.sortBy);

  }

  loadConcernDetails(page: number, size: number, sortBy: string):void{
    this.fileUploadService.getConcernDetailsPage(page, size, sortBy).subscribe(
    (response: PaginatedResponse<MstRegistryDetailsPage>) => { // Expecting an array of MstRegistryDetailsPage
      this.concernDetails = response.content;
      this.totalPages = response.totalPages;
      this.totalElements = response.totalElements;
    },
    error => {
      console.error('Error submitting form', error);
      
    });
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadConcernDetails(this.currentPage, this.pageSize, this.sortBy);
    }
  }

  // Function to handle changes in page size
  onPageSizeChange(event: Event): void {
    const newPageSize = +(event.target as HTMLSelectElement).value; // Typecast and convert to number
    if (newPageSize !== this.pageSize) {
      this.pageSize = newPageSize;
      this.currentPage = 0; // Reset to the first page on page size change
      this.loadConcernDetails(this.currentPage, this.pageSize, this.sortBy);
    }
  }

  // Function to handle changes in sorting criteria
  onSortByChange(sortBy: string): void {
    if (sortBy !== this.sortBy) {
      this.sortBy = sortBy;
      this.currentPage = 0; // Optionally reset to the first page on sort change
      this.loadConcernDetails(this.currentPage, this.pageSize, this.sortBy);
    }
  }
  get pages(): number[] {
    const pagesToShow = 10; // Max number of pages to show
    const pages = [];

    // Determine the range of pages to show
    const startPage = Math.max(0, this.currentPage - Math.floor(pagesToShow / 2));
    const endPage = Math.min(this.totalPages, startPage + pagesToShow);

    // Adjust start page if endPage is near the end of totalPages
    const adjustedStartPage = Math.max(0, endPage - pagesToShow);

    for (let i = adjustedStartPage; i < endPage; i++) {
      pages.push(i);
    }

    // Include the last page if not already included
    if (pages[pages.length - 1] < this.totalPages - 1) {
      pages.push(this.totalPages - 1);
    }

    return pages;
  }

  // Function to navigate to the first page
  goToFirstPage(): void {
    this.goToPage(0);
  }

  // Function to navigate to the last page
  goToLastPage(): void {
    this.goToPage(this.totalPages - 1);
  }

  // Function to navigate to the previous page
  goToPreviousPage(): void {
    if (this.currentPage > 0) {
      this.goToPage(this.currentPage - 1);
    }
  }

  // Function to navigate to the next page
  goToNextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.goToPage(this.currentPage + 1);
    }
  }
}
