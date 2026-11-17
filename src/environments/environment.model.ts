export interface AppEnvironment {
  production: boolean;
  environmentName: 'local' | 'uat' | 'production';
  apiUrl: string;
  recaptchaSiteKey: string;
  enableDebugLogs: boolean;
}
