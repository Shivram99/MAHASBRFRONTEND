export type RegisteredEstablishmentExportFormat = 'PDF' | 'EXCEL';

export interface RegisteredEstablishmentExportJobRequest {
  format: RegisteredEstablishmentExportFormat;
  districtIds?: number[];
  talukaIds?: number[];
  brn?: string | null;
}

export interface RegisteredEstablishmentExportJobCreatedResponse {
  jobId: string;
  status: string;
  stage: string;
  progressPercent: number;
  format: RegisteredEstablishmentExportFormat;
  fileName: string;
}

export interface RegisteredEstablishmentExportJobStatusResponse {
  jobId: string;
  status: string;
  stage: string;
  progressPercent: number;
  format: RegisteredEstablishmentExportFormat;
  fileName: string;
  totalRows: number | null;
  processedRows: number | null;
  message: string;
  downloadReady: boolean;
}
