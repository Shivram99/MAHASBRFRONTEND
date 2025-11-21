import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { MstMenu } from '../model/mst-menu';
import { environment } from '../../environments/environment.development';
import { Menu } from '../interface/menu';
import { ApiResponse } from '../interface/api-response';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  
   apiUrl: String = "";
    constructor(private http: HttpClient) {
      this.apiUrl = environment.apiUrl;
    }
  
  //private apiUrl = 'http://localhost:8085/MAHASBR/developer';
/** ============================
   *  GET ALL MENUS
   *  ============================ */
  getAllMenus(): Observable<Menu[]> {
    return this.http.get<ApiResponse<Menu[]>>(`${this.apiUrl}/citizenSearch/menus`).pipe(
      map(res => res.data),
      catchError(err => {
        console.error('Failed to fetch menus', err);
        return throwError(() => err);
      })
    );
  }

  /** ============================
   *  GET MENU BY ID
   *  ============================ */
  getMenuById(id: number): Observable<Menu> {
    return this.http.get<ApiResponse<Menu>>(`${this.apiUrl}/citizenSearch/menus/${id}`).pipe(
      map(res => res.data),
      catchError(err => throwError(() => err))
    );
  }

  /** ============================
   *  CREATE MENU
   *  ============================ */
  // createMenu(payload: Menu): Observable<Menu> {
  //   return this.http.post<ApiResponse<Menu>>(`${this.apiUrl}/citizenSearch/menus`, payload).pipe(
  //     map(res => res.data),
  //     catchError(err => throwError(() => err))
  //   );
  // }

  createMenu(payload: Partial<Menu>): Observable<Menu> {
  return this.http.post<ApiResponse<Menu>>(`${this.apiUrl}/citizenSearch/menus`, payload).pipe(
    map(res => res.data)
  );
}


  /** ============================
   *  UPDATE MENU
   *  ============================ */
  // updateMenu(id: number, payload: Menu): Observable<Menu> {
  //   return this.http.put<ApiResponse<Menu>>(`${this.apiUrl}/citizenSearch/menus/${id}`, payload).pipe(
  //     map(res => res.data),
  //     catchError(err => throwError(() => err))
  //   );
  // }
  updateMenu(id: number, payload: Partial<Menu>): Observable<Menu> {
  return this.http.put<ApiResponse<Menu>>(`${this.apiUrl}/citizenSearch/menus/${id}`, payload).pipe(
    map(res => res.data)
  );
}

  /** ============================
   *  DELETE MENU
   *  ============================ */
  deleteMenu(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/citizenSearch/menus/${id}`).pipe(
      catchError(err => throwError(() => err))
    );
  }

  /** ============================
   *  ACTIVATE MENU
   *  ============================ */
  activate(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/citizenSearch/menus/${id}/activate`, {}).pipe(
      catchError(err => throwError(() => err))
    );
  }

  /** ============================
   *  DEACTIVATE MENU
   *  ============================ */
  deactivate(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/citizenSearch/menus/${id}/deactivate`, {}).pipe(
      catchError(err => throwError(() => err))
    );
  }
}