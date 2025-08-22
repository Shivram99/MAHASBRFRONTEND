import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
    selector: 'app-news-ticker',
    templateUrl: './news-ticker.component.html',
    styleUrls: ['./news-ticker.component.css'],
    standalone: false
})
export class NewsTickerComponent implements OnInit, OnDestroy {
  newsItems: string[] = [
    'Cabinet Decisions 20/02/2024 (Meeting No.63)',
    'Cabinet Decisions 20/02/2024 (Meeting No.63)'
  ];

  displayItems: string[] = [];  // Array to handle duplicated items for smooth looping
  currentIndex = 0;
  isPlaying = true;
  isTransitioning = true;
  scrollInterval: any;
  tickerTransform = 'translateX(0)';
  isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      this.setupDisplayItems();
      this.playTicker();
    }
  }

  ngOnDestroy() {
    this.pauseTicker();
  }

  setupDisplayItems() {
    // Duplicate the items to facilitate infinite scrolling
    this.displayItems = [...this.newsItems, ...this.newsItems];
  }

  playTicker() {
    if (this.isBrowser && !this.scrollInterval) {
      this.scrollInterval = setInterval(() => {
        this.nextItem();
      }, 2000);
      this.isPlaying = true;
    }
  }

  pauseTicker() {
    if (this.isBrowser) {
      clearInterval(this.scrollInterval);
      this.scrollInterval = null;
      this.isPlaying = false;
    }
  }

  togglePlayStop() {
    if (this.isPlaying) {
      this.pauseTicker();
    } else {
      this.playTicker();
    }
  }

  nextItem() {
    if (this.isBrowser) {
      this.isTransitioning = true;
      this.currentIndex++;
      this.updateTransform();

      if (this.currentIndex >= this.newsItems.length) {
        setTimeout(() => {
          this.isTransitioning = false;
          this.currentIndex = 0;
          this.updateTransform();
        }, 500); // Sync with the transition time
      }
    }
  }

  prevItem() {
    if (this.isBrowser) {
      this.isTransitioning = true;
      this.currentIndex--;
      this.updateTransform();

      if (this.currentIndex < 0) {
        setTimeout(() => {
          this.isTransitioning = false;
          this.currentIndex = this.newsItems.length - 1;
          this.updateTransform();
        }, 500);
      }
    }
  }

  private updateTransform() {
    const itemWidth = 200; // Set this to the width of your ticker items
    this.tickerTransform = `translateX(-${this.currentIndex * itemWidth}px)`;
  }
}
