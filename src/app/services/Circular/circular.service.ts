import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Circular } from '../../interface/circular';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CircularService {
private baseUrl = "";
 constructor(private http: HttpClient) { 
   this.baseUrl = environment.apiUrl
 }


  createCircular(formData: FormData): Observable<Circular> {
    return this.http.post<Circular>(`${this.baseUrl}/api/circulars`, formData);
  }

  getAllCirculars(): Observable<Circular[]> {
    return this.http.get<Circular[]>(`${this.baseUrl}/api/circulars`);
  }

  deleteCircular(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/api/circulars/${id}`);
  }

  getAllCircularsForCitizen(): Observable<Circular[]> {
    return this.http.get<Circular[]>(`${this.baseUrl}/citizenSearch/circulars`);
  }

   getCircularFile(fileName: string): Observable<Blob> {
    return this.http.get(`${environment.apiUrl}/citizenSearch/files/${fileName}`, {
      responseType: 'blob'
    });
  }

  updateCircular(id: number, formData: FormData): Observable<any> {
  return this.http.put(`${this.baseUrl}/api/circulars`, formData);
}

}
