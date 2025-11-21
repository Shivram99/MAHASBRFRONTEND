import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-dashboard-tab',
    templateUrl: './dashboard-tab.component.html',
    styleUrl: './dashboard-tab.component.css',
    standalone: false
})
export class DashboardTabComponent implements OnInit {

  user: string = 'ADMIN';
  chartname: string = 'stack';

  data: any;
  dashboardData: any;
  dashboardData2: any;

  isLoggedIn: boolean = false;
  registrationSuccess: boolean = false;
  name: string = '';
  roles: string[] = [];
  unsecure!: string;
  secure!: string;
  secureAdmin!: string;
  showRegistration: boolean = false;

  dummyData = [
    { id: 1, name: 'Item 1', status: 'Pending' },
    { id: 2, name: 'Item 2', status: 'Approved' },
    { id: 3, name: 'Item 3', status: 'Pending' },
    { id: 4, name: 'Item 4', status: 'Pending' }
  ];

  ngOnInit(): void {
    // Initialize chart data when component loads
    this.initializeChartData();
  }

  private initializeChartData(): void {
    this.data = {
      labels: [
        'Ahmednagar', 'Akola', 'Amravati', 'Aurangabad', 'Beed', 'Bhandara', 'Buldhana',
        'Chandrapur', 'Dhule', 'Gadchiroli', 'Gondia', 'Hingoli', 'Jalgaon', 'Jalna',
        'Kolhapur', 'Latur', 'Mumbai City', 'Mumbai Suburban', 'Nagpur', 'Nanded',
        'Nandurbar', 'Nashik', 'Osmanabad', 'Palghar', 'Parbhani', 'Pune', 'Raigad',
        'Ratnagiri', 'Sangli', 'Satara', 'Sindhudurg', 'Solapur', 'Thane', 'Wardha',
        'Washim', 'Yavatmal'
      ],
      datasets: [
        this.createDataset('Quarter 1', 'rgba(255, 99, 132, 0.2)', 'rgba(255, 99, 132, 1)'),
        this.createDataset('Quarter 2', 'rgba(54, 162, 235, 0.2)', 'rgba(54, 162, 235, 1)'),
        this.createDataset('Quarter 3', 'rgba(75, 192, 192, 0.2)', 'rgba(75, 192, 192, 1)'),
        this.createDataset('Quarter 4', 'rgba(153, 102, 255, 0.2)', 'rgba(153, 102, 255, 1)')
      ]
    };

    this.dashboardData = {
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
        this.createDataset('Akola', 'rgba(255, 99, 132, 0.2)', 'rgba(255, 99, 132, 1)'),
        this.createDataset('Pune', 'rgba(54, 162, 235, 0.2)', 'rgba(54, 162, 235, 1)'),
        this.createDataset('Mumbai', 'rgba(75, 192, 192, 0.2)', 'rgba(75, 192, 192, 1)'),
        this.createDataset('Thane', 'rgba(153, 102, 255, 0.2)', 'rgba(153, 102, 255, 1)')
      ]
    };

    this.dashboardData2 = {
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
        this.createDataset('2020', 'rgba(255, 99, 132, 0.2)', 'rgba(255, 99, 132, 1)'),
        this.createDataset('2021', 'rgba(54, 162, 235, 0.2)', 'rgba(54, 162, 235, 1)'),
        this.createDataset('2023', 'rgba(75, 192, 192, 0.2)', 'rgba(75, 192, 192, 1)'),
        this.createDataset('2024', 'rgba(153, 102, 255, 0.2)', 'rgba(153, 102, 255, 1)')
      ]
    };
  }

  private createDataset(label: string, bgColor: string, borderColor: string) {
    return {
      label,
      data: Array.from({ length: 36 }, () => Math.floor(Math.random() * 100)),
      backgroundColor: bgColor,
      borderColor: borderColor,
      borderWidth: 1
    };
  }

  removeItem(id: number): void {
    this.dummyData = this.dummyData.filter(item => item.id !== id);
  }

  approveItem(id: number): void {
    const index = this.dummyData.findIndex(item => item.id === id);
    if (index !== -1) {
      this.dummyData[index].status = 'Approved';
    }
  }

  handleChildEvent(data: string): void {
    console.log('📩 Data received from child:', data);
    // You can add your business logic here
  }
}
