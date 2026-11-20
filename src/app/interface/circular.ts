export interface Circular {
  id: number;
  subject: string;
  activity: string;
  date: string;
  fileUrl: string;
  message?: string;
  status?: string;
  /** Only active circulars are shown on the public site. */
  active?: boolean;
}
