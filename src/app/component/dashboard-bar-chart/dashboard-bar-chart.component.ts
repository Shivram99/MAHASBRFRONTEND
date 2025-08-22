import { Component, ViewChild, ElementRef, AfterViewInit, input, Input } from '@angular/core';
import { Chart, ChartOptions } from 'chart.js/auto';


interface ChartData {
  labels: string[];
  datasets: any[];
}

@Component({
    selector: 'app-dashboard-bar-chart',
    templateUrl: './dashboard-bar-chart.component.html',
    styleUrls: ['./dashboard-bar-chart.component.css'],
    standalone: false
})


export class DashboardBarChartComponent implements AfterViewInit {


  @Input() dashboarddata: any;
  @Input() chartType: string='';
  
  @Input() userType:string='';

  @ViewChild('multiBarCanvas') private multiBarCanvas!: ElementRef;
  private chart!: Chart;

  constructor() {
   }

  
   ngAfterViewInit(): void {
    this.initializeMultiBarChart();
  }

  initializeMultiBarChart(): void {
    const multiBarCanvas = this.multiBarCanvas.nativeElement;
    const ctx = multiBarCanvas.getContext('2d');

    let scalesOptions = {
      x: {
          stacked: false
      },
      y: {
          stacked: false
      }
    };

    if (this.chartType === 'stack') {
      scalesOptions = {
        x: {
          stacked: true
        },
        y: {
          stacked: true
        }
      };
    }

    this.chart = new Chart(ctx, {
      type: 'bar',  
      data: this.dashboarddata,
      options: {
          responsive: true,
          plugins: {
              legend: {
                  position: 'bottom',
              },
              title: {
                  display: true,
                  text: 'Stacked Bar Chart'
              }
          },
          scales: scalesOptions
      }
    });
  }
 
}
