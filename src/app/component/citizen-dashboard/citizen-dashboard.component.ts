import { Component } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileUploadService } from '../../services/file-upload.service';
import { HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';

import { MstRegistryDetailsPage } from '../../model/mst-registry-details-page';
import { BRNGenerationRecordCount } from '../../interfaces/brngeneration-record-count';
import { PaginatedResponse } from '../../interface/paginated-response';
import { Router } from '@angular/router';

@Component({
    selector: 'app-citizen-dashboard',
    templateUrl: './citizen-dashboard.component.html',
    styleUrl: './citizen-dashboard.component.css',
    standalone: false
})
export class CitizenDashboardComponent {

  registryDetails: MstRegistryDetailsPage[]=[];
  brnGenerationRecordCount?: BRNGenerationRecordCount



  currentTemplate: string = '';

  showTemplate(template: string): void {
    this.currentTemplate = template;
  }
  // ngOnInit(): void {

  //   this.getRegistryDetailsPage()
  // }


  // getRegistryDetailsPage():void{
  //   // this.fileUploadService.getRegistryDetailsPage().subscribe(
  //   //   (response: MstRegistryDetailsPage[]) => { // Expecting an array of MstRegistryDetailsPage
  //   //     this.registryDetails = response;
  //   //     console.log('Form submitted successfully', this.registryDetails);
  //   //   },
  //   //   error => {
  //   //     console.error('Error submitting form', error);
        
  //   //   });
  //   }
    

  //   this.fileUploadService.uploadFile(this.selectedFile).subscribe({
  //     next: (event: HttpEvent<any>) => {
  //       if (event.type === HttpEventType.UploadProgress) {
  //         if (event.total) {
  //           // Calculate and update the upload progress percentage
  //           this.uploadProgress = Math.round((100 * event.loaded) / event.total);
  //         }
  //       } else if (event instanceof HttpResponse) {
  //         // Handle the successful response

  //         let responseBody: any;

  //         if (typeof event.body === 'string') {
  //           try {
  //             responseBody = JSON.parse(event.body);
  //           } catch (error) {
  //             console.error('Failed to parse JSON:', error);
  //             return;
  //           }
  //         } else {
  //           responseBody = event.body;
  //         }
  //         if (responseBody && typeof responseBody === 'object') {
  //           this.brnGenerationRecordCount = {
  //             totalBRNGeneretion: responseBody.totalBRNGeneretion ?? 0,
  //             concernData: responseBody.concernData ?? 0,
  //             duplicateGeneration: responseBody.duplicateGeneration ?? 0,
  //             totalGeneration: responseBody.totalGeneration ?? 0,
  //           };
  //         }
  //         alert('File uploaded successfully!');
  //         console.log("event.body"+event.body)
  //         this.clearFile()
  //         this.uploadProgress = 0; // Reset progress after successful upload
  //       }
  //     },
  //     error: (error) => {
  //       console.error('Upload failed:', error);
  //       alert('Upload failed. Please try again.');
  //       this.uploadProgress = 0; // Reset progress if upload fails
  //     }
  //   });
    
  // }
  // getRegistryDetailsPage():void{
  // this.fileUploadService.getRegistryDetailsPage().subscribe(
  //   (response: PaginatedResponse<MstRegistryDetailsPage>) => { // Expecting an array of MstRegistryDetailsPage
  //     this.registryDetails = response.content;
  //     console.log('MST details', response);
  //   },
  //   error => {
  //     console.error('Error submitting form', error);
      
  //   });
  // }

  // clearFile(): void {
  //   this.selectedFile=undefined;
  //   this.fileInfo = '';
  //   this.uploadProgress = 0;
  //   const fileInput = document.querySelector('.file-input') as HTMLInputElement;
  //   if (fileInput) {
  //     fileInput.value = ''; // Reset the file input
  //   }
  // }


  
  constructor(private router: Router,private fileUploadService:FileUploadService) {}

}
