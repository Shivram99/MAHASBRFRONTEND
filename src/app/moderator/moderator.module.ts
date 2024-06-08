import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModeratorRoutingModule } from './moderator-routing.module';
import { ModeratorDashboardComponent } from '../component/moderator-dashboard/moderator-dashboard.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [ModeratorDashboardComponent],
  imports: [
    CommonModule,
    ModeratorRoutingModule,
    FormsModule
  ]
})
export class ModeratorModule { }
