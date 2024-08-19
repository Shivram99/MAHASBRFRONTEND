import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { SerachBrnService } from '../../services/serach-brn.service';

@Component({
  selector: 'app-search-brn',
  templateUrl: './search-brn.component.html',
  styleUrl: './search-brn.component.css'
})
export class SearchBrnComponent implements OnInit{

  districts: any[]=[] ;

  searchBrnFilter!: FormGroup;

  

  constructor(private fb: FormBuilder,private dataService: SerachBrnService) { }

  
  ngOnInit(): void {
    this.fetchDistricts();

    this.searchBrnFilter = this.fb.group({
      district: [-1, [Validators.required, this.notMinusOneValidator()]],
      nameOfEstablishmentOrOwner: [''],
      brnNo: ['', [Validators.pattern('[A-Za-z0-9]+'),Validators.minLength(16),
        Validators.maxLength(16)]]
    }, { validators: this.atLeastOneFieldValidator });

   
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

  onSubmit() {
    console.log("searchBrnFilter :"+this.searchBrnFilter.get('district')?.value );
    console.log("searchBrnFilter :"+this.searchBrnFilter.get('nameOfEstablishmentOrOwner')?.value );
    }
  atLeastOneRequiredValidator(group: FormGroup): any {
    const nameOfEstablishmentOrOwner = group.get('nameOfEstablishmentOrOwner')?.value;
    const brnNo = group.get('brnNo')?.value;
    if (nameOfEstablishmentOrOwner || brnNo) {
      return null; // Valid
    }
    return { atLeastOneRequired: true }; // Invalid
  }


}
