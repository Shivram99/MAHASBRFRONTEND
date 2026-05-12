export interface SearchBrnRequest {
  districtId: number;
  talukaId: number | null;
  establishmentName: string | null;
  brn: string | null;
}
