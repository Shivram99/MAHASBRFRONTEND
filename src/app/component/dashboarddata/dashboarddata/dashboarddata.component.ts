// src/app/dashboarddata/dashboarddata.component.ts
import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../services/dashboard/data-service.service'; 

@Component({
    selector: 'app-dashboarddata',
    templateUrl: './dashboarddata.component.html',
    styleUrls: ['./dashboarddata.component.css'],
    standalone: false
})
export class DashboarddataComponent implements OnInit {
  filter = '';
  data = [];

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.updateData();
  }

  updateData(): void {
    if (this.filter) {
    //  this.dataService.getDataByCategory(this.filter).subscribe(data => this.data = data);
    } else {
     // this.dataService.getData().subscribe(data => this.data = data);
    }
  }

  onFilterChange(event: any): void {
    this.filter = event.target.value;
    this.updateData();
  }
}
