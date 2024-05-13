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
    return this.http.get<any[]>(`${this.apiUrl}/common/api/roles`);
  }

  register(user: User): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/auth/signup`, user);
  }



}