
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';

import { District } from '../interface/district'; 
@Injectable({
  providedIn: 'root'
})
export class SerachBrnService {
 
  apiUrl:String="";
  constructor(private http: HttpClient) {
    this.apiUrl=environment.apiUrl;
   }

   submitForm(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/v1/BRN/searchBRN`, data);
  }
  getAllDistricts(): Observable<District[]> {
    return this.http.get<District[]>(`${this.apiUrl}/api/v1/BRN/districts`);
  }
  
}
