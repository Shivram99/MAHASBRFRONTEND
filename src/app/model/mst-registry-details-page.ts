export interface MstRegistryDetailsPage {
    siNo?: number;
    nameOfEstablishmentOrOwner?: string;
    houseNo?: string;
    streetName?: string;
    locality?: string;
    pinCode?: number;
    telephoneMobNumber?: number;
    emailAddress?: string;
    panNumber?: string;
    tanNumber?: string;
    headOfficeHouseNo?: string;
    headOfficeStreetName?: string;
    headOfficeLocality?: string;
    headOfficePinCode?: number;
    headOfficeTelephoneMobNumber?: number;
    headOfficeEmailAddress?: string;
    headOfficePanNumber?: string;
    headOfficeTanNumber?: string;
    descriptionOfMajorActivity?: string;
    nic2008ActivityCode?: number;
    nic2008ActivityCodeDesicripton?: string;
    yearOfStartOfOperation?: number;
    ownershipCode?: number;
    totalNumberOfPersonsWorking?: number;
    actAuthorityRegistrationNumbers?: string;
    remarks?: string;
    locationCode?: string;
    registrationStatus?: string;
    townVillage?: string;
    taluka?: string;
    district?: string;
    sector?: string; // Rural / Urban
    wardNumber?: string;
    nameOfAuthority?: string;
    nameOfAct?: string;
    dateOfRegistration?: string; // Assuming the dates are returned as strings in ISO format
    dateOfDeregistrationExpiry?: string; // Assuming the dates are returned as strings in ISO format
    gstNumber?: string;
    hsnCode?: string;
    recordStatus?: string;
    brnNo: string;

}
