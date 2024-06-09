import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { MstSubMenu } from '../model/mst-sub-menu';
import { Observable } from 'rxjs';
import { MstMenu } from '../model/mst-menu';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  
  private apiUrl:String="";
  userId:number=0;
  //private apiUrl = 'http://localhost:8085/MAHASBR/developer';

constructor(private http: HttpClient) { 
  this.apiUrl=environment.apiUrl+"/user";
 
}

getMenusByUserId(userId: number): Observable<MstMenu[]> {
  return this.http.get<MstMenu[]>(`${this.apiUrl}/getMenusByUserId/${userId}`);
}

getAllSubMenus(): Observable<MstSubMenu[]> {
  return this.http.get<MstSubMenu[]>(`${this.apiUrl}/getAllSubMenus`);
}

}