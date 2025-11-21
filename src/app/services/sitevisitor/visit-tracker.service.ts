import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { VisitSummary } from '../../interface/visit-summary';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class VisitTrackerService {

  private baseUrl = `${environment.apiUrl}/citizenSearch/visitor`;
   private isBrowser: boolean;

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  /** Record a user visit */
  recordVisit(): Observable<any> {
    return this.http.post(`${this.baseUrl}`, {});
  }

  /** Fetch total and today visit counts */
  getVisitSummary(): Observable<VisitSummary> {
    return this.http.get<VisitSummary>(`${this.baseUrl}/summary`);
  }

   hasVisited(): boolean {
    if (!this.isBrowser) return false;
    return !!sessionStorage.getItem('visitRecorded');
  }

  markVisited(): void {
    if (this.isBrowser) {
      sessionStorage.setItem('visitRecorded', 'true');
    }
  }
}
