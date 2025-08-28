import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from '../shared/components/layout/layout.component';
import { BRNregistoryDetailsComponent } from './components/brn-registry-details/brn-registry-details.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { DashboardDetailsComponent } from '../component/dashboard-details/dashboard-details.component';
import { DashboardBrnDetailsComponent } from './components/dashboard-brn-details/dashboard-brn-details.component';
import { CsvUploadComponent } from './components/csv-upload/csv-upload.component';
import { DuplicateBrnDetailsComponent } from './components/duplicate-brn-details/duplicate-brn-details.component';
import { ConcernRegDetailsComponent } from './components/concern-reg-details/concern-reg-details.component';

const routes: Routes = [{
  path: '', component: LayoutComponent, children: [
  {
    path: '',
    component: BRNregistoryDetailsComponent
  },
  {
    path: 'detailsPage',
    component: BRNregistoryDetailsComponent
  },
  { path: 'profile', component: ProfileComponent },
  { path: 'change-password', component: ChangePasswordComponent },
  { path: 'dashboard-brn-details/:brnNo', component: DashboardBrnDetailsComponent },
  { path: 'csv-upload', component: CsvUploadComponent },
  { path: 'dup-brn-details', component: DuplicateBrnDetailsComponent },
  { path: 'con-reg-details', component: ConcernRegDetailsComponent },

  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommonPostLoginRoutingModule { }
