import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MarathiInputService {

  private apiUrl = `${environment.apiUrl}/api/translate/marathi`;

  constructor(private http: HttpClient) {}

  getMarathiSuggestion(text: string): Observable<any> {
    const params = new HttpParams().set('text', text);
    return this.http.get(this.apiUrl, { params });
  }
}
