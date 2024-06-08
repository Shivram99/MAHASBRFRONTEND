import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DistrictServiceService } from '../../services/district-service.service';
import { DataService } from '../../services/dashboard/data-service.service';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { DialogService } from '../../services/dashboard/dialog.service';

@Component({
  selector: 'app-dashboardadmin',
  templateUrl: './dashboardadmin.component.html',
  styleUrl: './dashboardadmin.component.css'
})
export class DashboardadminComponent  { 
  adminDashBoardfrm: FormGroup;
  selectedDistrict:any;
  districts: any[]=[] ;
  talukas:any[]=[];
  
  constructor(private fb: FormBuilder,private dataService: DataService,private dialogService: DialogService) {
    this.adminDashBoardfrm = this.fb.group({
      registerDate: ['', [Validators.required]]
    });
  }

  


  tableData = [
    { serialNumber: 1, departmentName: 'Department A', districtBRN: '123456', remark: 'Some remark' },
    { serialNumber: 2, departmentName: 'Department B', districtBRN: '789012', remark: 'Another remark' },
    { serialNumber: 3, departmentName: 'Department C', districtBRN: '345678', remark: 'Yet another remark' }
    // Add more data as needed
  ];



  
  ngOnInit(): void {
    this.fetchDistricts();
      this.adminDashBoardfrm = this.fb.group({
        registerDateFrom: [''],
        registerDateTo: [''],
        district: ['11111'],
        BNR: [''],
        talukas: ['']
    
  });
}


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
  onChangeFunction(event: any) {
    const selectedValue = event.target.value;
  this.fetchTalukas(selectedValue);
    
  }
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
  onChangeFunctionfrm(): void {
    this.onSubmit();
  }

  onSubmit() {
    const formData = this.adminDashBoardfrm.value;
    this.dataService.getDashBoardData(formData).subscribe({
      next: (response) => {
        // Handle the response here
        console.log(response);
      },
      error: (error) => {
        // Handle errors here
        console.error('Error occurred:', error);
      }
    });
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

}
  


