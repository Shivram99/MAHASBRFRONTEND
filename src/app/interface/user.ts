export interface User {
  id?: number;
  username: string;
  email: string;
  isFirstTimeLogin?: boolean; 
  roles?: string[];
  registryId?: number;
  districtId?: number;
  divisionCode?: number;
  userProfile?: UserProfile;
}

export interface UserProfile {
  id?: number;
  fullName: string;
  officeName: string;
  officeAddress: string;
  mobileNumber: string;
}