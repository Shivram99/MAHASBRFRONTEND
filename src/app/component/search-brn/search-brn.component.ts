import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { District } from '../../interface/district';
import { Page } from '../../interface/page';
import { SearchBrnRequest } from '../../interface/search-brn-request';
import { Talukas } from '../../interface/talukas';
import { MstRegistryDetailsPage } from '../../model/mst-registry-details-page';
import { SerachBrnService } from '../../services/serach-brn.service';

@Component({
  selector: 'app-search-brn',
  templateUrl: './search-brn.component.html',
  styleUrl: './search-brn.component.css',
  standalone: false
})
export class SearchBrnComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  districts: District[] = [];
  talukas: Talukas[] = [];
  registryDetails: MstRegistryDetailsPage[] = [];
  searchBrnFilter!: FormGroup;
  districtSearchTerm = '';
  talukaSearchTerm = '';
  showNoDataAlert = false;
  searchSubmitted = false;
  isTalukaLoading = false;
  currentPage = 1;
  readonly pageSize = 10;
  readonly sortBy = 'siNo';
  totalElements = 0;

  constructor(
    private readonly fb: FormBuilder,
    private readonly dataService: SerachBrnService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.fetchDistricts();
    this.registerDistrictChangeHandler();
    this.registerBrnSanitizer();
  }

  get districtControl(): AbstractControl | null {
    return this.searchBrnFilter.get('districtId');
  }

  get talukaControl(): AbstractControl | null {
    return this.searchBrnFilter.get('talukaId');
  }

  get establishmentNameControl(): AbstractControl | null {
    return this.searchBrnFilter.get('establishmentName');
  }

  get brnControl(): AbstractControl | null {
    return this.searchBrnFilter.get('brn');
  }

  get filteredDistricts(): District[] {
    return this.filterOptions(this.districts, this.districtSearchTerm, (district) => district.districtName);
  }

  get filteredTalukas(): Talukas[] {
    return this.filterOptions(this.talukas, this.talukaSearchTerm, (taluka) => taluka.talukaName);
  }

  get isTalukaControlDisabled(): boolean {
    return this.talukaControl?.disabled ?? true;
  }

  get showDistrictRequiredError(): boolean {
    return this.isControlInvalid('districtId', 'required');
  }

  get showBrnPatternError(): boolean {
    return this.isControlInvalid('brn', 'pattern');
  }

  get showBrnLengthError(): boolean {
    const control = this.brnControl;

    return !!control
      && (control.touched || this.searchSubmitted)
      && (control.hasError('minlength') || control.hasError('maxlength'));
  }

  get showEstablishmentOrBrnError(): boolean {
    const formWasInteractedWith = this.searchSubmitted
      || !!this.establishmentNameControl?.touched
      || !!this.brnControl?.touched;

    return formWasInteractedWith && this.searchBrnFilter.hasError('establishmentOrBrnRequired');
  }

  fetchDistricts(): void {
    this.dataService.getAllDistricts()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (districts) => {
          this.districts = Array.isArray(districts) ? districts : [];
        },
        error: () => {
          this.districts = [];
        }
      });
  }

  onSubmit(): void {
    this.searchSubmitted = true;
    this.searchBrnFilter.markAllAsTouched();

    if (this.searchBrnFilter.invalid) {
      return;
    }

    this.showNoDataAlert = false;
    this.currentPage = 1;
    this.loadSearchResults(this.currentPage);
  }

  onPageChanged(page: number): void {
    if (page === this.currentPage) {
      return;
    }

    this.currentPage = page;
    this.loadSearchResults(this.currentPage);
  }

  checkForNoData(): void {
    if (this.totalElements === 0) {
      this.showNoDataAlert = true;

      setTimeout(() => {
        this.showNoDataAlert = false;
      }, 30000);
    }
  }

  private initializeForm(): void {
    this.searchBrnFilter = this.fb.group({
      districtId: [null, Validators.required],
      talukaId: [{ value: null, disabled: true }],
      establishmentName: [''],
      brn: ['', [Validators.pattern(/^[0-9]*$/), Validators.minLength(16), Validators.maxLength(16)]]
    }, { validators: this.establishmentOrBrnValidator() });
  }

  private registerBrnSanitizer(): void {
    this.brnControl?.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        const sanitizedBrn = this.sanitizeBrn(value);

        if (sanitizedBrn !== value) {
          this.brnControl?.setValue(sanitizedBrn, { emitEvent: false });
          this.brnControl?.updateValueAndValidity({ emitEvent: false });
          this.searchBrnFilter.updateValueAndValidity({ emitEvent: false });
        }
      });
  }

  private registerDistrictChangeHandler(): void {
    this.districtControl?.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((districtId) => {
        this.resetTalukaSelection();

        if (!districtId) {
          return;
        }

        this.loadTalukas(Number(districtId));
      });
  }

  private loadTalukas(districtId: number): void {
    this.isTalukaLoading = true;

    this.dataService.getTalukasByDistrict(districtId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (talukas) => {
          this.talukas = Array.isArray(talukas) ? talukas : [];
          this.talukaControl?.enable({ emitEvent: false });
          this.isTalukaLoading = false;
        },
        error: () => {
          this.talukas = [];
          this.isTalukaLoading = false;
        }
      });
  }

  private resetTalukaSelection(): void {
    this.talukas = [];
    this.talukaSearchTerm = '';
    this.talukaControl?.reset(null, { emitEvent: false });
    this.talukaControl?.disable({ emitEvent: false });
  }

  private establishmentOrBrnValidator(): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const establishmentName = this.normalizeText(formGroup.get('establishmentName')?.value);
      const brn = this.normalizeText(formGroup.get('brn')?.value);

      return establishmentName || brn ? null : { establishmentOrBrnRequired: true };
    };
  }

  private buildSearchPayload(): SearchBrnRequest {
    const rawValue = this.searchBrnFilter.getRawValue();

    return {
      districtId: Number(rawValue.districtId),
      talukaId: rawValue.talukaId ? Number(rawValue.talukaId) : null,
      establishmentName: this.normalizeText(rawValue.establishmentName) || null,
      brn: this.sanitizeBrn(rawValue.brn) || null
    };
  }

  private normalizeText(value: unknown): string {
    return typeof value === 'string' ? value.trim() : '';
  }

  private sanitizeBrn(value: unknown): string {
    return this.normalizeText(value).replace(/\D/g, '').slice(0, 16);
  }

  private filterOptions<T>(options: T[], searchTerm: string, labelSelector: (option: T) => string | null | undefined): T[] {
    const normalizedSearchTerm = this.normalizeText(searchTerm).toLowerCase();

    if (!normalizedSearchTerm) {
      return options;
    }

    return options.filter((option) => (labelSelector(option) ?? '').toLowerCase().includes(normalizedSearchTerm));
  }

  private loadSearchResults(page: number): void {
    this.dataService.submitForm(this.buildSearchPayload(), page - 1, this.pageSize, this.sortBy)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: Page<MstRegistryDetailsPage>) => {
          this.registryDetails = response.content ?? [];
          this.totalElements = response.totalElements ?? 0;
          this.currentPage = (response.number ?? 0) + 1;
          this.showNoDataAlert = false;
          this.checkForNoData();
        },
        error: () => {
          this.registryDetails = [];
          this.totalElements = 0;
          this.showNoDataAlert = false;
          this.checkForNoData();
        }
      });
  }

  private isControlInvalid(controlName: string, errorName: string): boolean {
    const control = this.searchBrnFilter.get(controlName);

    return !!control && (control.touched || this.searchSubmitted) && control.hasError(errorName);
  }
}
