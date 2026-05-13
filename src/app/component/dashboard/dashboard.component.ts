import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Chart, ChartConfiguration, ChartOptions, registerables } from 'chart.js';
import { finalize } from 'rxjs';
import { SerachBrnService } from '../../services/serach-brn.service';
import { RegistryResponse } from '../../model/registry-response';
import { Division } from '../../model/division';
import { District } from '../../interface/district';
import { Talukas } from '../../interface/talukas';
import { CitizenDashboardFilterRequest } from '../../interface/citizen-dashboar-filter';
import { CitizenDashboardRow } from '../../interface/citizen-dashboard-row';
import { CitizenDashboardDataRegDeRegNewReg } from '../../interface/citizen-dashboard-data-reg-de-reg-new-reg';

Chart.register(...registerables);

type DashboardCountType = 'NR' | 'TR' | 'DR';

interface DashboardFilterOption {
  value: string;
  label: string;
}

interface DashboardFilterState {
  countType: DashboardCountType;
  year: string;
  ruralUrban: string;
  state: string;
  region: string;
  districtCode: string;
  tehsilCode: string;
  act: string;
  nicClassification: string;
  deregisteredClosed: string;
}

interface DashboardCard {
  label: string;
  value: number;
  icon: string;
}

interface DashboardViewRow extends CitizenDashboardRow {
  districtCode: string;
  stateCode: string;
  stateName: string;
  tehsilName: string;
  ruralUrbanLabel: string;
  nicClassificationLabel: string;
  deregisteredClosedLabel: string;
}

const COUNT_TYPE_OPTIONS: ReadonlyArray<{ key: DashboardCountType; label: string }> = [
  { key: 'NR', label: 'New Registration' },
  { key: 'TR', label: 'Total Registration' },
  { key: 'DR', label: 'Deregistration' }
];

const RURAL_URBAN_OPTIONS: ReadonlyArray<DashboardFilterOption> = [
  { value: 'Rural', label: 'Rural' },
  { value: 'Urban', label: 'Urban' }
];

const DEREGISTERED_CLOSED_OPTIONS: ReadonlyArray<DashboardFilterOption> = [
  { value: 'Deregistered', label: 'Deregistered' },
  { value: 'Closed', label: 'Closed' }
];

const STATE_NAME_BY_CODE: Readonly<Record<string, string>> = {
  '27': 'Maharashtra'
};

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: false
})
export class DashboardComponent implements OnInit {
  menuVisible = false;
  loading = false;

  registries: RegistryResponse[] = [];
  divisions: Division[] = [];
  districts: District[] = [];
  tehsils: Talukas[] = [];
  nicClassificationOptions: DashboardFilterOption[] = [];
  dashboardCards: DashboardCard[] = [];
  apiResponse: DashboardViewRow[] = [];

  readonly countTypeOptions = COUNT_TYPE_OPTIONS;
  readonly ruralUrbanOptions = RURAL_URBAN_OPTIONS;
  readonly deregisteredClosedOptions = DEREGISTERED_CLOSED_OPTIONS;

  filters: DashboardFilterState = this.createDefaultFilters();

  chart1: Chart | null = null;
  chart2: Chart | null = null;
  chart3: Chart | null = null;
  chart5: Chart | null = null;

  private rawDashboardRows: CitizenDashboardRow[] = [];
  private allDashboardRows: DashboardViewRow[] = [];
  private usedColors = new Set<string>();

  constructor(
    private readonly dataService: SerachBrnService,
    @Inject(PLATFORM_ID) private readonly platformId: object
  ) {}

  get selectedCountLabel(): string {
    return this.countTypeOptions.find((type) => type.key === this.filters.countType)?.label ?? '';
  }

  get stateOptions(): DashboardFilterOption[] {
    const stateCodes = Array.from(
      new Set(
        this.districts
          .map((district) => this.normalizeValue(district.censusStateCode))
          .filter((stateCode) => stateCode !== '')
      )
    ).sort((left, right) => this.resolveStateName(left).localeCompare(this.resolveStateName(right)));

    return stateCodes.map((stateCode) => ({
      value: stateCode,
      label: this.resolveStateName(stateCode)
    }));
  }

  get regionOptions(): DashboardFilterOption[] {
    return this.divisions
      .filter((division) => division.isActive !== false)
      .map((division) => ({
        value: this.normalizeValue(division.divisionName),
        label: this.normalizeValue(division.divisionName)
      }))
      .sort((left, right) => left.label.localeCompare(right.label));
  }

