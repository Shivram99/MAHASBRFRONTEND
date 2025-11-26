import { AfterViewInit, Component, Inject, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Chart, registerables } from 'chart.js';
import { SerachBrnService } from '../../services/serach-brn.service';
import { RegistryResponse } from '../../model/registry-response';
import { Division } from '../../model/division';
import { CitizenDashboarFilter } from '../../interface/citizen-dashboar-filter';
import { Console } from 'console';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],  // fixed typo: styleUrl → styleUrls
  standalone: false
})
export class DashboardComponent implements OnInit, AfterViewInit {
  // ==============================
  // 🔹 Class Properties
  // ==============================
menuVisible = false;


toggleMenu() {
  this.menuVisible = !this.menuVisible;
}
  districts: any[] = [];
  registries: RegistryResponse[] = [];
  division: Division[] = [];
  apiResponse: any[] = [];
  mainapiResponse: any[] = [];
  loading = false;
typesOfDataLable = [
  { key: 'NR', value: 'New Registration' },
  { key: 'TR', value: 'Total Registration' },
  { key: 'DR', value: 'Deregistration' }
];


get selectedCountLabel() {
  return this.typesOfDataLable.find(t => t.key === this.selectedCountType)?.value || '';
}
  // 🔸 Selected filter values
  selectedCountType = 'NR';
  selectedAct = '';
  selectedRegion = '';
  selectedDistrict = '';
  selectedYear = '';
  selectedQuarter = '';
  selectedNic = '';

  // 🔸 Static lists for dropdowns
  acts = ['Industry Act', 'Factory Act', 'Companies Act'];
  regions = ['Konkan', 'Vidarbha', 'Marathwada'];
  years = ['2021', '2022', '2023', '2024','2025','2026'];
  quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
  nicList = ['Textile', 'Manufacturing', 'IT Services', 'Agriculture'];

  // 🔸 Payload object for API
  payload!: CitizenDashboarFilter;

  // 🔸 Chart.js instances
  chart1!: Chart;
  chart2!: Chart;
  chart3!: Chart;
  chart4!: Chart;

  // ==============================
  // 🔹 Constructor & Lifecycle Hooks
  // ==============================

  constructor(private dataService: SerachBrnService) {}

  ngOnInit(): void {
    this.fetchDistricts();
    this.loadDivisions();
    this.loadRegistries();
    this.citizenDasbhordData(); // Load initial data
  }

  ngAfterViewInit(): void {
    
  }

  onCountTypeChange(type: string) {
     
  this.payload = {
      countType: this.selectedCountType,
      act: this.selectedAct,
      region: this.selectedRegion,
      district: this.selectedDistrict,
      year: this.selectedYear,
      quarter: this.selectedQuarter,
      nic: this.selectedNic
    };
    this.citizenDasbhordData();
}


  // ==============================
  // 🔹 Filters
  // ==============================

  onSubmit(): void {
    
    this.payload = {
      countType: this.selectedCountType,
      act: this.selectedAct,
      region: this.selectedRegion,
      district: this.selectedDistrict,
      year: this.selectedYear,
      quarter: this.selectedQuarter,
      nic: this.selectedNic
    };


     // Start with the full data
  let filteredData = this.mainapiResponse

  console.log(`this.mainapiResponse :${this.mainapiResponse}`)
  // Mapping between payload keys and response property names
  const fieldMapping: { [key: string]: string } = {
    act: 'registryName',
    region: 'divisionName',
    district: 'district',
    year: 'year',
    quarter: 'quarter',
    nic: 'nic'
  };

  debugger;
  // Loop over each key in payload
  (Object.keys(this.payload) as (keyof typeof this.payload)[]).forEach(key => {
    const value = this.payload[key];

    // ✅ Ignore undefined, null, empty, or only spaces
    if (value && value.toString().trim() !== '' && fieldMapping[key]) {
      const apiField = fieldMapping[key];

      filteredData = filteredData.filter((item: any) =>
        item[apiField] &&
        item[apiField].toString().toLowerCase().includes(value.toString().trim().toLowerCase())
      );
    }
  });

  console.log(filteredData)

  this.apiResponse = filteredData;
    this.updateCharts();
  }

  onClear(): void {
    this.selectedAct = '';
    this.selectedRegion = '';
    this.selectedDistrict = '';
    this.selectedYear = '';
    this.selectedQuarter = '';
    this.selectedNic = '';
    this.onSubmit();
  }

