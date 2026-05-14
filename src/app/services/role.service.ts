import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../interface/api-response';
import { Role } from '../model/role';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
    this.baseUrl=environment.apiUrl;
   }

  getRoleById(id: number): Observable<Role> {
    return this.http.get<Role>(`${this.baseUrl}/${id}`);
  }
  
getAllRoles(): Observable<Role[]> {
  return this.http.get<ApiResponse<Role[]>>(this.baseUrl + "/admin/roles").pipe(
    map(res => res.data ?? []),
    catchError(err => {
      console.error('Failed to fetch roles', err);
      return throwError(() => err);
    })
  );
}


  createRole(role: Role): Observable<Role> {
    return this.http.post<Role>(this.baseUrl+"/common/api", role);
  }

  updateRole(id: number, role: Role): Observable<Role> {
    return this.http.put<Role>(`${this.baseUrl}/${id}`, role);
  }

  deleteRole(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

    getAll(): Observable<ApiResponse<Role[]>> {
    return this.http.get<ApiResponse<Role[]>>(`${this.baseUrl}/admin/roles`);
  }

  getById(id: number): Observable<ApiResponse<Role>> {
    return this.http.get<ApiResponse<Role>>(`${this.baseUrl}/admin/roles/${id}`);
  }

  create(role: Role): Observable<ApiResponse<Role>> {
    return this.http.post<ApiResponse<Role>>(`${this.baseUrl}/admin/roles`, role);
  }

  update(id: number, role: Role): Observable<ApiResponse<Role>> {
    return this.http.put<ApiResponse<Role>>(`${this.baseUrl}/admin/roles/${id}`, role);
  }

  delete(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/admin/roles/${id}`);
  }
}