  get districtOptions(): DashboardFilterOption[] {
    const selectedDivisionCode = this.getSelectedDivisionCode();

    return this.districts
      .filter((district) => this.matchesSelectedState(district))
      .filter((district) =>
        !selectedDivisionCode || this.normalizeValue(district.divisionCode) === selectedDivisionCode
      )
      .map((district) => ({
        value: this.normalizeValue(district.censusDistrictCode),
        label: this.normalizeValue(district.districtName)
      }))
      .sort((left, right) => left.label.localeCompare(right.label));
  }

  get tehsilOptions(): DashboardFilterOption[] {
    return this.tehsils
      .map((tehsil) => ({
        value: this.normalizeValue(tehsil.censusTalukaCode),
        label: this.normalizeValue(tehsil.talukaName)
      }))
      .sort((left, right) => left.label.localeCompare(right.label));
  }

  get actOptions(): DashboardFilterOption[] {
    return this.registries
      .filter((registry) => registry.status !== false)
      .map((registry) => ({
        value: this.normalizeValue(registry.registryNameEn),
        label: this.normalizeValue(registry.registryNameEn)
      }))
      .sort((left, right) => left.label.localeCompare(right.label));
  }

  get yearOptions(): DashboardFilterOption[] {
    const years = Array.from(
      new Set(
        this.rawDashboardRows
          .map((row) => this.normalizeValue(row.year))
          .filter((year) => year !== '')
      )
    ).sort((left, right) => Number(right) - Number(left));

    return years.map((year) => ({ value: year, label: year }));
  }

  get isRuralUrbanFilterAvailable(): boolean {
    return this.hasDataForField((row) => row.ruralUrbanLabel);
  }

  get isTehsilFilterAvailable(): boolean {
    return this.hasDataForField((row) => row.tehsilName);
  }

  get isNicClassificationFilterAvailable(): boolean {
    return (
      this.nicClassificationOptions.length > 0 &&
      this.hasDataForField((row) => row.nicClassificationLabel)
    );
  }

  get isDeregisteredClosedFilterAvailable(): boolean {
    return this.hasDataForField((row) => row.deregisteredClosedLabel);
  }

  get hasBackendDataGaps(): boolean {
    return (
      !this.isRuralUrbanFilterAvailable ||
      !this.isTehsilFilterAvailable ||
      !this.isNicClassificationFilterAvailable ||
      !this.isDeregisteredClosedFilterAvailable
    );
  }

  ngOnInit(): void {
    this.loadLookupData();
    this.loadDashboardData();
    this.fetchCitizenDashboardSummary();
  }

  ngOnDestroy(): void {
    this.destroyAllCharts();
  }

  toggleMenu(): void {
    this.menuVisible = !this.menuVisible;
  }

  onCountTypeChange(): void {
    this.loadDashboardData();
  }

  onStateChange(): void {
    this.resetDistrictAndTehsilIfNeeded();
  }

  onRegionChange(): void {
    this.resetDistrictAndTehsilIfNeeded();
  }

  onDistrictChange(): void {
    this.filters.tehsilCode = '';
    this.tehsils = [];

    if (!this.filters.districtCode) {
      return;
    }

    this.loadTehsils(this.filters.districtCode);
  }

  onSubmit(): void {
    this.loadDashboardData();
  }

  onClear(): void {
    const currentCountType = this.filters.countType;
    this.filters = this.createDefaultFilters(currentCountType);
    this.tehsils = [];
    this.loadDashboardData();
  }

  trackByOption(_index: number, option: DashboardFilterOption): string {
    return option.value;
  }

  trackByCard(_index: number, card: DashboardCard): string {
    return card.label;
  }

  private createDefaultFilters(countType: DashboardCountType = 'NR'): DashboardFilterState {
    return {
      countType,
      year: '',
      ruralUrban: '',
      state: '',
      region: '',
      districtCode: '',
      tehsilCode: '',
      act: '',
      nicClassification: '',
      deregisteredClosed: ''
    };
  }

  private loadLookupData(): void {
    this.loadRegistries();
    this.loadDivisions();
    this.loadDistricts();
  }

