import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DesDistrictBrnDetailsRoutingModule } from './des-district-brn-details-routing.module';
import { DesDistrictBrnDetailsComponent } from './des-district-brn-details.component';


@NgModule({
  declarations: [
    DesDistrictBrnDetailsComponent
  ],
  imports: [
    CommonModule,
    DesDistrictBrnDetailsRoutingModule
  ]
})
export class DesDistrictBrnDetailsModule { }
