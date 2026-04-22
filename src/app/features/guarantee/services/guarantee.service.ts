import { Injectable, signal } from '@angular/core';
import { Observable, delay, of, tap } from 'rxjs';
import { GuaranteeFilter, GuaranteeRequest, Patient, GuaranteeStatus } from '../models/guarantee.model';

const FAKE_PATIENTS: Patient[] = [
  { id: '001090123456', name: 'Nguyễn Văn An', dateOfBirth: '1990-01-15', gender: 'MALE', address: 'Hà Nội', phone: '0901234567' },
  { id: '001090654321', name: 'Trần Thị Bình', dateOfBirth: '1992-05-20', gender: 'FEMALE', address: 'Hồ Chí Minh', phone: '0987654321' },
  { id: '001090111222', name: 'Lê Văn Cường', dateOfBirth: '1985-10-20', gender: 'MALE', address: 'Đà Nẵng', phone: '0912345678' },
  { id: '001090333444', name: 'Phạm Thị Dung', dateOfBirth: '1988-03-08', gender: 'FEMALE', address: 'Hải Phòng', phone: '0934567890' },
  { id: '001090555666', name: 'Hoàng Văn Em', dateOfBirth: '1975-07-22', gender: 'MALE', address: 'Cần Thơ', phone: '0956789012' },
  { id: '001090777888', name: 'Vũ Thị Phương', dateOfBirth: '1995-11-30', gender: 'FEMALE', address: 'Hà Nội', phone: '0978901234' },
  { id: '001090999000', name: 'Đặng Văn Giang', dateOfBirth: '1982-09-14', gender: 'MALE', address: 'Nghệ An', phone: '0923456789' },
];

