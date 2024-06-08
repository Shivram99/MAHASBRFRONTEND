import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';


@Injectable({
  providedIn: 'root'
})
export class ExcelGeneratorService {

  constructor() { }


  generateExcel(data:any[]) {
    
    const workbook = XLSX.utils.book_new();
  
    const worksheet = XLSX.utils.aoa_to_sheet(data);

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    XLSX.writeFile(workbook, 'data.xlsx');
  }
  
}
