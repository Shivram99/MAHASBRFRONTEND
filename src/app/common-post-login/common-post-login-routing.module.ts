import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from '../shared/components/layout/layout.component';
import { BRNregistoryDetailsComponent } from './components/brn-registry-details/brn-registry-details.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { DashboardBrnDetailsComponent } from './components/dashboard-brn-details/dashboard-brn-details.component';
import { CsvUploadComponent } from './components/csv-upload/csv-upload.component';
import { DuplicateBrnDetailsComponent } from './components/duplicate-brn-details/duplicate-brn-details.component';
import { ConcernRegDetailsComponent } from './components/concern-reg-details/concern-reg-details.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { RegistryMasterComponent } from './components/registry-master/registry-master.component';
import { CircularComponent } from '../component/circular/circular.component';
import { AddCircularComponent } from './components/add-circular/add-circular.component';
import { AddMenusComponent } from './components/add-menus/add-menus.component';
import { MenusListComponent } from './components/menus-list/menus-list.component';
import { MenuRoleAssignComponent } from './components/menu-role-assign/menu-role-assign.component';
import { RequestFormListComponent } from './components/request-form-list/request-form-list.component';

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
  { path: 'user', component: UserListComponent },
  { path: 'registery', component: RegistryMasterComponent },
  { path: 'add-circular', component: AddCircularComponent },
  { path: 'add-menu', component: AddMenusComponent },
  { path: 'add-menu/:id', component: AddMenusComponent },
  { path: 'menu-list', component: MenusListComponent },
  { path: 'add-menu-role', component: MenuRoleAssignComponent },
  { path: 'request-form-list', component: RequestFormListComponent },
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommonPostLoginRoutingModule { }
