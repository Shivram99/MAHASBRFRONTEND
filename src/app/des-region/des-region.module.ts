import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DesRegionRoutingModule } from './des-region-routing.module';
import { DesRegionComponent } from './des-region.component';


@NgModule({
  declarations: [
    DesRegionComponent
  ],
  imports: [
    CommonModule,
    DesRegionRoutingModule,
    
  ]
})
export class DesRegionModule { }
