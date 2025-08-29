import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { SerachBrnService } from '../../services/serach-brn.service';
import { MstRegistryDetailsPage } from '../../model/mst-registry-details-page';

@Component({
    selector: 'app-search-brn',
    templateUrl: './search-brn.component.html',
    styleUrl: './search-brn.component.css',
    standalone: false
})
export class SearchBrnComponent implements OnInit{

  districts: any[]=[] ;

  searchBrnFilter!: FormGroup;

  registryDetails: MstRegistryDetailsPage[]=[];

  showNoDataAlert = false;
  

  constructor(private fb: FormBuilder,private dataService: SerachBrnService) { }

  
  ngOnInit(): void {
    this.fetchDistricts();

    this.searchBrnFilter = this.fb.group({
      district: [-1, [Validators.required, this.notMinusOneValidator()]],
      nameOfEstablishmentOrOwner: [''],
      brnNo: ['', [Validators.pattern('[A-Za-z0-9]+'),Validators.minLength(16),
        Validators.maxLength(16)]]
    }, { validators: this.atLeastOneFieldValidator ,Validators: this.notMinusOneValidator});

   
   // this.searchBrnFilter.setValidators(this.atLeastOneFieldValidator);
  }
  notMinusOneValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const forbidden = control.value === '-1';
      return forbidden ? { forbiddenValue: { value: control.value } } : null;
    };
  }

  atLeastOneFieldValidator(formGroup: AbstractControl): ValidationErrors | null {
    const nameField = formGroup.get('nameOfEstablishmentOrOwner')?.value;
    const brnNoField = formGroup.get('brnNo')?.value;

    if (nameField || brnNoField) {
      return null; // At least one value is present, so the form is valid
    } else {
      return { atLeastOneRequired: true }; // No value present, so validation fails
    }
  }
  fetchDistricts(): void {
    this.dataService.getAllDistricts()
      .subscribe(districts1 => {
        this.districts = districts1.map(district => ({
          censusDistrictCode: district.censusDistrictCode,
          districtName: district.districtName,
          censusStateCode: district.censusStateCode
        }));

      });
  }

  atLeastOneRequiredValidator(group: FormGroup): any {
    const nameOfEstablishmentOrOwner = group.get('nameOfEstablishmentOrOwner')?.value;
    const brnNo = group.get('brnNo')?.value;
    if (nameOfEstablishmentOrOwner || brnNo) {
      return null; // Valid
    }
    return { atLeastOneRequired: true }; // Invalid
  }
  onSubmit() {
    debugger;
    console.log("searchBrnFilter :"+this.searchBrnFilter.get('district')?.value );
    console.log("searchBrnFilter :"+this.searchBrnFilter.get('nameOfEstablishmentOrOwner')?.value );
    console.log("searchBrnFilter :"+this.searchBrnFilter.get('brnNo')?.value );

    if (this.searchBrnFilter.valid) {
      this.dataService.submitForm(this.searchBrnFilter.value).subscribe(
        (response: MstRegistryDetailsPage[]) => { // Expecting an array of MstRegistryDetailsPage
          this.registryDetails = response;
          this.checkForNoData();
          console.log('Form submitted successfully', this.registryDetails);
        },
        error => {
          console.error('Error submitting form', error);
          
        }
      );
    } else {
      console.log('Form is invalid');
    }
    }

    checkForNoData(): void {
    if (!this.registryDetails || this.registryDetails.length === 0) {
      this.showNoDataAlert = true;
      setTimeout(() => {
        this.showNoDataAlert = false;
      }, 30000); // Hide after 30 seconds
    }
  }

}
