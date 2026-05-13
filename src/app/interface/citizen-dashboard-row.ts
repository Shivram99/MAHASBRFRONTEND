export interface CitizenDashboardRow {
  year: string;
  district: string;
  division: string;
  registryName: string;
  quarter: string;
  totalRegistrations: number;
  totalpersonsworking: number;
  [key: string]: unknown;
}
