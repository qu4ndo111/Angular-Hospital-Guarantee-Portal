import { Injectable, signal } from '@angular/core';
import { Observable, delay, of, tap } from 'rxjs';
import { GuaranteeFilter, GuaranteeRequest, Patient, GuaranteeStatus } from '../models/guarantee.model';

@Injectable({
  providedIn: 'root'
})
export class GuaranteeService {
  private fakePatients: Patient[] = [
    { id: '001090123456', name: 'Nguyễn Văn A', dateOfBirth: '1990-01-01', gender: 'MALE', address: 'Hà Nội', phone: '0901234567' },
    { id: '001090654321', name: 'Trần Thị B', dateOfBirth: '1992-05-15', gender: 'FEMALE', address: 'Hồ Chí Minh', phone: '0987654321' },
    { id: '001090111222', name: 'Lê Văn C', dateOfBirth: '1985-10-20', gender: 'MALE', address: 'Đà Nẵng', phone: '0912345678' }
  ];

  private fakeRequests: GuaranteeRequest[] = [
    {
      id: 'GRT-2024-001234',
      patientName: 'Nguyễn Văn A',
      patientId: '001090123456',
      dateOfBirth: '1990-01-01',
      gender: 'MALE',
      hospital: 'Bệnh viện Bạch Mai',
      phone: '0901234567',
      address: 'Hà Nội',
      department: 'Khoa Nội tiết',
      treatmentType: 'INPATIENT',
      admissionDate: '2024-04-10',
      estimatedDischargeDate: '2024-04-15',
      contractNo: 'HĐ-BH-2023-098765',
      insuranceCardNo: 'BH-123456789',
      estimatedAmount: 15000000,
      approvedAmount: null,
      status: 'SUBMITTED',
      submittedAt: '2024-04-10T08:30:00Z',
      reviewerId: null,
      reviewNote: null,
      documents: ['giay_nhap_vien.pdf', 'cdha.pdf'],
      timeline: [
        { status: 'DRAFT', timestamp: '2024-04-10T08:00:00Z', actor: 'Bệnh viện Bạch Mai' },
        { status: 'SUBMITTED', timestamp: '2024-04-10T08:30:00Z', actor: 'Bệnh viện Bạch Mai' }
      ]
    },
    {
      id: 'GRT-2024-001235',
      patientName: 'Trần Thị B',
      patientId: '001090654321',
      dateOfBirth: '1992-05-15',
      gender: 'FEMALE',
      hospital: 'Bệnh viện Chợ Rẫy',
      phone: '0987654321',
      address: 'Hồ Chí Minh',
      department: 'Khoa Ngoại',
      treatmentType: 'SURGERY',
      admissionDate: '2024-04-12',
      estimatedDischargeDate: '2024-04-20',
      contractNo: 'HĐ-BH-2023-112233',
      insuranceCardNo: 'BH-987654321',
      estimatedAmount: 55000000,
      approvedAmount: 50000000,
      status: 'APPROVED',
      submittedAt: '2024-04-12T09:00:00Z',
      reviewerId: 'rev-001',
      reviewNote: 'Đồng ý bảo lãnh 50tr theo hợp đồng.',
      documents: ['chi_dinh_phauthuat.pdf'],
      timeline: [
        { status: 'DRAFT', timestamp: '2024-04-12T08:00:00Z', actor: 'Bệnh viện Chợ Rẫy' },
        { status: 'SUBMITTED', timestamp: '2024-04-12T09:00:00Z', actor: 'Bệnh viện Chợ Rẫy' },
        { status: 'REVIEWING', timestamp: '2024-04-12T14:00:00Z', actor: 'AQ Reviewer 1' },
        { status: 'APPROVED', timestamp: '2024-04-13T10:00:00Z', actor: 'AQ Reviewer 1', note: 'Đồng ý bảo lãnh 50tr theo hợp đồng.' }
      ]
    },
    {
        id: 'GRT-2024-001236',
        patientName: 'Lê Văn C',
        patientId: '001090111222',
        dateOfBirth: '1985-10-20',
        gender: 'MALE',
        phone: '0912345678',
        address: 'Đà Nẵng',
        hospital: 'Bệnh viện Chấn thương Chỉnh hình',
        department: 'Khoa Phẫu thuật',
        treatmentType: 'SURGERY',
        admissionDate: '2024-04-20',
        estimatedDischargeDate: '2024-04-25',
        contractNo: 'HĐ-BH-2023-334455',
        insuranceCardNo: 'BH-112233445',
        estimatedAmount: 25000000,
        approvedAmount: null,
        status: 'REVIEWING',
        submittedAt: '2024-04-20T10:00:00Z',
        reviewerId: 'rev-002',
        reviewNote: null,
        documents: ['ho_so_benh_an.pdf'],
        timeline: [
          { status: 'DRAFT', timestamp: '2024-04-20T09:00:00Z', actor: 'Bệnh viện Chấn thương Chỉnh hình' },
          { status: 'SUBMITTED', timestamp: '2024-04-20T10:00:00Z', actor: 'Bệnh viện Chấn thương Chỉnh hình' },
          { status: 'REVIEWING', timestamp: '2024-04-20T14:00:00Z', actor: 'AQ Reviewer 2' }
        ]
      }
  ];

  private guaranteeRequests = signal<GuaranteeRequest[]>(this.fakeRequests);

  constructor() { }

  getPatients(): Observable<Patient[]> {
    return of(this.fakePatients).pipe(delay(300));
  }

  getPatientById(cccd: string): Observable<Patient | undefined> {
    const patient = this.fakePatients.find(p => p.id === cccd);
    return of(patient).pipe(delay(500)); // Simulate API delay
  }

  getGuaranteeRequests(filter?: GuaranteeFilter): Observable<GuaranteeRequest[]> {
    let results = this.guaranteeRequests();

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
      const lowerHospital = filter.hospital.toLowerCase();
      results = results.filter(r => r.hospital.toLowerCase().includes(lowerHospital));
    }

    if (filter?.treatmentType) {
      results = results.filter(r => r.treatmentType === filter.treatmentType);
    }

    return of(results).pipe(delay(400));
  }

  getGuaranteeRequestsById(id: string): Observable<GuaranteeRequest | undefined> {
    const guarantee = this.guaranteeRequests().find((rq) => rq.id === id)
    return of(guarantee)
  }

  addRequest(request: GuaranteeRequest): Observable<GuaranteeRequest> {
      return of(request).pipe(
        delay(400),
        tap(() => this.guaranteeRequests.update(reqs => [request, ...reqs]))
      )
  }

  updateRequest(request: GuaranteeRequest): Observable<GuaranteeRequest> {
    return of(request).pipe(
      delay(400),
      tap(() => {
        const updated = this.guaranteeRequests().map((rq) => rq.id === request.id ? request : rq)
        this.guaranteeRequests.set(updated)
      })
    )
  }
}
