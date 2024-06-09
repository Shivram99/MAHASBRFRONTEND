import { MstMenu } from "./mst-menu";

// mst-sub-menu.model.ts
export interface MstSubMenu {
    subMenuId: number;
    subMenuNameEnglish: string;
    controllerName: string;
    linkName: string;
    subMenuNameMarathi: string;
    isActive: string;
    menuId: number;
    menu:MstMenu;
  }
  