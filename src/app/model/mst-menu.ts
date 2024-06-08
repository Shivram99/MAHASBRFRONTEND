import { MstMenuRoleMapping } from "./mst-menu-role-mapping";
import { MstSubMenu } from "./mst-sub-menu";

// mst-menu.model.ts
export interface MstMenu {
    menuId?: number; // Mark menuId as optional
    menuNameEnglish: string;
    menuNameMarathi: string;
    isActive: string;
    menuRoleMappings?: MstMenuRoleMapping[];
    subMenus?: MstSubMenu[];
  }
  