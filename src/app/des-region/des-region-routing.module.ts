import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DesRegionComponent } from './des-region.component';
import { RegionBRNDetailsComponent } from '../component/region-brndetails/region-brndetails.component';
import { DashboardDetailsComponent } from '../component/dashboard-details/dashboard-details.component';

const routes: Routes = [{ path: '', component: DesRegionComponent ,children: [
  {
    path: '',
    component: RegionBRNDetailsComponent
  },
  {
    path: 'detailsPage',
    component: RegionBRNDetailsComponent
  },
  {
    path: 'des-district-brn-details/:brnNo',
    component: DashboardDetailsComponent
  },
] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DesRegionRoutingModule { }
