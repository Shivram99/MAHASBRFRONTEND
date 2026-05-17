import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, finalize } from 'rxjs';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx-js-style';

import {
  CsvUploadFailedPageResponse,
  CsvUploadFailedRecord,
  CsvUploadInitResponse,
  CsvUploadPreviewRecord,
  CsvUploadPreviewResponse,
  CsvUploadStatusResponse,
  CsvUploadSuccessPageResponse,
  CsvUploadSuccessRecord
} from '../../../interface/csv-upload';
import { CsvUploadService } from '../../../services/csv-upload.service';

type PreviewColumnKey =
  | 'srNo'
  | 'establishmentName'
  | 'district'
  | 'taluka'
  | 'mobileNo'
  | 'email'
  | 'pan'
  | 'gstNumber'
  | 'nicCode';

type ResultTab = 'success' | 'failed';
type PendingTransition = 'PAUSED' | 'CANCELLED' | null;

@Component({
  selector: 'app-csv-upload',
  standalone: false,
  templateUrl: './csv-upload.component.html',
  styleUrl: './csv-upload.component.scss'
})
export class CsvUploadComponent implements OnDestroy {
  @ViewChild('fileInput') fileInput?: ElementRef<HTMLInputElement>;

  private static readonly SAMPLE_HEADERS = [
    'NAME_OF_ESTABLISHMENT/OWNER',
    'HOUSE_NO',
    'STREET_NAME',
    'LOCALITY',
    'TOWN_VILLAGE',
    'TALUKA',
    'DISTRICT',
    'PIN_CODE',
    'SECTOR(RURAL/URBAN)',
    'ACT/AUTHORITY_REGISTRATION_NO',
    'NAME_OF_ACT',
    'NAME_OF_AUTHORITY',
    'TEL/MOB_NO',
    'EMAIL',
    'PAN',
    'TAN',
    'WARD_NUMBER',
    'GST_NUMBER',
    'NIC_2008_ACTIVITY_CODE'
  ];

  private static readonly SAMPLE_ROWS = [
    {
      'NAME_OF_ESTABLISHMENT/OWNER': 'ABC Traders',
      HOUSE_NO: '101',
      STREET_NAME: 'Market Road',
      LOCALITY: 'Shivaji Nagar',
      TOWN_VILLAGE: 'Pune',
      TALUKA: 'Haveli',
      DISTRICT: 'Pune',
      PIN_CODE: '411005',
      'SECTOR(RURAL/URBAN)': 'URBAN',
      'ACT/AUTHORITY_REGISTRATION_NO': 'REG123456',
      NAME_OF_ACT: 'Shops and Establishment Act',
      NAME_OF_AUTHORITY: 'PMC',
      'TEL/MOB_NO': '9876543210',
      EMAIL: 'abctraders@example.com',
      PAN: 'ABCDE1234F',
      TAN: 'PNEA12345B',
      WARD_NUMBER: '12',
      GST_NUMBER: '27ABCDE1234F1Z5',
      NIC_2008_ACTIVITY_CODE: '12345'
    }
  ];

  readonly uploadForm: FormGroup;
  readonly acceptedTypes = '.csv,.xls,.xlsx';
  readonly previewPageSize = 100;
  readonly previewColumns: Array<{ key: PreviewColumnKey; label: string }> = [
    { key: 'srNo', label: 'Sr.No' },
    { key: 'establishmentName', label: 'Establishment/Owner Name' },
    { key: 'district', label: 'District' },
    { key: 'taluka', label: 'Taluka' },
    { key: 'mobileNo', label: 'Mobile' },
    { key: 'email', label: 'Email' },
    { key: 'pan', label: 'PAN' },
    { key: 'gstNumber', label: 'GST' },
    { key: 'nicCode', label: 'NIC Code' }
  ];

  selectedFile: File | null = null;
  uploadSession: CsvUploadInitResponse | null = null;
  previewResponse: CsvUploadPreviewResponse | null = null;
  jobStatus: CsvUploadStatusResponse | null = null;
  successPage: CsvUploadSuccessPageResponse | null = null;
  failedPage: CsvUploadFailedPageResponse | null = null;
  previewRecords: CsvUploadPreviewRecord[] = [];
  successRecords: CsvUploadSuccessRecord[] = [];
  failedRecords: CsvUploadFailedRecord[] = [];
  validationMessage = '';
  uploading = false;
  loadingPreview = false;
  loadingResults = false;
  statusRequestInFlight = false;
  processing = false;
  activeResultTab: ResultTab = 'success';
  previewPageNumber = 0;
  successPageNumber = 0;
  failedPageNumber = 0;