  private loadRegistries(): void {
    this.dataService.getAllRegistry().subscribe({
      next: (response) => {
        this.registries = this.unwrapCollection<RegistryResponse>(response);
      },
      error: (error) => {
        console.error('Error loading registries:', error);
        this.registries = [];
      }
    });
  }

  private loadDivisions(): void {
    this.dataService.getAllDivisions().subscribe({
      next: (response) => {
        this.divisions = this.unwrapCollection<Division>(response);
      },
      error: (error) => {
        console.error('Error loading divisions:', error);
        this.divisions = [];
      }
    });
  }

  private loadDistricts(): void {
    this.dataService.getAllDistricts().subscribe({
      next: (response) => {
        this.districts = this.unwrapCollection<District>(response);
        this.resetDistrictAndTehsilIfNeeded();
        this.rebuildDashboardRows();
      },
      error: (error) => {
        console.error('Error loading districts:', error);
        this.districts = [];
      }
    });
  }

  private loadTehsils(districtCode: string): void {
    const districtId = Number(districtCode);
    const requestId = Number.isNaN(districtId) ? districtCode : districtId;

    this.dataService.getTalukasByDistrict(requestId).subscribe({
      next: (response) => {
        this.tehsils = this.unwrapCollection<Talukas>(response);
      },
      error: (error) => {
        console.error('Error loading tehsils:', error);
        this.tehsils = [];
      }
    });
  }

