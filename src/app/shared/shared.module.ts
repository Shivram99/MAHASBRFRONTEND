import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './components/layout/layout.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TransliterateDirective } from './directives/transliterate.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginationComponent } from './components/pagination/pagination.component';
import { TitleCaseSafePipe } from './pipes/title-case-safe.pipe';
import { LanguageSwitcherComponent } from './components/language-switcher/language-switcher.component';
import { AccessibilityToolbarComponent } from './components/accessibility-toolbar/accessibility-toolbar.component';

@NgModule({
  declarations: [LayoutComponent, TransliterateDirective, PaginationComponent, TitleCaseSafePipe],
  exports: [
    LayoutComponent,
    TransliterateDirective,
    PaginationComponent,
    TitleCaseSafePipe,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    LanguageSwitcherComponent,
    AccessibilityToolbarComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    LanguageSwitcherComponent,
    AccessibilityToolbarComponent
  ],
})
export class SharedModule { }
