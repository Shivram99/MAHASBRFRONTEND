import { Component, inject } from '@angular/core';
import { DashboardNavComponent } from '../dashboard-nav/dashboard-nav.component';


import { FormControl, FormGroup, Validators } from '@angular/forms';

import { take } from 'rxjs';

import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { ChartfilterComponent } from '../chartfilter/chartfilter.component';


@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css',
    standalone: false
})
export class DashboardComponent  {
  appService = inject(AuthService);
  user: string = "ADMIN";
  chartname:string='stack';
  data = {
    labels: [
      'Ahmednagar', 'Akola', 'Amravati', 'Aurangabad', 'Beed', 'Bhandara', 'Buldhana',
      'Chandrapur', 'Dhule', 'Gadchiroli', 'Gondia', 'Hingoli', 'Jalgaon', 'Jalna',
      'Kolhapur', 'Latur', 'Mumbai City', 'Mumbai Suburban', 'Nagpur', 'Nanded',
      'Nandurbar', 'Nashik', 'Osmanabad', 'Palghar', 'Parbhani', 'Pune', 'Raigad',
      'Ratnagiri', 'Sangli', 'Satara', 'Sindhudurg', 'Solapur', 'Thane', 'Wardha',
      'Washim', 'Yavatmal'
    ],
    datasets: [
      {
        label: 'Quarter 1',
        data: Array.from({ length: 36 }, () => Math.floor(Math.random() * 100)),
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      },
      {
        label: 'Quarter 2',
        data: Array.from({ length: 36 }, () => Math.floor(Math.random() * 100)),
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      },
      {
        label: 'Quarter 3',
        data: Array.from({ length: 36 }, () => Math.floor(Math.random() * 100)),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      },
      {
        label: 'Quarter 4',
        data: Array.from({ length: 36 }, () => Math.floor(Math.random() * 100)),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }
    ]
  };

  dashboardData = {
    labels: [
      'Industry Act',
      'Companies Act',
      'Shop and Commercial Establishments Act',
      'Co operative Societies Act-1960',
      'The Bombay Khadi & Village Industries Act, 1960',
      'Factory Act',
      'Society Registration act, 1860 / Bombay Public Trust Act. 1950'
    ],
    datasets: [
      {
        label: 'Akola',
        data: Array.from({ length: 36 }, () => Math.floor(Math.random() * 100)),
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      },
      {
        label: 'PUNE',
        data: Array.from({ length: 36 }, () => Math.floor(Math.random() * 100)),
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      },
      {
        label: 'MUMBAI',
        data: Array.from({ length: 36 }, () => Math.floor(Math.random() * 100)),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      },
      {
        label: 'THANE',
        data: Array.from({ length: 36 }, () => Math.floor(Math.random() * 100)),
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1
      }
    ]
  };

  dashboardData2 = {
    labels: [
      'Industry Act',
      'Companies Act',
      'Shop and Commercial Establishments Act',
      'Co operative Societies Act-1960',
      'The Bombay Khadi & Village Industries Act, 1960',
      'Factory Act',
      'Society Registration act, 1860 / Bombay Public Trust Act. 1950'
    ],
    datasets: [
      {
        label: '2020',
        data: Array.from({ length: 36 }, () => Math.floor(Math.random() * 100)),
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      },
      {
        label: '2021',
        data: Array.from({ length: 36 }, () => Math.floor(Math.random() * 100)),
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      },
      {
        label: '2023',
        data: Array.from({ length: 36 }, () => Math.floor(Math.random() * 100)),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      },
      {
        label: '2024',
        data: Array.from({ length: 36 }, () => Math.floor(Math.random() * 100)),
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1
      }
    ]
  };

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
  handleChildEvent(data: string) {
    console.log("Data received from child:", data);
    // You can perform additional logic here based on the received data
  }
}