import { HttpEventType, HttpHeaders, HttpResponse } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnDestroy, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, switchMap, takeWhile, timer } from 'rxjs';
import { PaginatedResponse } from '../../../interface/paginated-response';
import {
  RegisteredEstablishmentExportFormat,
  RegisteredEstablishmentExportJobCreatedResponse,
  RegisteredEstablishmentExportJobStatusResponse
} from '../../../interface/registered-establishment-export-job';
import { DetailsPageDTO } from '../../../interface/details-page-dto';
import { MstRegistryDetailsPage } from '../../../model/mst-registry-details-page';
import { AuthService } from '../../../services/auth.service';
import { DataService } from '../../../services/dashboard/data-service.service';
import { FileUploadService } from '../../../services/file-upload.service';

type ExportPhase = 'idle' | 'queued' | 'generating' | 'downloading' | 'completed' | 'failed';

interface ExportProgressState {
  inProgress: boolean;
  phase: ExportPhase;
  progressPercent: number;
  stage: string;
  message: string;
  error: string;
  jobId: string | null;
  fileName: string | null;
}

@Component({
  selector: 'app-brn-registry-details',
  standalone: false,
  templateUrl: './brn-registry-details.component.html',
  styleUrls: ['./brn-registry-details.component.css']
})
export class CommonPostLoginBrnRegistryDetailsComponent implements OnDestroy {
  allowedRoles: string[] = [
    'ROLE_ADMIN',
    'ROLE_DES_STATE',
    'ROLE_DES_REGION',
    'ROLE_DES_DISTRICT',
    'ROLE_REG_AUTH_API',
    'ROLE_REG_AUTH_CSV'
  ];

  districts: { id: number; name: string }[] = [];
  talukas: { id: number; name: string }[] = [];
  userRole: any;

  selectedTaluka: { id: number; name: string }[] = [];
  selectedDistrict: { id: number; name: string }[] = [];

  selectedTalukaIds: number[] = [];
  selectedDistrictIds: number[] = [];
  placeholder: string = '';
  tableData1: DetailsPageDTO[] = [];
  BNR: any;
  filters = {
    registerDateFrom: '',
    registerDateTo: '',
  };

  registryDetails: MstRegistryDetailsPage[] = [];
  selectComponent: string | undefined;
  currentPage: number = 0;
  pageSize: number = 12;
  totalPages: number = 0;
  totalElements: number = 0;
  pageSizeOptions: number[] = [10, 12, 20, 50];
  sortBy: string = 'siNo';
  pdfExportState = this.createInitialExportState();
  excelExportState = this.createInitialExportState();
  private readonly isBrowser: boolean;
  private readonly exportStatusSubscriptions = new Map<RegisteredEstablishmentExportFormat, Subscription>();

  constructor(
    private fileUploadService: FileUploadService,
    private router: Router,
    private dataService: DataService,
    private route: ActivatedRoute,
    private authService: AuthService,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.userRole = this.authService.getUserRoles();

    if (!this.canLoadProtectedData()) {
      this.resetDashboardState();
      return;
    }

    this.loadRegistryDetails(this.currentPage, this.pageSize, this.sortBy);
    this.fetchDistricts();
  }

  ngOnDestroy(): void {
    this.exportStatusSubscriptions.forEach((subscription) => subscription.unsubscribe());
    this.exportStatusSubscriptions.clear();
  }

  fetchDistricts(): void {
    if (!this.canLoadProtectedData()) {
      this.districts = [];
      return;
    }

    this.dataService.getAllDistrictsForLoginUser().subscribe({
      next: (districts1) => {
        this.districts = districts1.map((district) => ({
          id: district.censusDistrictCode,
          name: district.districtName,
        }));
      },
      error: () => {
        this.districts = [];
      }
    });
  }

  onChangeFunction(event: any) {
    const selectedValue = event.target.value;
    this.fetchTalukas(selectedValue);
    this.applyFilters();
  }

