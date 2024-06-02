import { Component, ViewChild, ElementRef, AfterViewInit, input, Input } from '@angular/core';
import { Chart, ChartOptions } from 'chart.js/auto';

@Component({
  selector: 'app-dashboard-bar-chart',
  templateUrl: './dashboard-bar-chart.component.html',
  styleUrls: ['./dashboard-bar-chart.component.css']
})
export class DashboardBarChartComponent implements AfterViewInit {


  @Input('dashBoardName') userName1:string="";

  @ViewChild('multiBarCanvas') private multiBarCanvas!: ElementRef;
  private chart!: Chart;

  constructor() { }

  ngAfterViewInit(): void {
    this.initializeMultiBarChart();
  }

  initializeMultiBarChart(): void {
    const multiBarCanvas = this.multiBarCanvas.nativeElement;
    const ctx = multiBarCanvas.getContext('2d');

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
          {
            label: 'Dataset 1',
            data: [65, 59, 80, 81, 56, 55, 40],
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
          },
          {
            label: 'Dataset 2',
            data: [28, 48, 40, 19, 86, 27, 90],
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }
          ,
          {
            label: 'Dataset 3',
            data: [28, 48, 40, 19, 86, 27, 90],
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}
