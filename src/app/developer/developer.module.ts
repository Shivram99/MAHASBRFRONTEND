import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeveloperRoutingModule } from './developer-routing.module';
import { MenuRoleMappingComponent } from '../component/menu-role-mapping/menu-role-mapping.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DeveloperDashboardComponent } from '../component/developer-dashboard/developer-dashboard.component';
import { AdduserComponent } from './component/user/adduser/adduser.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [    
    MenuRoleMappingComponent,
    DeveloperDashboardComponent,
    AdduserComponent,
  ],
  imports: [
    CommonModule,
    DeveloperRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
  ]
})
export class DeveloperModule { }
