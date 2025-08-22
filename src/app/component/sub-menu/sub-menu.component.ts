import { Component, OnInit } from '@angular/core';
import { MstSubMenu } from '../../model/mst-sub-menu';
import { MstSubMenuService } from '../../services/sub-menu.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MstMenu } from '../../model/mst-menu';
import { MenuService } from '../../services/menu.service';

@Component({
    selector: 'app-sub-menu',
    templateUrl: './sub-menu.component.html',
    styleUrl: './sub-menu.component.css',
    standalone: false
})
export class SubMenuComponent implements OnInit {
  subMenus: MstSubMenu[] = []; // Initialize with an empty array
  subMenuForm: FormGroup;

  selectedSubMenu: MstSubMenu | null = null;

  menus: MstMenu[] = [];

  constructor(private subMenuService: MstSubMenuService, private formBuilder: FormBuilder,private menuService: MenuService,) {
    this.subMenuForm = this.formBuilder.group({
      subMenuNameEnglish: ['', Validators.required],
      controllerName: ['', Validators.required],
      linkName: ['', Validators.required],
      subMenuNameMarathi: ['', Validators.required],
      isActive: ['', Validators.required],
      menuId: ['', Validators.required],
      // Add other form controls as needed
    });
  }

  ngOnInit(): void {
    this.loadSubMenus();
    this.loadMenus();
  }

  loadSubMenus() {
    this.subMenuService.getAllSubMenus().subscribe((subMenus: MstSubMenu[]) => {
      this.subMenus = subMenus;
    });
  }

  
  loadMenus(): void {
    this.menuService.getAllMenus().subscribe(menus => {
      this.menus = menus;
    });
  }

  createSubMenu() {
    if (this.subMenuForm.valid) {
      const newSubMenu: MstSubMenu = this.subMenuForm.value;
      this.subMenuService.createSubMenu(newSubMenu).subscribe(() => {
        this.loadSubMenus();
        this.subMenuForm.reset();
      });
    } else {
      // Handle form validation errors
    }
  }

  deleteSubMenu(subMenuId: number) {
    this.subMenuService.deleteSubMenu(subMenuId).subscribe(() => {
      this.loadSubMenus();
    });
  }

  updateSubMenu(subMenuId: number, updatedSubMenu: MstSubMenu) {
    this.subMenuService.updateSubMenu(subMenuId, updatedSubMenu).subscribe(() => {
      this.loadSubMenus();
    });
  }

  getSubMenusByUserRole(userRoleId: number) {
    this.subMenuService.getSubMenusByUserRole(userRoleId).subscribe((subMenus: MstSubMenu[]) => {
      this.subMenus = subMenus;
    });
  }

  getSubMenuById(subMenuId: number) {
    this.subMenuService.getSubMenuById(subMenuId).subscribe((subMenus: MstSubMenu) => {
      this.selectedSubMenu = subMenus;
    });
  }



  //getSubMenuById
}