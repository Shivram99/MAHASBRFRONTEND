import { MstMenu } from "./mst-menu";
import { Role } from "./user";

// mst-menu-role-mapping.model.ts
export interface MstMenuRoleMapping {
    menuMapID: number;
    isActive: string;
    menuId: number;
    roleId: number;
    menu:MstMenu;
    role:Role;
  }
  