
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { District } from '../interface/district';
import { RegistryResponse } from '../model/registry-response';
import { Division } from '../model/division';
import { CitizenDashboarFilter } from '../interface/citizen-dashboar-filter';
@Injectable({
  providedIn: 'root'
})
export class SerachBrnService {

  apiUrl: String = "";
  constructor(private http: HttpClient) {
    this.apiUrl = environment.apiUrl;
  }

  submitForm(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/citizenSearch/searchBRN`, data);
  }
  getAllDistricts(): Observable<District[]> {
    return this.http.get<District[]>(`${this.apiUrl}/citizenSearch/districts`);
  }

  getAllRegistry(): Observable<RegistryResponse[]> {
    return this.http.get<RegistryResponse[]>(`${this.apiUrl}/citizenSearch/registry`);
  }

  getAllDivisions(): Observable<Division[]> {
    return this.http.get<Division[]>(`${this.apiUrl}/citizenSearch/division`);
  }

  getFilteredDashboardData(payload: CitizenDashboarFilter): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(`${this.apiUrl}/citizenSearch/dashboardData`, payload, { headers });
  }

  submitRequest(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/citizenSearch/requestForm`, payload);
  }
}
