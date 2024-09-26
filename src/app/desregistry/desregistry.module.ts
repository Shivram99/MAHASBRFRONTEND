import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DESRegistryRoutingModule } from './desregistry-routing.module';
import { DESRegistryComponent } from './desregistry.component';


@NgModule({
  declarations: [
    DESRegistryComponent
  ],
  imports: [
    CommonModule,
    DESRegistryRoutingModule
  ]
})
export class DESRegistryModule { }
