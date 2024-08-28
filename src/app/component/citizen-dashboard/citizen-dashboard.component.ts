import { Component } from '@angular/core';

import { MstRegistryDetailsPage } from '../../model/mst-registry-details-page';

@Component({
  selector: 'app-citizen-dashboard',
  templateUrl: './citizen-dashboard.component.html',
  styleUrl: './citizen-dashboard.component.css'
})
export class CitizenDashboardComponent {
  registryDetails: MstRegistryDetailsPage[]=[];

  ngOnInit(): void {

    this.getRegistryDetailsPage()
  }

  getRegistryDetailsPage():void{
    // this.fileUploadService.getRegistryDetailsPage().subscribe(
    //   (response: MstRegistryDetailsPage[]) => { // Expecting an array of MstRegistryDetailsPage
    //     this.registryDetails = response;
    //     console.log('Form submitted successfully', this.registryDetails);
    //   },
    //   error => {
    //     console.error('Error submitting form', error);
        
    //   });
    }
    
}
