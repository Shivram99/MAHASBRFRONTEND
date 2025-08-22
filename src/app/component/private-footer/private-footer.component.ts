import { Component, OnInit } from '@angular/core';
import { LanguageService } from '../../language.service';


@Component({
    selector: 'app-private-footer',
    templateUrl: './private-footer.component.html',
    styleUrl: './private-footer.component.css',
    standalone: false
})
export class PrivateFooterComponent implements OnInit {

  currentLanguage: string="en";

  constructor(private languageService: LanguageService) { }

  ngOnInit(): void {
    this.currentLanguage = this.languageService.getCurrentLanguage();
    this.languageService.getLanguageObservable().subscribe(language => {
      this.currentLanguage = language;
    });
  }
}