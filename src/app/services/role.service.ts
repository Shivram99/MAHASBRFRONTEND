import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Role } from '../model/role';
import { environment } from '../../environments/environment.development';

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
    return this.http.get<Role[]>(this.baseUrl+"/common/api");
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
}