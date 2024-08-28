import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileUploadService } from '../../services/file-upload.service';
import { HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import { MstRegistryDetailsPage } from '../../model/mst-registry-details-page';
import { BRNGenerationRecordCount } from '../../interfaces/brngeneration-record-count';
import { PaginatedResponse } from '../../interfaces/paginated-response';

@Component({
  selector: 'app-citizen-dashboard',
  templateUrl: './citizen-dashboard.component.html',
  styleUrl: './citizen-dashboard.component.css'
})
export class CitizenDashboardComponent {
  fileInfo: string = '';
  selectedFile?: File;
  uploadProgress: number = 0;
  registryDetails: MstRegistryDetailsPage[]=[];
  brnGenerationRecordCount?: BRNGenerationRecordCount

  constructor(private fileUploadService: FileUploadService) {}
  ngOnInit(): void {

    this.getRegistryDetailsPage()
  }
  onFileChange(event: any): void {
    const file = event.target.files[0];
    this.selectedFile = file;
    this.fileInfo = file ? file.name : 'No file selected';
  }
  
  uploadFile(): void {
    if (!this.selectedFile) {
      alert('Please select a file to upload.');
      return;
    }

    this.fileUploadService.uploadFile(this.selectedFile).subscribe({
      next: (event: HttpEvent<any>) => {
        if (event.type === HttpEventType.UploadProgress) {
          if (event.total) {
            // Calculate and update the upload progress percentage
            this.uploadProgress = Math.round((100 * event.loaded) / event.total);
          }
        } else if (event instanceof HttpResponse) {
          // Handle the successful response

          let responseBody: any;

          if (typeof event.body === 'string') {
            try {
              responseBody = JSON.parse(event.body);
            } catch (error) {
              console.error('Failed to parse JSON:', error);
              return;
            }
          } else {
            responseBody = event.body;
          }
          if (responseBody && typeof responseBody === 'object') {
            this.brnGenerationRecordCount = {
              totalBRNGeneretion: responseBody.totalBRNGeneretion ?? 0,
              concernData: responseBody.concernData ?? 0,
              duplicateGeneration: responseBody.duplicateGeneration ?? 0,
              totalGeneration: responseBody.totalGeneration ?? 0,
            };
          }
          alert('File uploaded successfully!');
          console.log("event.body"+event.body)
          this.clearFile()
          this.uploadProgress = 0; // Reset progress after successful upload
        }
      },
      error: (error) => {
        console.error('Upload failed:', error);
        alert('Upload failed. Please try again.');
        this.uploadProgress = 0; // Reset progress if upload fails
      }
    });
    
  }
  getRegistryDetailsPage():void{
  this.fileUploadService.getRegistryDetailsPage().subscribe(
    (response: PaginatedResponse<MstRegistryDetailsPage>) => { // Expecting an array of MstRegistryDetailsPage
      this.registryDetails = response.content;
      console.log('MST details', response);
    },
    error => {
      console.error('Error submitting form', error);
      
    });
  }

  clearFile(): void {
    this.selectedFile=undefined;
    this.fileInfo = '';
    this.uploadProgress = 0;
    const fileInput = document.querySelector('.file-input') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = ''; // Reset the file input
    }
  }
}
