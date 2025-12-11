import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { catchError, Observable, throwError } from 'rxjs';
import { ApiResponse } from '../../interface/api-response';
import { NICCategory } from '../../interface/niccategory';

@Injectable({
  providedIn: 'root'
})
export class NICCategoryService {
 private readonly API_BASE = `${environment.apiUrl}/citizenSearch/api/nic-categories`;

  constructor(private http: HttpClient) {}

  getAllCategories(): Observable<ApiResponse<NICCategory[]>> {
    return this.http
      .get<ApiResponse<NICCategory[]>>(this.API_BASE)
      .pipe(catchError(this.handleError));
  }

  getCategoryByCode(categoryCode: string): Observable<ApiResponse<NICCategory>> {
    return this.http
      .get<ApiResponse<NICCategory>>(`${this.API_BASE}/${categoryCode}`)
      .pipe(catchError(this.handleError));
  }

  createCategory(category: NICCategory): Observable<ApiResponse<NICCategory>> {
    return this.http
      .post<ApiResponse<NICCategory>>(this.API_BASE, category)
      .pipe(catchError(this.handleError));
  }

  updateCategory(categoryCode: string, category: NICCategory): Observable<ApiResponse<NICCategory>> {
    return this.http
      .put<ApiResponse<NICCategory>>(`${this.API_BASE}/${categoryCode}`, category)
      .pipe(catchError(this.handleError));
  }

  toggleStatus(categoryCode: string): Observable<ApiResponse<NICCategory>> {
    return this.http
      .patch<ApiResponse<NICCategory>>(`${this.API_BASE}/${categoryCode}/toggle-status`, {})
      .pipe(catchError(this.handleError));
  }

  // 🔥 Upload Excel feature included
  uploadExcel(file: File): Observable<ApiResponse<string>> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http
      .post<ApiResponse<string>>(`${this.API_BASE}/upload`, formData)
      .pipe(catchError(this.handleError));
  }

  // 🔍 Centralized Error Handling
  private handleError(error: HttpErrorResponse) {
    let errMsg = 'Something went wrong!';

    if (error.error?.message) {
      errMsg = error.error.message;
    }

    console.error('API Error:', errMsg);
    return throwError(() => new Error(errMsg));
  }

}
