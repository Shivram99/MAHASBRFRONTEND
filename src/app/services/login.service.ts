import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService  {
  
  apiUrl:String="";

  private userRoles: string[] = [];
 

  
 constructor() { 
   this.apiUrl=environment.apiUrl;
 }


 //constructor() { }

 http = inject(HttpClient);

 login(username: string, password: string): Observable<HttpResponse<void>> {
   return this.http.post<void>(
    `${this.apiUrl}/api/auth/signin`,
     { username, password },
     {
       observe: 'response',
     }
   );
 }

 register(username: string, password: string): Observable<void> {
   return this.http.post<void>(`${this.apiUrl}/api/v1/register`, {
     username,
     password,
   });
 }

 fetchSecureEndpoint(): Observable<{ msg: string }> {
   return this.http.get<{ msg: string }>(`${this.apiUrl}/api/v1/secured`);
 }

 fetchSecureAdminEndpoint(): Observable<{ msg: string }> {
   return this.http.get<{ msg: string }>(`${this.apiUrl}/api/v1/secured-admin`);
 }

 fetchUnsecureEndpoint(): Observable<{ msg: string }> {
   return this.http.get<{ msg: string }>(`{this.apiUrl}/api/v1/unsecured`);
 }



hasRole(role: string): boolean {
  return this.userRoles.includes(role);
}

setRoles(roles: string[]) {
  this.userRoles=roles;
}


}
