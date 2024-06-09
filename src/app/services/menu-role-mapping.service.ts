import { Injectable } from '@angular/core';
import { MstMenuRoleMapping } from '../model/mst-menu-role-mapping';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class MenuRoleMappingService {
  private baseUrl = 'http://your-backend-api-url'; // Update with your backend API URL

  constructor(private http: HttpClient) {
    this.baseUrl=environment.apiUrl;
   }

  getAllMappings(): Observable<MstMenuRoleMapping[]> {
    return this.http.get<MstMenuRoleMapping[]>(`${this.baseUrl}/developer/MstMenuRoleMapping`);
  }

  getMappingById(id: number): Observable<MstMenuRoleMapping> {
    return this.http.get<MstMenuRoleMapping>(`${this.baseUrl}/developer/getMappingById/${id}`);
  }

  createMapping(mapping: MstMenuRoleMapping): Observable<MstMenuRoleMapping> {
    return this.http.post<MstMenuRoleMapping>(`${this.baseUrl}/developer/createMapping`, mapping);
  }

  updateMapping(id: number, mapping: MstMenuRoleMapping): Observable<MstMenuRoleMapping> {
    return this.http.put<MstMenuRoleMapping>(`${this.baseUrl}/developer/updateMapping/${id}`, mapping);
  }

  deleteMapping(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/developer/deleteMapping/${id}`);
  }

  
  getAllRoles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/developer/getAllRoles`);
  }
}