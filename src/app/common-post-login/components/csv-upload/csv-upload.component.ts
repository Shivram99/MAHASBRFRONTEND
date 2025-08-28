import { Component } from '@angular/core';
import { BRNGenerationRecordCount } from '../../../interfaces/brngeneration-record-count';
import { FileUploadService } from '../../../services/file-upload.service';
import { HttpClient, HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-csv-upload',
  standalone: false,
  templateUrl: './csv-upload.component.html',
  styleUrl: './csv-upload.component.css'
})
export class CsvUploadComponent {
  // selectedFiles: File[] = [];
  //   uploadProgress: number = 0;

  //   bRNGenerationRecordCount:BRNGenerationRecordCount | undefined;

  //   constructor(private fileUploadService: FileUploadService) {}

  //   onFileChange(event: any): void {
  //     if (event.target.files.length > 0) {
  //       this.selectedFiles = Array.from(event.target.files);
  //     }
  //   }

  //   removeFile(index: number): void {
  //     this.selectedFiles.splice(index, 1);
  //   }

  //   uploadFile(): void {
  //     if (this.selectedFiles.length === 0) {
  //       alert('Please select a file to upload.');
  //       return;
  //     }

  //     const formData = new FormData();
  //     this.selectedFiles.forEach(file => {
  //       formData.append('file', file);
  //     });

  //     this.fileUploadService.uploadFile(formData).subscribe({
  //       next: (event) => {
  //         if (event.type === HttpEventType.UploadProgress && event.total) {
  //           this.uploadProgress = Math.round((100 * event.loaded) / event.total);
  //         } else if (event instanceof HttpResponse) {
  //           if (event.body !== null) {  // Check if event.body is not null
  //             this.bRNGenerationRecordCount = event.body;  // Assign only if it's not null
  //             console.log('Upload successful:', this.bRNGenerationRecordCount);
  //             Swal.fire({
  //               title: "File Upload successful",
  //               text: "File Upload successful",
  //               icon: "success"
  //             });
  //             this.uploadProgress = 0;  // Reset progress after upload
  //             this.selectedFiles = [];  // Clear file list after upload
  //           } else {
  //             console.error('Upload failed: Response body is null');
  //             alert('Upload failed: Response body is null');
  //             Swal.fire({
  //               title: "File Upload failed",
  //               text: "File Upload failed",
  //               icon: "error"
  //             });
  //             this.uploadProgress = 0;
  //           }
  //         }
  //       },
  //       error: (error) => {
  //         console.error('Upload failed:', error);
  //         alert('Upload failed.');
  //         this.uploadProgress = 0;  // Reset progress if upload fails
  //       }
  //     });
  //   }

  //   downloadFile(fileName: string): void {
  //     this.fileUploadService.downloadFile(fileName).subscribe(blob => {
  //       const a = document.createElement('a');
  //       const objectUrl = URL.createObjectURL(blob);
  //       a.href = objectUrl;
  //       a.download = fileName;
  //       a.click();
  //       URL.revokeObjectURL(objectUrl);
  //     });
  //   }


  uploadForm: FormGroup;
  selectedFiles: File[] = [];
  uploadProgress = 0;

  validationMessages: string[] = [];
  successMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private translate: TranslateService,
    private fileUploadService: FileUploadService
  ) {
    this.uploadForm = this.fb.group({
      file: [null, Validators.required]
    });
  }

  /** Handle File Selection */
  onFileSelected(event: any) {
    const files: FileList = event.target.files;
    if (files && files.length > 0) {
      this.validateAndAddFiles(files);
    }
  }

  /** Handle Drag & Drop */
  onDrop(event: DragEvent) {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.validateAndAddFiles(files);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  /** Validate & Add Files */
  validateAndAddFiles(files: FileList) {
    this.validationMessages = []; // Reset messages
    this.selectedFiles = [];      // Reset files

    const validTypes = [
      'text/csv',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel' // old .xls
    ];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      //  File Type Validation
      if (!validTypes.includes(file.type)) {

        this.translate.get('upload.INVALID_FILE', { file: file.name })
          .subscribe((translatedMsg: string) => {
            this.validationMessages.push(translatedMsg);
          });
        continue;
      }

      //  File Size Validation (Max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.translate.get('upload.FILEESIZE', { file: file.name })
          .subscribe((translatedMsg: string) => {
            this.validationMessages.push(translatedMsg);
          });
        continue;
      }

      this.selectedFiles.push(file);
    }

    // Auto-clear messages after 1 minute if any
    if (this.validationMessages.length > 0) {
      setTimeout(() => {
        this.validationMessages = [];
      }, 60000);
    }
  }

  /** Remove file before upload */
  removeFile(index: number) {
    this.selectedFiles.splice(index, 1);
  }

  /** Upload to Backend */
  // uploadFiles() {
  //   this.validationMessages = []; // clear old errors
  //   this.successMessage = '';     // clear old success

  //   if (this.selectedFiles.length === 0) {
  //     this.validationMessages = ["⚠ Please select at least one valid file."];
  //     setTimeout(() => this.validationMessages = [], 60000);
  //     return;
  //   }

  //   const formData = new FormData();
  //   this.selectedFiles.forEach(file => formData.append('files', file));

     
  //   this.http.post('http://localhost:8080/api/files/upload', formData, {
  //     reportProgress: true,
  //     observe: 'events'
  //   }).subscribe({
  //     next: (event: HttpEvent<any>) => {
  //       if (event.type === HttpEventType.UploadProgress && event.total) {
  //         this.uploadProgress = Math.round((100 * event.loaded) / event.total);
  //       } else if (event.type === HttpEventType.Response) {
  //         this.successMessage = '✅ Files uploaded successfully!';
  //         this.selectedFiles = [];
  //         this.uploadProgress = 0;

  //         // Auto-clear success message after 1 min
  //         setTimeout(() => this.successMessage = '', 60000);
  //       }
  //     },
  //     error: () => {
  //       this.validationMessages = ['❌ File upload failed!'];
  //       setTimeout(() => this.validationMessages = [], 60000);
  //     }
  //   });
  // }

  uploadFiles() {
    this.validationMessages = [];
    this.successMessage = '';

    if (this.selectedFiles.length === 0) {
      this.validationMessages = ['⚠ Please select at least one valid file.'];
      setTimeout(() => this.validationMessages = [], 60000);
      return;
    }
     debugger
    this.fileUploadService.upload(this.selectedFiles).subscribe({
      next: (event: HttpEvent<any>) => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          this.uploadProgress = Math.round((100 * event.loaded) / event.total);
        } else if (event.type === HttpEventType.Response) {
          this.successMessage = '✅ Files uploaded successfully!';
          this.selectedFiles = [];
          this.uploadProgress = 0;
          setTimeout(() => this.successMessage = '', 60000);
        }
      },
      error: () => {
        this.validationMessages = ['❌ File upload failed!'];
        setTimeout(() => this.validationMessages = [], 60000);
      }
    });
  }
}
