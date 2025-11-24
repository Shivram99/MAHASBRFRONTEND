import { Component, OnDestroy } from '@angular/core';
import { BRNGenerationRecordCount } from '../../../interfaces/brngeneration-record-count';
import { FileUploadService } from '../../../services/file-upload.service';
import { HttpClient, HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';
import { RegistryRowDto } from '../../../interface/registry-row-dto';


@Component({
  selector: 'app-csv-upload',
  standalone: false,
  templateUrl:'./csv-upload.component.html',
  styleUrl: './csv-upload.component.css'
})
export class CsvUploadComponent implements OnDestroy {  uploadForm: FormGroup;
  selectedFiles: File[] = [];
  uploadProgress = 0;

  validationMessages: string[] = [];
  successMessage = '';

  // Preview
  previewRows: RegistryRowDto[] = [];
  previewVisible = false;
  previewFileName = '';

  // SSE processing progress
  processingProgress: Record<string, number> = {};
  processingFileMap: Record<string, string> = {};
  private sseConnections: Record<string, EventSource> = {};

  private subscriptions: Subscription[] = [];

  private readonly ALLOWED_TYPES = [
    'text/csv',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel'
  ];
  private readonly MAX_FILE_SIZE = 100 * 1024 * 1024; // 5MB

  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    private fileUploadService: FileUploadService
  ) {
    this.uploadForm = this.fb.group({
      file: [null, Validators.required]
    });
  }

  // -------------------------
  // File Selection
  // -------------------------
  onFileSelected(event: any): void {
    const files = event.target.files;
    if (files && files.length > 0) {
      this.resetValidation();
      this.validateAndAddFiles(files);
    }
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.resetValidation();
      this.validateAndAddFiles(files);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  private validateAndAddFiles(files: FileList): void {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (!this.ALLOWED_TYPES.includes(file.type)) {
        this.translate.get('upload.INVALID_FILE', { file: file.name }).subscribe(msg => {
          this.validationMessages.push(msg);
        });
        continue;
      }

      if (file.size > this.MAX_FILE_SIZE) {
        this.translate.get('upload.FILEESIZE', { file: file.name }).subscribe(msg => {
          this.validationMessages.push(msg);
        });
        continue;
      }

      this.selectedFiles.push(file);
    }

    this.autoClearValidationMessages();
  }

  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
  }

  // -------------------------
  // Upload + SSE
  // -------------------------
  uploadFiles(): void {
    this.resetValidation();

    if (this.selectedFiles.length === 0) {
      this.validationMessages = ['⚠ Please select at least one valid file.'];
      this.autoClearValidationMessages();
      return;
    }

    this.uploadProgress = 0;

    const uploadSub = this.fileUploadService.upload(this.selectedFiles).subscribe({
      next: (event: HttpEvent<any>) => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          this.uploadProgress = Math.round((100 * event.loaded) / event.total);
        }

        if (event.type === HttpEventType.Response) {
          const response = event.body;
          this.successMessage = '✅ Files uploaded successfully!';
          this.uploadProgress = 0;
          this.selectedFiles = [];

          setTimeout(() => (this.successMessage = ''), 60000);

          // SSE subscribe for each file
          if (response?.files) {
            response.files.forEach((file: any) => {
              const fileId = file.fileId;
              const fileName = file.fileName || fileId;

              this.processingFileMap[fileId] = fileName;
              this.processingProgress[fileId] = 0;

              this.listenToProcessingProgress(fileId, fileName);
            });
          }
        }
      },
      error: () => {
        this.validationMessages = ['❌ File upload failed!'];
        this.autoClearValidationMessages();
      }
    });

    this.subscriptions.push(uploadSub);
  }

  private listenToProcessingProgress(fileId: string, fileName: string): void {
    if (this.sseConnections[fileId]) {
      return;
    }

    const es = this.fileUploadService.progressEventSource(fileId);
    this.sseConnections[fileId] = es;

    es.onmessage = (event: MessageEvent) => {
      const percent = Number(event.data);

      if (!isNaN(percent)) {
        this.processingProgress[fileId] = percent;
      }

      if (percent >= 100) {
        this.processingProgress[fileId] = 100;
        Swal.fire('Success', `${fileName} processed`, 'success');
        this.closeSse(fileId);
      }

      if (percent === -1) {
        Swal.fire('Error', `${fileName} failed during processing`, 'error');
        this.closeSse(fileId);
      }
    };

    es.onerror = () => {
      Swal.fire('Error', `${fileName} failed due to SSE error`, 'error');
      this.processingProgress[fileId] = -1;
      this.closeSse(fileId);
    };
  }

  private closeSse(fileId: string): void {
    if (this.sseConnections[fileId]) {
      try {
        this.sseConnections[fileId].close();
      } catch {}
      delete this.sseConnections[fileId];
    }
  }

  // -------------------------
  // Preview
  // -------------------------
  previewFile(file: File): void {
    this.previewRows = [];
    this.previewVisible = false;
    this.previewFileName = file.name;

    const sub = this.fileUploadService.preview(file).subscribe({
      next: (res) => {
        this.previewRows = res.rows || [];
        this.previewVisible = true;
      },
      error: () => {
        this.validationMessages.push('❌ Preview failed.');
        this.autoClearValidationMessages();
      }
    });

    this.subscriptions.push(sub);
  }

  hasValidRows(): boolean {
    return Array.isArray(this.previewRows) && this.previewRows.some(r => r.valid);
  }

  closePreview(): void {
    this.previewVisible = false;
  }

  saveValidRows(): void {
    const validRows = this.previewRows.filter(r => r.valid).map(r => r.rowData);

    if (validRows.length === 0) {
      Swal.fire('No valid rows', 'Nothing to save', 'info');
      return;
    }

    const sub = this.fileUploadService.save(validRows).subscribe({
      next: () => {
        Swal.fire('Saved', 'Valid rows saved successfully', 'success');
        this.previewVisible = false;
      },
      error: () => {
        Swal.fire('Error', 'Save failed', 'error');
      }
    });

    this.subscriptions.push(sub);
  }

  // -------------------------
  // Download sample
  // -------------------------
  downloadFile(fileName: string): void {
    const sub = this.fileUploadService.downloadFile(fileName).subscribe(blob => {
      const a = document.createElement('a');
      const url = URL.createObjectURL(blob);
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
    });

    this.subscriptions.push(sub);
  }

  // -------------------------
  // Utility
  // -------------------------
  private resetValidation(): void {
    this.validationMessages = [];
  }

  private autoClearValidationMessages(): void {
    if (this.validationMessages.length > 0) {
      setTimeout(() => (this.validationMessages = []), 60000);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());

    Object.keys(this.sseConnections).forEach(id => {
      try {
        this.sseConnections[id].close();
      } catch {}
    });
  }
}
