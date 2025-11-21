import { Component } from '@angular/core';
import { MstRegistryDetailsPage } from '../../../model/mst-registry-details-page'; 
import { FileUploadService } from '../../../services/file-upload.service'; 
import { PaginatedResponse } from '../../../interface/paginated-response'; 
import { ActivatedRoute, Router } from '@angular/router';
import { DetailsPageDTO } from '../../../interface/details-page-dto'; 
import { DataService } from '../../../services/dashboard/data-service.service'; 
import { AuthService } from '../../../services/auth.service';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx-js-style';
import autoTable,{ RowInput } from 'jspdf-autotable';

@Component({
  selector: 'app-brn-registry-details',
  standalone: false,
  templateUrl: './brn-registry-details.component.html',
  styleUrl: './brn-registry-details.component.css'
})
export class BRNregistoryDetailsComponent {
  //filter variable data
allowedRoles: string[] = [
  'ROLE_DES_STATE',
  'ROLE_DES_REGION',
  'ROLE_REG_AUTH_API',
  'ROLE_REG_AUTH_CSV'
];
  districts: { id: number; name: string }[] = [];
  talukas: { id: number; name: string }[] = [];
  userRole:any;

  selectedTaluka: { id: number; name: string }[] = [];
  selectedDistrict: { id: number; name: string }[] = [];

  selectedTalukaIds: number[]=[];
  selectedDistrictIds: number[]=[];
placeholder:string='';
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
  pageSize: number = 12; // Default page size
  totalPages: number = 0;
  totalElements: number = 0;
  pageSizeOptions: number[] = [10, 12, 20, 50]; // Options for page size
  sortBy: string = 'siNo'; // Default sorting parameter
  constructor(
    private fileUploadService: FileUploadService,
    private router: Router,
    private dataService: DataService,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}
  ngOnInit(): void {
    this.loadRegistryDetails(this.currentPage, this.pageSize, this.sortBy);
    this.fetchDistricts();
    debugger;
    this.userRole=this.authService.getUserRoles();
  }

