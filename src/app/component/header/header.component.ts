import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../environments/environment.development';
import { LanguageService } from '../../language.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent  implements OnInit{

  ngOnInit(): void {
    this.languageService.getLanguageObservable().subscribe(language => {
     /* this.languageService.setCurrentLanguage(language);
      // alert(language);
       this.translate.use(language);*/
    });
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
