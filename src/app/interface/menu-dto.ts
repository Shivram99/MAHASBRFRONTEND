export interface MenuDTO {
     id: number;
  nameEn: string;
  nameMr: string;
  route: string;
  icon: string;
  sequence: number;
  active: boolean;
  menuType: string;
  parentId?: number;
  children: MenuDTO[];
}