  // ==============================
  // 🔹 API Calls
  // ==============================

  /**
   * Fetches filtered dashboard data from API and updates charts.
   */
  citizenDasbhordData(): void {
     this.loading = true;
    if (!this.payload) {
      this.payload = {
        countType: this.selectedCountType || 'NR',
        act: this.selectedAct || '',
        region: this.selectedRegion || '',
        district: this.selectedDistrict || '',
        year: this.selectedYear || '',
        quarter: this.selectedQuarter || '',
        nic: this.selectedNic || ''
      };
    }

    this.dataService.getFilteredDashboardData(this.payload).subscribe({
      next: (response) => {
        this.apiResponse = response;
        this.mainapiResponse = response;
        // console.log('✅ API Data:', response);
         this.loading = false;
        setTimeout(() => {
  this.updateCharts();
}, 50);
      },
      error: (error) => {
        console.error('❌ Error fetching dashboard data:', error.message);
        this.loading = false; 
      }
    });
  }

  /**
   * Loads all registries from API.
   */
  loadRegistries(): void {
    this.loading = true;
    this.dataService.getAllRegistry().subscribe({
      next: (data) => {
        this.registries = data;
        this.loading = false;
      },
      error: () => (this.loading = false)
    });
  }

  /**
   * Loads all divisions from API.
   */
  loadDivisions(): void {
    this.dataService.getAllDivisions().subscribe({
      next: (data: Division[]) => (this.division = data || []),
      error: (err) => console.error('Error loading divisions:', err)
    });
  }

  /**
   * Loads all districts from API.
   */
  fetchDistricts(): void {
    this.dataService.getAllDistricts().subscribe({
      next: (districtsData) => {
        if (Array.isArray(districtsData)) {
          this.districts = districtsData.map((d) => ({
            censusDistrictCode: d.censusDistrictCode,
            districtName: d.districtName,
            censusStateCode: d.censusStateCode
          }));
        }
      },
      error: (err) => {
        console.error('Error fetching districts:', err);
        this.districts = [];
      }
    });
  }

  // ==============================
  // 🔹 Chart Creation & Update
  // ==============================

  updateCharts(): void {
    // Destroy old charts before creating new ones
    [this.chart1, this.chart2, this.chart3, this.chart4].forEach((chart) => {
      if (chart) chart.destroy();
    });

    // ==================================
    // 🔸 Chart 1 – District & Quarter Wise
    // ==================================
    const groupedByDistrict = this.groupDataByDistrictAndQuarter(this.apiResponse);
    const districtLabels = Object.keys(groupedByDistrict);
    const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];

    const districtDatasets = quarters.map((q) => ({
      label: q,
      data: districtLabels.map((d) => groupedByDistrict[d][q] || 0),
      backgroundColor: this.getQuarterColor(q)
    }));

    this.chart1 = new Chart('chart1', {
      type: 'bar',
      data: { labels: districtLabels, datasets: districtDatasets },
      options: this.getChartOptions('District and Quarter-wise Registrations', 'Districts', 'Total Registrations', true)
    });

    // ==================================
    // 🔸 Chart 2 – Registry vs Year
    // ==================================
    const years = this.getDistinctYears(this.apiResponse);
    const registries = this.getDistinctRegistryNames(this.apiResponse);

    const datasets2 = years.map((year, i) => ({
      label: year.toString(),
      data: registries.map((registry) => {
        const yearData = this.getYearWiseRegistrations(this.apiResponse, registry, years);
        return yearData[i];
      }),
      backgroundColor: this.getColor(i)
    }));

    this.chart2 = new Chart('chart2', {
      type: 'bar',
      data: { labels: registries, datasets: datasets2 },
      options: this.getChartOptions('Registry-wise Registrations per Year', 'Registry', 'Total Registrations')
    });

    // ==================================
    // 🔸 Chart 3 – District vs Registry
    // ==================================
    const districts = this.getDistinctDistrictNames(this.apiResponse);
    const registries3 = this.getDistinctRegistryNames(this.apiResponse);

    const datasets3 = registries3.map((registry, i) => ({
      label: registry,
      data: districts.map((district) =>
        this.getRegistrationsByDistrictAndRegistry(this.apiResponse, district, registry)
      ),
      backgroundColor: this.getColor(i)
    }));

