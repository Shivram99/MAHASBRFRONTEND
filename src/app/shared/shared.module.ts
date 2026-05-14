import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './components/layout/layout.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TransliterateDirective } from './directives/transliterate.directive';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginationComponent } from './components/pagination/pagination.component';




@NgModule({
  declarations: [LayoutComponent, TransliterateDirective, PaginationComponent],
  exports: [LayoutComponent, TransliterateDirective, PaginationComponent],
  imports: [
    CommonModule,
    RouterModule,TranslateModule ,FormsModule,ReactiveFormsModule
  ],
})
export class SharedModule { }
