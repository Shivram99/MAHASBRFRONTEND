import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DashboardComponent } from './dashboard.component';

@NgModule({
  declarations: [DashboardComponent],
  exports: [DashboardComponent],
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule
  ]
})
export class DashboardFeatureModule {}
