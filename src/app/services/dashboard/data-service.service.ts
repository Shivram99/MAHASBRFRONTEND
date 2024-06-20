// src/app/data.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { District } from '../../interface/district';
import { Talukas } from '../../interface/talukas';
import { environment } from '../../../environments/environment';
import { DetailsPageDTO } from '../../interface/details-page-dto';
import { Page } from '../../interface/page';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  

  getBRNDetails(BNR: any): Observable<Page<DetailsPageDTO>> {

    const params = new HttpParams()
      .set('pageNo', 0)
      .set('pageSize', 10);

   // return this.http.get<Page<DetailsPageDTO>>(`${this.apiUrl}/admin/detailsPages`, { params });
    return this.http.get<Page<DetailsPageDTO>>(`${this.apiUrl}/admin/BRN/${BNR}`, { params });
  }

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

  getDashBoardData(currentPage: number, pageSize: number): Observable<Page<DetailsPageDTO>> {
    const params = new HttpParams()
      .set('pageNo', currentPage.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<Page<DetailsPageDTO>>(`${this.apiUrl}/admin/detailsPages`, { params });
  }
  fetchDataWithFilters(filters: any,currentPage: number, pageSize: number): Observable<Page<DetailsPageDTO>> {
    let params = new HttpParams()
    .set('pageNo', currentPage)
    .set('pageSize', pageSize);
    // Conditionally add parameters to the HttpParams
    if (filters.registerDateFrom) {
      params = params.set('registerDateFrom', filters.registerDateFrom);
    }
    if (filters.registerDateTo) {
      params = params.set('registerDateTo', filters.registerDateTo);
    }
    if (filters.district) {
      params = params.set('district', filters.district);
    }
    if (filters.talukas) {
      params = params.set('talukas', filters.talukas);
    }
    console.log("params "+params)
    return this.http.get<Page<DetailsPageDTO>>(`${this.apiUrl}/admin/getFilterData`, { params });
  }
}
