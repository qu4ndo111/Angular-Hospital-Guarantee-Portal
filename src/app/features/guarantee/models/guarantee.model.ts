export interface GuaranteeRequest {
  id: string;                    // "GRT-2024-001234"
  patientName: string;
  patientId: string;             // CCCD
  dateOfBirth: string;
  gender: 'MALE' | 'FEMALE';
  phone: string;
  address: string;
  hospital: string;              // "Bệnh viện Bạch Mai"
  department: string;            // "Khoa Nội tiết"
  treatmentType: 'INPATIENT' | 'OUTPATIENT' | 'SURGERY' | 'EMERGENCY';
  admissionDate: string;
  estimatedDischargeDate: string;
  contractNo: string;            // "HĐ-BH-2023-098765"
  insuranceCardNo: string;
  estimatedAmount: number;       // VND
  approvedAmount: number | null;
  status: GuaranteeStatus;
  submittedAt: string;
  reviewerId: string | null;
  reviewNote: string | null;
  documents: string[];           // file names (fake)
  timeline: TimelineEvent[];
}

export type GuaranteeStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'REVIEWING'
  | 'APPROVED'
  | 'REJECTED'
  | 'PAID';

export interface TimelineEvent {
  status: GuaranteeStatus;
  timestamp: string;
  actor: string;
  note?: string;
}

export interface GuaranteeFilter {
  fromDate: string | null;
  toDate: string | null;
  statuses: GuaranteeStatus[] | null;
  hospital: string | null;
  treatmentType: 'INPATIENT' | 'OUTPATIENT' | 'SURGERY' | 'EMERGENCY' | null;
  activeFilterChips: Record<string, string>[] | null;
}

export interface Patient {
  id: string; // CCCD
  name: string;
  dateOfBirth: string;
  gender: 'MALE' | 'FEMALE';
  address: string;
  phone: string;
}
