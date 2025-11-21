import { Component } from '@angular/core';
import { MstRegistryDetailsPage } from '../../model/mst-registry-details-page';
import { PaginatedResponse } from '../../interface/paginated-response';
import { FileUploadService } from '../../services/file-upload.service';
import { Router } from '@angular/router';
import { DataService } from '../../services/dashboard/data-service.service';
import { DetailsPageDTO } from '../../interface/details-page-dto';
import { RegionBrnDetailsService } from '../../services/region-brn-details.service';
import { catchError, throwError } from 'rxjs';

@Component({
    selector: 'app-region-brndetails',
    templateUrl: './region-brndetails.component.html',
    styleUrl: './region-brndetails.component.css',
    standalone: false
})
export class RegionBRNDetailsComponent {
  districts: { id: number; name: string }[] = [];
  talukas: { id: number; name: string }[] = [];

  selectedTaluka: { id: number; name: string }[] = [];
  selectedDistrict: { id: number; name: string }[] = [];

  selectedTalukaIds: number[]=[];
  selectedDistrictIds: number[]=[];

  tableData1: DetailsPageDTO[] = [];
  BNR: any;
  filters = {
    registerDateFrom: '',
    registerDateTo: '',
  };

  //filter variable end

  registryDetails: MstRegistryDetailsPage[] = [];
  selectComponent: string | undefined;
  currentPage: number = 0;
  pageSize: number = 10; // Default page size
  totalPages: number = 0;
  totalElements: number = 0;
  pageSizeOptions: number[] = [5, 10, 20, 50]; // Options for page size
  sortBy: string = 'siNo'; // Default sorting parameter
  constructor(
    private regionBrnDetailsService: RegionBrnDetailsService,
    private fileUploadService: FileUploadService,
    private router: Router,
    private dataService: DataService
  ) {}
  ngOnInit(): void {
    this.loadRegistryDetails(this.currentPage, this.pageSize, this.sortBy);
    this.fetchDistricts();
  }

  fetchDistricts(): void {
    this.dataService.getAllDistricts().subscribe((districts1) => {
      this.districts = districts1.map((district) => ({
        id: district.censusDistrictCode, // Assuming `censusDistrictCode` is the ID
        name: district.districtName, // Assuming `districtName` is the name
      }));
    });
  }
  //Call on chage the district
  onChangeFunction(event: any) {
    const selectedValue = event.target.value;
    this.fetchTalukas(selectedValue);

    this.applyFilters();
  }
  // load the talukas

  applyFilters() {
    this.postLoginDashboardData(this.currentPage, this.pageSize, this.sortBy);
  }
  
  goToDetails(brnNo: string) {
    console.log("brnNo "+brnNo)
    this.router.navigate(['des-region/dashboard-details', brnNo]);
  }

  loadRegistryDetails(page: number, size: number, sortBy: string): void {
    this.regionBrnDetailsService.getRegistryDetailsPage(page, size, sortBy)
  .pipe(
    catchError((error) => {
      let errorMsg = 'Something went wrong. Please try again later.';

      if (error.status === 0) {
        errorMsg = 'Server not reachable. Please check your connection.';
      } else if (error.status === 404) {
        errorMsg = 'Requested resource not found.';
      } else if (error.status === 401) {
        errorMsg = 'Unauthorized access. Please log in again.';
      } else if (error.status === 500) {
        errorMsg = 'Internal server error occurred.';
      }

      // Optionally show a toast/snackbar alert
      console.error('Global Error:', error);
      alert(errorMsg);

      return throwError(() => new Error(errorMsg));
    })
  )
  .subscribe({
    next: (response: PaginatedResponse<MstRegistryDetailsPage>) => {
      console.log(response.content);
      this.registryDetails = response.content;
      this.totalPages = response.totalPages;
      this.totalElements = response.totalElements;
    },
    error: (error) => {
      console.error('Error handled:', error.message);
    }
  });
  }

  goToPage(page: number): void {
    this.currentPage = page;
    if (this.selectedDistrictIds.length === 0){
      this.loadRegistryDetails(this.currentPage, this.pageSize, this.sortBy);
     console.log("loadRegistryDetails")
    }
      else{
      this.postLoginDashboardData(this.currentPage, this.pageSize, this.sortBy);
      }
  }

  onPageSizeChange(event: any): void {
    this.pageSize = event.target.value;
    this.currentPage = 0; // Reset to first page whenever the page size changes
    if (this.selectedDistrictIds.length === 0){
      this.loadRegistryDetails(this.currentPage, this.pageSize, this.sortBy);
     console.log("loadRegistryDetails")
    }
      else{
      this.postLoginDashboardData(this.currentPage, this.pageSize, this.sortBy);
      console.log("loadRegistryDetails 1");
      
      }
  }

  onSortByChange(sortBy: string): void {
    this.sortBy = sortBy;
    if (this.selectedDistrictIds.length === 0){
      this.loadRegistryDetails(this.currentPage, this.pageSize, this.sortBy);
     console.log("loadRegistryDetails")
    }
      else{
      this.postLoginDashboardData(this.currentPage, this.pageSize, this.sortBy);
      console.log("loadRegistryDetails 1");
      }
  }
  //

  onSelectionTalukaChange(selectedItems: { id: number; name: string }[]) {
    this.selectedTaluka = selectedItems;
    this.selectedTalukaIds =
      selectedItems.length > 0 ? selectedItems.map((item) => item.id) : [];
    this.applyFilters();
  }

  onSelectionDistrictChange(selectedItems: { id: number; name: string }[]) {
    this.selectedDistrict = selectedItems;

    this.selectedDistrictIds =
      selectedItems.length > 0 ? selectedItems.map((item) => item.id) : [];
    this.fetchTalukas(this.selectedDistrictIds);
    this.applyFilters();
    //console.log('Selected Items:', this.selectedItems);
  }

  fetchTalukas(selectedValue: any): void {
    this.dataService.getAllTaluka(selectedValue).subscribe((talukas1) => {
      this.talukas = talukas1.map((talukas) => ({
        id: talukas.censusTalukaCode,
        name: talukas.talukaName,
      }));
      
    });
  }

  postLoginDashboardData(page: number, size: number, sortBy: string){
    
  this.fileUploadService.postLoginDashboardData(page, size, sortBy,this.selectedDistrictIds,this.selectedTalukaIds,this.filters).subscribe(
    (response: PaginatedResponse<MstRegistryDetailsPage>) => {
      // Expecting an array of MstRegistryDetailsPage
      this.registryDetails = response.content;
      this.totalPages = response.totalPages;
      this.totalElements = response.totalElements;
    },
    (error) => {
      console.error('Error submitting form', error);
    }
  );
}

searchBRN() {
    if (this.BNR) {
      this.fileUploadService.getBRNDetails(this.BNR).subscribe(
        (response: PaginatedResponse<MstRegistryDetailsPage>) => {
          // Expecting an array of MstRegistryDetailsPage
          this.registryDetails = response.content;
          this.totalPages = response.totalPages;
          this.totalElements = response.totalElements;
        },
        (error) => {
          console.error('Error to Find the BRN', error);
        }
      );
    }
  }
}
