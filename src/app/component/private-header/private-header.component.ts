import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../language.service';


@Component({
  selector: 'app-private-header',
  templateUrl: './private-header.component.html',
  styleUrl: './private-header.component.css'
})
export class PrivateHeaderComponent implements OnInit{
  isChecked: boolean = true;


  ngOnInit(): void {

    const currentLang = this.translate.currentLang;
    this.isChecked = currentLang === 'mr'; 

    this.languageService.getLanguageObservable().subscribe(language => {
     /* this.languageService.setCurrentLanguage(language);
      // alert(language);
       this.translate.use(language);*/
    });
  }



  toggleLang(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.isChecked = checked;
    const selectedLang = checked ? 'mr' : 'en'; // Change 'en' and 'mr' to your language codes
    this.translate.use(selectedLang);
  }


  constructor(
    public translate: TranslateService,
    private languageService: LanguageService
  ) 
  {
 
    translate.addLangs(['en','mr']);
 
    translate.setDefaultLang('en');
 
  }


  switchLang(lang: string) {

    this.languageService.setCurrentLanguage(lang);

   // alert(environment.apiUrl);

  //  alert(lang);
    this.translate.use(lang);
  }

}