  isAllowed(): boolean {
    if (!this.allowedRoles || this.allowedRoles.length === 0) {
      return false;
    }

    if (Array.isArray(this.userRole)) {
      return this.userRole.some(
        (role: any) =>
          typeof role === 'string' &&
          this.allowedRoles.map((allowedRole) => allowedRole.toUpperCase()).includes(role.toUpperCase())
      );
    }

    if (typeof this.userRole === 'string') {
      return this.allowedRoles
        .map((allowedRole) => allowedRole.toUpperCase())
        .includes(this.userRole.toUpperCase());
    }

    return false;
  }

  applyFilters() {
    this.currentPage = 0;

    if (this.BNR?.trim()) {
      this.searchBRN();
      return;
    }

    this.postLoginDashboardData(this.currentPage, this.pageSize, this.sortBy);
  }

  goToDetails(brnNo: string) {
    this.router.navigate(['common-post-login/dashboard-brn-details', brnNo]);
  }

  loadRegistryDetails(page: number, size: number, sortBy: string): void {
    if (!this.canLoadProtectedData()) {
      this.resetRegistryPage();
      return;
    }

    this.fileUploadService.getRegistryDetailsPage(page, size, sortBy, this.filters).subscribe(
      (response: PaginatedResponse<MstRegistryDetailsPage>) => {
        this.registryDetails = response.content;
        this.totalPages = response.totalPages;
        this.totalElements = response.totalElements;
      },
      () => {
        this.resetRegistryPage();
      }
    );
  }

  goToPage(page: number): void {
    if (page < 0 || page >= this.totalPages || page === this.currentPage) {
      return;
    }

    this.currentPage = page;
    this.fetchData();
  }

  onPageSizeChange(event: any): void {
    this.pageSize = +event.target.value;
    this.currentPage = 0;
    this.fetchData();
  }

  onSortByChange(sortBy: string): void {
    this.sortBy = sortBy;
    this.currentPage = 0;
    this.fetchData();
  }

  private fetchData(): void {
    if (!this.canLoadProtectedData()) {
      this.resetRegistryPage();
      return;
    }

    if (this.selectedDistrictIds.length === 0) {
      this.loadRegistryDetails(this.currentPage, this.pageSize, this.sortBy);
    } else {
      this.postLoginDashboardData(this.currentPage, this.pageSize, this.sortBy);
    }
  }

  onSelectionTalukaChange(selectedItems: { id: number; name: string }[]) {
    this.selectedTaluka = selectedItems;
    this.selectedTalukaIds = selectedItems.length > 0 ? selectedItems.map((item) => item.id) : [];
    this.applyFilters();
  }

  onSelectionDistrictChange(selectedItems: { id: number; name: string }[]) {
    this.selectedDistrict = selectedItems;
    this.selectedDistrictIds = selectedItems.length > 0 ? selectedItems.map((item) => item.id) : [];
    this.fetchTalukas(this.selectedDistrictIds);
    this.applyFilters();
  }

  fetchTalukas(selectedValue: any): void {
    if (!this.canLoadProtectedData() || !selectedValue || selectedValue.length === 0) {
      this.talukas = [];
      return;
    }

    this.dataService.getAllTaluka(selectedValue).subscribe({
      next: (talukas1) => {
        this.talukas = talukas1.map((talukas) => ({
          id: talukas.censusTalukaCode,
          name: talukas.talukaName,
        }));
      },
      error: () => {
        this.talukas = [];
      }
    });
  }

  postLoginDashboardData(page: number, size: number, sortBy: string) {
    if (!this.canLoadProtectedData()) {
      this.resetRegistryPage();
      return;
    }

    this.fileUploadService.postLoginDashboardData(
      page,
      size,
      sortBy,
      this.selectedDistrictIds,
      this.selectedTalukaIds,
      this.filters
    ).subscribe(
      (response: PaginatedResponse<MstRegistryDetailsPage>) => {
        this.registryDetails = response.content;
        this.totalPages = response.totalPages;
        this.totalElements = response.totalElements;
      },
      () => {
        this.resetRegistryPage();
      }
    );
  }

