export interface MonthlyReportModel {
  month: string;
  total: number;
  approved: number;
  rejected: number;
  inProgress: number;
  avgDays: number;
  claimedAmount: number;
  assessedAmount: number;
}

export interface HospitalPerformanceModel {
  hospital: string;
  total: number;
  approved: number;
  rejected: number;
  inProgress: number;
  avgDays: number;
  sla: string;
}

export interface ReportFilter {
  fromDate?: string | Date;
  toDate?: string | Date;
  treatmentType?: string;
}
