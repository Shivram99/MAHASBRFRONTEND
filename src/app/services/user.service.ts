import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { User } from '../interface/user';
import { catchError, Observable, throwError } from 'rxjs';
import { Role } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
 private apiUrl = `${environment.apiUrl}/api/users`;

  constructor(private http: HttpClient) {}


  // Get all users
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  // Get user by ID
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Create a new user
  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Update an existing user
  updateUser(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Delete a user
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Centralized error handling
  private handleError(error: HttpErrorResponse) {
    console.error('UserService error:', error);
    return throwError(() => new Error(error.message || 'Server error'));
  }

   getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.apiUrl}/role`);
  }
}
