/** What the backend returns. The password itself is never sent to the browser. */
export interface RegistryApiAuthConfig {
  id?: number;
  serviceName: string;
  serviceNameCode: string;
  authUrl: string;
  authUrlMethod: string;
  username: string;
  passwordSet?: boolean;
  apiData: string;
  apiDataMethod: string;
  active: boolean;
  registryId: number | null;
  registryName?: string | null;
  syncFromDate?: string | null;
  lastSyncedTo?: string | null;
  lastRunAt?: string | null;
  lastRunStatus?: 'RUNNING' | 'SUCCESS' | 'FAILED' | null;
  lastRunMessage?: string | null;
  running?: boolean;
}

/** What the form sends. Leave password empty on edit to keep the stored one. */
export interface RegistryApiAuthConfigRequest {
  serviceName: string;
  serviceNameCode: string;
  authUrl: string;
  authUrlMethod: string;
  username: string;
  password: string;
  apiData: string;
  apiDataMethod: string;
  active: boolean;
  registryId: number | null;
  syncFromDate: string | null;
}
