import { AfterViewInit, Component, OnInit } from '@angular/core';
import { RegistryResponse } from '../../../model/registry-response';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegistryServiceService } from '../../../services/registry-master/registry-service.service';
import { TransliterationService } from '../../../shared/services/transliteration.service';

@Component({
  selector: 'app-registry-master',
  standalone: false,
  templateUrl: './registry-master.component.html',
  styleUrl: './registry-master.component.css'
})
export class RegistryMasterComponent implements OnInit{
  registries: RegistryResponse[] = [];
  form!: FormGroup;
  isEdit = false;
  editingId?: number;
  loading = false;

  

  constructor(private registryService: RegistryServiceService, private fb: FormBuilder, private translitService: TransliterationService) {}

  ngOnInit(): void {
    this.loadRegistries();

    
    this.form = this.fb.group({
      registryNameEn: ['', Validators.required],
      registryNameMr: ['', Validators.required],
      status: [true]
    });
  }

  loadRegistries(): void {
    this.loading = true;
    this.registryService.getAll().subscribe({
      next: (data) => {
        this.registries = data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  editRegistry(registry: RegistryResponse): void {
    this.isEdit = true;
    this.editingId = registry.id;
    this.form.patchValue(registry);
  }

  cancelEdit(): void {
    this.isEdit = false;
    this.editingId = undefined;
    this.form.reset({ status: true });
  }

  submit(): void {
    if (this.form.invalid) return;

    const request: RegistryResponse = this.form.value;

    if (this.isEdit && this.editingId) {
      this.registryService.update(this.editingId, request).subscribe(() => {
        this.loadRegistries();
        this.cancelEdit();
      });
    } else {
      this.registryService.create(request).subscribe(() => {
        this.loadRegistries();
        this.form.reset({ status: true });
      });
    }
  }

  deleteRegistry(id: number): void {
    if (confirm('Are you sure you want to delete this registry?')) {
      this.registryService.delete(id).subscribe(() => this.loadRegistries());
    }
  }

  
}