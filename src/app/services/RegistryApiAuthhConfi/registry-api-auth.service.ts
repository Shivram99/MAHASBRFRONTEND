import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../interface/api-response';
import { RegistryApiAuthConfig, RegistryApiAuthConfigRequest } from '../../interface/registry-api-auth-config';

@Injectable({
  providedIn: 'root'
})
export class RegistryApiAuthService {
  private readonly baseUrl = `${environment.apiUrl}/api/registry-auth`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<RegistryApiAuthConfig[]> {
    return this.http.get<ApiResponse<RegistryApiAuthConfig[]>>(this.baseUrl).pipe(map((r) => r.data ?? []));
  }

  create(request: RegistryApiAuthConfigRequest): Observable<RegistryApiAuthConfig> {
    return this.http.post<ApiResponse<RegistryApiAuthConfig>>(this.baseUrl, request).pipe(map((r) => r.data));
  }

  update(id: number, request: RegistryApiAuthConfigRequest): Observable<RegistryApiAuthConfig> {
    return this.http.put<ApiResponse<RegistryApiAuthConfig>>(`${this.baseUrl}/${id}`, request).pipe(map((r) => r.data));
  }

  delete(id: number): Observable<unknown> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  setActive(id: number, active: boolean): Observable<RegistryApiAuthConfig> {
    return this.http.patch<ApiResponse<RegistryApiAuthConfig>>(`${this.baseUrl}/${id}/active`, { active })
      .pipe(map((r) => r.data));
  }

  runNow(id: number): Observable<RegistryApiAuthConfig> {
    return this.http.post<ApiResponse<RegistryApiAuthConfig>>(`${this.baseUrl}/${id}/run`, {})
      .pipe(map((r) => r.data));
  }
}
