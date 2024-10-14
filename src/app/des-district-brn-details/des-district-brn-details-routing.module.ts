import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DesDistrictBrnDetailsComponent } from './des-district-brn-details.component';
import { DistrictBRNDetailsComponent } from '../component/district-brndetails/district-brndetails.component';
import { DashboardDetailsComponent } from '../component/dashboard-details/dashboard-details.component';

const routes: Routes = [{ path: '', component: DesDistrictBrnDetailsComponent  ,children: [
  {
    path: '',
    component: DistrictBRNDetailsComponent
  },
  {
    path: 'detailsPage',
    component: DistrictBRNDetailsComponent
  },
  {
    path: 'dashboard-details/:brnNo',
    component: DashboardDetailsComponent
  },
] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DesDistrictBrnDetailsRoutingModule { }
