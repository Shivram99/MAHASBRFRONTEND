import { Component, HostListener, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Chart, ChartConfiguration, ChartOptions, registerables } from 'chart.js';
import { finalize, Subject, takeUntil } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { SerachBrnService } from '../../services/serach-brn.service';
import { RegistryResponse } from '../../model/registry-response';
import { Division } from '../../model/division';
import { District } from '../../interface/district';
import { Talukas } from '../../interface/talukas';
import { CitizenDashboardFilterRequest } from '../../interface/citizen-dashboar-filter';
import { CitizenDashboardRow } from '../../interface/citizen-dashboard-row';
import { CitizenDashboardDataRegDeRegNewReg } from '../../interface/citizen-dashboard-data-reg-de-reg-new-reg';
import { LanguageService } from '../../core/services/language.service';

Chart.register(...registerables);

type DashboardCountType = 'NR' | 'TR' | 'DR';
type DashboardLanguage = 'en' | 'mr';

interface DashboardFilterOption {
  value: string;
  label: string;
}

interface DashboardCountOption {
  key: DashboardCountType;
  labelKey: string;
}

interface DashboardStaticOption {
  value: string;
  labelKey: string;
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

const COUNT_TYPE_OPTIONS: ReadonlyArray<DashboardCountOption> = [
  { key: 'NR', labelKey: 'dashboard.count_types.nr' },
  { key: 'TR', labelKey: 'dashboard.count_types.tr' },
  { key: 'DR', labelKey: 'dashboard.count_types.dr' }
];

const RURAL_URBAN_OPTIONS: ReadonlyArray<DashboardStaticOption> = [
  { value: 'Rural', labelKey: 'dashboard.options.rural' },
  { value: 'Urban', labelKey: 'dashboard.options.urban' }
];

const DEREGISTERED_CLOSED_OPTIONS: ReadonlyArray<DashboardStaticOption> = [
  { value: 'Deregistered', labelKey: 'dashboard.options.deregistered' },
  { value: 'Closed', labelKey: 'dashboard.options.closed' }
];

const STATE_NAME_BY_CODE: Readonly<Record<string, string>> = {
  '27': 'Maharashtra'
};

const DISTRICT_TRANSLATION_ALIASES: Readonly<Record<string, string>> = {
  ahmednager: 'ahmednagar',
  ahmadnagar: 'ahmednagar',
  gondiya: 'gondia',
  mumbai: 'mumbai',
  mumbai_district: 'mumbai',
  raigarh: 'raigad',
  raighar: 'raigad',
  raygad: 'raigad',
  mumbai_city_district: 'mumbai_city',
  mumbai_city_dist: 'mumbai_city',
  greater_mumbai: 'mumbai_city',
  mumbai_suburban_district: 'mumbai_suburban',
  mumbai_suburban_dist: 'mumbai_suburban',
  mumbai_suburban_mumbai: 'mumbai_suburban',
  mumbai_suburb: 'mumbai_suburban',
  mumbai_suburbs: 'mumbai_suburban',
  suburban_mumbai: 'mumbai_suburban'
};

const ENGLISH_FONT_FAMILY = '"Times New Roman", Times, serif';
const MARATHI_FONT_FAMILY = '"DVOT SurekhMR", "Noto Sans Devanagari", serif';
const DASHBOARD_UPPERCASE_TOKENS = new Set([
  'API',
  'BRN',
  'CSV',
  'DES',
  'DR',
  'ID',
  'MSME',
  'NIC',
  'NR',
  'Q1',
  'Q2',
  'Q3',
  'Q4',
  'TR'
]);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: false
})
export class DashboardComponent implements OnInit, OnDestroy {
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
  private dashboardSummaryRows: CitizenDashboardDataRegDeRegNewReg[] = [];
  private currentLanguage: DashboardLanguage = 'en';
  private readonly destroy$ = new Subject<void>();
  private chartRefreshTimer: number | null = null;
  private usedColors = new Set<string>();

