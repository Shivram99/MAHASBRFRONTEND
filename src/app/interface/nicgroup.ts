import { NICDivision } from "./nicdivision";

export interface NICGroup {
    groupCode: string;
    description: string;
    division?: NICDivision; // Optional
  }