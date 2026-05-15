export interface User {
  id?: number;
  username: string;
  email: string;
  isFirstTimeLogin?: boolean; 
  roles: string[];
  registryId?: number | null;
  districtId?: number | null;
  divisionCode?: string | null;
  userProfile?: UserProfile;
}

export interface UserProfile {
  id?: number;
  fullName: string;
  officeName: string;
  officeAddress: string;
  mobileNumber: string;
}
