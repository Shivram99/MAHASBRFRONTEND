import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MstSubMenu } from '../model/mst-sub-menu';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class MstSubMenuService {

  private apiUrl = ''; // Update with your API URL

  constructor(private http: HttpClient) { 
    this.apiUrl=environment.apiUrl+"/developer";
  }

  getAllSubMenus(): Observable<MstSubMenu[]> {
    return this.http.get<MstSubMenu[]>(`${this.apiUrl}/getAllSubMenus`);
  }

  getSubMenuById(id: number): Observable<MstSubMenu> {
    return this.http.get<MstSubMenu>(`${this.apiUrl}/getSubMenuById/${id}`);
  }

  createSubMenu(subMenu: MstSubMenu): Observable<MstSubMenu> {
    return this.http.post<MstSubMenu>(`${this.apiUrl}/createSubMenu`, subMenu);
  }

  updateSubMenu(id: number, subMenu: MstSubMenu): Observable<MstSubMenu> {
    return this.http.put<MstSubMenu>(`${this.apiUrl}/updateSubMenu/${id}`, subMenu);
  }

  deleteSubMenu(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deleteSubMenu/${id}`);
  }

  getSubMenusByUserRole(userRoleId: number): Observable<MstSubMenu[]> {
    return this.http.get<MstSubMenu[]>(`${this.apiUrl}/getSubMenusByUserRole/${userRoleId}`);
  }
}