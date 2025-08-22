import { Component, OnInit } from '@angular/core';
import { LanguageService } from '../../language.service';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.css',
    standalone: false
})
export class FooterComponent implements OnInit {

  currentLanguage: string="en";

  constructor(private languageService: LanguageService) { }

  ngOnInit(): void {
    this.currentLanguage = this.languageService.getCurrentLanguage();
    this.languageService.getLanguageObservable().subscribe(language => {
      this.currentLanguage = language;
    });
  }
}