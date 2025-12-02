import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnInit,
  PLATFORM_ID,
  ViewChild
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { SerachBrnService } from '../../services/serach-brn.service';
import { RegistryResponse } from '../../model/registry-response';
import { Division } from '../../model/division';
import { CitizenDashboarFilter } from '../../interface/citizen-dashboar-filter';
import * as echarts from 'echarts';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: false
})
export class DashboardComponent implements OnInit, AfterViewInit {
  // ==============================
  // 🔹 UI State
  // ==============================
  menuVisible = false;
  loading = false;

  // ==============================
  // 🔹 ECharts Elements
  // ==============================
  @ViewChild('echart', { static: false }) chartEl!: ElementRef<HTMLDivElement>;
  @ViewChild('sunburstChart', { static: false }) sunburstChartEl!: ElementRef<HTMLDivElement>;

  private chartInstance: echarts.ECharts | null = null;
  private sunburstChart: echarts.ECharts | null = null;

  // ==============================
  // 🔹 Data
  // ==============================
  districts: any[] = [];
  registries: RegistryResponse[] = [];
  division: Division[] = [];
  apiResponse: any[] = [];
  mainapiResponse: any[] = [];

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
  years = [
    '2010', '2011', '2012', '2013', '2014', '2015',
    '2016', '2017', '2018', '2019', '2020', '2021',
    '2022', '2023', '2024', '2025', '2026'
  ];
  quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
  nicList = ['Textile', 'Manufacturing', 'IT Services', 'Agriculture'];

  // 🔸 Payload object for API
  payload!: CitizenDashboarFilter;

  // 🔸 Chart.js instances
  chart1: Chart | null = null;
  chart2: Chart | null = null;
  chart3: Chart | null = null;
  chart4: Chart | null = null;
  chart5: Chart | null = null;

  usedColors: string[] = [];

  constructor(
    private dataService: SerachBrnService,
    @Inject(PLATFORM_ID) private platformId: any
  ) {}

  // ==============================
  // 🔹 Lifecycle
  // ==============================
  ngOnInit(): void {
    this.fetchDistricts();
    this.loadDivisions();
    this.loadRegistries();
    this.citizenDasbhordData(); // initial load
    this.fetchCitizenDashboardDataRegDeRegNewReg()

  }

  ngAfterViewInit(): void {
    // Charts are initialized after data load (citizenDasbhordData)
  }

  ngOnDestroy(): void {
    this.destroyAllCharts();
    this.disposeECharts();
  }

  // ==============================
  // 🔹 Menu Toggle
  // ==============================
  toggleMenu() {
    this.menuVisible = !this.menuVisible;
    this.citizenDasbhordData();
  }

  // ==============================
  // 🔹 Filters
  // ==============================
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

    // Start with full data
    let filteredData = this.mainapiResponse;
    const fieldMapping: { [key: string]: string } = {
      act: 'registryName',
      region: 'division',
      district: 'district',
      year: 'year',
      quarter: 'quarter',
      nic: 'nic'
    };

    (Object.keys(this.payload) as (keyof typeof this.payload)[]).forEach(key => {
      const value = this.payload[key];
      if (value && value.toString().trim() !== '' && fieldMapping[key]) {
        const apiField = fieldMapping[key];
        filteredData = filteredData.filter((item: any) =>
          item[apiField] &&
          item[apiField].toString().toLowerCase().includes(value.toString().trim().toLowerCase())
        );
      }
    });

    this.apiResponse = filteredData;

    this.updateCharts();
    // this.renderEchart();
    this.initSunburstChart();
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
        this.loading = false;

