import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NICDivision } from '../../interface/nicdivision';

@Injectable({
  providedIn: 'root'
})
export class NICDivisionService {

  private readonly API_BASE = `${environment.apiUrl}/citizenSearch/api/nic-divisions`;

  constructor(private http: HttpClient) { }
  getAll(): Observable<any> {
    return this.http.get(this.API_BASE);
  }

  getByCode(code: string): Observable<any> {
    return this.http.get(`${this.API_BASE}/${code}`);
  }

  create(division: NICDivision): Observable<any> {
    return this.http.post(this.API_BASE, division);
  }

  update(code: string, division: NICDivision): Observable<any> {
    return this.http.put(`${this.API_BASE}/${code}`, division);
  }

  toggleStatus(code: string): Observable<any> {
    return this.http.patch(`${this.API_BASE}/${code}/toggle-status`, {});
  }
}
