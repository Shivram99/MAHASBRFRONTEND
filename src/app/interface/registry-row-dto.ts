export interface RegistryRowDto {
  rowData: Record<string, string>;
  valid: boolean;
  errorMessage?: string;
  rowNumber?: number;
}