  private readonly subscriptions: Subscription[] = [];
  private readonly allowedExtensions = new Set(['csv', 'xls', 'xlsx']);
  private readonly maxFileSize = 50 * 1024 * 1024;
  private pollTimer: number | null = null;
  private completionNotified = false;
  private pendingTransition: PendingTransition = null;

  constructor(
    private readonly fb: FormBuilder,
    private readonly csvUploadService: CsvUploadService
  ) {
    this.uploadForm = this.fb.group({
      file: [null, Validators.required]
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.handleFileSelection(input.files?.[0] ?? null);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.handleFileSelection(event.dataTransfer?.files?.[0] ?? null);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onPreview(page = 0): void {
    if (!this.selectedFile && !this.currentJobId) {
      this.validationMessage = 'Select a CSV, XLS, or XLSX file to continue.';
      return;
    }

    this.clearMessages();
    if (!this.currentJobId) {
      this.uploadAndGeneratePreview(page);
      return;
    }

    if (!this.previewResponse) {
      this.generatePreview(page);
      return;
    }

    this.loadPreviewPage(page);
  }

  onStartProcessing(): void {
    if (!this.currentJobId) {
      this.validationMessage = 'Preview the file before starting processing.';
      return;
    }

    if (!this.canStartProcessing) {
      Swal.fire('Unable to start', 'Preview the file and ensure at least one valid row is available.', 'info');
      return;
    }

    this.processing = true;
    this.pendingTransition = null;
    this.completionNotified = false;
    const startSub = this.csvUploadService.start(this.currentJobId).subscribe({
      next: ({ data, message }) => {
        this.applyStatusResponse(data);
        this.startPolling();
        Swal.fire('Processing started', message || 'The backend job has started.', 'success');
      },
      error: (error: Error) => {
        this.processing = false;
        Swal.fire('Processing failed', error.message, 'error');
      }
    });

    this.subscriptions.push(startSub);
  }

  onPauseProcessing(): void {
    this.invokeJobAction('pause', 'PAUSED', 'Pause requested', 'The job will pause safely after the current batch.');
  }

  onResumeProcessing(): void {
    this.invokeJobAction('resume', null, 'Processing resumed', 'The backend job has resumed.');
  }

  onCancelProcessing(): void {
    this.invokeJobAction('cancel', 'CANCELLED', 'Cancellation requested', 'The job will stop safely after the current batch.');
  }

  downloadSampleCsv(): void {
    const csvLines = [
      CsvUploadComponent.SAMPLE_HEADERS.join(','),
      ...CsvUploadComponent.SAMPLE_ROWS.map((row) =>
        CsvUploadComponent.SAMPLE_HEADERS.map((header) => this.escapeCsvValue(String(row[header as keyof typeof row] ?? ''))).join(',')
      )
    ];

    this.downloadBlob(
      new Blob([`\uFEFF${csvLines.join('\r\n')}`], { type: 'text/csv;charset=utf-8;' }),
      'mahasbr-upload-sample.csv'
    );
  }

  downloadSampleExcel(): void {
    const worksheetData = [
      CsvUploadComponent.SAMPLE_HEADERS,
      ...CsvUploadComponent.SAMPLE_ROWS.map((row) =>
        CsvUploadComponent.SAMPLE_HEADERS.map((header) => row[header as keyof typeof row] ?? '')
      )
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sample Upload');
    XLSX.writeFile(workbook, 'mahasbr-upload-sample.xlsx');
  }

  onReset(): void {
    this.stopPolling();
    this.uploadForm.reset();
    this.selectedFile = null;
    this.uploadSession = null;
    this.previewResponse = null;
    this.jobStatus = null;
    this.successPage = null;
    this.failedPage = null;
    this.previewRecords = [];
    this.successRecords = [];
    this.failedRecords = [];
    this.validationMessage = '';
    this.uploading = false;
    this.loadingPreview = false;
    this.loadingResults = false;
    this.statusRequestInFlight = false;
    this.processing = false;
    this.activeResultTab = 'success';
    this.previewPageNumber = 0;
    this.successPageNumber = 0;
    this.failedPageNumber = 0;
    this.completionNotified = false;
    this.pendingTransition = null;

    if (this.fileInput?.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
  }

  setActiveResultTab(tab: ResultTab): void {
    this.activeResultTab = tab;
    this.loadActiveResultPage(0);
  }

  goToPreviewPage(page: number): void {
    if (!this.previewResponse || page < 0 || page >= this.previewResponse.totalPages) {
      return;
    }
    this.loadPreviewPage(page);
  }

  goToSuccessPage(page: number): void {
    if (!this.successPage || page < 0 || page >= this.successPage.totalPages) {
      return;
    }
    this.loadSuccessPage(page);
  }

  goToFailedPage(page: number): void {
    if (!this.failedPage || page < 0 || page >= this.failedPage.totalPages) {
      return;
    }
    this.loadFailedPage(page);
  }

  get currentJobId(): string | null {
    return (
      this.uploadSession?.jobId ||
      this.uploadSession?.uploadId ||
      this.previewResponse?.jobId ||
      this.previewResponse?.uploadId ||
      this.jobStatus?.jobId ||
      this.jobStatus?.uploadId ||
      null
    );
  }

  get canStartProcessing(): boolean {
    if (this.jobStatus) {
      return this.jobStatus.canStart ?? this.jobStatus.canProcess ?? false;
    }
    return (this.previewResponse?.validRecords ?? 0) > 0;
  }

  get canPauseProcessing(): boolean {
    return !!this.jobStatus?.canPause && !this.loadingPreview && !this.loadingResults;
  }

  get canResumeProcessing(): boolean {
    return !!this.jobStatus?.canResume && !this.loadingPreview && !this.loadingResults;
  }

  get canCancelProcessing(): boolean {
    return !!this.jobStatus?.canCancel && !this.loadingPreview;
  }

  get selectedFileName(): string {
    return this.selectedFile?.name || this.uploadSession?.fileName || '';
  }

  get selectedFileSizeMb(): string {
    const fileSize = this.selectedFile?.size ?? this.uploadSession?.fileSize ?? 0;
    return (fileSize / (1024 * 1024)).toFixed(2);
  }

  get hasResults(): boolean {
    return !!this.jobStatus && this.jobStatus.processedRecords > 0;
  }

  get currentStatusLabel(): string {
    return this.jobStatus?.status || this.previewResponse?.status || this.uploadSession?.status || 'IDLE';
  }

  get progressPercentage(): number {
    return this.jobStatus?.progressPercentage ?? 0;
  }

  get totalRecords(): number {
    return this.jobStatus?.totalRecords ?? this.previewResponse?.totalRecords ?? 0;
  }

  get processedRecords(): number {
    return this.jobStatus?.processedRecords ?? 0;
  }

  get successRecordsCount(): number {
    return this.jobStatus?.successRecords ?? this.jobStatus?.insertedRecords ?? 0;
  }

  get failedRecordsCount(): number {
    if (this.jobStatus) {
      return this.jobStatus.failedRecords;
    }
    return this.previewResponse?.invalidRecords ?? 0;
  }

  get pendingRecordsCount(): number {
    if (this.jobStatus) {
      return this.jobStatus.pendingRecords ?? Math.max(0, (this.jobStatus.totalRecords ?? 0) - (this.jobStatus.processedRecords ?? 0));
    }
    return Math.max(0, (this.previewResponse?.totalRecords ?? 0) - (this.previewResponse?.invalidRecords ?? 0));
  }

  get previewSummaryAvailable(): boolean {
    return !!this.previewResponse;
  }

  get shouldShowProgress(): boolean {
    return !!(this.uploadSession || this.previewResponse || this.jobStatus);
  }

  get progressStatusMessage(): string {
    if (this.jobStatus) {
      return `${this.processedRecords} / ${this.totalRecords} records processed`;
    }

    if (this.loadingPreview || this.uploading) {
      return 'Preparing preview for the selected file. Large files can take a little longer.';
    }

    if (this.previewResponse) {
      return 'Preview is ready. Start processing to begin the import and track live progress.';
    }

    return 'Upload a file to begin preview and processing.';
  }

  getPreviewCellValue(record: CsvUploadPreviewRecord, key: PreviewColumnKey): string | number {
    if (key === 'srNo') {
      return record.rowNumber;
    }

    return record[key] || '-';
  }

  getFailedReason(record: CsvUploadFailedRecord): string {
    return record.errorReason || record.reason || '-';
  }

  getSuccessBrn(record: CsvUploadSuccessRecord): string {
    return record.brn || record.brnNo || record.generatedBrn || '-';
  }

  trackByRowNumber(_: number, record: CsvUploadPreviewRecord | CsvUploadSuccessRecord | CsvUploadFailedRecord): number {
    return record.rowNumber;
  }

  ngOnDestroy(): void {
    this.stopPolling();
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  private handleFileSelection(file: File | null): void {
    this.onReset();
    this.clearMessages();

    if (!file) {
      this.uploadForm.patchValue({ file: null });
      return;
    }

    const validationError = this.validateFile(file);
    if (validationError) {
      this.uploadForm.patchValue({ file: null });
      this.validationMessage = validationError;
      if (this.fileInput?.nativeElement) {
        this.fileInput.nativeElement.value = '';
      }
      return;
    }

    this.selectedFile = file;
    this.uploadForm.patchValue({ file });
    this.uploadAndGeneratePreview(0);
  }

  private uploadAndGeneratePreview(page: number): void {
    if (!this.selectedFile) {
      this.validationMessage = 'Select a CSV, XLS, or XLSX file to continue.';
      return;
    }

    this.uploading = true;
    const uploadSub = this.csvUploadService
      .upload(this.selectedFile)
      .pipe(finalize(() => (this.uploading = false)))
      .subscribe({
        next: ({ data }) => {
          this.uploadSession = data;
          this.jobStatus = null;
          this.previewResponse = null;
          this.previewRecords = [];
          this.validationMessage = '';
          this.generatePreview(page);
        },
        error: (error: Error) => {
          this.validationMessage = error.message;
          Swal.fire('Upload failed', error.message, 'error');
        }
      });

    this.subscriptions.push(uploadSub);
  }

  private generatePreview(page: number): void {
    if (!this.currentJobId) {
      return;
    }

    this.loadingPreview = true;
    const previewSub = this.csvUploadService
      .generatePreview(this.currentJobId, page, this.previewPageSize)
      .pipe(finalize(() => (this.loadingPreview = false)))
      .subscribe({
        next: ({ data }) => {
          this.applyPreviewResponse(data);
        },
        error: (error: Error) => {
          this.validationMessage = error.message;
          Swal.fire('Preview failed', error.message, 'error');
        }
      });

    this.subscriptions.push(previewSub);
  }

  private loadPreviewPage(page: number): void {
    if (!this.currentJobId) {
      return;
    }

    this.loadingPreview = true;
    const pageSub = this.csvUploadService
      .getPreviewPage(this.currentJobId, page, this.previewPageSize)
      .pipe(finalize(() => (this.loadingPreview = false)))
      .subscribe({
        next: ({ data }) => {
          this.applyPreviewResponse(data);
        },
        error: (error: Error) => {
          this.validationMessage = error.message;
        }
      });

    this.subscriptions.push(pageSub);
  }

  private applyPreviewResponse(response: CsvUploadPreviewResponse): void {
    this.previewResponse = response;
    this.previewRecords = response.records ?? [];
    this.previewPageNumber = response.pageNumber;
  }

  private loadActiveResultPage(page = 0): void {
    if (!this.currentJobId) {
      return;
    }

    if (this.activeResultTab === 'success') {
      this.loadSuccessPage(page);
      return;
    }

    this.loadFailedPage(page);
  }

  private loadSuccessPage(page: number): void {
    if (!this.currentJobId) {
      return;
    }

    this.loadingResults = true;
    const successSub = this.csvUploadService
      .getSuccessPage(this.currentJobId, page, this.previewPageSize)
      .pipe(finalize(() => (this.loadingResults = false)))
      .subscribe({
        next: ({ data }) => {
          this.successPage = data;
          this.successRecords = data.records ?? [];
          this.successPageNumber = data.pageNumber;
        }
      });

    this.subscriptions.push(successSub);
  }

  private loadFailedPage(page: number): void {
    if (!this.currentJobId) {
      return;
    }

    this.loadingResults = true;
    const failedSub = this.csvUploadService
      .getFailedPage(this.currentJobId, page, this.previewPageSize)
      .pipe(finalize(() => (this.loadingResults = false)))
      .subscribe({
        next: ({ data }) => {
          this.failedPage = data;
          this.failedRecords = data.records ?? [];
          this.failedPageNumber = data.pageNumber;
        }
      });

    this.subscriptions.push(failedSub);
  }

  private invokeJobAction(
    action: 'pause' | 'resume' | 'cancel',
    pendingTransition: PendingTransition,
    title: string,
    successMessage: string
  ): void {
    if (!this.currentJobId) {
      return;
    }

    const actionRequest =
      action === 'pause'
        ? this.csvUploadService.pause(this.currentJobId)
        : action === 'resume'
          ? this.csvUploadService.resume(this.currentJobId)
          : this.csvUploadService.cancel(this.currentJobId);

    const actionSub = actionRequest.subscribe({
      next: ({ data }) => {
        this.pendingTransition = pendingTransition;
        this.applyStatusResponse(data);
        this.startPolling();
        Swal.fire(title, successMessage, 'success');
      },
      error: (error: Error) => {
        Swal.fire('Action failed', error.message, 'error');
      }
    });

    this.subscriptions.push(actionSub);
  }

  private startPolling(): void {
    this.stopPolling();
    this.pollTimer = window.setInterval(() => this.fetchStatus(), 2000);
    this.fetchStatus();
  }

  private fetchStatus(): void {
    if (!this.currentJobId || this.statusRequestInFlight) {
      return;
    }

    this.statusRequestInFlight = true;
    const statusSub = this.csvUploadService
      .getStatus(this.currentJobId)
      .pipe(finalize(() => (this.statusRequestInFlight = false)))
      .subscribe({
        next: ({ data }) => {
          this.applyStatusResponse(data);
        },
        error: (error: Error) => {
          this.processing = false;
          this.stopPolling();
          this.validationMessage = error.message;
        }
      });

    this.subscriptions.push(statusSub);
  }

  private applyStatusResponse(data: CsvUploadStatusResponse): void {
    this.jobStatus = data;
    this.processing = data.status === 'PROCESSING';

    if (this.hasResults) {
      this.loadActiveResultPage(this.activeResultTab === 'success' ? this.successPageNumber : this.failedPageNumber);
    }

    if (data.status === 'PROCESSING') {
      return;
    }

    if (data.status === 'PAUSED') {
      this.pendingTransition = null;
      this.stopPolling();
      return;
    }

    if (data.status === 'COMPLETED' || data.status === 'FAILED' || data.status === 'CANCELLED') {
      this.pendingTransition = null;
      this.stopPolling();
      this.loadSuccessPage(0);
      this.loadFailedPage(0);

      if (!this.completionNotified) {
        this.completionNotified = true;
        const title =
          data.status === 'COMPLETED'
            ? 'Processing completed'
            : data.status === 'FAILED'
              ? 'Processing failed'
              : 'Processing cancelled';
        const icon = data.status === 'COMPLETED' ? 'success' : data.status === 'FAILED' ? 'error' : 'warning';
        Swal.fire(title, data.message || 'The upload job has finished.', icon);
      }
      return;
    }

    if (this.pendingTransition && data.status !== this.pendingTransition) {
      return;
    }

    this.stopPolling();
  }

  private stopPolling(): void {
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
    }
  }

  private validateFile(file: File): string | null {
    const extension = file.name.split('.').pop()?.toLowerCase() ?? '';
    if (!this.allowedExtensions.has(extension)) {
      return 'Only CSV, XLS, and XLSX files are allowed.';
    }

    if (file.size > this.maxFileSize) {
      return 'File size must be 50 MB or less.';
    }

    return null;
  }

  private clearMessages(): void {
    this.validationMessage = '';
  }

  private escapeCsvValue(value: string): string {
    const escapedValue = value.replace(/"/g, '""');
    return /[",\r\n]/.test(escapedValue) ? `"${escapedValue}"` : escapedValue;
  }

  private downloadBlob(blob: Blob, fileName: string): void {
    const downloadUrl = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = downloadUrl;
    anchor.download = fileName;
    anchor.click();
    URL.revokeObjectURL(downloadUrl);
  }
}
