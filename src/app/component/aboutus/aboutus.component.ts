import { Component } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-aboutus',
  templateUrl: './aboutus.component.html',
  styleUrl: './aboutus.component.css'
})
export class AboutusComponent {



  constructor(

    public translate: TranslateService
 
  ) 
  {
 
    translate.addLangs(['en','mr']);
 
    translate.setDefaultLang('en');
 
  }


  switchLang(lang: string) {

    alert(environment.apiUrl);

    alert(lang);
    this.translate.use(lang);
  }





}
