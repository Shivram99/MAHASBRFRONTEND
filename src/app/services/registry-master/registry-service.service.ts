import { Injectable } from '@angular/core';
import { RegistryResponse } from '../../model/registry-response';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RegistryServiceService {
  private baseUrl = `${environment.apiUrl}/api/registries`;
constructor(private http: HttpClient) {}

  getAll(): Observable<RegistryResponse[]> {
    return this.http.get<RegistryResponse[]>(this.baseUrl);
  }

  getById(id: number): Observable<RegistryResponse> {
    return this.http.get<RegistryResponse>(`${this.baseUrl}/${id}`);
  }

  create(request: RegistryResponse): Observable<RegistryResponse> {
    return this.http.post<RegistryResponse>(this.baseUrl, request);
  }

  update(id: number, request: RegistryResponse): Observable<RegistryResponse> {
    return this.http.put<RegistryResponse>(`${this.baseUrl}/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
