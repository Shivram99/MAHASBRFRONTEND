// src/app/data.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { District } from '../../interface/district';
import { Talukas } from '../../interface/talukas';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  apiUrl:String="";
  constructor(private http: HttpClient) {
    this.apiUrl=environment.apiUrl;
   }

  getAllDistricts(): Observable<District[]> {
    return this.http.get<District[]>(`${this.apiUrl}/user/getAllDistricts`);
  }
  
  getAllTaluka(selectedValue:number): Observable<Talukas[]> {
    return this.http.get<Talukas[]>(`${this.apiUrl}/user/getDistrictTaluka/${selectedValue}`);
  }

  getDashBoardData(fromvalue: any) {
    return this.http.post<any>(`${this.apiUrl}/user/getDistrictTaluka`, fromvalue);
  }
}