  searchBRN() {
    if (!this.canLoadProtectedData()) {
      this.resetRegistryPage();
      return;
    }

    if (this.BNR) {
      const trimmedBRN = this.BNR.trim();
      this.currentPage = 0;
      this.fileUploadService.getBRNDetails(trimmedBRN, this.filters).subscribe(
        (response: PaginatedResponse<MstRegistryDetailsPage>) => {
          this.registryDetails = response.content;
          this.totalPages = response.totalPages;
          this.totalElements = response.totalElements;
        },
        () => {
          this.resetRegistryPage();
        }
      );
    }
  }

  clearGeneratedDateFilters(): void {
    this.BNR = '';
    this.filters.registerDateFrom = '';
    this.filters.registerDateTo = '';
    this.applyFilters();
  }

  showTodaysGeneratedBrn(): void {
    const today = this.getTodayDateString();
    this.filters.registerDateFrom = today;
    this.filters.registerDateTo = today;
    this.currentPage = 0;

    if (this.BNR?.trim()) {
      this.searchBRN();
      return;
    }

    if (this.selectedDistrictIds.length === 0 && this.selectedTalukaIds.length === 0) {
      this.loadRegistryDetails(this.currentPage, this.pageSize, this.sortBy);
      return;
    }

    this.postLoginDashboardData(this.currentPage, this.pageSize, this.sortBy);
  }

  exportRegisteredEstablishmentsPdf(): void {
    this.startExport('PDF');
  }

  exportToExcel(): void {
    this.startExport('EXCEL');
  }

  get isPdfExporting(): boolean {
    return this.pdfExportState.inProgress;
  }

  get isExcelExporting(): boolean {
    return this.excelExportState.inProgress;
  }

  get pdfExportError(): string {
    return this.pdfExportState.error;
  }

  get excelExportError(): string {
    return this.excelExportState.error;
  }

  private startExport(format: RegisteredEstablishmentExportFormat): void {
    if (!this.isBrowser || !this.canLoadProtectedData()) {
      return;
    }

    const state = this.getExportState(format);
    if (state.inProgress) {
      return;
    }

    this.resetExportState(state);
    state.inProgress = true;
    state.phase = 'queued';
    state.stage = 'Queued';
    state.message = 'Creating export job.';

    this.fileUploadService.createRegisteredEstablishmentExportJob({
      format,
      districtIds: this.selectedDistrictIds,
      talukaIds: this.selectedTalukaIds,
      brn: this.BNR?.trim() ?? ''
    }).subscribe({
      next: (response) => this.monitorExportJob(format, response),
      error: () => this.failExportState(state, 'Unable to start export. Please try again.')
    });
  }

  private monitorExportJob(
    format: RegisteredEstablishmentExportFormat,
    createdResponse: RegisteredEstablishmentExportJobCreatedResponse
  ): void {
    const state = this.getExportState(format);
    state.jobId = createdResponse.jobId;
    state.fileName = createdResponse.fileName;
    state.phase = 'generating';
    state.progressPercent = createdResponse.progressPercent;
    state.stage = createdResponse.stage;
    state.message = 'Preparing export data.';

    this.exportStatusSubscriptions.get(format)?.unsubscribe();

    const subscription = timer(0, 1200).pipe(
      switchMap(() => this.fileUploadService.getRegisteredEstablishmentExportJobStatus(createdResponse.jobId)),
      takeWhile((status) => status.status !== 'COMPLETED' && status.status !== 'FAILED', true)
    ).subscribe({
      next: (status) => this.handleExportStatus(format, status),
      error: () => this.failExportState(state, 'Unable to track export progress. Please try again.')
    });

    this.exportStatusSubscriptions.set(format, subscription);
  }

  private handleExportStatus(
    format: RegisteredEstablishmentExportFormat,
    status: RegisteredEstablishmentExportJobStatusResponse
  ): void {
    const state = this.getExportState(format);
    state.jobId = status.jobId;
    state.fileName = status.fileName;
    state.stage = status.stage;
    state.message = status.message;
    state.progressPercent = this.normalizeProgress(status.progressPercent);

    if (status.status === 'FAILED') {
      this.exportStatusSubscriptions.get(format)?.unsubscribe();
      this.exportStatusSubscriptions.delete(format);
      this.failExportState(state, status.message || 'Export generation failed. Please try again.');
      return;
    }

    if (status.status === 'COMPLETED' && status.downloadReady) {
      this.exportStatusSubscriptions.get(format)?.unsubscribe();
      this.exportStatusSubscriptions.delete(format);
      this.downloadGeneratedExport(format, status.jobId, status.fileName);
      return;
    }

    state.phase = 'generating';
  }