  fetchDistricts(): void {
    this.dataService.getAllDistrictsForLoginUser().subscribe((districts1) => {
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

  isAllowed(): boolean {
  if (!this.allowedRoles || this.allowedRoles.length === 0) return false;

  // Handle case when userRole is an array (multiple roles)
  if (Array.isArray(this.userRole)) {
    return this.userRole.some(
      (role: any) =>
        typeof role === 'string' &&
        this.allowedRoles.map(r => r.toUpperCase()).includes(role.toUpperCase())
    );
  }

  // Handle single role (string)
  if (typeof this.userRole === 'string') {
    return this.allowedRoles
      .map(r => r.toUpperCase())
      .includes(this.userRole.toUpperCase());
  }

  // Any other type (object, null, etc.)
  return false;
}

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
  if (page < 0 || page >= this.totalPages || page === this.currentPage) {
    return; // Prevent invalid or duplicate page navigation
  }
  this.currentPage = page;
  this.fetchData();
}

onPageSizeChange(event: any): void {
  this.pageSize = +event.target.value; // ensure number
  this.currentPage = 0; // Reset to first page whenever page size changes
  this.fetchData();
}

onSortByChange(sortBy: string): void {
  this.sortBy = sortBy;
  this.currentPage = 0; // optional: reset page when sorting
  this.fetchData();
}

/**
 * 🔹 Centralized data fetching logic
 *    Decides which API to call (filtered vs normal)
 */
private fetchData(): void {
  if (this.selectedDistrictIds.length === 0) {
    this.loadRegistryDetails(this.currentPage, this.pageSize, this.sortBy);
    console.log("loadRegistryDetails", { page: this.currentPage, size: this.pageSize, sort: this.sortBy });
  } else {
    this.postLoginDashboardData(this.currentPage, this.pageSize, this.sortBy);
    console.log("postLoginDashboardData", { page: this.currentPage, size: this.pageSize, sort: this.sortBy });
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
      debugger;
      this.talukas = talukas1.map((talukas) => ({
        id: talukas.censusTalukaCode,
        name: talukas.talukaName,
      }));
      
    });
  }

  postLoginDashboardData(page: number, size: number, sortBy: string){
    debugger
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
      const trimmedBRN = this.BNR.trim();
      this.fileUploadService.getBRNDetails(trimmedBRN).subscribe(
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


goToFirst(): void {
  this.goToPage(0);
}

goToLast(): void {
  this.goToPage(this.totalPages - 1);
}

getVisiblePages(): number[] {
  const pages: number[] = [];
  const total = this.totalPages;
  const current = this.currentPage;

  if (total <= 6) {
    // Show all pages when small
    return Array.from({ length: total }, (_, i) => i);
  }

  // Always show first page
  pages.push(0);

  if (current > 2) {
    pages.push(-1); // Ellipsis
  }

  // Show current-1, current, current+1
  for (let i = Math.max(1, current - 1); i <= Math.min(total - 2, current + 1); i++) {
    pages.push(i);
  }

  if (current < total - 3) {
    pages.push(-1); // Ellipsis
  }

  // Always show last page
  pages.push(total - 1);

  return pages;
}

allowOnlyNumbers(event: KeyboardEvent) {
  const charCode = event.which ? event.which : event.keyCode;
  // Allow only digits (0-9)
  if (charCode < 48 || charCode > 57) {
    event.preventDefault();
  }
}

exportToExcel(): void {
  if (!this.registryDetails || this.registryDetails.length === 0) {
    console.warn('No registry details available to export.');
    return;
  }

  // ✅ Field mapping
  const fieldMap: Record<string, string> = {
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

  // ✅ Convert only selected fields
  const exportData = this.registryDetails.map((item: any) => {
    const row: any = {};
    for (const key in fieldMap) {
      row[fieldMap[key]] = item[key] ?? '';
    }
    return row;
  });

  // ✅ Create worksheet
  const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);

  // ✅ Apply styles to each cell
  const range = XLSX.utils.decode_range(ws['!ref']!);
  for (let R = range.s.r; R <= range.e.r; ++R) {
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
      if (!ws[cellRef]) continue;

      const isHeader = R === 0;
      ws[cellRef].s = {
        border: {
          top: { style: 'thin', color: { rgb: '000000' } },
          bottom: { style: 'thin', color: { rgb: '000000' } },
          left: { style: 'thin', color: { rgb: '000000' } },
          right: { style: 'thin', color: { rgb: '000000' } },
        },
        font: {
          bold: isHeader,
          color: { rgb: isHeader ? 'FFFFFF' : '000000' },
        },
        fill: isHeader
          ? { fgColor: { rgb: '1F4E78' } } // Dark blue header
          : undefined,
        alignment: {
          vertical: 'center',
          horizontal: isHeader ? 'center' : 'left',
          wrapText: true,
        },
      };
    }
  }

  // ✅ Freeze header row
  ws['!freeze'] = { xSplit: 0, ySplit: 1 };

  // ✅ Auto-fit column width based on max content length
  ws['!cols'] = Object.values(fieldMap).map((header) => {
    const maxLength = Math.max(
      header.length,
      ...exportData.map((row: any) => String(row[header] || '').length)
    );
    return { wch: Math.min(Math.max(maxLength + 2, 15), 50) };
  });

  // ✅ Create workbook
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Registry Details');

  // ✅ File name with current date
  const formattedDate = new Date()
    .toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    .replace(/ /g, '-');

  const fileName = `RegistryDetails_${formattedDate}.xlsx`;

  XLSX.writeFile(wb, fileName, { compression: true });
}
  // ✅ Export to PDF
  exportToPDF() {
    const doc = new jsPDF();
    doc.text('Registry Details', 14, 10);

    const body: RowInput[] = this.registryDetails.map((d, i) => [
      i + 1,
      d.brnNo ?? '',
      d.nameOfEstablishmentOrOwner ?? '',
      d.taluka ?? '',
      d.district ?? '',
      d.sector ?? ''
    ]);

    autoTable(doc, {
      head: [['Sr.No', 'BRN', 'Establishment Name', 'City', 'District', 'Type Of Business']],
      body: body,
      startY: 20,
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185] },
      styles: { fontSize: 9 }
    });

    doc.save('RegistryDetails.pdf');
  }
}

