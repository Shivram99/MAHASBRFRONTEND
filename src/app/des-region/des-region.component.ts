import { Component } from '@angular/core';
import { PaginatedResponse } from '../interface/paginated-response';
import { MstRegistryDetailsPage } from '../model/mst-registry-details-page'; 
import { Router } from '@angular/router';
import { DetailsPageDTO } from '../interface/details-page-dto';
import { DataService } from '../services/dashboard/data-service.service'; 
import { Page } from '../interface/page'; 
import { FileUploadService } from '../services/file-upload.service';
import { RegionBrnDetailsService } from '../services/region-brn-details.service';

@Component({
    selector: 'app-des-region',
    templateUrl: './des-region.component.html',
    styleUrl: './des-region.component.css',
    standalone: false
})
export class DesRegionComponent {
}
