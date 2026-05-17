export interface CsvUploadPreviewRecord {
  rowNumber: number;
  establishmentName: string;
  district: string;
  taluka: string;
  mobileNo: string;
  email: string;
  pan: string;
  gstNumber: string;
  nicCode: string;
  valid: boolean;
  errorMessage: string | null;
}

export interface CsvUploadInitResponse {
  jobId?: string;
  uploadId?: string;
  fileName: string;
  fileSize: number;
  status: string;
  message: string;
}

export interface CsvUploadPreviewResponse {
  jobId?: string;
  uploadId?: string;
  fileName: string;
  fileSize: number;
  status: string;
  message: string;
  totalRecords: number;
  validRecords: number;
  invalidRecords: number;
  duplicateRecords: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  previewReady: boolean;
  records: CsvUploadPreviewRecord[];
}

export interface CsvUploadSuccessRecord {
  rowNumber: number;
  brn: string;
  establishmentName: string;
  rawData?: string | null;
}

export interface CsvUploadFailedRecord {
  rowNumber: number;
  establishmentName: string;
  brn?: string | null;
  errorReason?: string;
  reason?: string;
  rawData?: string | null;
}

export interface CsvUploadStatusResponse {
  jobId?: string;
  uploadId?: string;
  fileName: string;
  fileSize: number;
  status: string;
  message: string;
  progressPercentage: number;
  totalRecords: number;
  processedRecords: number;
  successRecords?: number;
  insertedRecords?: number;
  failedRecords: number;
  pendingRecords: number;
  validRecords: number;
  invalidRecords: number;
  duplicateRecords: number;
  totalPreviewPages: number;
  totalSuccessPages: number;
  totalFailedPages: number;
  previewReady: boolean;
  canStart?: boolean;
  canProcess?: boolean;
  canPause?: boolean;
  canResume?: boolean;
  canCancel?: boolean;
  canRetry?: boolean;
}

export interface CsvUploadSuccessPageResponse {
  jobId?: string;
  uploadId?: string;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
  records: CsvUploadSuccessRecord[];
}

export interface CsvUploadFailedPageResponse {
  jobId?: string;
  uploadId?: string;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
  records: CsvUploadFailedRecord[];
}
