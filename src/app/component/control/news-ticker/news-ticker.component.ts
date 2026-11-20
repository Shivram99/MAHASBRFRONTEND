import { isPlatformBrowser } from '@angular/common';
import {
  Component, ElementRef, Inject, OnDestroy, OnInit, PLATFORM_ID, QueryList, ViewChild, ViewChildren
} from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Circular } from '../../../interface/circular';
import { CircularService } from '../../../services/Circular/circular.service';

interface TickerItem {
  text: string;
  link: string | null;
}

/**
 * The "What's News" bar on the home page. It shows the circulars entered on the
 * Add Circular page (newest first); clicking one opens its PDF.
 */
@Component({
    selector: 'app-news-ticker',
    templateUrl: './news-ticker.component.html',
    styleUrls: ['./news-ticker.component.css'],
    standalone: false
})
export class NewsTickerComponent implements OnInit, OnDestroy {
  /** How many of the latest circulars the bar shows. */
  private static readonly MAX_ITEMS = 10;

  newsItems: TickerItem[] = [];
  displayItems: TickerItem[] = [];  // items twice, so the bar can loop smoothly
  currentIndex = 0;
  isPlaying = true;
  isTransitioning = true;
  scrollInterval: any;
  tickerTransform = 'translateX(0)';
  isBrowser: boolean;

  /** True only when the circulars are wider than the bar, so the list repeats and scrolls. */
  scrolling = false;

  @ViewChildren('tickerItem') private itemElements!: QueryList<ElementRef<HTMLElement>>;
  @ViewChild('tickerContainer') private container?: ElementRef<HTMLElement>;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private circularService: CircularService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      this.loadCirculars();
    }
  }

  ngOnDestroy() {
    this.pauseTicker();
  }

  private loadCirculars(): void {
    this.circularService.getAllCircularsForCitizen().subscribe({
      next: (circulars) => {
        this.newsItems = this.toItems(circulars ?? []);
        this.displayItems = [...this.newsItems];   // each circular once
        this.scrolling = false;
        this.currentIndex = 0;
        this.tickerTransform = 'translateX(0)';
        // Once drawn, scroll only if the items are wider than the bar.
        setTimeout(() => this.startScrollingIfNeeded());
      },
      error: () => {
        // The bar is optional: if circulars can't be loaded, show nothing instead of an error.
        this.newsItems = [];
        this.displayItems = [];
      }
    });
  }

  /**
   * If everything fits in the bar, show each circular once and stay still. Only when the items
   * overflow is the list repeated (so it can loop) and the scrolling started.
   */
  private startScrollingIfNeeded(): void {
    const container = this.container?.nativeElement;
    const total = (this.itemElements?.toArray() ?? [])
      .reduce((sum, el) => sum + el.nativeElement.offsetWidth, 0);
    if (!container || this.newsItems.length < 2 || total <= container.clientWidth) {
      return;
    }
    this.scrolling = true;
    this.displayItems = [...this.newsItems, ...this.newsItems];
    this.playTicker();
  }

  private toItems(circulars: Circular[]): TickerItem[] {
    return [...circulars]
      .filter((c) => !!c.subject?.trim())
      .sort((a, b) => (b.date ?? '').localeCompare(a.date ?? '') || b.id - a.id)   // newest first
      .slice(0, NewsTickerComponent.MAX_ITEMS)
      .map((c) => ({
        text: this.formatDate(c.date) ? `${c.subject.trim()} (${this.formatDate(c.date)})` : c.subject.trim(),
        link: c.fileUrl ? `${environment.apiUrl}/citizenSearch/files/${c.fileUrl}` : null
      }));
  }

  /** "2024-02-20" -> "20/02/2024". */
  private formatDate(date: string | undefined): string {
    const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(date ?? '');
    return match ? `${match[3]}/${match[2]}/${match[1]}` : '';
  }

  playTicker() {
    if (this.isBrowser && !this.scrollInterval && this.scrolling) {
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
    if (!this.isBrowser || !this.scrolling) {
      return;
    }
    this.isTransitioning = true;
    this.currentIndex++;
    this.updateTransform();

    if (this.currentIndex >= this.newsItems.length) {
      // Now showing the repeated copy: jump back to the start without animation.
      setTimeout(() => {
        this.isTransitioning = false;
        this.currentIndex = 0;
        this.updateTransform();
      }, 500);
    }
  }

  prevItem() {
    if (!this.isBrowser || !this.scrolling) {
      return;
    }
    if (this.currentIndex <= 0) {
      // Jump to the repeated copy without animation, then slide back one step.
      this.isTransitioning = false;
      this.currentIndex = this.newsItems.length;
      this.updateTransform();
      setTimeout(() => {
        this.isTransitioning = true;
        this.currentIndex = this.newsItems.length - 1;
        this.updateTransform();
      }, 20);
      return;
    }
    this.isTransitioning = true;
    this.currentIndex--;
    this.updateTransform();
  }

  /** Slides by the real width of the items passed, since each circular title has a different length. */
  private updateTransform() {
    const elements = this.itemElements?.toArray() ?? [];
    let offset = 0;
    for (let i = 0; i < this.currentIndex && i < elements.length; i++) {
      offset += elements[i].nativeElement.offsetWidth;
    }
    this.tickerTransform = `translateX(-${offset}px)`;
  }
}
