import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Circular } from '../../../interface/circular';
import { CircularService } from '../../../services/Circular/circular.service';
import { NewsTickerComponent } from './news-ticker.component';

describe('NewsTickerComponent', () => {
  let fixture: ComponentFixture<NewsTickerComponent>;
  let component: NewsTickerComponent;

  function setup(response: any) {
    TestBed.configureTestingModule({
      declarations: [NewsTickerComponent],
      imports: [TranslateModule.forRoot()],
      providers: [{ provide: CircularService, useValue: { getAllCircularsForCitizen: () => response } }]
    });
    fixture = TestBed.createComponent(NewsTickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  afterEach(() => component?.pauseTicker());

  const circular = (id: number, subject: string, date: string, fileUrl = 'circulars/a.pdf'): Circular =>
    ({ id, subject, date, fileUrl, activity: 'general' });

  it('shows the saved circulars, newest first, with date and a link to the PDF', () => {
    setup(of([
      circular(1, 'Old circular', '2024-02-20'),
      circular(2, 'New circular', '2026-11-18', 'circulars/new.pdf')
    ]));

    expect(component.newsItems.map((i) => i.text)).toEqual([
      'New circular (18/11/2026)',
      'Old circular (20/02/2024)'
    ]);
    expect(component.newsItems[0].link).toBe(`${environment.apiUrl}/citizenSearch/files/circulars/new.pdf`);
  });

  it('shows no bar when there are no circulars', () => {
    setup(of([]));

    expect(component.newsItems.length).toBe(0);
    expect(fixture.nativeElement.querySelector('.ticker-bg')).toBeNull();
  });

  it('shows no bar, and no error, when the circulars cannot be loaded', () => {
    setup(throwError(() => new Error('offline')));

    expect(component.newsItems.length).toBe(0);
    expect(fixture.nativeElement.querySelector('.ticker-bg')).toBeNull();
  });

  it('shows a single circular once, without scrolling or repeating it', async () => {
    setup(of([circular(1, 'Only one', '2026-11-18')]));
    await new Promise((resolve) => setTimeout(resolve));
    fixture.detectChanges();

    expect(component.scrolling).toBeFalse();
    expect(component.scrollInterval).toBeFalsy();
    expect(fixture.nativeElement.querySelectorAll('.ticker-content').length).toBe(1);
  });

  it('shows two short circulars once each when they fit in the bar', async () => {
    setup(of([circular(1, 'A', '2026-11-17'), circular(2, 'B', '2026-11-18')]));
    await new Promise((resolve) => setTimeout(resolve));
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('.ticker-content').length).toBe(2);
  });
});
