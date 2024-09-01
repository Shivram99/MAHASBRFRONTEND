
import { Injectable } from '@angular/core';
import { MstRegistryDetailsPage } from '../model/mst-registry-details-page';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DashboardDetailsService {
  apiUrl:String="";
  constructor(private http: HttpClient) { 
    this.apiUrl=environment.apiUrl;

  }

  getBRNDetails(brn: any): Observable<MstRegistryDetailsPage> {
    return this.http.get<MstRegistryDetailsPage>(`${this.apiUrl}/api/auth/brn-details/${brn}`);
  }
}
