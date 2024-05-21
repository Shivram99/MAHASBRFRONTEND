import { Injectable } from '@angular/core';
import { DepartmentMst } from '../model/department-mst';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DepartmentMstService {

  private baseUrl: string;

  constructor(private http: HttpClient) { 
    this.baseUrl = environment.apiUrl;
  }

  getDepartmentById(id: number): Observable<DepartmentMst> {
    return this.http.get<DepartmentMst>(`${this.baseUrl}/admin/${id}`);
  }

  getAllDepartments(): Observable<DepartmentMst[]> {
    return this.http.get<DepartmentMst[]>(`${this.baseUrl}/admin/getAllDepartments`);
  }

  createDepartment(department: DepartmentMst): Observable<DepartmentMst> {
    return this.http.post<DepartmentMst>(`${this.baseUrl}/admin/createDepartment`, department);
  }

  updateDepartment(id: number, department: DepartmentMst): Observable<DepartmentMst> {
    return this.http.put<DepartmentMst>(`${this.baseUrl}/admin/getDepartmentById/${id}`, department);
  }

  deleteDepartment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/admin/deleteDepartment/${id}`);
  }
}
