import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RequestFormService {

   private apiUrl = environment.apiUrl;

constructor(private http: HttpClient) { this.apiUrl = environment.apiUrl;}

  getAllRequests(): Observable<any> {
    return this.http.get(`${this.apiUrl}/citizenSearch/all`);
}
}
