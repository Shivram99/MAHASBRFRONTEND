import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, switchMap, throwError, timeout } from 'rxjs';

import { environment } from '../../environments/environment';
import { ApiResponse } from '../interface/api-response';
import {
  CsvUploadFailedPageResponse,
  CsvUploadInitResponse,
  CsvUploadPreviewResponse,
  CsvUploadStatusResponse,
  CsvUploadSuccessPageResponse
} from '../interface/csv-upload';

@Injectable({
  providedIn: 'root'
})
export class CsvUploadService {
  private readonly apiBase = `${environment.apiUrl}/api/auth/csv-upload`;
  private readonly previewRequestTimeoutMs = 60000;

  constructor(private readonly http: HttpClient) {}

  upload(file: File): Observable<ApiResponse<CsvUploadInitResponse>> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http
      .post<ApiResponse<CsvUploadInitResponse>>(`${this.apiBase}/upload`, formData)
      .pipe(catchError((error) => this.handleError(error)));
  }

  generatePreview(jobId: string, page = 0, size = 100): Observable<ApiResponse<CsvUploadPreviewResponse>> {
    return this.requestPreview<ApiResponse<CsvUploadPreviewResponse>>(
      () =>
        this.http.post<ApiResponse<CsvUploadPreviewResponse>>(`${this.apiBase}/${jobId}/preview`, null, {
          params: { page, size }
        }),
      () =>
        this.http.post<ApiResponse<CsvUploadPreviewResponse>>(`${this.apiBase}/preview/${jobId}`, null, {
          params: { page, size }
        })
    );
  }

  getPreviewPage(jobId: string, page = 0, size = 100): Observable<ApiResponse<CsvUploadPreviewResponse>> {
    return this.requestPreview<ApiResponse<CsvUploadPreviewResponse>>(
      () =>
        this.http.get<ApiResponse<CsvUploadPreviewResponse>>(`${this.apiBase}/${jobId}/preview`, {
          params: { page, size }
        }),
      () =>
        this.http.get<ApiResponse<CsvUploadPreviewResponse>>(`${this.apiBase}/preview/${jobId}`, {
          params: { page, size }
        })
    );
  }

  start(jobId: string): Observable<ApiResponse<CsvUploadStatusResponse>> {
    return this.http
      .post<ApiResponse<CsvUploadStatusResponse>>(`${this.apiBase}/process/${jobId}`, null)
      .pipe(catchError((error) => this.handleError(error)));
  }

  pause(jobId: string): Observable<ApiResponse<CsvUploadStatusResponse>> {
    return this.http
      .post<ApiResponse<CsvUploadStatusResponse>>(`${this.apiBase}/${jobId}/pause`, null)
      .pipe(catchError((error) => this.handleError(error)));
  }

  resume(jobId: string): Observable<ApiResponse<CsvUploadStatusResponse>> {
    return this.http
      .post<ApiResponse<CsvUploadStatusResponse>>(`${this.apiBase}/${jobId}/resume`, null)
      .pipe(catchError((error) => this.handleError(error)));
  }

  cancel(jobId: string): Observable<ApiResponse<CsvUploadStatusResponse>> {
    return this.http
      .post<ApiResponse<CsvUploadStatusResponse>>(`${this.apiBase}/${jobId}/cancel`, null)
      .pipe(catchError((error) => this.handleError(error)));
  }

  getStatus(jobId: string): Observable<ApiResponse<CsvUploadStatusResponse>> {
    return this.http
      .get<ApiResponse<CsvUploadStatusResponse>>(`${this.apiBase}/status/${jobId}`)
      .pipe(catchError((error) => this.handleError(error)));
  }

  getSuccessPage(jobId: string, page = 0, size = 100): Observable<ApiResponse<CsvUploadSuccessPageResponse>> {
    return this.http
      .get<ApiResponse<CsvUploadSuccessPageResponse>>(`${this.apiBase}/results/${jobId}/success`, {
        params: { page, size }
      })
      .pipe(catchError((error) => this.handleError(error)));
  }

  getFailedPage(jobId: string, page = 0, size = 100): Observable<ApiResponse<CsvUploadFailedPageResponse>> {
    return this.http
      .get<ApiResponse<CsvUploadFailedPageResponse>>(`${this.apiBase}/results/${jobId}/failed`, {
        params: { page, size }
      })
      .pipe(catchError((error) => this.handleError(error)));
  }

  private handleError(error: unknown): Observable<never> {
    const httpError = error as HttpErrorResponse;
    const errorName = String((error as { name?: string } | null)?.name || '');
    const message =
      httpError?.error?.message ||
      httpError?.error?.data?.message ||
      (errorName === 'TimeoutError' ? 'Preview request timed out. Please try again.' : undefined) ||
      httpError?.message ||
      'Something went wrong while processing the file.';

    return throwError(() => new Error(message));
  }

  private requestPreview<T extends ApiResponse<CsvUploadPreviewResponse>>(
    primaryRequest: () => Observable<T>,
    fallbackRequest: () => Observable<T>
  ): Observable<T> {
    return this.executePreviewRequest(primaryRequest).pipe(
      catchError(() => this.executePreviewRequest(fallbackRequest)),
      switchMap((response) => (this.isPreviewResponseValid(response) ? of(response) : this.executePreviewRequest(fallbackRequest))),
      map((response) => {
        if (!this.isPreviewResponseValid(response)) {
          throw new Error('Preview response was invalid. Please try again.');
        }
        return response;
      }),
      catchError((error) => this.handleError(error))
    );
  }

  private executePreviewRequest<T>(request: () => Observable<T>): Observable<T> {
    return request().pipe(timeout(this.previewRequestTimeoutMs));
  }

  private isPreviewResponseValid(response: unknown): response is ApiResponse<CsvUploadPreviewResponse> {
    const candidate = response as ApiResponse<CsvUploadPreviewResponse> | null;
    return !!candidate && typeof candidate === 'object' && !!candidate.data && Array.isArray(candidate.data.records);
  }
}
