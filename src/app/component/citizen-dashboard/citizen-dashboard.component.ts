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
  styleUrl: './citizen-dashboard.component.css'
})
export class CitizenDashboardComponent {

  registryDetails: MstRegistryDetailsPage[]=[];
  brnGenerationRecordCount?: BRNGenerationRecordCount
  
  constructor(private router: Router,private fileUploadService:FileUploadService) {}
  
}
