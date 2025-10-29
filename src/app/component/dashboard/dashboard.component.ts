import { Component, Inject, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],  // fixed typo: styleUrl → styleUrls
  standalone: false
})
export class DashboardComponent  implements OnInit{
  appService = inject(AuthService);
  user: string = "ADMIN";
  chartname: string = 'stack';

  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }
  ngOnInit(): void {
     if (this.isBrowser) {
      // this.initializeCharts();
    }
  }

  ngAfterViewInit() {
    // Initialize charts only on browser side
    if (this.isBrowser) {
      // this.initializeCharts();
    }
  }

  private async initializeCharts() {
    const { Chart } = await import('chart.js'); // lazy import for SSR safety

    const ctx1 = document.getElementById('chart1') as HTMLCanvasElement;
    if (ctx1) {
      new Chart(ctx1, {
        type: 'bar',
        data: this.data,
        options: {
          responsive: true,
          plugins: { legend: { position: 'top' } }
        }
      });
    }

    const ctx2 = document.getElementById('chart2') as HTMLCanvasElement;
    if (ctx2) {
      new Chart(ctx2, {
        type: 'bar',
        data: this.dashboardData,
        options: {
          responsive: true,
          plugins: { legend: { position: 'top' } }
        }
      });
    }

    const ctx3 = document.getElementById('chart3') as HTMLCanvasElement;
    if (ctx3) {
      new Chart(ctx3, {
        type: 'bar',
        data: this.dashboardData2,
        options: {
          responsive: true,
          plugins: { legend: { position: 'top' } }
        }
      });
    }
  }

  // ==== Chart Data (no changes to your original datasets) ====
  data = {
    labels: [
      'Ahmednagar', 'Akola', 'Amravati', 'Aurangabad', 'Beed', 'Bhandara',
      'Buldhana', 'Chandrapur', 'Dhule', 'Gadchiroli', 'Gondia', 'Hingoli',
      'Jalgaon', 'Jalna', 'Kolhapur', 'Latur', 'Mumbai City',
      'Mumbai Suburban', 'Nagpur', 'Nanded', 'Nandurbar', 'Nashik',
      'Osmanabad', 'Palghar', 'Parbhani', 'Pune', 'Raigad', 'Ratnagiri',
      'Sangli', 'Satara', 'Sindhudurg', 'Solapur', 'Thane', 'Wardha',
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
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: 'rgba(153, 102, 255, 1)',
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
        data: Array.from({ length: 7 }, () => Math.floor(Math.random() * 100)),
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      },
      {
        label: 'PUNE',
        data: Array.from({ length: 7 }, () => Math.floor(Math.random() * 100)),
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      },
      {
        label: 'MUMBAI',
        data: Array.from({ length: 7 }, () => Math.floor(Math.random() * 100)),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      },
      {
        label: 'THANE',
        data: Array.from({ length: 7 }, () => Math.floor(Math.random() * 100)),
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
        data: Array.from({ length: 7 }, () => Math.floor(Math.random() * 100)),
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      },
      {
        label: '2021',
        data: Array.from({ length: 7 }, () => Math.floor(Math.random() * 100)),
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      },
      {
        label: '2023',
        data: Array.from({ length: 7 }, () => Math.floor(Math.random() * 100)),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      },
      {
        label: '2024',
        data: Array.from({ length: 7 }, () => Math.floor(Math.random() * 100)),
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1
      }
    ]
  };

  // ==== Login / Registration ====
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

  // ==== Dummy Data ====
  dummyData = [
    { id: 1, name: 'Item 1', status: 'Pending' },
    { id: 2, name: 'Item 2', status: 'Approved' },
    { id: 3, name: 'Item 3', status: 'Pending' },
    { id: 4, name: 'Item 4', status: 'Pending' }
  ];

  removeItem(id: number): void {
    this.dummyData = this.dummyData.filter(item => item.id !== id);
  }

  approveItem(id: number): void {
    const index = this.dummyData.findIndex(item => item.id === id);
    if (index !== -1) {
      this.dummyData[index].status = 'Approved';
    }
  }

  handleChildEvent(data: string) {
    console.log("Data received from child:", data);
  }
}