  constructor(
    private readonly dataService: SerachBrnService,
    private readonly translate: TranslateService,
    private readonly languageService: LanguageService,
    @Inject(DOCUMENT) private readonly document: Document,
    @Inject(PLATFORM_ID) private readonly platformId: object
  ) {}

  get selectedCountLabel(): string {
    const selectedCountType = this.countTypeOptions.find((type) => type.key === this.filters.countType);
    return selectedCountType
      ? this.formatDashboardText(this.translate.instant(selectedCountType.labelKey))
      : '';
  }

  get toggleMenuLabelKey(): string {
    return this.menuVisible ? 'dashboard.toggle_close_filters' : 'dashboard.toggle_open_filters';
  }

  get stateOptions(): DashboardFilterOption[] {
    const stateCodes = Array.from(
      new Set(
        this.districts
          .map((district) => this.normalizeValue(district.censusStateCode))
          .filter((stateCode) => stateCode !== '')
      )
    ).sort((left, right) =>
      this.localizeStateName(this.resolveStateName(left)).localeCompare(
        this.localizeStateName(this.resolveStateName(right))
      )
    );

    return stateCodes.map((stateCode) => ({
      value: stateCode,
      label: this.localizeStateName(this.resolveStateName(stateCode))
    }));
  }

  get regionOptions(): DashboardFilterOption[] {
    return this.divisions
      .filter((division) => division.isActive !== false)
      .map((division) => ({
        value: this.normalizeValue(division.divisionName),
        label: this.localizeRegionName(this.normalizeValue(division.divisionName))
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
        label: this.localizeDistrictName(this.normalizeValue(district.districtName))
      }))
      .sort((left, right) => left.label.localeCompare(right.label));
  }

  get tehsilOptions(): DashboardFilterOption[] {
    return this.tehsils
      .map((tehsil) => ({
        value: this.normalizeValue(tehsil.censusTalukaCode),
        label: this.formatDashboardText(this.normalizeValue(tehsil.talukaName))
      }))
      .sort((left, right) => left.label.localeCompare(right.label));
  }

