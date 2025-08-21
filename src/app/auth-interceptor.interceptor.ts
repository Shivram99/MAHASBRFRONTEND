import { HttpInterceptorFn } from '@angular/common/http';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {try {
    const token = localStorage.getItem('accessToken');
    let cloned = req;
    if (token) {
      cloned = req.clone({
        setHeaders: {
          Authorization : `Bearer ${token}`
        }
      });
    }
    return next.handle(cloned);
  } catch (error) {
    return next.handle(req);
  }

  }

}