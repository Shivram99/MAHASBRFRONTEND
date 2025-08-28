import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommonPostLoginRoutingModule } from './common-post-login-routing.module';
import { CommonPostLoginComponent } from './common-post-login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { BRNregistoryDetailsComponent } from './components/brn-registry-details/brn-registry-details.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { DashboardBrnDetailsComponent } from './components/dashboard-brn-details/dashboard-brn-details.component';
import { CsvUploadComponent } from './components/csv-upload/csv-upload.component';
import { DuplicateBrnDetailsComponent } from './components/duplicate-brn-details/duplicate-brn-details.component';
import { ConcernRegDetailsComponent } from './components/concern-reg-details/concern-reg-details.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    CommonPostLoginComponent,
    ProfileComponent,
    ChangePasswordComponent,
    BRNregistoryDetailsComponent,
    DashboardBrnDetailsComponent,
    CsvUploadComponent,
    DuplicateBrnDetailsComponent,
    ConcernRegDetailsComponent
  ],
  imports: [
    CommonModule,TranslateModule,
    CommonPostLoginRoutingModule,FormsModule,SharedModule,
  ]
})
export class CommonPostLoginModule { }