const FAKE_REQUESTS: GuaranteeRequest[] = [
  {
    id: 'GRT-2025-001234', patientName: 'Nguyễn Văn An', patientId: '001090123456',
    dateOfBirth: '1990-01-15', gender: 'MALE', phone: '0901234567', address: 'Hà Nội',
    hospital: 'Bệnh viện Bạch Mai', department: 'Khoa Nội tiết', treatmentType: 'INPATIENT',
    admissionDate: '2025-04-10', estimatedDischargeDate: '2025-04-15',
    contractNo: 'HĐ-BH-2023-098765', insuranceCardNo: 'BH-123456789',
    estimatedAmount: 15000000, approvedAmount: null, status: 'SUBMITTED',
    submittedAt: '2025-04-10T08:30:00Z', reviewerId: null, reviewNote: null,
    documents: ['giay_nhap_vien.pdf', 'cdha.pdf'],
    timeline: [
      { status: 'DRAFT', timestamp: '2025-04-10T08:00:00Z', actor: 'Bệnh viện Bạch Mai' },
      { status: 'SUBMITTED', timestamp: '2025-04-10T08:30:00Z', actor: 'Bệnh viện Bạch Mai' },
    ]
  },
  {
    id: 'GRT-2025-001235', patientName: 'Trần Thị Bình', patientId: '001090654321',
    dateOfBirth: '1992-05-20', gender: 'FEMALE', phone: '0987654321', address: 'Hồ Chí Minh',
    hospital: 'Bệnh viện Chợ Rẫy', department: 'Khoa Ngoại', treatmentType: 'SURGERY',
    admissionDate: '2025-04-12', estimatedDischargeDate: '2025-04-20',
    contractNo: 'HĐ-BH-2023-112233', insuranceCardNo: 'BH-987654321',
    estimatedAmount: 55000000, approvedAmount: 50000000, status: 'APPROVED',
    submittedAt: '2025-04-12T09:00:00Z', reviewerId: 'rev-001', reviewNote: 'Duyệt 50tr theo hợp đồng.',
    documents: ['chi_dinh_phau_thuat.pdf', 'xet_nghiem.pdf'],
    timeline: [
      { status: 'DRAFT', timestamp: '2025-04-12T08:00:00Z', actor: 'Bệnh viện Chợ Rẫy' },
      { status: 'SUBMITTED', timestamp: '2025-04-12T09:00:00Z', actor: 'Bệnh viện Chợ Rẫy' },
      { status: 'REVIEWING', timestamp: '2025-04-12T14:00:00Z', actor: 'Reviewer Minh' },
      { status: 'APPROVED', timestamp: '2025-04-13T10:00:00Z', actor: 'Reviewer Minh', note: 'Duyệt 50tr theo hợp đồng.' },
    ]
  },
  {
    id: 'GRT-2025-001236', patientName: 'Lê Văn Cường', patientId: '001090111222',
    dateOfBirth: '1985-10-20', gender: 'MALE', phone: '0912345678', address: 'Đà Nẵng',
    hospital: 'Bệnh viện Chấn thương Chỉnh hình', department: 'Khoa Phẫu thuật', treatmentType: 'SURGERY',
    admissionDate: '2025-04-20', estimatedDischargeDate: '2025-04-25',
    contractNo: 'HĐ-BH-2023-334455', insuranceCardNo: 'BH-112233445',
    estimatedAmount: 25000000, approvedAmount: null, status: 'REVIEWING',
    submittedAt: '2025-04-20T10:00:00Z', reviewerId: 'rev-002', reviewNote: null,
    documents: ['ho_so_benh_an.pdf'],
    timeline: [
      { status: 'DRAFT', timestamp: '2025-04-20T09:00:00Z', actor: 'BV Chấn thương Chỉnh hình' },
      { status: 'SUBMITTED', timestamp: '2025-04-20T10:00:00Z', actor: 'BV Chấn thương Chỉnh hình' },
      { status: 'REVIEWING', timestamp: '2025-04-20T14:00:00Z', actor: 'Reviewer Hoa' },
    ]
  },
  {
    id: 'GRT-2025-001237', patientName: 'Phạm Thị Dung', patientId: '001090333444',
    dateOfBirth: '1988-03-08', gender: 'FEMALE', phone: '0934567890', address: 'Hải Phòng',
    hospital: 'Bệnh viện Việt Đức', department: 'Khoa Sản', treatmentType: 'INPATIENT',
    admissionDate: '2025-04-18', estimatedDischargeDate: '2025-04-22',
    contractNo: 'HĐ-BH-2022-556677', insuranceCardNo: 'BH-556677889',
    estimatedAmount: 8000000, approvedAmount: null, status: 'REJECTED',
    submittedAt: '2025-04-18T07:00:00Z', reviewerId: 'rev-001',
    reviewNote: 'Hợp đồng hết hạn trước ngày nhập viện.',
    documents: ['giay_nhap_vien.pdf'],
    timeline: [
      { status: 'DRAFT', timestamp: '2025-04-18T06:30:00Z', actor: 'Bệnh viện Việt Đức' },
      { status: 'SUBMITTED', timestamp: '2025-04-18T07:00:00Z', actor: 'Bệnh viện Việt Đức' },
      { status: 'REVIEWING', timestamp: '2025-04-18T09:00:00Z', actor: 'Reviewer Minh' },
      { status: 'REJECTED', timestamp: '2025-04-18T11:00:00Z', actor: 'Reviewer Minh', note: 'Hợp đồng hết hạn trước ngày nhập viện.' },
    ]
  },
  {
    id: 'GRT-2025-001238', patientName: 'Hoàng Văn Em', patientId: '001090555666',
    dateOfBirth: '1975-07-22', gender: 'MALE', phone: '0956789012', address: 'Cần Thơ',
    hospital: 'Bệnh viện Đa khoa Cần Thơ', department: 'Khoa Tim mạch', treatmentType: 'EMERGENCY',
    admissionDate: '2025-04-22', estimatedDischargeDate: '2025-04-28',
    contractNo: 'HĐ-BH-2025-001122', insuranceCardNo: 'BH-667788990',
    estimatedAmount: 40000000, approvedAmount: 40000000, status: 'PAID',
    submittedAt: '2025-04-22T03:00:00Z', reviewerId: 'rev-003',
    reviewNote: 'Cấp cứu tim mạch, duyệt toàn bộ.',
    documents: ['giay_cap_cuu.pdf', 'ecg.pdf', 'xet_nghiem_mau.pdf'],
    timeline: [
      { status: 'DRAFT', timestamp: '2025-04-22T02:30:00Z', actor: 'BV Đa khoa Cần Thơ' },
      { status: 'SUBMITTED', timestamp: '2025-04-22T03:00:00Z', actor: 'BV Đa khoa Cần Thơ' },
      { status: 'REVIEWING', timestamp: '2025-04-22T03:30:00Z', actor: 'Reviewer Tuấn' },
      { status: 'APPROVED', timestamp: '2025-04-22T04:00:00Z', actor: 'Reviewer Tuấn', note: 'Cấp cứu, duyệt khẩn.' },
      { status: 'PAID', timestamp: '2025-04-29T08:00:00Z', actor: 'Phòng Tài chính' },
    ]
  },
  {
    id: 'GRT-2025-001239', patientName: 'Vũ Thị Phương', patientId: '001090777888',
    dateOfBirth: '1995-11-30', gender: 'FEMALE', phone: '0978901234', address: 'Hà Nội',
    hospital: 'Bệnh viện Phụ sản Hà Nội', department: 'Khoa Sản', treatmentType: 'INPATIENT',
    admissionDate: '2025-05-01', estimatedDischargeDate: '2025-05-04',
    contractNo: 'HĐ-BH-2025-334455', insuranceCardNo: 'BH-778899001',
    estimatedAmount: 12000000, approvedAmount: null, status: 'DRAFT',
    submittedAt: '2025-05-01T07:00:00Z', reviewerId: null, reviewNote: null,
    documents: [],
    timeline: [
      { status: 'DRAFT', timestamp: '2025-05-01T07:00:00Z', actor: 'BV Phụ sản Hà Nội' },
    ]
  },
  {
    id: 'GRT-2025-001240', patientName: 'Đặng Văn Giang', patientId: '001090999000',
    dateOfBirth: '1982-09-14', gender: 'MALE', phone: '0923456789', address: 'Nghệ An',
    hospital: 'Bệnh viện Đa khoa Nghệ An', department: 'Khoa Thần kinh', treatmentType: 'INPATIENT',
    admissionDate: '2025-05-05', estimatedDischargeDate: '2025-05-15',
    contractNo: 'HĐ-BH-2023-889900', insuranceCardNo: 'BH-990011223',
    estimatedAmount: 30000000, approvedAmount: 28000000, status: 'APPROVED',
    submittedAt: '2025-05-05T09:00:00Z', reviewerId: 'rev-002',
    reviewNote: 'Duyệt 28tr, loại trừ chi phí không trong danh mục.',
    documents: ['mri.pdf', 'bien_ban_hoi_chan.pdf'],
    timeline: [
      { status: 'DRAFT', timestamp: '2025-05-05T08:00:00Z', actor: 'BV Đa khoa Nghệ An' },
      { status: 'SUBMITTED', timestamp: '2025-05-05T09:00:00Z', actor: 'BV Đa khoa Nghệ An' },
      { status: 'REVIEWING', timestamp: '2025-05-05T14:00:00Z', actor: 'Reviewer Hoa' },
      { status: 'APPROVED', timestamp: '2025-05-06T10:00:00Z', actor: 'Reviewer Hoa', note: 'Duyệt 28tr.' },
    ]
  },
  {
    id: 'GRT-2025-001241', patientName: 'Nguyễn Văn An', patientId: '001090123456',
    dateOfBirth: '1990-01-15', gender: 'MALE', phone: '0901234567', address: 'Hà Nội',
    hospital: 'Bệnh viện Nội tiết Trung ương', department: 'Khoa Nội', treatmentType: 'OUTPATIENT',
    admissionDate: '2025-05-10', estimatedDischargeDate: '2025-05-10',
    contractNo: 'HĐ-BH-2023-098765', insuranceCardNo: 'BH-123456789',
    estimatedAmount: 3500000, approvedAmount: 3500000, status: 'PAID',
    submittedAt: '2025-05-10T08:00:00Z', reviewerId: 'rev-001', reviewNote: 'Khám ngoại trú, duyệt đủ.',
    documents: ['don_thuoc.pdf'],
    timeline: [
      { status: 'DRAFT', timestamp: '2025-05-10T07:30:00Z', actor: 'BV Nội tiết TW' },
      { status: 'SUBMITTED', timestamp: '2025-05-10T08:00:00Z', actor: 'BV Nội tiết TW' },
      { status: 'REVIEWING', timestamp: '2025-05-10T09:00:00Z', actor: 'Reviewer Minh' },
      { status: 'APPROVED', timestamp: '2025-05-10T09:30:00Z', actor: 'Reviewer Minh' },
      { status: 'PAID', timestamp: '2025-05-11T08:00:00Z', actor: 'Phòng Tài chính' },
    ]
  },
  {
    id: 'GRT-2025-001242', patientName: 'Trần Thị Bình', patientId: '001090654321',
    dateOfBirth: '1992-05-20', gender: 'FEMALE', phone: '0987654321', address: 'Hồ Chí Minh',
    hospital: 'Bệnh viện Ung bướu TP.HCM', department: 'Khoa Ung thư', treatmentType: 'INPATIENT',
    admissionDate: '2025-05-15', estimatedDischargeDate: '2025-05-25',
    contractNo: 'HĐ-BH-2023-112233', insuranceCardNo: 'BH-987654321',
    estimatedAmount: 90000000, approvedAmount: null, status: 'REVIEWING',
    submittedAt: '2025-05-15T10:00:00Z', reviewerId: 'rev-003', reviewNote: null,
    documents: ['sinh_thiet.pdf', 'pet_scan.pdf', 'phac_do_dieu_tri.pdf'],
    timeline: [
      { status: 'DRAFT', timestamp: '2025-05-15T09:00:00Z', actor: 'BV Ung bướu TP.HCM' },
      { status: 'SUBMITTED', timestamp: '2025-05-15T10:00:00Z', actor: 'BV Ung bướu TP.HCM' },
      { status: 'REVIEWING', timestamp: '2025-05-15T14:00:00Z', actor: 'Reviewer Tuấn' },
    ]
  },
  {
    id: 'GRT-2025-001243', patientName: 'Phạm Thị Dung', patientId: '001090333444',
    dateOfBirth: '1988-03-08', gender: 'FEMALE', phone: '0934567890', address: 'Hải Phòng',
    hospital: 'Bệnh viện Hữu Nghị Việt Tiệp', department: 'Khoa Xương khớp', treatmentType: 'OUTPATIENT',
    admissionDate: '2025-05-20', estimatedDischargeDate: '2025-05-20',
    contractNo: 'HĐ-BH-2025-778899', insuranceCardNo: 'BH-556677889',
    estimatedAmount: 2000000, approvedAmount: null, status: 'SUBMITTED',
    submittedAt: '2025-05-20T08:30:00Z', reviewerId: null, reviewNote: null,
    documents: ['don_thuoc.pdf', 'xquang.pdf'],
    timeline: [
      { status: 'DRAFT', timestamp: '2025-05-20T08:00:00Z', actor: 'BV Hữu Nghị Việt Tiệp' },
      { status: 'SUBMITTED', timestamp: '2025-05-20T08:30:00Z', actor: 'BV Hữu Nghị Việt Tiệp' },
    ]
  },
  {
    id: 'GRT-2025-001244', patientName: 'Hoàng Văn Em', patientId: '001090555666',
    dateOfBirth: '1975-07-22', gender: 'MALE', phone: '0956789012', address: 'Cần Thơ',
    hospital: 'Bệnh viện Đa khoa Cần Thơ', department: 'Khoa Nội', treatmentType: 'OUTPATIENT',
    admissionDate: '2025-06-01', estimatedDischargeDate: '2025-06-01',
    contractNo: 'HĐ-BH-2025-001122', insuranceCardNo: 'BH-667788990',
    estimatedAmount: 1500000, approvedAmount: 1500000, status: 'PAID',
    submittedAt: '2025-06-01T09:00:00Z', reviewerId: 'rev-001', reviewNote: 'Tái khám tim mạch.',
    documents: ['don_thuoc.pdf'],
    timeline: [
      { status: 'DRAFT', timestamp: '2025-06-01T08:30:00Z', actor: 'BV Đa khoa Cần Thơ' },
      { status: 'SUBMITTED', timestamp: '2025-06-01T09:00:00Z', actor: 'BV Đa khoa Cần Thơ' },
      { status: 'REVIEWING', timestamp: '2025-06-01T09:30:00Z', actor: 'Reviewer Minh' },
      { status: 'APPROVED', timestamp: '2025-06-01T10:00:00Z', actor: 'Reviewer Minh' },
      { status: 'PAID', timestamp: '2025-06-02T08:00:00Z', actor: 'Phòng Tài chính' },
    ]
  },
  {
    id: 'GRT-2025-001245', patientName: 'Đặng Văn Giang', patientId: '001090999000',
    dateOfBirth: '1982-09-14', gender: 'MALE', phone: '0923456789', address: 'Nghệ An',
    hospital: 'Bệnh viện Bạch Mai', department: 'Khoa Hô hấp', treatmentType: 'INPATIENT',
    admissionDate: '2025-06-10', estimatedDischargeDate: '2025-06-17',
    contractNo: 'HĐ-BH-2023-889900', insuranceCardNo: 'BH-990011223',
    estimatedAmount: 22000000, approvedAmount: null, status: 'SUBMITTED',
    submittedAt: '2025-06-10T10:00:00Z', reviewerId: null, reviewNote: null,
    documents: ['ct_phoi.pdf', 'xet_nghiem_dom.pdf'],
    timeline: [
      { status: 'DRAFT', timestamp: '2025-06-10T09:30:00Z', actor: 'Bệnh viện Bạch Mai' },
      { status: 'SUBMITTED', timestamp: '2025-06-10T10:00:00Z', actor: 'Bệnh viện Bạch Mai' },
    ]
  },
];

