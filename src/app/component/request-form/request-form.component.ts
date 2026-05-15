import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs';
import { RequestFormDTO } from '../../interface/request-form-dto';
import { SerachBrnService } from '../../services/serach-brn.service';
import { ErrorHandlerService } from '../../services/errorHandler/error-handler.service';
import {
  ValidationMessageMap,
  ValidationMessageService
} from '../../shared/services/validation-message.service';
import { toTranslationKeySegment } from '../../shared/utils/translation-key.util';

interface DistrictOption {
  value: string;
  labelKey: string;
}

type RequestFormControlName = 'name' | 'district' | 'email' | 'mobile' | 'message';

@Component({
  selector: 'app-request-form',
  standalone: false,
  templateUrl: './request-form.component.html',
  styleUrl: './request-form.component.css'
})
export class RequestFormComponent implements OnInit {
  requestForm!: FormGroup;
  submitting = false;
  showPreview = false;
  requestId: string | null = null;
  districts: DistrictOption[] = [];
  formAlertMessage = '';
  formAlertType: 'danger' | 'success' | null = null;

  readonly validationMessages: Record<RequestFormControlName, ValidationMessageMap> = {
    name: {
      required: 'ReqForm.name_req',
      maxlength: 'ReqForm.name_max'
    },
    district: {
      required: 'ReqForm.district_req'
    },
    email: {
      required: 'ReqForm.email_req',
      email: 'ReqForm.email_valid',
      maxlength: 'ReqForm.email_max'
    },
    mobile: {
      required: 'ReqForm.mobile_req',
      pattern: 'ReqForm.mobile_valid'
    },
    message: {
      required: 'ReqForm.message_req',
      maxlength: 'ReqForm.message_max'
    }
  };

  constructor(
    private readonly fb: FormBuilder,
    private readonly dataService: SerachBrnService,
    private readonly errorHandler: ErrorHandlerService,
    private readonly validationMessageService: ValidationMessageService,
    private readonly translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.requestForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      district: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(320)]],
      mobile: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      message: ['', [Validators.required, Validators.maxLength(5000)]]
    });

    this.fetchDistricts();
  }

  get f() {
    return this.requestForm.controls;
  }

  getValidationMessage(controlName: RequestFormControlName): string {
    return this.validationMessageService.getMessage(
      this.requestForm.get(controlName),
      this.validationMessages[controlName]
    );
  }

  onSubmit(): void {
    this.formAlertMessage = '';

    if (this.requestForm.invalid) {
      this.requestForm.markAllAsTouched();
      this.formAlertType = 'danger';
      this.formAlertMessage = this.translate.instant('VALIDATION.REVIEW_FORM_ERRORS');
      return;
    }

    this.formAlertType = null;
    this.showPreview = true;
  }

  editDetails(): void {
    this.showPreview = false;
  }

  confirmSubmit(): void {
    if (this.requestForm.invalid) {
      this.requestForm.markAllAsTouched();
      this.formAlertType = 'danger';
      this.formAlertMessage = this.translate.instant('VALIDATION.REVIEW_FORM_ERRORS');
      return;
    }

    this.submitting = true;
    this.formAlertMessage = '';

    const payload: RequestFormDTO = this.requestForm.getRawValue();

    this.dataService.submitRequest(payload)
      .pipe(finalize(() => {
        this.submitting = false;
      }))
      .subscribe({
        next: (response: { requestId?: string }) => {
          this.formAlertType = null;
          this.showPreview = false;
          this.requestId = response?.requestId ?? null;

          this.requestForm.reset({
            name: '',
            district: '',
            email: '',
            mobile: '',
            message: ''
          });

          window.setTimeout(() => {
            this.requestId = null;
          }, 600000);
        },
        error: (error) => {
          this.formAlertType = 'danger';
          this.formAlertMessage = this.errorHandler.getErrorMessage(error, 'ReqForm.error_msg');
        }
      });
  }

  getPreviewDistrictLabel(): string {
    const selectedDistrict = this.districts.find(
      (district) => district.value === this.requestForm.value.district
    );

    return selectedDistrict?.labelKey ?? this.requestForm.value.district;
  }

  private fetchDistricts(): void {
    this.dataService.getAllDistricts().subscribe({
      next: (districts) => {
        if (!Array.isArray(districts)) {
          this.districts = [];
          return;
        }

        this.districts = districts.map((district) => ({
          value: district.districtName,
          labelKey: `map.district.${toTranslationKeySegment(district.districtName)}`
        }));
      },
      error: () => {
        this.districts = [];
      }
    });
  }
}
