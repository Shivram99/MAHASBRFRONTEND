import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageSwitcherComponent } from './components/language-switcher/language-switcher.component';
import { LayoutComponent } from './layout/layout.component';




@NgModule({
  declarations: [LanguageSwitcherComponent, LayoutComponent],
  exports: [LanguageSwitcherComponent],
  imports: [
    CommonModule,
  ]
})
export class SharedModule { }
