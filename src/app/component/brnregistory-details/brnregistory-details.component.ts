import { Component } from '@angular/core';
import { MstRegistryDetailsPage } from '../../model/mst-registry-details-page';
import { FileUploadService } from '../../services/file-upload.service';
import { PaginatedResponse } from '../../interface/paginated-response';
import { Router } from '@angular/router';
import { DetailsPageDTO } from '../../interface/details-page-dto';
import { DataService } from '../../services/dashboard/data-service.service';
import { Page } from '../../interface/page';

@Component({
  selector: 'app-brnregistory-details',
  templateUrl: './brnregistory-details.component.html',
  styleUrl: './brnregistory-details.component.css'
})
export class BRNregistoryDetailsComponent {
 //filter variable data

  districts: any[]=[] ;
  talukas:any[]=[];
  tableData1: DetailsPageDTO[] = [];
  BNR:any;
  filters = {
    registerDateFrom: '',
    registerDateTo: '',
    district: [],
    talukas: []
  };

//filter variable end

  registryDetails: MstRegistryDetailsPage[]=[];
  selectComponent: string | undefined;
  currentPage: number = 0;
  pageSize: number = 10; // Default page size
  totalPages: number = 0;
  totalElements: number = 0;
  pageSizeOptions: number[] = [5, 10, 20, 50]; // Options for page size
  sortBy: string = 'siNo'; // Default sorting parameter
  constructor(private fileUploadService:FileUploadService,private router: Router,private dataService: DataService) {}
  ngOnInit(): void {

    this.loadRegistryDetails(this.currentPage, this.pageSize, this.sortBy);
    this.fetchDistricts();
   // this.fetchTalukas();
  }
 
  fetchDistricts(): void {
    this.dataService.getAllDistricts()
      .subscribe(districts1 => {
        this.districts = districts1.map(district => ({
          censusDistrictCode: district.censusDistrictCode,
          districtName: district.districtName,
          censusStateCode: district.censusStateCode
        }));
      //  console.log(" this.districts "+ this.districts)
      });
  }
  //Call on chage the district
  onChangeFunction(event: any) {
    const selectedValue = event.target.value;
    this.fetchTalukas(selectedValue);
    this.applyFilters();  
    }
    // load the talukas 
    fetchTalukas(selectedValue:number): void {
      this.dataService.getAllTaluka(selectedValue)
        .subscribe(talukas1 => {
          this.talukas = talukas1.map(talukas => ({
            censusTalukaCode: talukas.censusTalukaCode,
            talukaName: talukas.talukaName,
            censusDistrictCode: talukas.censusDistrictCode
          }));
  
        });
    }

    applyFilters() {
      console.log(" this.filters :"+this.filters.district +" " +this.filters.talukas)
      // this.dataService.fetchDataWithFilters(this.filters,this.currentPage,this.pageSize).subscribe(
      //   (response: Page<DetailsPageDTO>) => {
      //     this.totalPages = response.totalPages;
      //     this.totalElements = response.totalElements;
      //     this.tableData1 = response.content;
      //     console.log(this.tableData1);
      //   },
      //   (error) => {
      //     console.log("console.log(this.tableData1); "+this.tableData1);
      //     this.tableData1 = [];
      //     this.totalElements = 0;
      //   }
      // );
    }
    searchBRN() {
      if (this.BNR) {
        this.dataService.getBRNDetails(this.BNR).subscribe(
          (response: Page<DetailsPageDTO>) => {
            this.totalPages = response.totalPages;
            this.totalElements = response.totalElements;
            this.tableData1 = response.content;
            console.log(this.tableData1);
          },
          (error) => {
            this.tableData1 = [];
            this.totalElements = 0;
          }
        );
      }
    }
//pagination data
  goToDetails(brnNo: string) {
    this.router.navigate(['citizen-dashboard/dashboard-details', brnNo]);
  }

  loadRegistryDetails(page: number, size: number, sortBy: string):void{
    this.fileUploadService.getRegistryDetailsPage(page, size, sortBy).subscribe(
    (response: PaginatedResponse<MstRegistryDetailsPage>) => { // Expecting an array of MstRegistryDetailsPage
      this.registryDetails = response.content;
      this.totalPages = response.totalPages;
      this.totalElements = response.totalElements;
    },
    error => {
      console.error('Error submitting form', error);
      
    });
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.loadRegistryDetails(this.currentPage, this.pageSize, this.sortBy);
  }

  onPageSizeChange(event: any): void {
    this.pageSize = event.target.value;
    this.currentPage = 0; // Reset to first page whenever the page size changes
    this.loadRegistryDetails(this.currentPage, this.pageSize, this.sortBy);
  }

  onSortByChange(sortBy: string): void {
    this.sortBy = sortBy;
    this.loadRegistryDetails(this.currentPage, this.pageSize, this.sortBy);
  }
}


// getRegistryDetails(talukas: string[], districts: string[], page: number, size: number, sort: string): Observable<Page<MstRegistryDetailsPageEntity>> {
//   let params = new HttpParams()
//     .set('page', page)
//     .set('size', size)
//     .set('sort', sort);

//   // Append talukas and districts to the request parameters
//   talukas.forEach(taluka => params = params.append('talukas', taluka));
//   districts.forEach(district => params = params.append('districts', district));

//   return this.http.get<Page<MstRegistryDetailsPageEntity>>(this.apiUrl, { params });
// }