import { Component, OnInit } from '@angular/core';
import { MstMenuRoleMapping } from '../../model/mst-menu-role-mapping';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenuRoleMappingService } from '../../services/menu-role-mapping.service';
import { MstMenu } from '../../model/mst-menu';
import { MenuService } from '../../services/menu.service';
import { Role } from '../../model/user';

@Component({
    selector: 'app-menu-role-mapping',
    templateUrl: './menu-role-mapping.component.html',
    styleUrl: './menu-role-mapping.component.css',
    standalone: false
})
export class MenuRoleMappingComponent  implements OnInit {

  mappings: MstMenuRoleMapping[] = [];
  mappingForm: FormGroup;
  menus: MstMenu[] = [];

  roles: any[] = [];

  constructor(private formBuilder: FormBuilder, private mappingService: MenuRoleMappingService,
    private menuService: MenuService) { 
      this.mappingForm = this.formBuilder.group({
        menuMapID: ['', Validators.required], // Add more validations as needed
        isActive: ['', Validators.required],
        menuId: ['', Validators.required],
        roleId: ['', Validators.required]
      });

    }

  ngOnInit(): void {
    //this.createForm();
    this.loadMappings();
    this.loadMenus();
    this.loadRoles();
  }

  createForm() {

    this.mappingForm = this.formBuilder.group({
      menuMapID: ['', Validators.required], // Add more validations as needed
      isActive: ['', Validators.required],
      menu: ['', Validators.required],
      role: ['', Validators.required]
    });

   /* this.mappingForm = this.formBuilder.group({
      isActive: ['', Validators.required],
      menuId: ['', Validators.required],
      roleId: ['', Validators.required],
    });*/
  }

  loadMappings() {
    this.mappingService.getAllMappings().subscribe(mappings => {
      this.mappings = mappings;
    });
  }

  createMapping() {
    console.log(this.mappingForm.errors);
      const newMapping: MstMenuRoleMapping = this.mappingForm.value;
      this.mappingService.createMapping(newMapping).subscribe(() => {
        this.loadMappings();
        this.mappingForm.reset();
      });
  }

  updateMapping(mapping: MstMenuRoleMapping) {
    this.mappingService.updateMapping(mapping.menuMapID, mapping).subscribe(() => {
      this.loadMappings();
    });
  }

  deleteMapping(id: number) {
    this.mappingService.deleteMapping(id).subscribe(() => {
      this.loadMappings();
    });
  }

  
  loadMenus(): void {
    // this.menuService.getAllMenus().subscribe(menus => {
    //   this.menus = menus;
    // });
  }

  
  loadRoles(): void {
    debugger
    this.mappingService.getAllRoles().subscribe(
      roles => {
        this.roles = roles;
      },
      error => {
        console.log('Error fetching roles:', error);
      }
    );
  }
}