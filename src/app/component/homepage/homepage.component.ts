import { Component, OnInit } from '@angular/core';
import { LanguageService } from '../../language.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent  implements OnInit{

  constructor(private languageService: LanguageService) { }

  ngOnInit(): void {
    // Subscribe to language changes
    this.languageService.getLanguageObservable().subscribe(language => {
      // Update homepage content based on the new language
    });
  }
}
  