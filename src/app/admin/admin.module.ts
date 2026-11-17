import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';

import { RegisterUserComponent } from '../component/register-user/register-user.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardFeatureModule } from '../component/dashboard/dashboard-feature.module';
import { DashboardBarChartComponent } from '../component/dashboard-bar-chart/dashboard-bar-chart.component';
import { DashboarddataComponent } from '../component/dashboarddata/dashboarddata/dashboarddata.component';
import { ChartfilterComponent } from '../component/chartfilter/chartfilter.component';
import { DashboardTabComponent } from '../component/dashboard-tab/dashboard-tab.component';
import { TranslateModule } from '@ngx-translate/core';
import { DepartmentMstComponent } from '../component/department-mst/department-mst.component';
import { DashboardadminComponent } from '../component/dashboardadmin/dashboardadmin.component';
import { ViewDetailsAdminDashBoardComponent } from '../component/view-details-admin-dash-board/view-details-admin-dash-board.component';

@NgModule({
  declarations: [RegisterUserComponent, DashboardBarChartComponent,
    DashboarddataComponent,
    ChartfilterComponent,
    DashboardTabComponent,
    DepartmentMstComponent,
    DashboardadminComponent,
    ViewDetailsAdminDashBoardComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    DashboardFeatureModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
  ]
})
export class AdminModule { }
