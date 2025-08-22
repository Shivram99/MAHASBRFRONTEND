import { Component, OnInit } from '@angular/core';
import { MstMenu } from '../../model/mst-menu';
import { MenuService } from '../../services/menu.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrl: './menu.component.css',
    standalone: false
})
export class MenuComponent implements OnInit {


  constructor(private menuService: MenuService, private formBuilder: FormBuilder) {}

  
   menus: MstMenu[] = [];
   selectedMenu: MstMenu | null = null;
   newMenu: MstMenu = {
     menuNameEnglish: '',
     menuNameMarathi: '',
     isActive: '1',
     menuId:0
   };
 

  ngOnInit(): void {
    this.loadMenus();
  }

  loadMenus(): void {
    this.menuService.getAllMenus().subscribe(menus => {
      this.menus = menus;
    });
  }

  selectMenu(menu: MstMenu): void {
    this.selectedMenu = menu;
  }

  createMenu(): void {
    debugger
    this.menuService.createMenu(this.newMenu).subscribe(menu => {
      this.menus.push(menu);
      this.newMenu = {
        menuNameEnglish: '',
        menuNameMarathi: '',
        isActive: '',
        menuId:0
      };
    });
  }

  updateMenu(): void {
    if (this.selectedMenu) {
      this.menuService.updateMenu(this.selectedMenu.menuId ?? 0, this.selectedMenu).subscribe(menu => {
        // Optionally handle the updated menu
      });
    }
  }

  deleteMenu(): void {
    if (this.selectedMenu) {

      this.menuService.deleteMenu(this.selectedMenu.menuId ?? 0).subscribe(() => {
        // Delete operation completed
        this.menus = this.menus.filter(menu => menu !== this.selectedMenu);
        this.selectedMenu = null;
      });

    }
  }
}