        setTimeout(() => {
          this.updateCharts();
          // this.renderEchart();
          // this.updateDashboardCards();

          this.initSunburstChart();
        }, 50);
      },
      error: (error) => {
        console.error('❌ Error fetching dashboard data:', error.message);
        this.loading = false;
      }
    });
  }

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

  loadDivisions(): void {
    this.dataService.getAllDivisions().subscribe({
      next: (data: Division[]) => (this.division = data || []),
      error: (err) => console.error('Error loading divisions:', err)
    });
  }

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
  // 🔹 Chart.js Creation & Update
  // ==============================
  private destroyAllCharts(): void {
    [this.chart1, this.chart2, this.chart3,  this.chart5].forEach(c => c?.destroy());
    this.chart1 = this.chart2 = this.chart3 =  this.chart5 = null;
  }

  updateCharts(): void {
    this.destroyAllCharts();

    if (!this.apiResponse || this.apiResponse.length === 0) {
      return;
    }

    // -----------------------
    // Chart 1 – District & Quarter Wise
    // -----------------------
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
      options: this.getChartOptions(
        'District and Quarter-wise Registrations',
        'Districts',
        'Total Registrations',
        true
      )
    });

    // -----------------------
    // Chart 2 – Registry vs Year
    // -----------------------
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
      options: this.getChartOptions(
        'Registry-wise Registrations per Year',
        'Registry',
        'Total Registrations'
      )
    });

    // -----------------------
    // Chart 3 – District vs Registry
    // -----------------------
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
      options: this.getChartOptions(
        'District-wise Registrations per Registry',
        'District',
        'Total Registrations'
      )
    });

    // -----------------------
    // Chart 4 – Year-wise Trends
    // -----------------------
    // const groupedByYear = this.groupDataByYear(this.apiResponse);
    // const yearLabels = Object.keys(groupedByYear).sort();
    // const yearlyRegistrations = yearLabels.map((y) => groupedByYear[y].totalRegistrations);
    // const yearlyDeRegs = yearLabels.map((y) => groupedByYear[y].totalDeRegistrations || 0);

    // this.chart4 = new Chart('chart4', {
    //   type: 'bar',
    //   data: {
    //     labels: yearLabels,
    //     datasets: [
    //       { label: 'New Registrations', data: yearlyRegistrations, backgroundColor: '#17a2b8' },
    //       { label: 'Deregistrations', data: yearlyDeRegs, backgroundColor: '#6f42c1' }
    //     ]
    //   },
    //   options: this.getChartOptions(
    //     'Year-wise Registration Trends',
    //     'Years',
    //     'Registrations'
    //   )
    // });

    // -----------------------
    // Chart 5 – District & Registry Wise Total Working Persons
    // -----------------------
    const groupedData = this.groupDataByDistrictAndRegistry(this.apiResponse);
    const districtLabels1 = Object.keys(groupedData);
    const registryNamesSet = new Set<string>();

    districtLabels1.forEach(district => {
      Object.keys(groupedData[district]).forEach(reg => registryNamesSet.add(reg));
    });

    const registryNames = Array.from(registryNamesSet);

    const datasets5 = registryNames.map(reg => ({
      label: reg,
      data: districtLabels1.map(d => groupedData[d][reg] || 0),
      backgroundColor: this.getRandomColor()
    }));

    this.chart5 = new Chart('chart5', {
      type: 'bar',
      data: { labels: districtLabels1, datasets: datasets5 },
      options: this.getChartOptions(
        'District & Registry Wise Total Working Persons',
        'Districts',
        'Total Working Persons'
      )
    });
  }

  // ==============================
  // 🔹 Chart.js Helpers
  // ==============================
  private groupDataByDistrictAndQuarter(data: any[]): Record<string, Record<string, number>> {
    const grouped: Record<string, Record<string, number>> = {};
    data.forEach((item) => {
      const district = item.district || 'Unknown';
      const quarter = item.quarter || 'NA';
      if (!grouped[district]) grouped[district] = {};
      grouped[district][quarter] = (grouped[district][quarter] || 0) + (item.totalRegistrations || 0);
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

  groupDataByDistrictAndRegistry(data: any[]) {
    const result: any = {};

    data.forEach(item => {
      const district = item.district || 'Unknown';
      const registry = item.registryName || 'Unknown Registry';
      const working = item.totalpersonsworking || 0;

      if (!result[district]) {
        result[district] = {};
      }
      if (!result[district][registry]) {
        result[district][registry] = 0;
      }
      result[district][registry] += working;
    });

    return result;
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

  getRandomColor(): string {
    let color: string;
    do {
      color = `rgba(${Math.floor(Math.random() * 255)},
                    ${Math.floor(Math.random() * 255)},
                    ${Math.floor(Math.random() * 255)},
                    0.7)`;
    } while (this.usedColors.includes(color));
    this.usedColors.push(color);
    return color;
  }

  // ==============================
  // 🔹 ECharts – Brush + Stacked Bar
  // ==============================
  private disposeECharts(): void {
    if (this.chartInstance) {
      this.chartInstance.dispose();
      this.chartInstance = null;
    }
    if (this.sunburstChart) {
      this.sunburstChart.dispose();
      this.sunburstChart = null;
    }
  }

  // private renderEchart(): void {
  //   if (!isPlatformBrowser(this.platformId)) return;
  //   if (!this.chartEl?.nativeElement) return;

  //   if (!this.apiResponse || this.apiResponse.length === 0) {
  //     if (this.chartInstance) this.chartInstance.clear();
  //     return;
  //   }

  //   const grouped = this.groupDataByDistrictAndQuarter(this.apiResponse);
  //   const districtLabels = Object.keys(grouped);
  //   const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];

  //   const emphasisStyle = {
  //     itemStyle: {
  //       shadowBlur: 10,
  //       shadowColor: 'rgba(0,0,0,0.3)'
  //     }
  //   };

  //   const series = quarters.map(q => ({
  //     name: q,
  //     type: 'bar' as const,
  //     stack: 'stack',
  //     emphasis: emphasisStyle,
  //     data: districtLabels.map(d => grouped[d]?.[q] || 0)
  //   }));

  //   if (this.chartInstance) {
  //     this.chartInstance.dispose();
  //   }

  //   this.chartInstance = echarts.init(this.chartEl.nativeElement);

  //   const option: echarts.EChartsOption = {
  //     legend: {
  //       data: quarters,
  //       left: '10%'
  //     },
  //     title: {
  //       text: 'District vs Quarter – Interactive View',
  //       left: 'center'
  //     },
  //     brush: {
  //       toolbox: ['rect', 'polygon', 'lineX', 'lineY', 'keep', 'clear'],
  //       xAxisIndex: 0
  //     },
  //     toolbox: {
  //       feature: {
  //         magicType: {
  //           type: ['stack']
  //         },
  //         dataView: {}
  //       }
  //     },
  //     tooltip: {
  //       trigger: 'axis'
  //     },
  //     xAxis: {
  //       data: districtLabels,
  //       name: 'District',
  //       axisLine: { onZero: true },
  //       splitLine: { show: false },
  //       splitArea: { show: false },
  //       axisLabel: { rotate: 30 }
  //     },
  //     yAxis: {
  //       type: 'value',
  //       name: 'Total Registrations'
  //     },
  //     grid: {
  //       bottom: 100,
  //       left: 60,
  //       right: 30,
  //       containLabel: true
  //     },
  //     series
  //   };

  //   this.chartInstance.setOption(option);

  //   this.chartInstance.on('brushSelected', (params: any) => {
  //     const brushed: string[] = [];
  //     const brushComponent = params.batch[0];

  //     brushComponent.selected.forEach((sel: any, sIdx: number) => {
  //       const rawIndices = sel.dataIndex;
  //       brushed.push(`[${quarters[sIdx]}] → ${rawIndices.join(', ')}`);
  //     });

  //     this.chartInstance?.setOption({
  //       title: {
  //         backgroundColor: '#333',
  //         text: 'SELECTED DATA INDICES:\n' + brushed.join('\n'),
  //         bottom: 0,
  //         right: '10%',
  //         width: 180,
  //         textStyle: {
  //           fontSize: 11,
  //           color: '#fff'
  //         }
  //       }
  //     });
  //   });

  //   window.addEventListener('resize', () => this.chartInstance?.resize());
  // }

  // ==============================
  // 🔹 ECharts – Sunburst
  // ==============================
  initSunburstChart(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (!this.sunburstChartEl?.nativeElement) {
      console.error('Sunburst chart element missing!');
      return;
    }

    if (!this.apiResponse || this.apiResponse.length === 0) {
      if (this.sunburstChart) this.sunburstChart.clear();
      return;
    }

    const el = this.sunburstChartEl.nativeElement;

    if (this.sunburstChart) {
      this.sunburstChart.dispose();
    }

    this.sunburstChart = echarts.init(el);

    const sunburstData = this.buildSunburstData(this.apiResponse || []);

    const option: echarts.EChartsOption = {
      title: {
        text: 'Quarter → Division → District → Registry',
        subtext: 'Size: Registrations | Tooltip: Working Persons',
        right: 5,
        bottom: 10,
        textStyle: { fontSize: 14, fontWeight: 'bold' },
        subtextStyle: { fontSize: 11 }
      },
      tooltip: {
        trigger: 'item',
        formatter: (info: any) => {
          const d = info.data;
          return `
            <div style="font-size:12px; line-height:16px; min-width:200px;">
              <strong>${d?.name}</strong><br/>
              Quarter: ${d.quarter || '-'}<br/>
              Division: ${d.division || '-'}<br/>
              District: ${d.district || '-'}<br/><br/>
              📦 Registrations: <b>${info.value ?? 0}</b><br/>
              👷 Working Persons: <b>${d.totalpersonsworking ?? 0}</b>
            </div>
          `;
        }
      },
      series: [
        {
          type: 'sunburst',
          data: sunburstData,
          radius: ['10%', '90%'],
          sort: undefined,
          emphasis: { focus: 'ancestor' },
          label: {
            rotate: 'radial',
            overflow: 'break',
            minAngle: 4,
            formatter: (params: any) => params.data?.name
          },
          levels: [
            {},
            {
              // Quarter
              r0: '0%',
              r: '30%',
              label: { fontSize: 11, fontWeight: 'bold' },
              itemStyle: { borderWidth: 2 }
            },
            {
              // Division
              r0: '30%',
              r: '60%',
              label: { fontSize: 10 }
            },
            {
              // District
              r0: '60%',
              r: '75%',
              label: { fontSize: 9 },
              itemStyle: { borderWidth: 1.5 }
            },
            {
              // Registry
              r0: '75%',
              r: '90%',
              label: {
                position: 'outside',
                silent: true,
                fontSize: 9
              },
              itemStyle: { borderWidth: 2 }
            }
          ]
        }
      ]
    };

    this.sunburstChart.setOption(option);
    window.addEventListener('resize', () => this.sunburstChart?.resize());
  }

  private buildSunburstData(data: any[]): any[] {
    const grouped: any = {};

    data.forEach(item => {
      const quarter = item.quarter || 'NA';
      const division = item.division || 'Unknown Division';
      const district = item.district || 'Unknown District';
      const registry = item.registryName || 'Unknown Registry';

      if (!grouped[quarter]) grouped[quarter] = {};
      if (!grouped[quarter][division]) grouped[quarter][division] = {};
      if (!grouped[quarter][division][district]) grouped[quarter][division][district] = {};
      if (!grouped[quarter][division][district][registry]) {
        grouped[quarter][division][district][registry] = {
          totalRegistrations: 0,
          totalpersonsworking: 0,
          quarter,
          division,
          district,
          registry
        };
      }

      grouped[quarter][division][district][registry].totalRegistrations += item.totalRegistrations;
      grouped[quarter][division][district][registry].totalpersonsworking += item.totalpersonsworking;
    });

    return Object.keys(grouped).map(quarter => {
      let quarterTotReg = 0;
      let quarterTotWork = 0;

      const divisionChildren = Object.keys(grouped[quarter]).map(division => {
        let divTotReg = 0;
        let divTotWork = 0;

        const districtChildren = Object.keys(grouped[quarter][division]).map(district => {
          let distTotReg = 0;
          let distTotWork = 0;

          const registryChildren = Object.keys(grouped[quarter][division][district]).map(registry => {
            const val = grouped[quarter][division][district][registry];
            distTotReg += val.totalRegistrations;
            distTotWork += val.totalpersonsworking;

            return {
              name: registry,
              value: val.totalRegistrations,
              totalpersonsworking: val.totalpersonsworking,
              quarter,
              division,
              district,
              registry
            };
          });

          divTotReg += distTotReg;
          divTotWork += distTotWork;

          return {
            name: district,
            value: distTotReg,
            totalpersonsworking: distTotWork,
            children: registryChildren,
            quarter,
            division
          };
        });

        quarterTotReg += divTotReg;
        quarterTotWork += divTotWork;

        return {
          name: division,
          value: divTotReg,
          totalpersonsworking: divTotWork,
          children: districtChildren,
          quarter
        };
      });

      return {
        name: quarter,
        value: quarterTotReg,
        totalpersonsworking: quarterTotWork,
        children: divisionChildren
      };
    });
  }
  dashboardCards: any[] = [];

fetchCitizenDashboardDataRegDeRegNewReg() {
  this.loading = true;
  this.dataService.getCitizenDashboardDataRegDeRegNewReg().subscribe({
    next: (res) => {
      ;
      this.loading = false;
      this.updateDashboardSummary(res); // Your KPI cards update
      
    },
    error: (err) => {
      console.error("Dashboard API Error:", err);
      this.loading = false;
    }
  });
}
  
updateDashboardSummary(response: any[]) {
  // Calculate totals
  const totalRegistrations = response.reduce((s, i) => s + (i.totalRegistrations || 0), 0);
  const totalDeregistrations = response.reduce((s, i) => s + (i.totalDeregistrations || 0), 0);
  const newRegistrationsThisYear = response.reduce((s, i) => s + (i.newRegistrationsThisYear || 0), 0);
  const totalPersonsWorking = response.reduce((s, i) => s + (i.totalPersonsWorking || 0), 0);

  const activeRegistrations = totalRegistrations - totalDeregistrations;

  // Set KPI Cards Data
  this.dashboardCards = [
    { label: 'Total Registrations', value: totalRegistrations, icon: 'bi bi-bar-chart-fill text-primary' },
    { label: 'Total working persion', value: totalPersonsWorking, icon: 'bi bi-people-fill text-success' },
    { label: 'Deregistrations', value: totalDeregistrations, icon: 'bi bi-x-octagon-fill text-danger' },
    { label: 'New Registrations This Year', value: newRegistrationsThisYear, icon: 'bi bi-stars text-warning' }
  ];
}

}
