export interface Menu {
   
  id: number;
  nameEn: string;
  nameMr: string;
  route?: string | null;
  icon?: string | null;
  sequence?: number | null;
  active?: boolean | null;
  parentId?: number | null;   // important for create/update
  children: Menu[];           // always present (empty array if no children)
  menuType:string;
   // UI-only fields (optional)
  displayNameEn?: string;
  displayNameMr?: string;
}
