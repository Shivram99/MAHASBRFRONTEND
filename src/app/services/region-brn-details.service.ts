import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { PaginatedResponse } from '../interface/paginated-response';
import { MstRegistryDetailsPage } from '../model/mst-registry-details-page';

@Injectable({
  providedIn: 'root'
})
export class RegionBrnDetailsService {

  apiUrl:String="";
  constructor(private http: HttpClient) {
    this.apiUrl=environment.apiUrl;
   }

   getRegistryDetailsPage(page: number, size: number, sortBy: string): Observable<PaginatedResponse<MstRegistryDetailsPage>> {
    const params = new HttpParams()
    .set('page', page.toString())
    .set('size', size.toString())
    .set('sortBy', sortBy);
    return this.http.get<PaginatedResponse<MstRegistryDetailsPage>>(`${this.apiUrl}/api/auth/registoryRegionData`, { params });
  }
}
