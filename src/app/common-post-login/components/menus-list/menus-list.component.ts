import { Component, OnInit } from '@angular/core';
import { Menu } from '../../../interface/menu';
import { MenuService } from '../../../services/menu.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menus-list',
  standalone: false,
  templateUrl: './menus-list.component.html',
  styleUrl: './menus-list.component.css'
})
export class MenusListComponent implements OnInit {

  menus: Menu[] = [];
  filteredMenus: Menu[] = [];
  searchText = '';

  constructor(
    private menuService: MenuService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadMenus();
  }

  /** Load menus from API */
  loadMenus(): void {
    this.menuService.getAllMenus().subscribe({
      next: (data: Menu[]) => {
        // Use backend tree directly — no custom recursion!
        this.menus = JSON.parse(JSON.stringify(data)); 
        this.filteredMenus = JSON.parse(JSON.stringify(data));
      },
      error: (err) => console.error('Failed to load menus', err)
    });
  }

  /** Search nested menu structure */
  search(): void {
    const q = this.searchText.toLowerCase().trim();

    if (!q) {
      this.filteredMenus = JSON.parse(JSON.stringify(this.menus));
      return;
    }

    this.filteredMenus = this.filterNested(this.menus, q);
  }

  /** Recursively filter menu tree */
  expandedMap = new Map<number, boolean>();

  private filterNested(menus: Menu[], query: string): Menu[] {
  const q = query.toLowerCase().trim();
  const result: Menu[] = [];

  for (const m of menus) {
    const matches =
      m.nameEn?.toLowerCase().includes(q) ||
      m.nameMr?.toLowerCase().includes(q);

    const filteredChildren = m.children?.length
      ? this.filterNested(m.children, q)
      : [];

    if (matches || filteredChildren.length > 0) {

      // ⭐ auto expand parents in UI map
      if (filteredChildren.length > 0 || matches) {
        this.expandedMap.set(m.id, true);
      }

      result.push({
        ...m,
        children: filteredChildren
      });
    }
  }

  return result;
}
toggle(menu: Menu): void {
  const current = this.expandedMap.get(menu.id) ?? false;
  this.expandedMap.set(menu.id, !current);
}

isExpanded(menu: Menu): boolean {
  return this.expandedMap.get(menu.id) ?? false;
}


  /** Edit menu */
  edit(id: number): void {
    this.router.navigate(['/common-post-login/add-menu', id]);
  }

  /** Delete menu */
  delete(id: number): void {
    if (!confirm('Are you sure you want to delete this menu?')) return;

    this.menuService.deleteMenu(id).subscribe({
      next: () => this.loadMenus(),
      error: (err) => console.error('Delete failed', err)
    });
  }

  /** Activate menu */
  activate(id: number): void {
    this.menuService.activate(id).subscribe(() => this.loadMenus());
  }

  /** Deactivate menu */
  deactivate(id: number): void {
    this.menuService.deactivate(id).subscribe(() => this.loadMenus());
  }
}
