import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-aboutus',
    templateUrl: './aboutus.component.html',
    styleUrl: './aboutus.component.css',
    standalone: false
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
    this.translate.use(lang);
  }





}
