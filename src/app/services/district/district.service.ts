import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { District } from '../../model/district';

@Injectable({
  providedIn: 'root'
})
export class DistrictService {
 private baseUrl = `${environment.apiUrl}/api/districts`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<District[]> {
    return this.http.get<District[]>(this.baseUrl);
  }

  getById(id: number): Observable<District> {
    return this.http.get<District>(`${this.baseUrl}/${id}`);
  }

  create(district: District): Observable<District> {
    return this.http.post<District>(this.baseUrl, district);
  }

  update(id: number, district: District): Observable<District> {
    return this.http.put<District>(`${this.baseUrl}/${id}`, district);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
