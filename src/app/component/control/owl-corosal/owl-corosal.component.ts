import { Component } from '@angular/core';


@Component({
    selector: 'app-owl-corosal',
    templateUrl: './owl-corosal.component.html',
    styleUrl: './owl-corosal.component.css',
    standalone: false
})
export class OwlCorosalComponent {


  footerLogo = [
    { src: 'assets/images/footerlogo/gov.jpg', url: 'https://www.maharashtra.gov.in/' },
    { src: 'assets/images/footerlogo/digital_india.jpg', url: 'https://www.digitalindia.gov.in/' },
    { src: 'assets/images/footerlogo/india_gov.jpg', url: 'https://www.india.gov.in/' },
    { src: 'assets/images/footerlogo/mygov.jpg', url: 'https://www.mygov.in/' },
    { src: 'assets/images/footerlogo/nic.jpg', url: 'https://www.nic.in/' }
  ];


 
}
