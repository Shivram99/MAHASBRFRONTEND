import { Component } from '@angular/core';
import { FileUploadService } from '../../services/file-upload.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { BRNGenerationRecordCount } from '../../interfaces/brngeneration-record-count';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-upload-csv',
  templateUrl: './upload-csv.component.html',
  styleUrls: ['./upload-csv.component.css']
})
export class UploadCsvComponent {
  selectedFiles: File[] = [];
  uploadProgress: number = 0;

  bRNGenerationRecordCount:BRNGenerationRecordCount | undefined;

  constructor(private fileUploadService: FileUploadService) {}

  onFileChange(event: any): void {
    if (event.target.files.length > 0) {
      this.selectedFiles = Array.from(event.target.files);
    }
  }

  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
  }

  uploadFile(): void {
    if (this.selectedFiles.length === 0) {
      alert('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    this.selectedFiles.forEach(file => {
      formData.append('file', file);
    });

    this.fileUploadService.uploadFile(formData).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          this.uploadProgress = Math.round((100 * event.loaded) / event.total);
        } else if (event instanceof HttpResponse) {
          if (event.body !== null) {  // Check if event.body is not null
            this.bRNGenerationRecordCount = event.body;  // Assign only if it's not null
            console.log('Upload successful:', this.bRNGenerationRecordCount);
            Swal.fire({
              title: "File Upload successful",
              text: "File Upload successful",
              icon: "success"
            });
            this.uploadProgress = 0;  // Reset progress after upload
            this.selectedFiles = [];  // Clear file list after upload
          } else {
            console.error('Upload failed: Response body is null');
            alert('Upload failed: Response body is null');
            Swal.fire({
              title: "File Upload failed",
              text: "File Upload failed",
              icon: "error"
            });
            this.uploadProgress = 0;
          }
        }
      },
      error: (error) => {
        console.error('Upload failed:', error);
        alert('Upload failed.');
        this.uploadProgress = 0;  // Reset progress if upload fails
      }
    });
  }

  downloadFile(fileName: string): void {
    this.fileUploadService.downloadFile(fileName).subscribe(blob => {
      const a = document.createElement('a');
      const objectUrl = URL.createObjectURL(blob);
      a.href = objectUrl;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(objectUrl);
    });
  }
}
