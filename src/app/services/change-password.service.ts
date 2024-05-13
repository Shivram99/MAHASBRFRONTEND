import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { ChangePasswordModel } from '../model/change-password-model';

@Injectable({
  providedIn: 'root'
})
export class ChangePasswordService { 

  private apiUrl = environment.apiUrl;

constructor(private http: HttpClient) { this.apiUrl = environment.apiUrl;}

changePassword(changePasswordModel: ChangePasswordModel): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/api/auth/changePassword`, changePasswordModel);
}

}
