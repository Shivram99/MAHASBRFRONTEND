import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DistrictServiceService } from '../../services/district-service.service';
import { DataService } from '../../services/dashboard/data-service.service';
import * as XLSX from 'xlsx-js-style';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { DialogService } from '../../services/dashboard/dialog.service';
import { DetailsPageDTO } from '../../interface/details-page-dto';
import { Page } from '../../interface/page';

@Component({
    selector: 'app-dashboardadmin',
    templateUrl: './dashboardadmin.component.html',
    styleUrl: './dashboardadmin.component.css',
    standalone: false
})
export class DashboardadminComponent  { 
 
  districts: any[]=[] ;
  talukas:any[]=[];
  tableData: any[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  pageSize: number = 50;
  pages: number[] = [];
  BNR:any;
  tableData1: DetailsPageDTO[] = [];
  totalElements: number=0;

  filters = {
    registerDateFrom: '',
    registerDateTo: '',
    district: '',
    talukas: ''
  };

  constructor(private fb: FormBuilder,private dataService: DataService,private dialogService: DialogService) { }
  ngOnInit(): void {
    this.fetchDistricts();
   this.getAlldata();
  }
  // load all districts 
  fetchDistricts(): void {
    this.dataService.getAllDistricts()
      .subscribe(districts1 => {
        this.districts = districts1.map(district => ({
          censusDistrictCode: district.censusDistrictCode,
          districtName: district.districtName,
          censusStateCode: district.censusStateCode
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
  // load the initial data in dashboard
  getAlldata(){
      this.dataService.getDashBoardData(this.currentPage - 1, this.pageSize).subscribe((response: Page<DetailsPageDTO>) => {
        this.totalPages = response.totalPages;
        this.totalElements = response.totalElements;
        this.tableData1 = response.content;
      },(error) => {
       // console.error('Error fetching BRN details', error);
        this.tableData1 = [];
        this.totalElements = 0;
      });
    }

  onBRNInput(event: Event) {
    const input = (event.target as HTMLInputElement).value;
    this.BNR = input;
  }
  //load the BRN number details
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

applyFilters() {
    this.dataService.fetchDataWithFilters(this.filters,this.currentPage,this.pageSize).subscribe(
      (response: Page<DetailsPageDTO>) => {
        this.totalPages = response.totalPages;
        this.totalElements = response.totalElements;
        this.tableData1 = response.content;
        console.log(this.tableData1);
      },
      (error) => {
        console.log("console.log(this.tableData1); "+this.tableData1);
        this.tableData1 = [];
        this.totalElements = 0;
      }
    );
  }
  
  
  

  
  //Load the pagination details
  fetchData(pagedata:any[]) {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.tableData = pagedata.slice(startIndex, endIndex);
    this.totalPages = Math.ceil(pagedata.length / this.pageSize);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  


  
  

  
 
  generateExcel(data:any[]) {
    const data1 = [];

    // Add header row
    data1.push(['Serial Number', 'Department Name', 'District BRN']);

    console.log(data)
    for (let item of this.tableData) {
      const row = [
        item.serialNumber,
        item.departmentName,
        item.districtBRN
      ];
      data1.push(row)
    }
    const workbook = XLSX.utils.book_new();
  
    const worksheet = XLSX.utils.aoa_to_sheet(data1);

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    XLSX.writeFile(workbook, 'download/data.xlsx');
  }

  generatePDF() {
    const element = document.getElementById('pdfContent'); // ID of the HTML element you want to convert to PDF
  
    if (!element) {
      console.error('Element with ID "pdfContent" not found.');
      return;
    }
  
    html2canvas(element).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgWidth = 210; // Width of A4 in mm
      const pageHeight = 297; // Height of A4 in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
  
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        
      }
  
      pdf.save('generated.pdf');
    }).catch((error) => {
      console.error('An error occurred while generating PDF:', error);
    });
  }
  

  openDialog() {
    this.dialogService.openDialog();
  }



//  for the pagination 
onPageChange(page: number) {
  this.currentPage = page;
}

nextPage() {
  if (this.currentPage < this.totalPages) {
    this.onPageChange(this.currentPage + 1);
  }
}

previousPage() {
  if (this.currentPage > 1) {
    this.onPageChange(this.currentPage - 1);
  }
}

firstPage() {
  if (this.currentPage !== 1) {
    this.onPageChange(1);
  }
}

lastPage() {
  if (this.currentPage !== this.totalPages) {
    this.onPageChange(this.totalPages);
  }
}

getDisplayedPages(): number[] {
  const maxPagesToShow = 9; // Change this number to adjust how many pages to show
  const halfMaxPages = Math.floor(maxPagesToShow / 2);

  let startPage = Math.max(1, this.currentPage - halfMaxPages);
  let endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);

  if (endPage - startPage + 1 < maxPagesToShow) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }

  return Array.from({length: (endPage - startPage + 1)}, (_, i) => startPage + i);
}
}
  


