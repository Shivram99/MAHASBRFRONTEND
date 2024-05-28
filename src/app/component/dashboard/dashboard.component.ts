import { Component, inject } from '@angular/core';


import { FormControl, FormGroup, Validators } from '@angular/forms';

import { take } from 'rxjs';

import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';




@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent  {
  appService = inject(AuthService);


  loginForm!: FormGroup;
  registrationForm!: FormGroup;
  isLoggedIn: boolean = false;
  registrationSuccess: boolean = false;
  name = '';
  roles: string[] = [];
  unsecure!: string;
  secure!: string;
  secureAdmin!: string;
  showRegistration = false;


  // fetchUnsecure() {
  //   this.appService
  //     .fetchUnsecureEndpoint()
  //     .pipe(take(1))
  //     .subscribe((response) => {
  //       this.unsecure = response.msg;
  //     });
  // }

  // fetchSecure() {
  //   this.appService
  //     .fetchSecureEndpoint()
  //     .pipe(take(1))
  //     .subscribe({
  //       next: (response) => (this.secure = response.msg),
  //       error: (err) => {
  //         this.secure = err.statusText;
  //       },
  //     });
  // }

  // fetchSecureAdmin() {
  //   this.appService
  //     .fetchSecureAdminEndpoint()
  //     .pipe(take(1))
  //     .subscribe({
  //       next: (response) => (this.secureAdmin = response.msg),
  //       error: (err) => {
  //         this.secureAdmin = err.statusText;
  //       },
  //     });
  // }

  // Dummy data
  dummyData = [
    { id: 1, name: 'Item 1', status: 'Pending' },
    { id: 2, name: 'Item 2', status: 'Approved' },
    { id: 3, name: 'Item 3', status: 'Pending' },
    { id: 4, name: 'Item 4', status: 'Pending' }
  ];

  removeItem(id: number): void {
    // Logic to remove item from the list
    this.dummyData = this.dummyData.filter(item => item.id !== id);
  }

  approveItem(id: number): void {
    // Logic to approve item
    const index = this.dummyData.findIndex(item => item.id === id);
    if (index !== -1) {
      this.dummyData[index].status = 'Approved';
    }
  }
}