@Injectable({ providedIn: 'root' })
export class GuaranteeService {
  private patients = signal<Patient[]>(FAKE_PATIENTS);
  private guaranteeRequests = signal<GuaranteeRequest[]>(FAKE_REQUESTS);

  getPatients(): Observable<Patient[]> {
    return of(this.patients()).pipe(delay(300));
  }

  getPatientById(cccd: string): Observable<Patient | undefined> {
    return of(this.patients().find(p => p.id === cccd)).pipe(delay(500));
  }

  getGuaranteeRequests(filter?: GuaranteeFilter, searchKeyword?: string, page?: number, pageSize?: number): Observable<GuaranteeRequest[]> {
    let results = this.guaranteeRequests();

    if (searchKeyword) {
      results = results.filter(r => r.id.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        r.patientName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        r.patientId.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        r.hospital.toLowerCase().includes(searchKeyword.toLowerCase()));
    }
    if (filter?.statuses?.length) {
      results = results.filter(r => filter.statuses!.includes(r.status));
    }
    if (filter?.fromDate) {
      results = results.filter(r => r.admissionDate >= filter.fromDate!);
    }
    if (filter?.toDate) {
      results = results.filter(r => r.admissionDate <= filter.toDate!);
    }
    if (filter?.hospital) {
      results = results.filter(r => r.hospital.toLowerCase().includes(filter.hospital!.toLowerCase()));
    }
    if (filter?.treatmentType) {
      results = results.filter(r => r.treatmentType === filter.treatmentType);
    }

    if (page !== undefined && pageSize !== undefined) {
      const startIndex = (page - 1) * pageSize;
      results = results.slice(startIndex, startIndex + pageSize);
    }

    return of(results).pipe(delay(400));
  }

  getGuaranteeRequestsById(id: string): Observable<GuaranteeRequest | undefined> {
    return of(this.guaranteeRequests().find(r => r.id === id));
  }

  addRequest(request: GuaranteeRequest): Observable<GuaranteeRequest> {
    return of(request).pipe(
      delay(400),
      tap(() => this.guaranteeRequests.update(reqs => [request, ...reqs]))
    );
  }

  updateRequest(request: GuaranteeRequest): Observable<GuaranteeRequest> {
    return of(request).pipe(
      delay(400),
      tap(() => this.guaranteeRequests.update(reqs =>
        reqs.map(r => r.id === request.id ? request : r)
      ))
    );
  }

  /** Stats for dashboard cards */
  getStats(): Observable<{ total: number; pending: number; approved: number; rejected: number }> {
    const reqs = this.guaranteeRequests();
    return of({
      total: reqs.length,
      pending: reqs.filter(r => r.status === 'SUBMITTED' || r.status === 'REVIEWING').length,
      approved: reqs.filter(r => r.status === 'APPROVED' || r.status === 'PAID').length,
      rejected: reqs.filter(r => r.status === 'REJECTED').length,
    }).pipe(delay(300));
  }
}
