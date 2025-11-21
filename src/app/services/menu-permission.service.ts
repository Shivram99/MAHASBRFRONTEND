import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { AssignMenuDTO } from '../interface/assign-menu-dto';
import { Menu } from '../interface/menu';
import { ApiResponse } from '../interface/api-response';

@Injectable({
  providedIn: 'root'
})
export class MenuPermissionService {

   apiUrl: String = "";
    constructor(private http: HttpClient) {
      this.apiUrl = environment.apiUrl;
    }
  

  // assignMenuToRole(dto: AssignMenuDTO): Observable<void> {
  //   return this.http.post<void>(`${this.apiUrl}/api/permissions/role/assign`, dto);
  // }

  // removeMenuFromRole(dto: AssignMenuDTO): Observable<void> {
  //   return this.http.delete<void>(`${this.apiUrl}/api/permissions/role/remove`, { body: dto });
  // }

  assignMenuToUser(dto: AssignMenuDTO): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/api/permissions/user/assign`, dto);
  }

  removeMenuFromUser(dto: AssignMenuDTO): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/api/permissions/user/remove`, { body: dto });
  }

  assignMenusToRole(dto: AssignMenuDTO): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/api/permissions/role/assign`, dto);
  }

  // removeMenusFromRole(dto: AssignMenuDTO): Observable<void> {
  //   return this.http.delete<void>(`$${this.apiUrl}/api/permissions/role/remove`, { body: dto });
  // }

  assignMenusToUser(dto: AssignMenuDTO): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/api/permissions/user/assign`, dto);
  }

  removeMenusFromRole(dto: AssignMenuDTO): Observable<ApiResponse<void>> {
  return this.http.delete<ApiResponse<void>>(
    `${this.apiUrl}/api/permissions/role/remove`,
    { body: dto }
  );
}

  getMenusForRole(roleId: number) {
    return this.http.get<ApiResponse<Menu[]>>(`${this.apiUrl}/api/permissions/role/${roleId}/menus`);
  }

  getMenusForUser(userId: number) {
    return this.http.get<ApiResponse<Menu[]>>(`${this.apiUrl}/api/permissions/user/${userId}/menus`);
  }
}
