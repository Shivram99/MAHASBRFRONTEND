import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { VisitTrackerService } from '../../services/sitevisitor/visit-tracker.service';
import { VisitSummary } from '../../interface/visit-summary';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.css',
    standalone: false
})
export class FooterComponent implements OnInit {
  summary: VisitSummary = { totalVisits: 0, todayVisits: 0 };
  private readonly isBrowser: boolean;

  constructor(
    private readonly visitService: VisitTrackerService,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
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
