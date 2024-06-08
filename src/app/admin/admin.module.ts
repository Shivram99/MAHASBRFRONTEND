import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';

import { RegisterUserComponent } from '../component/register-user/register-user.component';
import { FormsModule } from '@angular/forms';
import { DashboardComponent } from '../component/dashboard/dashboard.component';
import { DashboardBarChartComponent } from '../component/dashboard-bar-chart/dashboard-bar-chart.component';
import { DashboarddataComponent } from '../component/dashboarddata/dashboarddata/dashboarddata.component';
import { ChartfilterComponent } from '../component/chartfilter/chartfilter.component';

console.log("properly loaded")
@NgModule({
  declarations: [RegisterUserComponent,DashboardComponent,DashboardBarChartComponent,
    DashboarddataComponent,
    ChartfilterComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule
  ]
})
export class AdminModule { }
