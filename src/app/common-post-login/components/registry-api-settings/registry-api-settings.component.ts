import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin, Subscription, timer } from 'rxjs';
import { RegistryApiAuthConfig, RegistryApiAuthConfigRequest } from '../../../interface/registry-api-auth-config';
import { RegistryResponse } from '../../../model/registry-response';
import { RegistryApiAuthService } from '../../../services/RegistryApiAuthhConfi/registry-api-auth.service';
import { RegistryServiceService } from '../../../services/registry-master/registry-service.service';

@Component({
  selector: 'app-registry-api-settings',
  standalone: false,
  templateUrl: './registry-api-settings.component.html',
  styleUrl: './registry-api-settings.component.css'
})
export class RegistryApiSettingsComponent implements OnInit, OnDestroy {

  apis: RegistryApiAuthConfig[] = [];
  registries: RegistryResponse[] = [];
  form: FormGroup;
  editingId: number | null = null;
  editingPasswordSet = false;
  showForm = false;
  isSaving = false;
  busyId: number | null = null;
  message = '';
  messageType: 'success' | 'danger' | '' = '';

  private poll?: Subscription;

  constructor(
    private fb: FormBuilder,
    private apiService: RegistryApiAuthService,
    private registryService: RegistryServiceService
  ) {
    this.form = this.fb.group({
      serviceName: ['', Validators.required],
      serviceNameCode: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9_-]+$/)]],
      registryId: [null as number | null, Validators.required],
      authType: ['TOKEN', Validators.required],
      authUrl: ['', [Validators.required, Validators.pattern(/^https?:\/\/\S+$/)]],
      authUrlMethod: ['POST', Validators.required],
      dateFromField: ['FromDate', [Validators.required, Validators.pattern(/^[A-Za-z_][A-Za-z0-9_]*$/)]],
      dateToField: ['ToDate', [Validators.required, Validators.pattern(/^[A-Za-z_][A-Za-z0-9_]*$/)]],
      dateFormat: ['yyyy-MM-dd', Validators.required],
      skipSslVerify: [false],
      username: ['', Validators.required],
      password: [''],
      apiData: ['', [Validators.required, Validators.pattern(/^https?:\/\/\S+$/)]],
      apiDataMethod: ['POST', Validators.required],
      syncFromDate: ['2015-01-01']
    });
  }

  get isBasic(): boolean {
    return this.form.get('authType')?.value === 'BASIC';
  }

  /** BASIC APIs have no separate login call, so the login URL/method are not needed. */
  onAuthTypeChange(): void {
    const authUrl = this.form.get('authUrl');
    if (this.isBasic) {
      authUrl?.clearValidators();
    } else {
      authUrl?.setValidators([Validators.required, Validators.pattern(/^https?:\/\/\S+$/)]);
    }
    authUrl?.updateValueAndValidity();
  }

  /** Fills in the settings used by the MCGM API (from its documentation). */
  applyMcgmPreset(): void {
    this.form.patchValue({
      authType: 'BASIC', dateFromField: 'from_date', dateToField: 'to_date', dateFormat: 'yyyyMMdd'
    });
    this.onAuthTypeChange();
  }

  ngOnInit(): void {
    forkJoin({ apis: this.apiService.getAll(), registries: this.registryService.getAll() }).subscribe({
      next: ({ apis, registries }) => {
        this.apis = apis;
        this.registries = registries;
        this.updatePolling();
      },
      error: (error) => this.fail(error, 'Unable to load the registry API settings.')
    });
  }

  ngOnDestroy(): void {
    this.poll?.unsubscribe();
  }

  get anyRunning(): boolean {
    return this.apis.some((api) => api.running);
  }

  openCreate(): void {
    this.editingId = null;
    this.editingPasswordSet = false;
    this.form.reset({
      authType: 'TOKEN', authUrlMethod: 'POST', apiDataMethod: 'POST', syncFromDate: '2015-01-01',
      dateFromField: 'FromDate', dateToField: 'ToDate', dateFormat: 'yyyy-MM-dd', skipSslVerify: false
    });
    this.onAuthTypeChange();
    this.form.get('password')?.setValidators(Validators.required);
    this.form.get('password')?.updateValueAndValidity();
    this.form.get('serviceNameCode')?.enable();
    this.showForm = true;
    this.clearMessage();
  }

  openEdit(api: RegistryApiAuthConfig): void {
    this.editingId = api.id ?? null;
    this.editingPasswordSet = !!api.passwordSet;
    this.form.reset({
      serviceName: api.serviceName,
      serviceNameCode: api.serviceNameCode,
      registryId: api.registryId,
      authType: api.authType || 'TOKEN',
      authUrl: api.authUrl ?? '',
      authUrlMethod: api.authUrlMethod || 'POST',
      dateFromField: api.dateFromField || 'FromDate',
      dateToField: api.dateToField || 'ToDate',
      dateFormat: api.dateFormat || 'yyyy-MM-dd',
      skipSslVerify: !!api.skipSslVerify,
      username: api.username,
      password: '',
      apiData: api.apiData,
      apiDataMethod: api.apiDataMethod || 'POST',
      syncFromDate: api.syncFromDate ?? '2015-01-01'
    });
    this.onAuthTypeChange();
    this.form.get('password')?.clearValidators();
    this.form.get('password')?.updateValueAndValidity();
    this.showForm = true;
    this.clearMessage();
  }

  cancelForm(): void {
    this.showForm = false;
    this.editingId = null;
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const current = this.editingId !== null ? this.apis.find((a) => a.id === this.editingId) : undefined;
    const request: RegistryApiAuthConfigRequest = {
      ...this.form.getRawValue(),
      active: current?.active ?? false   // new APIs start switched off
    };

    this.isSaving = true;
    const wasCreate = this.editingId === null;
    const call$ = this.editingId !== null
      ? this.apiService.update(this.editingId, request)
      : this.apiService.create(request);
    call$.subscribe({
      next: (saved) => {
        this.isSaving = false;
        this.replaceOrAdd(saved);
        this.showForm = false;
        this.editingId = null;
        this.succeed(wasCreate ? 'Saved. Switch it on when you are ready.' : 'Updated.');
      },
      error: (error) => {
        this.isSaving = false;
        this.fail(error, 'Unable to save.');
      }
    });
  }

  toggleActive(api: RegistryApiAuthConfig): void {
    if (api.id == null) {
      return;
    }
    const turnOn = !api.active;
    if (turnOn && !confirm(`Switch on "${api.serviceName}"? It will be called every night.`)) {
      return;
    }
    this.busyId = api.id;
    this.apiService.setActive(api.id, turnOn).subscribe({
      next: (saved) => {
        this.busyId = null;
        this.replaceOrAdd(saved);
        this.succeed(turnOn ? `${saved.serviceName} switched on.` : `${saved.serviceName} switched off.`);
      },
      error: (error) => {
        this.busyId = null;
        this.fail(error, 'Unable to change the switch.');
      }
    });
  }

  runNow(api: RegistryApiAuthConfig): void {
    if (api.id == null || !confirm(`Run "${api.serviceName}" now? It fetches everything since the last sync.`)) {
      return;
    }
    this.busyId = api.id;
    this.apiService.runNow(api.id).subscribe({
      next: (saved) => {
        this.busyId = null;
        this.replaceOrAdd({ ...saved, running: true });
        this.succeed('Sync started. This page updates as it runs.');
        this.updatePolling();
      },
      error: (error) => {
        this.busyId = null;
        this.fail(error, 'Unable to start the sync.');
      }
    });
  }

  remove(api: RegistryApiAuthConfig): void {
    if (api.id == null || !confirm(`Delete "${api.serviceName}"? Records already fetched are kept.`)) {
      return;
    }
    this.apiService.delete(api.id).subscribe({
      next: () => {
        this.apis = this.apis.filter((a) => a.id !== api.id);
        this.succeed('Deleted.');
      },
      error: (error) => this.fail(error, 'Unable to delete.')
    });
  }

  invalid(name: string): boolean {
    const control = this.form.get(name);
    return !!control && control.touched && control.invalid;
  }

  trackById(_: number, api: RegistryApiAuthConfig): number | undefined {
    return api.id;
  }

  /** While any sync is running, refresh every 4 seconds; stop when none is. */
  private updatePolling(): void {
    if (!this.anyRunning) {
      this.poll?.unsubscribe();
      this.poll = undefined;
      return;
    }
    if (this.poll) {
      return;
    }
    this.poll = timer(4000, 4000).subscribe(() => {
      this.apiService.getAll().subscribe({
        next: (apis) => {
          this.apis = apis;
          this.updatePolling();
        }
      });
    });
  }

  private replaceOrAdd(saved: RegistryApiAuthConfig): void {
    const index = this.apis.findIndex((a) => a.id === saved.id);
    if (index >= 0) {
      this.apis = this.apis.map((a, i) => (i === index ? saved : a));
    } else {
      this.apis = [...this.apis, saved];
    }
  }

  private succeed(text: string): void {
    this.messageType = 'success';
    this.message = text;
  }

  private fail(error: unknown, fallback: string): void {
    const http = error as HttpErrorResponse;
    const body = http?.error;
    this.messageType = 'danger';
    this.message = (typeof body === 'string' ? body : body?.message) || fallback;
  }

  private clearMessage(): void {
    this.message = '';
    this.messageType = '';
  }
}