  private downloadGeneratedExport(
    format: RegisteredEstablishmentExportFormat,
    jobId: string,
    fallbackFileName: string
  ): void {
    const state = this.getExportState(format);
    state.phase = 'downloading';
    state.stage = 'Downloading';
    state.message = 'Downloading generated file.';
    state.progressPercent = 0;

    this.fileUploadService.downloadRegisteredEstablishmentExport(jobId).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.DownloadProgress) {
          if (event.total) {
            state.progressPercent = this.normalizeProgress(Math.round((100 * event.loaded) / event.total));
          } else {
            state.progressPercent = Math.max(state.progressPercent, 15);
          }
          return;
        }

        if (event.type === HttpEventType.Response) {
          const response = event as HttpResponse<Blob>;
          const blob = response.body;

          if (!blob || blob.size === 0) {
            this.failExportState(state, 'The generated export file was empty.');
            return;
          }

          this.downloadBlobFile(blob, this.extractFileName(response.headers) ?? fallbackFileName);
          state.inProgress = false;
          state.phase = 'completed';
          state.stage = 'Completed';
          state.message = 'Download started successfully.';
          state.progressPercent = 100;
        }
      },
      error: () => this.failExportState(state, 'Download failed. Please try again.')
    });
  }

  private getExportState(format: RegisteredEstablishmentExportFormat): ExportProgressState {
    return format === 'PDF' ? this.pdfExportState : this.excelExportState;
  }

  private failExportState(state: ExportProgressState, message: string): void {
    state.inProgress = false;
    state.phase = 'failed';
    state.stage = 'Failed';
    state.message = '';
    state.error = message;
    state.progressPercent = 0;
  }

  private resetExportState(state: ExportProgressState): void {
    state.inProgress = false;
    state.phase = 'idle';
    state.progressPercent = 0;
    state.stage = '';
    state.message = '';
    state.error = '';
    state.jobId = null;
    state.fileName = null;
  }

  private createInitialExportState(): ExportProgressState {
    return {
      inProgress: false,
      phase: 'idle',
      progressPercent: 0,
      stage: '',
      message: '',
      error: '',
      jobId: null,
      fileName: null
    };
  }

  private normalizeProgress(progress: number): number {
    if (Number.isNaN(progress)) {
      return 0;
    }

    return Math.min(100, Math.max(0, progress));
  }

  private canLoadProtectedData(): boolean {
    return this.isBrowser && this.authService.isAuthenticated();
  }

  private resetDashboardState(): void {
    this.districts = [];
    this.talukas = [];
    this.resetRegistryPage();
  }

  private resetRegistryPage(): void {
    this.registryDetails = [];
    this.totalPages = 0;
    this.totalElements = 0;
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
      return Array.from({ length: total }, (_, i) => i);
    }

    pages.push(0);

    if (current > 2) {
      pages.push(-1);
    }

    for (let i = Math.max(1, current - 1); i <= Math.min(total - 2, current + 1); i++) {
      pages.push(i);
    }

    if (current < total - 3) {
      pages.push(-1);
    }

    pages.push(total - 1);

    return pages;
  }

  allowOnlyNumbers(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  private extractFileName(headers: HttpHeaders): string | null {
    const contentDisposition = headers.get('content-disposition');
    if (!contentDisposition) {
      return null;
    }

    const match = contentDisposition.match(/filename="?([^"]+)"?/i);
    return match?.[1] ?? null;
  }

  private downloadBlobFile(blob: Blob, fileName: string): void {
    const objectUrl = URL.createObjectURL(blob);
    const anchor = document.createElement('a');

    anchor.href = objectUrl;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(objectUrl);
  }

  private getTodayDateString(): string {
    const today = new Date();
    const offset = today.getTimezoneOffset();
    const localDate = new Date(today.getTime() - offset * 60 * 1000);
    return localDate.toISOString().split('T')[0];
  }
}
