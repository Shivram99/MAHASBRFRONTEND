import { NICCategory } from "./niccategory";
import { NICGroup } from "./nicgroup";

export interface NICDivision {
    divisionCode: string;
    description: string;
    category?: NICCategory; // Optional
    groups?: NICGroup[]; // Optional
  }