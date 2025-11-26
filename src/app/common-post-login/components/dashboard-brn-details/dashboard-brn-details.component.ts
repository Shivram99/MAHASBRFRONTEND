import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MstRegistryDetailsPage } from '../../../model/mst-registry-details-page';
import { DashboardDetailsService } from '../../../services/dashboard-details.service';
import { PaginatedResponse } from '../../../interface/paginated-response';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx-js-style';
import autoTable, { RowInput } from 'jspdf-autotable';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-dashboard-brn-details',
  standalone: false,
  templateUrl: './dashboard-brn-details.component.html',
  styleUrl: './dashboard-brn-details.component.css'
})
export class DashboardBrnDetailsComponent implements OnInit {
  brn: any;
  mstRegistryDetailsPage!: MstRegistryDetailsPage;

  constructor(private route: ActivatedRoute, private dashboardDetailsService: DashboardDetailsService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.brn = params.get('brnNo');
      this.getBRNDetails();

    });
  }

  getBRNDetails(): void {
    this.dashboardDetailsService.getBRNDetails(this.brn).subscribe(
      (data: PaginatedResponse<MstRegistryDetailsPage>) => {
        this.mstRegistryDetailsPage = data.content[0];
        console.log('BRN Details:', this.mstRegistryDetailsPage);
      },
      (error: any) => {
        console.error('Error fetching BRN details:', error);
      }
    );
  }

  /**
   * ✅ Export as Excel
   */
  exportToExcel(): void {
    if (!this.mstRegistryDetailsPage) {
      console.error('No data available to export');
      return;
    }

    const brnNo = this.mstRegistryDetailsPage.brnNo || 'BRN';

    // 1️⃣ Map fields in order
    const fieldMapping: { [key: string]: string } = {
      siNo: 'SI.No',
      nameOfEstablishmentOrOwner: 'Name of Establishment / Owner',
      houseNo: 'House No',
      streetName: 'Street Name',
      locality: 'Locality',
      pinCode: 'Pin Code',
      telephoneMobNumber: 'Telephone / Mob Number',
      emailAddress: 'Email Address',
      panNumber: 'PAN',
      tanNumber: 'TAN',
      headOfficeHouseNo: 'Head Office: House No',
      headOfficeStreetName: 'Head Office: Street Name',
      headOfficeLocality: 'Head Office: Locality',
      headOfficePinCode: 'Head Office: Pin Code',
      headOfficeTelephoneMobNumber: 'Head Office: Telephone/Mob Number',
      headOfficeEmailAddress: 'Head Office: Email Address',
      descriptionOfMajorActivity: 'Description of Major Activity',
      nic2008ActivityCode: 'NIC 2008 Activity Code',
      yearOfStartOfOperation: 'Year of Start of Operation',
      ownershipCode: 'Ownership Code',
      totalNumberOfPersonsWorking: 'Total Number of Persons Working',
      actAuthorityRegistrationNumbers: 'ACT/Authority Registration Numbers',
      remarks: 'Remarks',
      locationCode: 'Location Code',
      brnNo: 'Business Registration Number',
      registrationStatus: 'Registration Status',
      townVillage: 'Town/Village',
      taluka: 'Taluka',
      district: 'District',
      sector: 'Sector (Rural/Urban)',
      nameOfAct: 'Name of Act',
      dateOfRegistration: 'Date of Registration',
      dateOfDeregistrationExpiry: 'Date of Deregistration/Expiry',
      gstNumber: 'GST Number',
      hsnCode: 'HSN Code'
    };

    // 2️⃣ Convert data into table rows
    const data = Object.entries(fieldMapping).map(([key, label]) => ({
      'Field Name': label,
      'Value': this.formatValue(key, (this.mstRegistryDetailsPage as any)[key])
    }));

    // 3️⃣ Create worksheet
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);

    // 4️⃣ Apply styling (using xlsx-js-style)
    const range = XLSX.utils.decode_range(ws['!ref']!);
    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
        if (!ws[cellRef]) continue;

        ws[cellRef].s = {
          border: {
            top: { style: 'thin', color: { rgb: '000000' } },
            bottom: { style: 'thin', color: { rgb: '000000' } },
            left: { style: 'thin', color: { rgb: '000000' } },
            right: { style: 'thin', color: { rgb: '000000' } }
          },
          font: {
            bold: R === 0,
            color: { rgb: '000000' },
            sz: R === 0 ? 12 : 11
          },
          fill: R === 0 ? { fgColor: { rgb: 'BDD7EE' } } : undefined, // Header light blue
          alignment: { vertical: 'center', horizontal: 'left', wrapText: true }
        };
      }
    }

    // 5️⃣ Adjust column width
    ws['!cols'] = [{ wch: 40 }, { wch: 50 }];

    // 6️⃣ Create workbook and export
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'BRN Details');
    XLSX.writeFile(wb, `${brnNo}_Details.xlsx`);
  }
  /**
   * ✅ Export as PDF
   */
  exportToPDF() {
  const brnNo = this.mstRegistryDetailsPage?.brnNo || 'BRN';
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  // Title
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(`Business Registration Details (${brnNo})`, 14, 10);

  // --- Merge Left + Right fields in one list ---
  const allFields = [
    // Left Section
    { key: 'siNo', label: 'SR.No' },
    { key: 'nameOfEstablishmentOrOwner', label: 'Name of Establishment / Owner' },
    { key: 'houseNo', label: 'House No' },
    { key: 'streetName', label: 'Street Name' },
    { key: 'locality', label: 'Locality' },
    { key: 'pinCode', label: 'Pin code' },
    { key: 'telephoneMobNumber', label: 'Telephone / Mob Number' },
    { key: 'emailAddress', label: 'Email Address' },
    { key: 'panNumber', label: 'PAN' },
    { key: 'tanNumber', label: 'TAN' },
    { key: 'headOfficeHouseNo', label: 'Head Office: House No' },
    { key: 'headOfficeStreetName', label: 'Head Office: Street Name' },
    { key: 'headOfficeLocality', label: 'Head Office: Locality' },
    { key: 'headOfficePinCode', label: 'Head Office: Pin Code' },
    { key: 'headOfficeTelephoneMobNumber', label: 'Head Office: Telephone/Mob Number' },
    { key: 'headOfficeEmailAddress', label: 'Head Office: Email Address' },
    { key: 'descriptionOfMajorActivity', label: 'Description of Major Activity' },
    { key: 'nic2008ActivityCode', label: 'NIC 2008 Activity Code' },

    // Right Section
    { key: 'yearOfStartOfOperation', label: 'Year of Start of Operation' },
    { key: 'ownershipCode', label: 'Ownership Code' },
    { key: 'totalNumberOfPersonsWorking', label: 'Total Number of Persons Working' },
    { key: 'actAuthorityRegistrationNumbers', label: 'ACT/Authority Registration Numbers' },
    { key: 'remarks', label: 'Remarks' },
    { key: 'locationCode', label: 'Location Code' },
    { key: 'brnNo', label: 'Business Registration Number' },
    { key: 'registrationStatus', label: 'Registration Status' },
    { key: 'townVillage', label: 'Town/Village' },
    { key: 'taluka', label: 'Taluka' },
    { key: 'district', label: 'District' },
    { key: 'sector', label: 'Sector (Rural/Urban)' },
    { key: 'nameOfAct', label: 'Name of Act' },
    { key: 'dateOfRegistration', label: 'Date of Registration' },
    { key: 'dateOfDeregistrationExpiry', label: 'Date of Deregistration/Expiry' },
    { key: 'gstNumber', label: 'GST Number' },
    { key: 'hsnCode', label: 'HSN Code' },
  ];

  // Prepare table rows
  const tableBody = allFields.map(f => [
    f.label,
    this.formatValue(f.key, (this.mstRegistryDetailsPage as any)[f.key])
  ]);

  // Generate single table
  autoTable(doc, {
    startY: 20,
    head: [['Field Name', 'Value']],
    body: tableBody,
    styles: {
      fontSize: 9,
      cellPadding: 2,
      lineColor: [0, 0, 0],
      lineWidth: 0.1,
    },
    headStyles: {
      fillColor: [52, 152, 219],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'center'
    },
    columnStyles: {
      0: { cellWidth: 60, fontStyle: 'bold' },
      1: { cellWidth: 110 }
    },
  });

  // Save PDF
  doc.save(`${brnNo}_Details.pdf`);
}


  /**
   * ✅ Format field name (e.g., headOfficeStreetName → Head Office Street Name)
   */
  private formatFieldName(key: string): string {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase());
  }

  /**
   * ✅ Format value with special handling for dates
   */
  private formatValue(key: string, value: any): string | number {
    if (!value) return '';

    if (key.toLowerCase().includes('date')) {
      return this.formatDate(value);
    }
    return value;
  }

  private formatDateValue(value?: string): string {
    if (!value) return '-';
    try {
      return formatDate(value, 'dd-MMM-yyyy', 'en-IN');
    } catch {
      return value;
    }
  }

  /**
   * ✅ Format date to DD/MMM/YYYY (e.g., 31/Oct/2025)
   */
  private formatDate(date: any): string {
    const d = new Date(date);
    if (isNaN(d.getTime())) return ''; // Invalid date check

    const day = d.getDate().toString().padStart(2, '0');
    const month = d.toLocaleString('en-US', { month: 'short' });
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }
}