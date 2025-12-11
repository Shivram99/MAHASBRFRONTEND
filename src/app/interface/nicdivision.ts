import { NICCategory } from "./niccategory";
import { NICGroup } from "./nicgroup";

export interface NICDivision {
    divisionCode: string;
    description: string;
    // category?: NICCategory; // Optional
    categoryCode: string;
    groups?: NICGroup[]; // Optional
     isActive: string;  
  }