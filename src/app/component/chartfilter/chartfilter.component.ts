import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-chartfilter',
  templateUrl: './chartfilter.component.html',
  styleUrl: './chartfilter.component.css'
})
export class ChartfilterComponent {

  @Output() childEvent = new EventEmitter<string>();

  countType: string = 'NR'; // Default count type
  countOptions: string[] = ['NR :New Registration (NR)', 'TR:Total Registration (TR)', 'DR: Deregistration(DR)']; // Radio button options
  sendDataToParent(): void {
    //console.log(this.countType)
    this.childEvent.emit(this.countType);
   // emit(this.countType);
  }



  registration: any = {
    year: "Select Year",
    region: 'Select Region',
    district: 'Select District',
    quarter: 'Select Quarter',
    industry: 'Select Industry',
    registrationType: ''
  };

  currentYear: number = new Date().getFullYear();
  startYear: number = 2015;
  years: number[] = Array.from(
    { length: this.currentYear - this.startYear + 1 },
    (_, i) => this.currentYear - i
  ).filter(year => year >= this.startYear);

  regions: string[] = [
    'Mumbai Metropolitan Region (MMR)',
    'Pune Metropolitan Region (PMR)',
    'Nashik Metropolitan Region (NMR)',
    'Aurangabad Metropolitan Region (AMR)',
    'Nagpur Metropolitan Region (Nagpur)',
    'Amravati Metropolitan Region (AMR)'
];

acts: string[] = [
  'Industry Act',
  'Companies Act',
  'Shop and Commercial Establishments Act',
  'Co operative Societies Act-1960',
  'The Bombay Khadi & Village Industries Act, 1960',
  'Factory Act',
  'Society Registration act, 1860 / Bombay Public Trust Act. 1950'
];

  quarters: string[] = [
    '1st Quarters',
    '2nd Quarters',
    '3rd Quarters',
    '4th Quarters'
  ];

  industry: string[] = [
    "Information Technology (IT)",
    "Automobiles",
    "Pharmaceuticals",
    "Textiles",
    "Telecommunications",
    "Banking and Finance",
    "Healthcare",
    "Energy",
    "Retail",
    "Real Estate",
    "Hospitality and Tourism",
    "Agriculture"
  ];
  

  registrationTypes: string[] = [
    'New Registration',
    'Total Registration',
    'Deregistration'
  ];


   regionDistrictMap: { [key: string]: string[] } = {
    'Mumbai Metropolitan Region (MMR)': ['Mumbai City', 'Mumbai Suburban', 'Thane', 'Palghar', 'Raigad', 'Ratnagiri', 'Sindhudurg', 'Satara', 'Sangli', 'Kolhapur'],
    'Pune Metropolitan Region (PMR)': ['Pune', 'Solapur', 'Ahmednagar', 'Beed'],
    'Nashik Metropolitan Region (NMR)': ['Nashik', 'Dhule', 'Nandurbar', 'Jalgaon'],
    'Aurangabad Metropolitan Region (AMR)': ['Aurangabad', 'Jalna', 'Parbhani', 'Hingoli', 'Nanded', 'Latur', 'Osmanabad'],
    'Nagpur Metropolitan Region (Nagpur)': ['Nagpur', 'Chandrapur', 'Bhandara', 'Gondia', 'Wardha', 'Washim', 'Yavatmal', 'Gadchiroli'],
    'Amravati Metropolitan Region (AMR)': ['Amravati', 'Akola', 'Buldhana']
  };
  
  // Array to hold the region names
 regions1: string[] = Object.keys(this.regionDistrictMap);
 districts:string[]=[];
  // Function to handle region change
   onRegionChange(region: string) {
    // Reset the selected district
    let selectedDistrict = '';
    
    // Populate the districts array based on the selected region
    this.districts = this.regionDistrictMap[region];
    
    // Log the selected region and its districts
    console.log(`Selected Region: ${region}`);
    console.log(`Districts in ${region}: ${this.districts.join(', ')}`);
  }
  
  onFieldChange() {
    // Handle the change event logic here
    console.log('Field changed:', this.registration);
  }

  onSubmit() {
    // Handle form submission logic here
    console.log('Form submitted:', this.registration);
  }
}