    this.chart3 = new Chart('chart3', {
      type: 'bar',
      data: { labels: districts, datasets: datasets3 },
      options: this.getChartOptions('District-wise Registrations per Registry', 'District', 'Total Registrations')
    });

    // ==================================
    // 🔸 Chart 4 – Year-wise Trends
    // ==================================
    const groupedByYear = this.groupDataByYear(this.apiResponse);
    const yearLabels = Object.keys(groupedByYear).sort();
    const yearlyRegistrations = yearLabels.map((y) => groupedByYear[y].totalRegistrations);
    const yearlyDeRegs = yearLabels.map((y) => groupedByYear[y].totalDeRegistrations || 0);

    this.chart4 = new Chart('chart4', {
      type: 'bar',
      data: {
        labels: yearLabels,
        datasets: [
          { label: 'New Registrations', data: yearlyRegistrations, backgroundColor: '#17a2b8' },
          { label: 'Deregistrations', data: yearlyDeRegs, backgroundColor: '#6f42c1' }
        ]
      },
      options: this.getChartOptions('Year-wise Registration Trends', 'Years', 'Registrations')
    });
  }

  // ==============================
  // 🔹 Helper Methods
  // ==============================

  private groupDataByDistrictAndQuarter(data: any[]): Record<string, Record<string, number>> {
    const grouped: Record<string, Record<string, number>> = {};
    data.forEach((item) => {
      const district = item.district || 'Unknown';
      const quarter = item.quarter || 'NA';
      if (!grouped[district]) grouped[district] = {};
      grouped[district][quarter] = (grouped[district][quarter] || 0) + item.totalRegistrations;
    });
    return grouped;
  }

  private groupDataByYear(data: any[]): Record<string, { totalRegistrations: number; totalDeRegistrations: number }> {
    const grouped: Record<string, { totalRegistrations: number; totalDeRegistrations: number }> = {};
    data.forEach((item) => {
      const year = item.year || 'Unknown';
      if (!grouped[year]) grouped[year] = { totalRegistrations: 0, totalDeRegistrations: 0 };
      grouped[year].totalRegistrations += item.totalRegistrations;
      grouped[year].totalDeRegistrations += item.totalDeRegistrations || 0;
    });
    return grouped;
  }

  // ==============================
  // 🔹 Utility / Computation Helpers
  // ==============================

  getDistinctYears(data: any[]): string[] {
    return Array.from(new Set(data.map((item) => item.year))).sort();
  }

  getDistinctRegistryNames(data: any[]): string[] {
    return Array.from(new Set(data.map((item) => item.registryName))).sort();
  }

  getDistinctDistrictNames(data: any[]): string[] {
    return Array.from(new Set(data.map((item) => item.district))).sort();
  }

  getYearWiseRegistrations(data: any[], registryName: string, years: string[]): number[] {
    return years.map((year) =>
      data
        .filter((item) => item.registryName === registryName && item.year === year)
        .reduce((sum, item) => sum + (item.totalRegistrations || 0), 0)
    );
  }

  getRegistrationsByDistrictAndRegistry(data: any[], district: string, registry: string): number {
    return data
      .filter((item) => item.district === district && item.registryName === registry)
      .reduce((sum, item) => sum + (item.totalRegistrations || 0), 0);
  }

  getColor(index: number): string {
    const colors = ['#28a745', '#dc3545', '#007bff', '#ffc107', '#6f42c1', '#fd7e14', '#20c997'];
    return colors[index % colors.length];
  }

  getQuarterColor(quarter: string): string {
    const colors: Record<string, string> = {
      Q1: '#4472C4',
      Q2: '#ED7D31',
      Q3: '#A5A5A5',
      Q4: '#FFC000'
    };
    return colors[quarter] || '#6c757d';
  }

  getChartOptions(title: string, xLabel: string, yLabel: string, stacked: boolean = false): any {
    return {
      responsive: true,
      plugins: {
        title: { display: true, text: title, font: { size: 16, weight: 'bold' } },
        legend: { position: 'bottom' }
      },
      scales: {
        x: { stacked, title: { display: true, text: xLabel } },
        y: { stacked, beginAtZero: true, title: { display: true, text: yLabel } }
      }
    };
  }
}


