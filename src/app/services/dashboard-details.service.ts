
import { Injectable } from '@angular/core';
import { MstRegistryDetailsPage } from '../model/mst-registry-details-page';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { PaginatedResponse } from '../interface/paginated-response';

@Injectable({
  providedIn: 'root'
})
export class DashboardDetailsService {
  apiUrl:String="";
  constructor(private http: HttpClient) { 
    this.apiUrl=environment.apiUrl;

  }

  getBRNDetails(brn: any): Observable<PaginatedResponse<MstRegistryDetailsPage>> {
    return this.http.get<PaginatedResponse<MstRegistryDetailsPage>>(`${this.apiUrl}/api/auth/brn-details/${brn}`);
  }
}
