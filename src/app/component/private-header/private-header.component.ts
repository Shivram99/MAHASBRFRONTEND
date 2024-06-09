import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../language.service';
import { MenuService } from '../../services/menu.service';
import { MstMenu } from '../../model/mst-menu';
import { AuthService } from '../../services/auth.service';
import { MstSubMenu } from '../../model/mst-sub-menu';
import { CommonService } from '../../services/common.service';


@Component({
  selector: 'app-private-header',
  templateUrl: './private-header.component.html',
  styleUrl: './private-header.component.css'
})
export class PrivateHeaderComponent implements OnInit{
  isChecked: boolean = true;

  subMenus: MstSubMenu[] = []; // Initialize with an empty array
 // menus: MstMenu[] = [];
 userId:number=0;

  menus: any[] = [];
  roles: any[] = [];
  isLoggedIn:boolean=false;
  
  constructor(
    public translate: TranslateService,
    private languageService: LanguageService,
    private menuService: MenuService,
   private authService:AuthService,
   private commonService:CommonService
  ) 
  {
 
    translate.addLangs(['en','mr']);
 
    translate.setDefaultLang('en');
 
  }
  
  ngOnInit(): void {
    this.loadMenus();
    this.loadSubMenus();
debugger
    const currentLang = this.translate.currentLang;
    this.isChecked = currentLang === 'mr'; 

    this.authService.getIsLoggedIn().subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });

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


  switchLang(lang: string) {

    this.languageService.setCurrentLanguage(lang);

   // alert(environment.apiUrl);

  //  alert(lang);
    this.translate.use(lang);
  }

  loadMenus(): void {

    const userIdString = localStorage.getItem("id");
    if (userIdString !== null) {
      this.userId = parseInt(userIdString, 0);
    } else {
      // Handle the case when localStorage.getItem("id") returns null
    }

    this.commonService.getMenusByUserId(this.userId).subscribe((menus: MstMenu[]) => {
      this.menus = menus;
    });
  }

  loadSubMenus(): void {
    this.commonService.getAllSubMenus().subscribe((subMenus: MstSubMenu[]) => {
      this.subMenus = subMenus;
    });
  }



}
