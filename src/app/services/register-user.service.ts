import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../model/user';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class RegisterUserService {


  private apiUrl:String="";

  constructor(private http: HttpClient) {
    this.apiUrl=environment.apiUrl;
   }

   fetchRoles() {
    return this.http.get<any[]>(`${this.apiUrl}/admin/getAllRoles`);
  }


  fetchDepartments() {
    return this.http.get<any[]>(`${this.apiUrl}/admin/getAllDepartments`);
  }



  

  register(user: User): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/signup`, user);
  }



}