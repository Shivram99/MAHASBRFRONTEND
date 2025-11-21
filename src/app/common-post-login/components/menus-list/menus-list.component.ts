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
export class MenusListComponent  implements OnInit {

  
  menus: Menu[] = [];
  flatMenus: Menu[] = [];
  filteredMenus: Menu[] = [];
  searchText = '';

  constructor(
    private menuService: MenuService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadMenus();
  }

  /** Load all menus from API */
  loadMenus(): void {
    this.menuService.getAllMenus().subscribe({
      next: (data: Menu[]) => {
        // Ensure children exist recursively
        this.menus = data.map(m => this.ensureChildren(m));
        this.flatMenus = this.flattenMenus(this.menus);
        this.filteredMenus = [...this.flatMenus];
      },
      error: (err) => console.error('Failed to load menus', err)
    });
  }

  /** Ensure children always exist */
  private ensureChildren(menu: Menu): Menu {
    return {
      ...menu,
      children: (menu.children ?? []).map(c => this.ensureChildren(c))
    };
  }

  /** Convert nested tree → flat list with level indent */
  private flattenMenus(menus: Menu[], level: number = 0): Menu[] {
    let flat: Menu[] = [];

    for (const m of menus) {
      flat.push({
        ...m,
        displayNameEn: `${'— '.repeat(level)}${m.nameEn}`,
        displayNameMr: `${'— '.repeat(level)}${m.nameMr}`
      });

      if (m.children?.length) {
        flat = flat.concat(this.flattenMenus(m.children, level + 1));
      }
    }

    return flat;
  }

  /** Search menus (all levels) */
  search(): void {
    const query = this.searchText.toLowerCase().trim();

    if (!query) {
      this.filteredMenus = [...this.flatMenus];
      return;
    }

    this.filteredMenus = this.flatMenus.filter(m =>
      m.nameEn.toLowerCase().includes(query) ||
      m.nameMr.toLowerCase().includes(query)
    );
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