  private loadDashboardData(): void {
    const request = this.buildDashboardRequest();
    this.loading = true;

    this.dataService.getFilteredDashboardData(request)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (response) => {
          this.rawDashboardRows = this.unwrapCollection<CitizenDashboardRow>(response);
          this.rebuildDashboardRows();
        },
        error: (error) => {
          console.error('Error fetching dashboard data:', error);
          this.rawDashboardRows = [];
          this.allDashboardRows = [];
          this.apiResponse = [];
          this.updateCharts();
        }
      });
  }

  private rebuildDashboardRows(): void {
    this.allDashboardRows = this.rawDashboardRows.map((row) => this.toDashboardViewRow(row));
    this.syncDynamicFilterOptions();
    this.applyLocalFilters();
  }

  private syncDynamicFilterOptions(): void {
    const nicValues = Array.from(
      new Set(
        this.allDashboardRows
          .map((row) => row.nicClassificationLabel)
          .filter((value) => value !== '')
      )
    ).sort((left, right) => left.localeCompare(right));

    this.nicClassificationOptions = nicValues.map((value) => ({ value, label: value }));

    if (!this.isNicClassificationFilterAvailable) {
      this.filters.nicClassification = '';
    }
    if (!this.isRuralUrbanFilterAvailable) {
      this.filters.ruralUrban = '';
    }
    if (!this.isTehsilFilterAvailable) {
      this.filters.tehsilCode = '';
    }
    if (!this.isDeregisteredClosedFilterAvailable) {
      this.filters.deregisteredClosed = '';
    }
  }

  private buildDashboardRequest(): CitizenDashboardFilterRequest {
    const selectedDistrict = this.getSelectedDistrict();

    return {
      countType: this.filters.countType,
      act: this.filters.act,
      region: this.filters.region,
      district: selectedDistrict ? this.normalizeValue(selectedDistrict.districtName) : '',
      year: this.filters.year,
      quarter: '',
      nic: ''
    };
  }

  private applyLocalFilters(): void {
    const selectedDistrict = this.getSelectedDistrict();
    const selectedDistrictName = selectedDistrict
      ? this.normalizeValue(selectedDistrict.districtName)
      : '';
    const selectedTehsil = this.getSelectedTehsil();
    const selectedTehsilName = selectedTehsil ? this.normalizeValue(selectedTehsil.talukaName) : '';
    const selectedStateName = this.filters.state
      ? this.resolveStateName(this.filters.state)
      : '';

    this.apiResponse = this.allDashboardRows.filter((row) => {
      if (this.filters.year && !this.valuesMatch(row.year, this.filters.year)) {
        return false;
      }
      if (this.filters.state && !this.valuesMatch(row.stateName, selectedStateName)) {
        return false;
      }
      if (this.filters.region && !this.valuesMatch(row.division, this.filters.region)) {
        return false;
      }
      if (selectedDistrictName && !this.valuesMatch(row.district, selectedDistrictName)) {
        return false;
      }
      if (this.filters.act && !this.valuesMatch(row.registryName, this.filters.act)) {
        return false;
      }
      if (this.filters.ruralUrban && !this.valuesMatch(row.ruralUrbanLabel, this.filters.ruralUrban)) {
        return false;
      }
      if (selectedTehsilName && !this.valuesMatch(row.tehsilName, selectedTehsilName)) {
        return false;
      }
      if (
        this.filters.nicClassification &&
        !this.valuesMatch(row.nicClassificationLabel, this.filters.nicClassification)
      ) {
        return false;
      }
      if (
        this.filters.deregisteredClosed &&
        !this.valuesMatch(row.deregisteredClosedLabel, this.filters.deregisteredClosed)
      ) {
        return false;
      }

      return true;
    });

    this.scheduleChartRefresh();
  }

  private fetchCitizenDashboardSummary(): void {
    this.dataService.getCitizenDashboardDataRegDeRegNewReg().subscribe({
      next: (response) => {
        this.updateDashboardSummary(response ?? []);
      },
      error: (error) => {
        console.error('Error loading dashboard summary:', error);
        this.dashboardCards = [];
      }
    });
  }

  private updateDashboardSummary(summaryRows: CitizenDashboardDataRegDeRegNewReg[]): void {
    const totalRegistrations = summaryRows.reduce(
      (sum, row) => sum + (row.totalRegistrations || 0),
      0
    );
    const totalDeregistrations = summaryRows.reduce(
      (sum, row) => sum + (row.totalDeregistrations || 0),
      0
    );
    const newRegistrationsThisYear = summaryRows.reduce(
      (sum, row) => sum + (row.newRegistrationsThisYear || 0),
      0
    );
    const totalPersonsWorking = summaryRows.reduce(
      (sum, row) => sum + (row.totalPersonsWorking || 0),
      0
    );

    this.dashboardCards = [
      { label: 'Total Registrations', value: totalRegistrations, icon: 'bi bi-building-check text-primary' },
      { label: 'Total Working Persons', value: totalPersonsWorking, icon: 'bi bi-people-fill text-success' },
      { label: 'Deregistrations', value: totalDeregistrations, icon: 'bi bi-x-octagon-fill text-danger' },
      { label: 'New Registrations This Year', value: newRegistrationsThisYear, icon: 'bi bi-stars text-warning' }
    ];
  }

  private scheduleChartRefresh(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    setTimeout(() => this.updateCharts(), 0);
  }

  private updateCharts(): void {
    this.destroyAllCharts();

    if (!this.apiResponse.length) {
      return;
    }

    this.usedColors.clear();

    const groupedByDistrictAndQuarter = this.groupDataByDistrictAndQuarter(this.apiResponse);
    const districtLabels = Object.keys(groupedByDistrictAndQuarter);
    const quarterLabels = ['Q1', 'Q2', 'Q3', 'Q4'];

    this.chart1 = new Chart(
      'chart1',
      this.createBarChartConfig(
        districtLabels,
        quarterLabels.map((quarterLabel) => ({
          label: quarterLabel,
          data: districtLabels.map((district) => groupedByDistrictAndQuarter[district][quarterLabel] || 0),
          backgroundColor: this.getQuarterColor(quarterLabel)
        })),
        'District and Quarter-wise Registrations',
        'Districts',
        'Total Registrations',
        true
      )
    );

    const yearLabels = this.getDistinctValues(this.apiResponse, (row) => row.year)
      .sort((left, right) => Number(left) - Number(right));
    const registryLabels = this.getDistinctValues(this.apiResponse, (row) => row.registryName)
      .sort((left, right) => left.localeCompare(right));

    this.chart2 = new Chart(
      'chart2',
      this.createBarChartConfig(
        registryLabels,
        yearLabels.map((yearLabel, index) => ({
          label: yearLabel,
          data: registryLabels.map((registryLabel) =>
            this.apiResponse
              .filter((row) => this.valuesMatch(row.registryName, registryLabel) && this.valuesMatch(row.year, yearLabel))
              .reduce((sum, row) => sum + (row.totalRegistrations || 0), 0)
          ),
          backgroundColor: this.getPaletteColor(index)
        })),
        'Registry-wise Registrations per Year',
        'Registry',
        'Total Registrations'
      )
    );

    const districtNames = this.getDistinctValues(this.apiResponse, (row) => row.district)
      .sort((left, right) => left.localeCompare(right));

    this.chart3 = new Chart(
      'chart3',
      this.createBarChartConfig(
        districtNames,
        registryLabels.map((registryLabel, index) => ({
          label: registryLabel,
          data: districtNames.map((districtName) =>
            this.apiResponse
              .filter(
                (row) =>
                  this.valuesMatch(row.district, districtName) &&
                  this.valuesMatch(row.registryName, registryLabel)
              )
              .reduce((sum, row) => sum + (row.totalRegistrations || 0), 0)
          ),
          backgroundColor: this.getPaletteColor(index)
        })),
        'District-wise Registrations per Registry',
        'District',
        'Total Registrations'
      )
    );

    const groupedByDistrictAndRegistry = this.groupDataByDistrictAndRegistry(this.apiResponse);
    const totalWorkingDistrictLabels = Object.keys(groupedByDistrictAndRegistry);
    const totalWorkingRegistryLabels = Array.from(
      totalWorkingDistrictLabels.reduce((registryNames, district) => {
        Object.keys(groupedByDistrictAndRegistry[district]).forEach((registryName) =>
          registryNames.add(registryName)
        );
        return registryNames;
      }, new Set<string>())
    );

    this.chart5 = new Chart(
      'chart5',
      this.createBarChartConfig(
        totalWorkingDistrictLabels,
        totalWorkingRegistryLabels.map((registryLabel) => ({
          label: registryLabel,
          data: totalWorkingDistrictLabels.map(
            (districtLabel) => groupedByDistrictAndRegistry[districtLabel][registryLabel] || 0
          ),
          backgroundColor: this.getRandomColor()
        })),
        'District and Registry-wise Total Working Persons',
        'Districts',
        'Total Working Persons'
      )
    );
  }

  private createBarChartConfig(
    labels: string[],
    datasets: ChartConfiguration<'bar'>['data']['datasets'],
    title: string,
    xAxisLabel: string,
    yAxisLabel: string,
    stacked = false
  ): ChartConfiguration<'bar'> {
    return {
      type: 'bar',
      data: {
        labels,
        datasets
      },
      options: this.getChartOptions(title, xAxisLabel, yAxisLabel, stacked)
    };
  }

  private getChartOptions(
    title: string,
    xAxisLabel: string,
    yAxisLabel: string,
    stacked = false
  ): ChartOptions<'bar'> {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: title,
          font: {
            size: 16,
            weight: 'bold'
          }
        },
        legend: {
          position: 'bottom'
        }
      },
      scales: {
        x: {
          stacked,
          title: {
            display: true,
            text: xAxisLabel
          }
        },
        y: {
          stacked,
          beginAtZero: true,
          title: {
            display: true,
            text: yAxisLabel
          }
        }
      }
    };
  }

  private groupDataByDistrictAndQuarter(
    rows: DashboardViewRow[]
  ): Record<string, Record<string, number>> {
    return rows.reduce<Record<string, Record<string, number>>>((result, row) => {
      const district = row.district || 'Unknown';
      const quarter = row.quarter || 'NA';

      result[district] ??= {};
      result[district][quarter] = (result[district][quarter] || 0) + (row.totalRegistrations || 0);

      return result;
    }, {});
  }

  private groupDataByDistrictAndRegistry(
    rows: DashboardViewRow[]
  ): Record<string, Record<string, number>> {
    return rows.reduce<Record<string, Record<string, number>>>((result, row) => {
      const district = row.district || 'Unknown';
      const registry = row.registryName || 'Unknown Registry';

      result[district] ??= {};
      result[district][registry] =
        (result[district][registry] || 0) + (row.totalpersonsworking || 0);

      return result;
    }, {});
  }

  private getDistinctValues(
    rows: DashboardViewRow[],
    selector: (row: DashboardViewRow) => string
  ): string[] {
    return Array.from(
      new Set(
        rows
          .map((row) => this.normalizeValue(selector(row)))
          .filter((value) => value !== '')
      )
    );
  }

  private getQuarterColor(quarter: string): string {
    const colors: Record<string, string> = {
      Q1: '#4472C4',
      Q2: '#ED7D31',
      Q3: '#A5A5A5',
      Q4: '#FFC000'
    };

    return colors[quarter] || '#6C757D';
  }

  private getPaletteColor(index: number): string {
    const palette = ['#28A745', '#DC3545', '#007BFF', '#FFC107', '#6F42C1', '#FD7E14', '#20C997'];
    return palette[index % palette.length];
  }

  private getRandomColor(): string {
    let color = '';

    do {
      color = `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.7)`;
    } while (this.usedColors.has(color));

    this.usedColors.add(color);
    return color;
  }

  private destroyAllCharts(): void {
    [this.chart1, this.chart2, this.chart3, this.chart5].forEach((chart) => chart?.destroy());
    this.chart1 = null;
    this.chart2 = null;
    this.chart3 = null;
    this.chart5 = null;
  }

  private toDashboardViewRow(row: CitizenDashboardRow): DashboardViewRow {
    const districtName = this.normalizeValue(row.district);
    const district = this.findDistrictByName(districtName);
    const stateCode = district ? this.normalizeValue(district.censusStateCode) : '';

    return {
      ...row,
      districtCode: district ? this.normalizeValue(district.censusDistrictCode) : '',
      stateCode,
      stateName: this.resolveStateName(stateCode),
      tehsilName: this.pickFirstAvailableString(row, ['tehsilName', 'tehsil', 'talukaName', 'taluka']),
      ruralUrbanLabel: this.pickFirstAvailableString(row, ['ruralUrban', 'ruralUrbanLabel', 'locationType', 'areaType']),
      nicClassificationLabel: this.pickFirstAvailableString(row, ['nicClassification', 'nicClassificationLabel', 'nicClass', 'nic']),
      deregisteredClosedLabel: this.pickFirstAvailableString(row, ['deregisteredClosed', 'deregisteredClosedLabel', 'status', 'registrationStatus'])
    };
  }

  private findDistrictByName(districtName: string): District | undefined {
    const normalizedTarget = this.normalizeKey(districtName);

    return this.districts.find(
      (district) => this.normalizeKey(district.districtName) === normalizedTarget
    );
  }

  private getSelectedDistrict(): District | undefined {
    return this.districts.find(
      (district) => this.normalizeValue(district.censusDistrictCode) === this.filters.districtCode
    );
  }

  private getSelectedTehsil(): Talukas | undefined {
    return this.tehsils.find(
      (tehsil) => this.normalizeValue(tehsil.censusTalukaCode) === this.filters.tehsilCode
    );
  }

  private getSelectedDivisionCode(): string {
    const selectedDivision = this.divisions.find(
      (division) => this.valuesMatch(division.divisionName, this.filters.region)
    );

    return selectedDivision ? this.normalizeValue(selectedDivision.divisionCode) : '';
  }

  private resetDistrictAndTehsilIfNeeded(): void {
    const availableDistrictCodes = new Set(this.districtOptions.map((option) => option.value));

    if (!availableDistrictCodes.has(this.filters.districtCode)) {
      this.filters.districtCode = '';
      this.filters.tehsilCode = '';
      this.tehsils = [];
    }
  }

  private matchesSelectedState(district: District): boolean {
    return (
      !this.filters.state ||
      this.normalizeValue(district.censusStateCode) === this.filters.state
    );
  }

  private resolveStateName(stateCode: string): string {
    return STATE_NAME_BY_CODE[stateCode] ?? stateCode;
  }

  private hasDataForField(selector: (row: DashboardViewRow) => string): boolean {
    return this.allDashboardRows.some((row) => selector(row) !== '');
  }

  private pickFirstAvailableString(
    row: CitizenDashboardRow,
    candidateKeys: readonly string[]
  ): string {
    for (const candidateKey of candidateKeys) {
      const value = row[candidateKey];
      const normalizedValue = this.normalizeValue(value);
      if (normalizedValue) {
        return normalizedValue;
      }
    }

    return '';
  }

  private valuesMatch(left: unknown, right: unknown): boolean {
    return this.normalizeKey(left) === this.normalizeKey(right);
  }

  private normalizeValue(value: unknown): string {
    return typeof value === 'string' || typeof value === 'number'
      ? String(value).trim()
      : '';
  }

  private normalizeKey(value: unknown): string {
    return this.normalizeValue(value).toLowerCase();
  }

  private unwrapCollection<T>(response: unknown): T[] {
    if (Array.isArray(response)) {
      return response as T[];
    }

    if (response && typeof response === 'object') {
      const wrappedResponse = response as { value?: unknown };
      if (Array.isArray(wrappedResponse.value)) {
        return wrappedResponse.value as T[];
      }
    }

    return [];
  }
}
