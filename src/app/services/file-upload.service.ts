import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { MstRegistryDetailsPage } from '../model/mst-registry-details-page';
import { BRNGenerationRecordCount } from '../interfaces/brngeneration-record-count';
import { PaginatedResponse } from '../interfaces/paginated-response';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  apiUrl:String="";
  constructor(private http: HttpClient) {
    this.apiUrl=environment.apiUrl;
   }

   uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    // return this.http.post<BRNGenerationRecordCount>(`${this.apiUrl}/api/auth/upload`, formData, {
    //   headers: new HttpHeaders({
    //     // 'Content-Type': 'multipart/form-data'  // Note: No need to set this header, FormData will set it automatically
    //   }),
    //   reportProgress: true,
    //   observe: 'body'  // Observe the response body directly
    // }).pipe(
    //   catchError(this.handleError)
    // );
    return this.http.post(`${this.apiUrl}/api/auth/upload`, formData, {
      headers: new HttpHeaders({}),
      reportProgress: true,
      observe: 'response',  // Observe the full response
      responseType: 'text'  // Expect a plain text response
  }).pipe(
      catchError(this.handleError)
  );
  }

  // Error handling
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }
  getRegistryDetailsPage(): Observable<PaginatedResponse<MstRegistryDetailsPage>> {
    return this.http.get<PaginatedResponse<MstRegistryDetailsPage>>(`${this.apiUrl}/api/auth/registoryData`);
  }
}
