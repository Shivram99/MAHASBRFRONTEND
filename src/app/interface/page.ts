export interface Page<T> {
    content: T[];       // Array of DTO objects
    pageable: any;      // Pagination metadata (can be more specific if needed)
    totalPages: number; // Total number of pages
    totalElements: number; // Total number of items
    last: boolean;      // Whether it's the last page
    size: number;       // Number of items in the current page
    number: number;     // Current page number
    sort: any;          // Sorting information (if applicable)
    numberOfElements: number; // Number of items currently on this page
    first: boolean;     // Whether it's the first page
    empty: boolean;     // Whether the content is empty
  }
  