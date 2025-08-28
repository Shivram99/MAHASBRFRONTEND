import { HttpClient, HttpErrorResponse, HttpHeaders, HttpEvent, HttpRequest, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { MstRegistryDetailsPage } from '../model/mst-registry-details-page';
import { PaginatedResponse } from '../interface/paginated-response';
import { BRNGenerationRecordCount } from '../interfaces/brngeneration-record-count';


@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  apiUrl:String="";
  constructor(private http: HttpClient) {
    this.apiUrl=environment.apiUrl;
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
  getRegistryDetailsPage(page: number, size: number, sortBy: string): Observable<PaginatedResponse<MstRegistryDetailsPage>> {
    const params = new HttpParams()
    .set('page', page.toString())
    .set('size', size.toString())
    .set('sortBy', sortBy);
    return this.http.get<PaginatedResponse<MstRegistryDetailsPage>>(`${this.apiUrl}/api/auth/registoryData`, { params });
  }

  getDuplicateDetailsPage(page: number, size: number, sortBy: string): Observable<PaginatedResponse<MstRegistryDetailsPage>> {
    const params = new HttpParams()
    .set('page', page.toString())
    .set('size', size.toString())
    .set('sortBy', sortBy);
    return this.http.get<PaginatedResponse<MstRegistryDetailsPage>>(`${this.apiUrl}/api/auth/registoryDuplicateData`, { params });
  }
  getConcernDetailsPage(page: number, size: number, sortBy: string): Observable<PaginatedResponse<MstRegistryDetailsPage>> {
    const params = new HttpParams()
    .set('page', page.toString())
    .set('size', size.toString())
    .set('sortBy', sortBy);
    return this.http.get<PaginatedResponse<MstRegistryDetailsPage>>(`${this.apiUrl}/api/auth/registoryConcernData`, { params });
  }
  
  
  // Change the method to accept FormData instead of File
  uploadFile(formData: FormData): Observable<HttpEvent<BRNGenerationRecordCount>> {
    console.log("formData : "+formData.getAll);
    const req = new HttpRequest('POST', `${this.apiUrl}/api/auth/upload`, formData, {
      reportProgress: true,
    });
    return this.http.request<BRNGenerationRecordCount>(req);
  }

  upload(files: File[]): Observable<HttpEvent<any>> {
    debugger
    const formData: FormData = new FormData();
    files.forEach(file => formData.append('files', file));

    const req = new HttpRequest('POST', `${this.apiUrl}/api/auth/upload`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }
 
  postLoginDashboardData(page: number, size: number, sortBy: string, selectedDistrictIds: number[], selectedTalukaIds: number[], filters: { registerDateFrom: string, registerDateTo: string }): Observable<PaginatedResponse<MstRegistryDetailsPage>> {
    const requestBody = {
        page,
        size,
        sortBy,
        selectedDistrictIds, // Corrected key to pluralize for consistency with the array
        selectedTalukaIds,
        filters
    };

    return this.http.post<PaginatedResponse<MstRegistryDetailsPage>>(`${this.apiUrl}/api/auth/getPostLoginDashboardData`, requestBody, {
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
    });
}

getBRNDetails(BNR: any): Observable<PaginatedResponse<MstRegistryDetailsPage>> {
 // return this.http.get<Page<DetailsPageDTO>>(`${this.apiUrl}/admin/detailsPages`, { params });
  return this.http.get<PaginatedResponse<MstRegistryDetailsPage>>(`${this.apiUrl}/api/auth/brn-details/${BNR}`);
}



downloadFile(fileName: string): Observable<Blob> {
  return this.http.get(`${this.apiUrl}/api/auth/download`, {
    params: { fileName },
    responseType: 'blob'
  }).pipe(
    map((res: Blob) => {
      console.log("Blob :"+Blob)
      return res;
    })
  );
}
  
}
