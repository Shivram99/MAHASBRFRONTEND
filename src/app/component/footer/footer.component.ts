import { Component, OnInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { LanguageService } from '../../core/services/language.service'; 
import { VisitTrackerService } from '../../services/sitevisitor/visit-tracker.service';
import { VisitSummary } from '../../interface/visit-summary';
import { Inject, PLATFORM_ID } from '@angular/core';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.css',
    standalone: false
})
export class FooterComponent implements OnInit {

  currentLanguage: string="en";

  summary: VisitSummary = { totalVisits: 0, todayVisits: 0 };
  private readonly isBrowser: boolean;

  constructor(
    private languageService: LanguageService,
    private visitService: VisitTrackerService,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.currentLanguage = this.languageService.getCurrentLanguage();
    this.languageService.getLanguageObservable().subscribe(language => {
      this.currentLanguage = language;
    });

    if (this.isBrowser) {
      this.loadSummary();
    }
  }

   private loadSummary(): void {
    this.visitService.getVisitSummary().subscribe({
      next: (data) => {
        this.summary = data;
      },
      error: (err) => {
        console.error('Error loading summary', err);
      }
    });
  }
}
