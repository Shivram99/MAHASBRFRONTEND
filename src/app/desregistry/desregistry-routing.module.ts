import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DESRegistryComponent } from './desregistry.component';
import { BRNregistoryDetailsComponent } from '../component/brnregistory-details/brnregistory-details.component';
import { UploadCsvComponent } from '../component/upload-csv/upload-csv.component';
import { DashboardDetailsComponent } from '../component/dashboard-details/dashboard-details.component';
import { DuplicatedeatilsComponent } from '../component/duplicatedeatils/duplicatedeatils.component';
import { ConcerndetailsComponent } from '../component/concerndetails/concerndetails.component';

const routes: Routes = [
  {
    path: '',
    component: DESRegistryComponent, // Parent component
    children: [
      {
        path: '',
        component: BRNregistoryDetailsComponent
      },
      {
        path: 'detailsPage',
        component: BRNregistoryDetailsComponent
      },
      {
        path: 'upload-csv',
        component: UploadCsvComponent
      },
      {
        path: 'dashboard-details/:brnNo',
        component: DashboardDetailsComponent
      },
      {
        path: 'duplicate-details',
        component: DuplicatedeatilsComponent
      },
      {
        path: 'concern-details',
        component: ConcerndetailsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DESRegistryRoutingModule { }
