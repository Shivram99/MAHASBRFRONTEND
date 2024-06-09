import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MstMenu } from '../model/mst-menu';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  
  
  private apiUrl:String="";
  //private apiUrl = 'http://localhost:8085/MAHASBR/developer';

constructor(private http: HttpClient) { 
  this.apiUrl=environment.apiUrl+"/developer";
}

getAllMenus(): Observable<MstMenu[]> {
  return this.http.get<MstMenu[]>(`${this.apiUrl}/getAllMenus`);
}

getMenuById(id: number): Observable<MstMenu> {
  return this.http.get<MstMenu>(`${this.apiUrl}/getMenuById/${id}`);
}

createMenu(menu: MstMenu): Observable<MstMenu> {
  return this.http.post<MstMenu>(`${this.apiUrl}/createMenu`, menu);
}

updateMenu(id: number, menu: MstMenu): Observable<MstMenu> {
  return this.http.put<MstMenu>(`${this.apiUrl}/updateMenu/${id}`, menu);
}

deleteMenu(id: number): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/deleteMenu/${id}`);
}
}