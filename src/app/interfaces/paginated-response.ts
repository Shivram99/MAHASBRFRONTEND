export interface PaginatedResponse <T> {

  content: T[];          // The actual data list for the current page
  totalElements: number; // Total number of elements across all pages
  totalPages: number;    // Total number of pages
  size: number;          // Number of elements per page (page size)
  number: number;        // Current page number (0-indexed)
  numberOfElements: number; // Number of elements in the current page
  first: boolean;        // Is this the first page?
  last: boolean;         // Is this the last page?
  empty: boolean;        // Is this page empty?
  //sort: Sort;            // Sorting criteria
 // pageable: Pageable;    // Pageable object with pagination information

}
