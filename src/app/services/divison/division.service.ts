import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Division } from '../../model/division';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DivisionService {
private baseUrl = `${environment.apiUrl}/api/divisions`;
  constructor(private http: HttpClient) {}

  getAllDivisions(): Observable<Division[]> {
    return this.http.get<Division[]>(this.baseUrl);
  }

  getDivisionById(id: number): Observable<Division> {
    return this.http.get<Division>(`${this.baseUrl}/${id}`);
  }

  createDivision(division: Division): Observable<Division> {
    return this.http.post<Division>(this.baseUrl, division);
  }

  updateDivision(id: number, division: Division): Observable<Division> {
    return this.http.put<Division>(`${this.baseUrl}/${id}`, division);
  }

  deleteDivision(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
