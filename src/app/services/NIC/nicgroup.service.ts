import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NICGroup } from '../../interface/nicgroup';

@Injectable({
  providedIn: 'root'
})
export class NICGroupService {

   private readonly API_BASE = `${environment.apiUrl}/citizenSearch/api/nic-groups`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<any> {
    return this.http.get(this.API_BASE);
  }

  getByDivision(divisionCode: string): Observable<any> {
    return this.http.get(`${this.API_BASE}/by-division/${divisionCode}`);
  }

  getByCode(groupCode: string): Observable<any> {
    return this.http.get(`${this.API_BASE}/${groupCode}`);
  }

  create(group: NICGroup): Observable<any> {
    return this.http.post(this.API_BASE, group);
  }

  update(groupCode: string, group: NICGroup): Observable<any> {
    return this.http.put(`${this.API_BASE}/${groupCode}`, group);
  }

  toggleStatus(groupCode: string): Observable<any> {
    return this.http.patch(`${this.API_BASE}/${groupCode}/toggle-status`, {});
  }

  delete(groupCode: string): Observable<any> {
    return this.http.delete(`${this.API_BASE}/${groupCode}`);
  }
}
