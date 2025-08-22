import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MstRegistryDetailsPage } from '../../model/mst-registry-details-page';
import { DashboardDetailsService } from '../../services/dashboard-details.service';
import { PaginatedResponse } from '../../interface/paginated-response';

@Component({
    selector: 'app-dashboard-details',
    templateUrl: './dashboard-details.component.html',
    styleUrl: './dashboard-details.component.css',
    standalone: false
})
export class DashboardDetailsComponent implements OnInit {
  brn:any;
  mstRegistryDetailsPage!: MstRegistryDetailsPage;

  constructor(private route: ActivatedRoute, private dashboardDetailsService:DashboardDetailsService) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.brn = params.get('brnNo');
      this.getBRNDetails();
      
    });
  }
  
  getBRNDetails(): void {
    this.dashboardDetailsService.getBRNDetails(this.brn).subscribe(
      (data: PaginatedResponse<MstRegistryDetailsPage>) => {
        this.mstRegistryDetailsPage = data.content[0];
        console.log('BRN Details:', this.mstRegistryDetailsPage);
      },
      (error: any) => {
        console.error('Error fetching BRN details:', error);
      }
    );
  }
}
