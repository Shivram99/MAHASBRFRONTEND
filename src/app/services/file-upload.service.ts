import { HttpClient, HttpErrorResponse, HttpHeaders,  HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { MstRegistryDetailsPage } from '../model/mst-registry-details-page';


@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  apiUrl:String="";
  constructor(private http: HttpClient) {
    this.apiUrl=environment.apiUrl;
   }

  //  uploadFile(file: File): Observable<any> {
  //   const formData = new FormData();
  //   formData.append('file', file);

  //   return this.http.post(`${this.apiUrl}/api/auth/upload`, formData, {
  //     headers: new HttpHeaders({
  //       // 'Content-Type': 'multipart/form-data'  // Note: No need to set this header, FormData will set it automatically
  //     }),
  //     reportProgress: true,
  //     observe: 'events'
  //   }).pipe(
  //     catchError(this.handleError)
  //   );
  // }

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
  getRegistryDetailsPage(): Observable<MstRegistryDetailsPage[]> {
    return this.http.get<MstRegistryDetailsPage[]>(`${this.apiUrl}/api/auth/registoryData`);
  }

  private uploadUrl = 'YOUR_UPLOAD_ENDPOINT'; // Replace with your actual API endpoint


  // Change the method to accept FormData instead of File
  uploadFile(formData: FormData): Observable<HttpEvent<any>> {
    const req = new HttpRequest('POST', this.uploadUrl, formData, {
      reportProgress: true,
    });
    return this.http.request(req);
  }


  
}
