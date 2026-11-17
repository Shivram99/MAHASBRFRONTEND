import { Component, DestroyRef, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { VisitTrackerService } from '../../services/sitevisitor/visit-tracker.service';
import { VisitSummary } from '../../interface/visit-summary';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css',
  standalone: false
})
export class HomepageComponent implements OnInit {
  private isBrowser: boolean;
  summary: VisitSummary = { totalVisits: 0, todayVisits: 0 };
  constructor(
    private visitService: VisitTrackerService,
    private destroyRef: DestroyRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (!this.isBrowser) {
      return;
    }

    if (!this.visitService.hasVisited()) {
      this.visitService.recordVisit()
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
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
    this.visitService.getVisitSummary()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
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
    'assets/images/slide/img3.png',
    'assets/images/slide/banner_1.png',
    'assets/images/slide/banner_2.png',
    'assets/images/slide/banner_3.png',
    'assets/images/slide/banner_4.png',
    'assets/images/slide/banner_5.png',
    'assets/images/slide/banner_6.png',
    'assets/images/slide/banner_7.png',
    'assets/images/slide/banner_8.png',
    'assets/images/slide/banner_9.png'
  ];

}

