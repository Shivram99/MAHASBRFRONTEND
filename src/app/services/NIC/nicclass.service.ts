import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NICClassService {
 private readonly API_BASE = `${environment.apiUrl}/api/nic-classes`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<any> {
    return this.http.get(this.API_BASE);
  }

  getByGroup(groupCode: string): Observable<any> {
    return this.http.get(`${this.API_BASE}/by-group/${groupCode}`);
  }

  create(dto: any): Observable<any> {
    return this.http.post(this.API_BASE, dto);
  }

  update(classCode: string, dto: any): Observable<any> {
    return this.http.put(`${this.API_BASE}/${classCode}`, dto);
  }

  toggleStatus(classCode: string): Observable<any> {
    return this.http.patch(`${this.API_BASE}/${classCode}/toggle-status`, {});
  }
}
