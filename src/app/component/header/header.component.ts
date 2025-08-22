import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../environments/environment.development';
import { LanguageService } from '../../language.service';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrl: './header.component.css',
    standalone: false
})
export class HeaderComponent  implements OnInit{
  isChecked: boolean = true;
  isLoggedIn: boolean = false;

  ngOnInit(): void {

    const currentLang = this.translate.currentLang;
    this.isChecked = currentLang === 'mr'; 

    this.languageService.getLanguageObservable().subscribe(language => {
     /* this.languageService.setCurrentLanguage(language);
      // alert(language);
       this.translate.use(language);*/
    });

    this.authService.getIsLoggedIn().subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
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
    private languageService: LanguageService,
    private authService: AuthService
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


  

  mh_logo : string = 'assets/images/DES_Logo.png';
  

}
