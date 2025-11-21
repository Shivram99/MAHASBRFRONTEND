import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { LanguageService } from '../../core/services/language.service'; 
import { VisitTrackerService } from '../../services/sitevisitor/visit-tracker.service';
import { VisitSummary } from '../../interface/visit-summary';
import { isPlatformBrowser } from '@angular/common';

@Component({
    selector: 'app-homepage',
    templateUrl: './homepage.component.html',
    styleUrl: './homepage.component.css',
    standalone: false
})
export class HomepageComponent  implements OnInit{
   private isBrowser: boolean;
summary: VisitSummary = { totalVisits: 0, todayVisits: 0 };
  constructor(private languageService: LanguageService,private visitService: VisitTrackerService, @Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
   }

  ngOnInit(): void {
    // Subscribe to language changes
    this.languageService.getLanguageObservable().subscribe(language => {
      // Update homepage content based on the new language
    });
  if (!this.visitService.hasVisited()) {
      this.visitService.recordVisit().subscribe({
        next: () => {
          this.visitService.markVisited();
          this.loadSummary();
        },
        error: err => {
          console.error('Error recording visit:', err);
          this.loadSummary(); // still load summary even if failed
        }
      });
    } else {
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

  images2 = [
    'assets/images/slide/img.png',
    'assets/images/slide/img2.png',
    'assets/images/slide/img3.png'
  ];
  
}
  