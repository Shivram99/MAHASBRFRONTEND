import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';

import { RegisterUserComponent } from '../component/register-user/register-user.component';
import { FormsModule } from '@angular/forms';



console.log("properly loaded")
@NgModule({
  declarations: [RegisterUserComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule
  ]
})
export class AdminModule { }
