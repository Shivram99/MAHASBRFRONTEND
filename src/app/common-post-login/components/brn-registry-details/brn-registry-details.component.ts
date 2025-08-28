import { Component } from '@angular/core';
import { MstRegistryDetailsPage } from '../../../model/mst-registry-details-page'; 
import { FileUploadService } from '../../../services/file-upload.service'; 
import { PaginatedResponse } from '../../../interface/paginated-response'; 
import { ActivatedRoute, Router } from '@angular/router';
import { DetailsPageDTO } from '../../../interface/details-page-dto'; 
import { DataService } from '../../../services/dashboard/data-service.service'; 

@Component({
  selector: 'app-brn-registry-details',
  standalone: false,
  templateUrl: './brn-registry-details.component.html',
  styleUrl: './brn-registry-details.component.css'
})
export class BRNregistoryDetailsComponent {
  //filter variable data

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
    private fileUploadService: FileUploadService,
    private router: Router,
    private dataService: DataService,
    private route: ActivatedRoute
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
    // this.router.navigate(['dashboard-brn-details', brnNo], { relativeTo: this.route });

    this.router.navigate(['common-post-login/dashboard-brn-details', brnNo]);
  }

  loadRegistryDetails(page: number, size: number, sortBy: string): void {
    this.fileUploadService.getRegistryDetailsPage(page, size, sortBy).subscribe(
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

// searchBRN() {
//   if (this.BNR) {
//     this.fileUploadService.getBRNDetails(page: number, size: number,this.BNR).subscribe(
//       (response: PaginatedResponse<MstRegistryDetailsPage>) => {
//         this.totalPages = response.totalPages;
//         this.totalElements = response.totalElements;
//         this.registryDetails = response.content;
//         console.log(this.tableData1);
//       },
//       (error) => {
//         this.tableData1 = [];
//         this.totalElements = 0;
//       }
//     );
//   }
// }

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

