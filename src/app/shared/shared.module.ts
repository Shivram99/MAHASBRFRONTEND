import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageSwitcherComponent } from './components/language-switcher/language-switcher.component';




@NgModule({
  declarations: [LanguageSwitcherComponent],
  exports: [LanguageSwitcherComponent],
  imports: [
    CommonModule,
  ]
})
export class SharedModule { }