  get actOptions(): DashboardFilterOption[] {
    return this.registries
      .filter((registry) => registry.status !== false)
      .map((registry) => ({
        value: this.normalizeValue(registry.registryNameEn) || this.normalizeValue(registry.registryNameMr),
        label: this.getLocalizedRegistryName(registry)
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
    this.currentLanguage = this.normalizeLanguage(this.languageService.getCurrentLanguage());
    this.observeLanguageChanges();
    this.loadLookupData();
    this.loadDashboardData();
    this.fetchCitizenDashboardSummary();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.clearChartRefreshTimer();
    this.destroyAllCharts();
  }

  toggleMenu(): void {
    this.menuVisible = !this.menuVisible;
    this.scheduleChartRefresh(180);
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.scheduleChartRefresh(180);
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

  trackByOption(_index: number, option: { value: string }): string {
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
        this.rebuildDashboardRows();
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

    this.nicClassificationOptions = nicValues.map((value) => ({
      value,
      label: this.formatDashboardText(value)
    }));

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
        this.dashboardSummaryRows = response ?? [];
        this.updateDashboardSummary(this.dashboardSummaryRows);
      },
      error: (error) => {
        console.error('Error loading dashboard summary:', error);
        this.dashboardSummaryRows = [];
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
      {
        label: this.formatDashboardText(this.translate.instant('dashboard.cards.total_registrations')),
        value: totalRegistrations,
        icon: 'bi bi-building-check text-primary'
      },
      {
        label: this.formatDashboardText(this.translate.instant('dashboard.cards.total_working_persons')),
        value: totalPersonsWorking,
        icon: 'bi bi-people-fill text-success'
      },
      {
        label: this.formatDashboardText(this.translate.instant('dashboard.cards.deregistrations')),
        value: totalDeregistrations,
        icon: 'bi bi-x-octagon-fill text-danger'
      },
      {
        label: this.formatDashboardText(this.translate.instant('dashboard.cards.new_registrations_this_year')),
        value: newRegistrationsThisYear,
        icon: 'bi bi-stars text-warning'
      }
    ];
  }

  private scheduleChartRefresh(delay = 0): void {
    if (!isPlatformBrowser(this.platformId) || !this.apiResponse.length) {
      return;
    }

    const browserWindow = this.document.defaultView;
    if (!browserWindow) {
      return;
    }

    this.clearChartRefreshTimer();

    this.chartRefreshTimer = browserWindow.setTimeout(() => {
      this.chartRefreshTimer = null;
      this.updateCharts();
    }, delay);
  }

  private updateCharts(): void {
    this.destroyAllCharts();

    if (!this.apiResponse.length) {
      return;
    }

    this.usedColors.clear();
    Chart.defaults.font.family = this.getChartFontFamily();

    const groupedByDistrictAndQuarter = this.groupDataByDistrictAndQuarter(this.apiResponse);
    const districtKeys = Object.keys(groupedByDistrictAndQuarter);
    const districtLabels = districtKeys.map((district) => this.localizeDistrictName(district));
    const quarterLabels = ['Q1', 'Q2', 'Q3', 'Q4'];

    this.chart1 = new Chart(
      'chart1',
      this.createBarChartConfig(
        districtLabels,
        quarterLabels.map((quarterLabel) => ({
          label: this.getQuarterLabel(quarterLabel),
          data: districtKeys.map((district) => groupedByDistrictAndQuarter[district][quarterLabel] || 0),
          backgroundColor: this.getQuarterColor(quarterLabel)
        })),
        this.formatDashboardText(this.translate.instant('dashboard.charts.district_quarter_registrations_title')),
        this.formatDashboardText(this.translate.instant('dashboard.charts.districts_axis')),
        this.formatDashboardText(this.translate.instant('dashboard.charts.total_registrations_axis')),
        true
      )
    );

    const yearLabels = this.getDistinctValues(this.apiResponse, (row) => row.year)
      .sort((left, right) => Number(left) - Number(right));
    const registryKeys = this.getDistinctValues(this.apiResponse, (row) => row.registryName)
      .sort((left, right) => left.localeCompare(right));

    this.chart2 = new Chart(
      'chart2',
      this.createBarChartConfig(
        registryKeys.map((registryKey) => this.getRegistryDisplayName(registryKey)),
        yearLabels.map((yearLabel, index) => ({
          label: yearLabel,
          data: registryKeys.map((registryLabel) =>
            this.apiResponse
              .filter((row) => this.valuesMatch(row.registryName, registryLabel) && this.valuesMatch(row.year, yearLabel))
              .reduce((sum, row) => sum + (row.totalRegistrations || 0), 0)
          ),
          backgroundColor: this.getPaletteColor(index)
        })),
        this.formatDashboardText(this.translate.instant('dashboard.charts.registry_year_registrations_title')),
        this.formatDashboardText(this.translate.instant('dashboard.charts.registry_axis')),
        this.formatDashboardText(this.translate.instant('dashboard.charts.total_registrations_axis'))
      )
    );

    const districtNames = this.getDistinctValues(this.apiResponse, (row) => row.district)
      .sort((left, right) => left.localeCompare(right));

    this.chart3 = new Chart(
      'chart3',
      this.createBarChartConfig(
        districtNames.map((districtName) => this.localizeDistrictName(districtName)),
        registryKeys.map((registryLabel, index) => ({
          label: this.getRegistryDisplayName(registryLabel),
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
        this.formatDashboardText(this.translate.instant('dashboard.charts.district_registry_registrations_title')),
        this.formatDashboardText(this.translate.instant('dashboard.charts.district_axis')),
        this.formatDashboardText(this.translate.instant('dashboard.charts.total_registrations_axis'))
      )
    );

    const groupedByDistrictAndRegistry = this.groupDataByDistrictAndRegistry(this.apiResponse);
    const totalWorkingDistrictKeys = Object.keys(groupedByDistrictAndRegistry);
    const totalWorkingRegistryKeys = Array.from(
      totalWorkingDistrictKeys.reduce((registryNames, district) => {
        Object.keys(groupedByDistrictAndRegistry[district]).forEach((registryName) =>
          registryNames.add(registryName)
        );
        return registryNames;
      }, new Set<string>())
    );

    this.chart5 = new Chart(
      'chart5',
      this.createBarChartConfig(
        totalWorkingDistrictKeys.map((districtKey) => this.localizeDistrictName(districtKey)),
        totalWorkingRegistryKeys.map((registryLabel) => ({
          label: this.getRegistryDisplayName(registryLabel),
          data: totalWorkingDistrictKeys.map(
            (districtLabel) => groupedByDistrictAndRegistry[districtLabel][registryLabel] || 0
          ),
          backgroundColor: this.getRandomColor()
        })),
        this.formatDashboardText(this.translate.instant('dashboard.charts.district_registry_working_persons_title')),
        this.formatDashboardText(this.translate.instant('dashboard.charts.districts_axis')),
        this.formatDashboardText(this.translate.instant('dashboard.charts.total_working_persons_axis'))
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
      options: this.getChartOptions(labels, title, xAxisLabel, yAxisLabel, stacked)
    };
  }

  private getChartOptions(
    labels: string[],
    title: string,
    xAxisLabel: string,
    yAxisLabel: string,
    stacked = false
  ): ChartOptions<'bar'> {
    const fontFamily = this.getChartFontFamily();
    const compactViewport = this.isCompactViewport();
    const tabletViewport = this.isTabletViewport();
    const axisTickLineLength = compactViewport ? 10 : tabletViewport ? 14 : 18;
    const headingColor = '#2676C3';
    const bodyTextColor = '#555555';
    const chartGridColor = 'rgba(38, 118, 195, 0.14)';

    return {
      animation: false,
      responsive: true,
      resizeDelay: 150,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false
      },
      layout: {
        padding: {
          top: 8,
          right: compactViewport ? 4 : 12,
          bottom: compactViewport ? 4 : 8,
          left: compactViewport ? 4 : 8
        }
      },
      plugins: {
        title: {
          color: headingColor,
          display: true,
          text: title,
          font: {
            family: fontFamily,
            size: compactViewport ? 13 : 16,
            weight: 'bold'
          },
          padding: {
            bottom: compactViewport ? 12 : 16
          }
        },
        legend: {
          position: compactViewport ? 'top' : 'bottom',
          maxHeight: compactViewport ? 72 : 96,
          labels: {
            boxWidth: compactViewport ? 10 : 14,
            color: bodyTextColor,
            padding: compactViewport ? 12 : 16,
            font: {
              family: fontFamily,
              size: compactViewport ? 10 : 12
            },
            usePointStyle: true
          }
        }
      },
      scales: {
        x: {
          stacked,
          grid: {
            color: chartGridColor,
            display: !compactViewport
          },
          ticks: {
            autoSkip: compactViewport,
            autoSkipPadding: compactViewport ? 10 : 14,
            color: bodyTextColor,
            font: {
              family: fontFamily,
              size: compactViewport ? 10 : 11
            },
            maxRotation: compactViewport ? 0 : 35,
            minRotation: 0,
            padding: 8,
            callback: (_value, index) =>
              this.formatAxisTickLabel(labels[index] ?? '', axisTickLineLength)
          },
          title: {
            color: headingColor,
            display: true,
            text: xAxisLabel,
            font: {
              family: fontFamily,
              size: compactViewport ? 10 : 12,
              weight: 'bold'
            },
            padding: {
              top: compactViewport ? 10 : 14
            }
          }
        },
        y: {
          stacked,
          beginAtZero: true,
          grace: '8%',
          grid: {
            color: chartGridColor
          },
          ticks: {
            color: bodyTextColor,
            font: {
              family: fontFamily,
              size: compactViewport ? 10 : 11
            },
            padding: 8
          },
          title: {
            color: headingColor,
            display: true,
            text: yAxisLabel,
            font: {
              family: fontFamily,
              size: compactViewport ? 10 : 12,
              weight: 'bold'
            },
            padding: {
              bottom: compactViewport ? 8 : 10
            }
          }
        }
      }
    };
  }

  private groupDataByDistrictAndQuarter(
    rows: DashboardViewRow[]
  ): Record<string, Record<string, number>> {
    return rows.reduce<Record<string, Record<string, number>>>((result, row) => {
      const district = row.district || this.translate.instant('dashboard.fallback.unknown_district');
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
      const district = row.district || this.translate.instant('dashboard.fallback.unknown_district');
      const registry = row.registryName || this.translate.instant('dashboard.fallback.unknown_registry');

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

  private observeLanguageChanges(): void {
    this.languageService
      .getLanguageObservable()
      .pipe(takeUntil(this.destroy$))
      .subscribe((language) => {
        this.currentLanguage = this.normalizeLanguage(language);
        this.rebuildDashboardRows();
        this.updateDashboardSummary(this.dashboardSummaryRows);
        this.scheduleChartRefresh(100);
      });
  }

  private normalizeLanguage(language: string): DashboardLanguage {
    return language === 'mr' ? 'mr' : 'en';
  }

  private getQuarterLabel(quarter: string): string {
    return this.formatDashboardText(
      this.translate.instant(`dashboard.quarters.${quarter.toLowerCase()}`)
    );
  }

  private localizeStateName(stateName: string): string {
    return this.translateMappedValue('map.state', stateName);
  }

  private localizeDistrictName(districtName: string): string {
    const normalizedDistrictName = this.normalizeValue(districtName);
    if (!normalizedDistrictName) {
      return '';
    }

    const translationKey = `map.district.${this.getDistrictLookupKey(normalizedDistrictName)}`;
    const translatedValue = this.translate.instant(translationKey);

    return this.formatDashboardText(
      translatedValue !== translationKey ? translatedValue : normalizedDistrictName
    );
  }

  private localizeRegionName(regionName: string): string {
    return this.translateMappedValue('dashboard.regions.map', regionName);
  }

  private translateMappedValue(namespace: string, value: string): string {
    const normalizedValue = this.normalizeValue(value);
    if (!normalizedValue) {
      return '';
    }

    const translationKey = `${namespace}.${this.toTranslationKeySegment(normalizedValue)}`;
    const translatedValue = this.translate.instant(translationKey);

    return this.formatDashboardText(
      translatedValue !== translationKey ? translatedValue : normalizedValue
    );
  }

  private toTranslationKeySegment(value: string): string {
    return this.normalizeKey(value)
      .replace(/&/g, ' and ')
      .replace(/\//g, ' ')
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');
  }

  private getLocalizedRegistryName(registry: RegistryResponse): string {
    const englishName = this.normalizeValue(registry.registryNameEn);
    const marathiName = this.normalizeValue(registry.registryNameMr);

    if (this.currentLanguage === 'mr') {
      return marathiName || englishName;
    }

    return this.formatDashboardText(englishName || marathiName);
  }

  private getRegistryDisplayName(registryName: string): string {
    const matchingRegistry = this.findRegistryByAnyName(registryName);
    return this.formatDashboardText(
      matchingRegistry ? this.getLocalizedRegistryName(matchingRegistry) : registryName
    );
  }

  private findRegistryByAnyName(registryName: string): RegistryResponse | undefined {
    const normalizedRegistryName = this.normalizeKey(registryName);

    return this.registries.find((registry) =>
      [registry.registryNameEn, registry.registryNameMr].some(
        (name) => this.normalizeKey(name) === normalizedRegistryName
      )
    );
  }

  private resolveCanonicalRegistryName(registryName: string): string {
    const matchingRegistry = this.findRegistryByAnyName(registryName);
    if (!matchingRegistry) {
      return registryName;
    }

    return this.normalizeValue(matchingRegistry.registryNameEn) || this.normalizeValue(matchingRegistry.registryNameMr);
  }

  private getChartFontFamily(): string {
    const fallbackFontFamily =
      this.currentLanguage === 'mr' ? MARATHI_FONT_FAMILY : ENGLISH_FONT_FAMILY;

    if (!isPlatformBrowser(this.platformId)) {
      return fallbackFontFamily;
    }

    const cssFontFamily = this.document.defaultView
      ?.getComputedStyle(this.document.documentElement)
      .getPropertyValue('--app-font-family')
      .trim();

    return cssFontFamily || fallbackFontFamily;
  }

  private isCompactViewport(): boolean {
    return this.getViewportWidth() < 768;
  }

  private isTabletViewport(): boolean {
    const viewportWidth = this.getViewportWidth();
    return viewportWidth >= 768 && viewportWidth < 1200;
  }

  private getViewportWidth(): number {
    if (!isPlatformBrowser(this.platformId)) {
      return 1280;
    }

    return this.document.defaultView?.innerWidth ?? 1280;
  }

  private formatAxisTickLabel(label: string, maxCharactersPerLine: number): string | string[] {
    const normalizedLabel = this.formatDashboardText(this.normalizeValue(label));
    if (!normalizedLabel || normalizedLabel.length <= maxCharactersPerLine) {
      return normalizedLabel;
    }

    const words = normalizedLabel.split(/\s+/).filter(Boolean);
    if (words.length <= 1) {
      return `${normalizedLabel.slice(0, Math.max(1, maxCharactersPerLine - 3))}...`;
      return `${normalizedLabel.slice(0, Math.max(1, maxCharactersPerLine - 1))}…`;
    }

    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      const nextLine = currentLine ? `${currentLine} ${word}` : word;

      if (nextLine.length <= maxCharactersPerLine) {
        currentLine = nextLine;
        continue;
      }

      if (currentLine) {
        lines.push(currentLine);
      }

      currentLine = word;

      if (lines.length === 1) {
        break;
      }
    }

    if (currentLine) {
      lines.push(currentLine);
    }

    if (lines.length === 1) {
      return `${lines[0].slice(0, Math.max(1, maxCharactersPerLine - 3))}...`;
      return `${lines[0].slice(0, Math.max(1, maxCharactersPerLine - 1))}…`;
    }

    const firstLine = lines[0];
    const remainingLabel = normalizedLabel.slice(firstLine.length).trim();
    const secondLineValue = remainingLabel.length > maxCharactersPerLine
      ? `${remainingLabel.slice(0, Math.max(1, maxCharactersPerLine - 3))}...`
      : remainingLabel;

    return [firstLine, secondLineValue];
    const secondLine = remainingLabel.length > maxCharactersPerLine
      ? `${remainingLabel.slice(0, Math.max(1, maxCharactersPerLine - 1))}…`
      : remainingLabel;

    return [firstLine, secondLine];
  }

  private clearChartRefreshTimer(): void {
    if (this.chartRefreshTimer === null) {
      return;
    }

    const browserWindow = this.document.defaultView;
    if (browserWindow) {
      browserWindow.clearTimeout(this.chartRefreshTimer);
    }

    this.chartRefreshTimer = null;
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
    const canonicalRegistryName = this.resolveCanonicalRegistryName(this.normalizeValue(row.registryName));

    return {
      ...row,
      registryName: canonicalRegistryName,
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
    const normalizedTarget = this.getDistrictLookupKey(districtName);

    return this.districts.find(
      (district) => this.getDistrictLookupKey(district.districtName) === normalizedTarget
    );
  }

  private getDistrictLookupKey(districtName: string): string {
    const normalizedDistrictKey = this.toTranslationKeySegment(districtName);
    return DISTRICT_TRANSLATION_ALIASES[normalizedDistrictKey] ?? normalizedDistrictKey;
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
        return this.formatDashboardText(normalizedValue);
      }
    }

    return '';
  }

  private formatDashboardText(value: string): string {
    const normalizedValue = this.normalizeValue(value);
    if (!normalizedValue || this.currentLanguage !== 'en') {
      return normalizedValue;
    }

    return normalizedValue.replace(/[A-Za-z0-9]+(?:['&][A-Za-z0-9]+)*/g, (token) => {
      const uppercaseToken = token.toUpperCase();
      if (DASHBOARD_UPPERCASE_TOKENS.has(uppercaseToken)) {
        return uppercaseToken;
      }

      const lowercaseToken = token.toLowerCase();
      return `${lowercaseToken.charAt(0).toUpperCase()}${lowercaseToken.slice(1)}`;
    });
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
