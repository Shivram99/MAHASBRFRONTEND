
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SerachBrnService } from '../../services/serach-brn.service';
import { RequestFormDTO } from '../../interface/request-form-dto';

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
  finalSubmitted = false;
  requestId: string | null = null;

  districts: any[]=[] ;

  constructor(private fb: FormBuilder,private dataService: SerachBrnService) {
    this.fetchDistricts();
  }

  ngOnInit(): void {
    this.requestForm = this.fb.group({
      name: [
        '', 
        [Validators.required, Validators.maxLength(100)]
      ],

      district: [
        '-1', 
        [Validators.required]
      ],

      email: [
        '', 
        [
          Validators.required,
          Validators.email,
          Validators.maxLength(320)   
        ]
      ],

      mobile: [
        '', 
        [
          Validators.required,
          Validators.pattern(/^[0-9]{10}$/)  
        ]
      ],

      message: [
        '', 
        [
          Validators.required,
          Validators.maxLength(5000)
        ]
      ]
    });
  }

   

  get f() {
    return this.requestForm.controls;
  }
  fetchDistricts(): void {
  this.dataService.getAllDistricts().subscribe({
    next: (districts1) => {
      if (districts1 && Array.isArray(districts1)) {
        // Safely map the response if it’s a valid array
        this.districts = districts1.map(district => ({
          censusDistrictCode: district.censusDistrictCode,
          districtName: district.districtName,
          censusStateCode: district.censusStateCode
        }));
      } else {
        // If API gives null, undefined, or invalid data
        console.warn('No districts data received from API.');
        this.districts = [];
      }
    },
    error: (err) => {
      console.error('Error fetching districts:', err);
      this.districts = []; // Fallback to empty array
    }
  });
}
  onSubmit() {
    if (this.requestForm.invalid) {
      this.requestForm.markAllAsTouched();
      return;
    }

    this.showPreview = true;  // Show preview instead of submitting
  }

  editDetails() {
    this.showPreview = false; // Back to form
  }

  confirmSubmit() {

  if (this.requestForm.invalid) {
    this.requestForm.markAllAsTouched();
    return;
  }

  this.submitting = true;
  const payload: RequestFormDTO = this.requestForm.value;

  // Call API
  this.dataService.submitRequest(payload).subscribe({
    next: (res: any) => {

      this.submitting = false;
      this.showPreview = false;

      // Backend assigned ID (recommended)
      this.requestId = res.requestId;

      // Auto-hide success message after 10 minutes
      setTimeout(() => {
        this.requestId = null;
      }, 600000); // 10 minutes

      // Reset form
      this.requestForm.reset();
    },

    error: () => {
      this.submitting = false;
      alert("Something went wrong. Try again later.");
    }
  });
}

}

