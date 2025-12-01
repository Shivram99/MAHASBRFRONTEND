import { HttpErrorResponse } from '@angular/common/http'; 
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor() { }

   public getErrorMessage(error: HttpErrorResponse | any): string {
    if (!error) return 'An unexpected error occurred. Please try again.';

    if (error.status === 0) {
      return 'Server is not reachable. Please check your network or backend.';
    } else if (error.status === 404) {
      return 'Requested resource not found.';
    } else if (error.status === 500) {
      return 'Internal Server Error. Please try again later.';
    } else if (error.error?.message) {
      return error.error.message;
    } else {
      return 'An unexpected error occurred. Please try again.';
    }
  }
}
