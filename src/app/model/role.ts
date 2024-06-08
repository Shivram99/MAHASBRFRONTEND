import { MstMenuRoleMapping } from "./mst-menu-role-mapping";

export interface Role {
    id?: number;
    name: string;
    mappings?: MstMenuRoleMapping[]; // Include this property if needed
  }