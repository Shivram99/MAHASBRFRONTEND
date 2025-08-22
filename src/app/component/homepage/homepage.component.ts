import { Component, OnInit } from '@angular/core';
import { LanguageService } from '../../language.service';

@Component({
    selector: 'app-homepage',
    templateUrl: './homepage.component.html',
    styleUrl: './homepage.component.css',
    standalone: false
})
export class HomepageComponent  implements OnInit{

  constructor(private languageService: LanguageService) { }

  ngOnInit(): void {
    // Subscribe to language changes
    this.languageService.getLanguageObservable().subscribe(language => {
      // Update homepage content based on the new language
    });
  }

  images2 = [
    'assets/images/slide/img.png',
    'assets/images/slide/img2.png',
    'assets/images/slide/img3.png'
  ];
  
}
  