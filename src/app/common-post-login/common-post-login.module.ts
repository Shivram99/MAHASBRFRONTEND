import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommonPostLoginRoutingModule } from './common-post-login-routing.module';
import { CommonPostLoginComponent } from './common-post-login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { BRNregistoryDetailsComponent } from './components/brn-registry-details/brn-registry-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { DashboardBrnDetailsComponent } from './components/dashboard-brn-details/dashboard-brn-details.component';
import { CsvUploadComponent } from './components/csv-upload/csv-upload.component';
import { DuplicateBrnDetailsComponent } from './components/duplicate-brn-details/duplicate-brn-details.component';
import { ConcernRegDetailsComponent } from './components/concern-reg-details/concern-reg-details.component';
import { TranslateModule } from '@ngx-translate/core';
import { UserListComponent } from './components/user-list/user-list.component';
import { RegistryMasterComponent } from './components/registry-master/registry-master.component';
import { AddCircularComponent } from './components/add-circular/add-circular.component';
import { MultiSelectOptionComponent } from '../component/util/multi-select-option/multi-select-option.component';
import { FilterUsersPipe } from '../pipes/filter-users.pipe';
import { AddMenusComponent } from './components/add-menus/add-menus.component';
import { MenusListComponent } from './components/menus-list/menus-list.component';
import { MenuRoleAssignComponent } from './components/menu-role-assign/menu-role-assign.component'; 


@NgModule({
  declarations: [
    CommonPostLoginComponent,
    ProfileComponent,
    ChangePasswordComponent,
    BRNregistoryDetailsComponent,
    DashboardBrnDetailsComponent,
    CsvUploadComponent,
    DuplicateBrnDetailsComponent,
    ConcernRegDetailsComponent,
    UserListComponent,
    RegistryMasterComponent,
    AddCircularComponent,
    MultiSelectOptionComponent,
    FilterUsersPipe,
    AddMenusComponent,
    MenusListComponent,
    MenuRoleAssignComponent,

  
  ],
  imports: [
    CommonModule,TranslateModule,
    CommonPostLoginRoutingModule,FormsModule,SharedModule,ReactiveFormsModule
  ]
})
export class CommonPostLoginModule { }
