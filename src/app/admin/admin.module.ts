import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';

import { RegisterUserComponent } from '../component/register-user/register-user.component';
import { FormsModule } from '@angular/forms';
import { DashboardComponent } from '../component/dashboard/dashboard.component';



console.log("properly loaded")
@NgModule({
  declarations: [RegisterUserComponent,DashboardComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule
  ]
})
export class AdminModule { }
