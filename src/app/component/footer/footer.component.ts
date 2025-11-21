import { Component, OnInit } from '@angular/core';
import { LanguageService } from '../../core/services/language.service'; 
import { VisitTrackerService } from '../../services/sitevisitor/visit-tracker.service';
import { VisitSummary } from '../../interface/visit-summary';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.css',
    standalone: false
})
export class FooterComponent implements OnInit {

  currentLanguage: string="en";

  summary: VisitSummary = { totalVisits: 0, todayVisits: 0 };

  constructor(private languageService: LanguageService,private visitService: VisitTrackerService) { }

  ngOnInit(): void {
    this.currentLanguage = this.languageService.getCurrentLanguage();
    this.languageService.getLanguageObservable().subscribe(language => {
      this.currentLanguage = language;
    });
    this.loadSummary();
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