import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-news-ticker',
  templateUrl: './news-ticker.component.html',
  styleUrls: ['./news-ticker.component.css']
})
export class NewsTickerComponent implements OnInit, OnDestroy {
  newsItems: string[] = [
    'Breaking News: Angular is awesome!',
    'Latest Update: Learn Angular with hands-on projects.',
    'Headline: TypeScript makes JavaScript safer.',
    'Breaking: Web development trends for 2024.'
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
