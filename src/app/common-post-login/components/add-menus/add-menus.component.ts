import { Component, OnInit } from '@angular/core';
import { MenuService } from '../../../services/menu.service';
import { Menu } from '../../../interface/menu';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { debounceTime, forkJoin } from 'rxjs';
import { MarathiInputService } from '../../../services/marathi-input.service';

@Component({
  selector: 'app-add-menus',
  standalone: false,
  templateUrl: './add-menus.component.html',
  styleUrl: './add-menus.component.css'
})
export class AddMenusComponent implements OnInit {


  menuForm!: FormGroup;
  allMenus: Menu[] = [];        // original nested tree from server
  flatMenus: Menu[] = [];       // flattened for dropdown
  validParentMenus: Menu[] = []; // parents allowed given current editing menu
  isEdit = false;
  isLoading = false;
  isSubmitting = false;
  currentMenuId?: number;


  inputText = '';
  marathiSuggestions: string[] = [];
  selectedIndex = -1;


  constructor(
    private fb: FormBuilder,
    private menuService: MenuService,
    private route: ActivatedRoute,
    private router: Router,
    private marathiService: MarathiInputService
  ) { }

  ngOnInit(): void {
    this.initForm();
    // check route param to decide edit vs create
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEdit = true;
      this.currentMenuId = Number(idParam);
    }
    this.loadInitial();
    this.listenToMarathiInput();
  }

  private initForm(): void {
    this.menuForm = this.fb.group({
      nameEn: ['', Validators.required],
      nameMr: ['', Validators.required],
      route: [''],
      icon: [''],
       menuType: [-1, Validators.required],
      sequence: [1, [Validators.required, Validators.min(0)]],
      active: [true],
      parentId: [null]
    });
    // this.listenToMarathiInput();
  }

  private loadInitial(): void {
    this.isLoading = true;

    // If edit, get menu + all menus in parallel (otherwise only all menus)
    const calls = this.isEdit ?
      forkJoin({
        menus: this.menuService.getAllMenus(),
        menu: this.menuService.getMenuById(this.currentMenuId!)
      }) :
      forkJoin({
        menus: this.menuService.getAllMenus()
      } as any);

    calls.subscribe({
      next: (res: any) => {
        this.allMenus = (res.menus || res) as Menu[]; // for TS safety
        // Ensure children arrays exist
        this.allMenus = this.allMenus.map(m => this.ensureChildrenInitialized(m));
        this.flatMenus = this.flattenMenus(this.allMenus);
        if (this.isEdit && res.menu) {
          this.patchForm(res.menu as Menu);
        }
        // prepare valid parents: if editing remove current menu and its descendants
        this.updateValidParents();
      },
      error: (err) => {
        console.error('Failed to load menus', err);
        alert('Failed to load data');
      },
      complete: () => this.isLoading = false
    });
  }

  private ensureChildrenInitialized(menu: Menu): Menu {
    const children = (menu.children ?? []).map(c => this.ensureChildrenInitialized(c));
    return { ...menu, children };
  }

  private patchForm(menu: Menu): void {
    this.menuForm.patchValue({
      nameEn: menu.nameEn,
      nameMr: menu.nameMr,
      route: menu.route ?? '',
      icon: menu.icon ?? '',
      menuType: menu.menuType ?? -1,
      sequence: menu.sequence ?? 1,
      active: menu.active ?? true,
      parentId: menu.parentId ?? null
    });
  }

  // flatten tree to one-level array (keeps original ids and labels)
  private flattenMenus(menus: Menu[], level: number = 0): Menu[] {
    let flat: Menu[] = [];
    for (const m of menus) {
      // include display prefix (not modifying original fields)
      flat.push({ ...m, nameEn: `${'— '.repeat(level)}${m.nameEn}`, nameMr: `${'— '.repeat(level)}${m.nameMr}` });
      if (m.children?.length) {
        flat = flat.concat(this.flattenMenus(m.children, level + 1));
      }
    }
    return flat;
  }

  // when editing, exclude current menu and its descendants from parent candidates
  private updateValidParents(): void {
    if (!this.isEdit || !this.currentMenuId) {
      this.validParentMenus = [...this.flatMenus];
      return;
    }

    const invalidIds = this.getDescendantIds(this.currentMenuId);
    invalidIds.push(this.currentMenuId); // also exclude self
    this.validParentMenus = this.flatMenus.filter(m => !invalidIds.includes(m.id));
  }

  private getDescendantIds(menuId: number): number[] {
    const root = this.findMenuById(this.allMenus, menuId);
    if (!root || !root.children) return [];
    const ids: number[] = [];
    const recurse = (items: Menu[]) => {
      for (const it of items) {
        ids.push(it.id);
        if (it.children?.length) recurse(it.children);
      }
    };
    recurse(root.children);
    return ids;
  }

  private findMenuById(menus: Menu[], id: number): Menu | null {
    for (const m of menus) {
      if (m.id === id) return m;
      if (m.children?.length) {
        const found = this.findMenuById(m.children, id);
        if (found) return found;
      }
    }
    return null;
  }

  // convenience getters
  get f() { return this.menuForm.controls; }

  submit(): void {
    this.menuForm.markAllAsTouched();
    if (this.menuForm.invalid) return;

    this.isSubmitting = true;
    const payload = this.buildPayload();

    const obs = this.isEdit && this.currentMenuId
      ? this.menuService.updateMenu(this.currentMenuId, payload)
      : this.menuService.createMenu(payload);

    obs.subscribe({
      next: () => {
        alert(this.isEdit ? 'Menu updated successfully' : 'Menu created successfully');
        // this.router.navigate(['../menu-list'], { relativeTo: this.route });// adjust route to your list page
        this.router.navigate(['/common-post-login/menu-list']);
      },
      error: (err) => {
        console.error('Save failed', err);
        alert(err?.error?.message || 'Save failed');
        this.isSubmitting = false;
      },
      complete: () => this.isSubmitting = false
    });
  }

  private buildPayload(): Partial<Menu> {
    const raw = this.menuForm.value;
    return {
      nameEn: raw.nameEn,
      nameMr: raw.nameMr,
      route: raw.route || null,
      icon: raw.icon || null,
      menuType: raw.menuType,
      sequence: Number(raw.sequence),
      active: raw.active,
      parentId: raw.parentId ?? null
    } as Partial<Menu>;
  }

  cancel(): void {
    this.router.navigate(['/common-post-login/menus-list']);
  }


  listenToMarathiInput(): void {
    this.menuForm.get('nameMr')?.valueChanges
      .pipe(debounceTime(300))
      .subscribe(value => {
        if (value?.trim()) {
          this.marathiService.getMarathiSuggestion(value).subscribe({
            next: (response) => {
              if (response && response[0] === 'SUCCESS' && response[1]?.[0]?.[1]) {
                this.marathiSuggestions = response[1][0][1];
              } else {
                this.marathiSuggestions = [];
              }
            },
            error: (err) => {
              console.error('Error fetching Marathi suggestions:', err);
              this.marathiSuggestions = [];
            }
          });
        } else {
          this.marathiSuggestions = [];
        }
      });
  }

  setMarathiValue(text: string) {
    this.menuForm.get('nameMr')?.setValue(text);
    this.marathiSuggestions = [];
  }
  
}