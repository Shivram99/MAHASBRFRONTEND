import { NICDivision } from "./nicdivision";

export interface NICCategory {
    categoryCode: string;
    description: string;
    divisions?: NICDivision[]; // Optional
  }