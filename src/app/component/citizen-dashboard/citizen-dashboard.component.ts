import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileUploadService } from '../../services/file-upload.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { MstRegistryDetailsPage } from '../../model/mst-registry-details-page';

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
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          this.uploadProgress = Math.round((100 * event.loaded) / event.total);
        } else if (event instanceof HttpResponse) {
          console.log('Upload successful:', event.body);
          alert('File uploaded successfully!');
          this.uploadProgress = 0;  // Reset progress after upload
        }
      },
      error: (error) => {
        console.error('Upload failed:', error);
        alert(error);
        this.uploadProgress = 0;  // Reset progress if upload fails
      }
    });
  }
  getRegistryDetailsPage():void{
  this.fileUploadService.getRegistryDetailsPage().subscribe(
    (response: MstRegistryDetailsPage[]) => { // Expecting an array of MstRegistryDetailsPage
      this.registryDetails = response;
      console.log('Form submitted successfully', this.registryDetails);
    },
    error => {
      console.error('Error submitting form', error);
      
    });
  }
}
