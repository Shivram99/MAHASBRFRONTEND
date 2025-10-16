import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './components/layout/layout.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TransliterateDirective } from './directives/transliterate.directive';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';




@NgModule({
  declarations: [LayoutComponent,TransliterateDirective,],
  exports: [LayoutComponent,TransliterateDirective],
  imports: [
    CommonModule,
    RouterModule,TranslateModule ,FormsModule,ReactiveFormsModule
  ],
})
export class SharedModule { }
