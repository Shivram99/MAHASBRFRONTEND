import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AutologoutService } from './autologout.service';
import { Observable } from 'rxjs/internal/Observable';
import { BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../environments/environment.development';

import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authTokenKey = 'accessToken';
  private tokenExpirationKey = 'tokenExpiration';
  private id = 'id';
  private username = 'username';
  private roles = 'roles';
  private roles1: string[] = [];
  private rolesSubject = new BehaviorSubject<string[]>(this.roles1);
  //private defaultRole: string = 'ROLE_USER';
  responseData: any;

  private isLoggedInSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  //private isLoggedInSubject = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) { }

  login(username: string, password: string,recaptchaResponse:string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/api/auth/signin`, { username, password ,recaptchaResponse})
      .pipe(
        tap(response => {
          debugger
          this.responseData = response;
         
          this.roles1 = response.roles; // Store roles
          this.rolesSubject.next(this.roles1); // Notify subscribers
          // JWT token to decode
          const token =this.responseData.accessToken;
          if(this.responseData.id!=null){
            this.setSession(response);
          }
        })
      );
  }

  fetchSecureEndpoint(): Observable<{ msg: string }> {
    return this.http.get<{ msg: string }>(`${environment.apiUrl}git `);
  }

  fetchSecureAdminEndpoint(): Observable<{ msg: string }> {
    return this.http.get<{ msg: string }>(`${environment.apiUrl}/api/test/secured-admin`);
  }

  fetchUnsecureEndpoint(): Observable<{ msg: string }> {
    return this.http.get<{ msg: string }>(`${environment.apiUrl}/api/test/unsecured`);
  }


  

  private setSession(authResult: any): void {
 debugger
    const currentDate = new Date();
    const tomorrowDate = new Date(currentDate.getTime() + 86400000);
    console.log(tomorrowDate);

    const { id, username, roles, accessToken } = authResult;
    localStorage.setItem(this.authTokenKey, accessToken);
    localStorage.setItem(this.tokenExpirationKey, tomorrowDate.toString());
    localStorage.setItem(this.roles, roles);
    localStorage.setItem(this.username, username);
    localStorage.setItem(this.id, id);

    localStorage.setItem("isAuthenticated","true");
    this.setIsLoggedIn(true);
  }

  logout(): void {
    localStorage.removeItem(this.authTokenKey);
    localStorage.removeItem(this.tokenExpirationKey);
    localStorage.removeItem(this.roles);
    localStorage.removeItem(this.username);
    localStorage.removeItem(this.id);
    localStorage.removeItem("isAuthenticated");
    this.rolesSubject.next([]);
    this.setIsLoggedIn(false);
  }

  getToken(): string | null {
    return localStorage.getItem(this.authTokenKey);
  }

  isAuthenticated(): boolean {
    const expiration = localStorage.getItem(this.tokenExpirationKey);
    if (!expiration || new Date(expiration) <= new Date()) {
      this.logout();
      this.setIsLoggedIn(false);
      return false;
    }
    return true;
  }

  getTokenExpiration(): Date {
    const expiration = localStorage.getItem(this.tokenExpirationKey);
    return expiration ? new Date(expiration) : new Date();
  }

 
  setIsLoggedIn(value: boolean) {
    this.isLoggedInSubject.next(value);
  }

  getIsLoggedIn() {
    return this.isLoggedInSubject.asObservable();
  }

  getUserRoles(): string[] {
    return this.roles1;
  }

  getUserRolesObservable() {
    return this.rolesSubject.asObservable();
  }
}