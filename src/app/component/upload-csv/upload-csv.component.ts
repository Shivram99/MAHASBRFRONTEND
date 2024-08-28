import { Component } from '@angular/core';
import { FileUploadService } from '../../services/file-upload.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-upload-csv',
  templateUrl: './upload-csv.component.html',
  styleUrls: ['./upload-csv.component.css']
})
export class UploadCsvComponent {
  selectedFiles: File[] = [];
  uploadProgress: number = 0;

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
      formData.append('files', file);
    });

    this.fileUploadService.uploadFile(formData).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          this.uploadProgress = Math.round((100 * event.loaded) / event.total);
        } else if (event instanceof HttpResponse) {
          console.log('Upload successful:', event.body);
          alert('Files uploaded successfully!');
          this.uploadProgress = 0;  // Reset progress after upload
          this.selectedFiles = [];  // Clear file list after upload
        }
      },
      error: (error) => {
        console.error('Upload failed:', error);
        alert('Upload failed.');
        this.uploadProgress = 0;  // Reset progress if upload fails
      }
    });
  }
}
