import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GuaranteeService } from '../../guarantee/services/guarantee.service';
import { GuaranteeRequest } from '../../guarantee/models/guarantee.model';
import { MonthlyReportModel, HospitalPerformanceModel, ReportFilter } from '../models/report.model';

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  private guaranteeService = inject(GuaranteeService);

  getMonthlyReportData(filters?: ReportFilter, page?: number, pageSize?: number): Observable<{ data: MonthlyReportModel[]; total: number }> {
    return this.guaranteeService.getGuaranteeRequests().pipe(
      map(requests => {
        let filtered = requests.guaranteeRequests;

        if (filters?.fromDate) {
          const fromStr = this.formatDate(filters.fromDate);
          filtered = filtered.filter(r => r.admissionDate >= fromStr);
        }
        if (filters?.toDate) {
          const toStr = this.formatDate(filters.toDate);
          filtered = filtered.filter(r => r.admissionDate <= toStr);
        }
        if (filters?.treatmentType && filters.treatmentType !== 'all') {
          filtered = filtered.filter(r => r.treatmentType === filters.treatmentType);
        }

        const groups: Record<string, GuaranteeRequest[]> = {};
        filtered.forEach(r => {
          const monthKey = r.admissionDate.substring(0, 7);
          if (!groups[monthKey]) {
            groups[monthKey] = [];
          }
          groups[monthKey].push(r);
        });

        const reportRows: MonthlyReportModel[] = Object.keys(groups).map(month => {
          const items = groups[month];
          const total = items.length;
          const approved = items.filter(i => i.status === 'APPROVED' || i.status === 'PAID').length;
          const rejected = items.filter(i => i.status === 'REJECTED').length;
          const inProgress = items.filter(i => i.status === 'SUBMITTED' || i.status === 'REVIEWING').length;

          const processingDaysList = items
            .map(i => this.getProcessingDays(i))
            .filter((d): d is number => d !== null);

          const sumDays = processingDaysList.reduce((acc, curr) => acc + curr, 0);
          const avgDays = processingDaysList.length > 0
            ? parseFloat((sumDays / processingDaysList.length).toFixed(1))
            : 0;

          const claimedAmount = items.reduce((acc, curr) => acc + curr.estimatedAmount, 0);
          const assessedAmount = items.reduce((acc, curr) => acc + (curr.approvedAmount || 0), 0);

          return {
            month,
            total,
            approved,
            rejected,
            inProgress,
            avgDays,
            claimedAmount,
            assessedAmount
          };
        });

        const sortedRows = reportRows.sort((a, b) => a.month.localeCompare(b.month));
        const total = sortedRows.length;

        let paginatedRows = sortedRows;
        if (page !== undefined && pageSize !== undefined) {
          const startIndex = (page - 1) * pageSize;
          paginatedRows = sortedRows.slice(startIndex, startIndex + pageSize);
        }

        return {
          data: paginatedRows,
          total
        };
      })
    );
  }

  getHospitalPerformanceReportData(filters?: ReportFilter, page?: number, pageSize?: number): Observable<{ data: HospitalPerformanceModel[]; total: number }> {
    return this.guaranteeService.getGuaranteeRequests().pipe(
      map(requests => {
        let filtered = requests.guaranteeRequests;

        if (filters?.fromDate) {
          const fromStr = this.formatDate(filters.fromDate);
          filtered = filtered.filter(r => r.admissionDate >= fromStr);
        }
        if (filters?.toDate) {
          const toStr = this.formatDate(filters.toDate);
          filtered = filtered.filter(r => r.admissionDate <= toStr);
        }
        if (filters?.treatmentType && filters.treatmentType !== 'all') {
          filtered = filtered.filter(r => r.treatmentType === filters.treatmentType);
        }

        const groups: Record<string, GuaranteeRequest[]> = {};
        filtered.forEach(r => {
          const hospitalKey = r.hospital || 'Unknown';
          if (!groups[hospitalKey]) {
            groups[hospitalKey] = [];
          }
          groups[hospitalKey].push(r);
        });

        const reportRows: HospitalPerformanceModel[] = Object.keys(groups).map(hospital => {
          const items = groups[hospital];
          const total = items.length;
          const approved = items.filter(i => i.status === 'APPROVED' || i.status === 'PAID').length;
          const rejected = items.filter(i => i.status === 'REJECTED').length;
          const inProgress = items.filter(i => i.status === 'SUBMITTED' || i.status === 'REVIEWING').length;

          const processingDaysList = items
            .map(i => this.getProcessingDays(i))
            .filter((d): d is number => d !== null);

          const sumDays = processingDaysList.reduce((acc, curr) => acc + curr, 0);
          const avgDays = processingDaysList.length > 0
            ? parseFloat((sumDays / processingDaysList.length).toFixed(1))
            : 0;

          const completed = approved + rejected;
          const onTimeCount = items
            .map(i => this.getProcessingDays(i))
            .filter(d => d !== null && d <= 2.0).length;

          const slaVal = completed > 0 ? Math.round((onTimeCount / completed) * 100) : 100;

          return {
            hospital,
            total,
            approved,
            rejected,
            inProgress,
            avgDays,
            sla: `${slaVal}%`
          };
        });

        const sortedRows = reportRows.sort((a, b) => b.total - a.total);
        const total = sortedRows.length;

        let paginatedRows = sortedRows;
        if (page !== undefined && pageSize !== undefined) {
          const startIndex = (page - 1) * pageSize;
          paginatedRows = sortedRows.slice(startIndex, startIndex + pageSize);
        }

        return {
          data: paginatedRows,
          total
        };
      })
    );
  }

  private getProcessingDays(req: GuaranteeRequest): number | null {
    const submitted = req.timeline.find(e => e.status === 'SUBMITTED');
    const completed = req.timeline.find(e => ['APPROVED', 'REJECTED', 'PAID'].includes(e.status));
    if (submitted && completed) {
      const subTime = new Date(submitted.timestamp).getTime();
      const compTime = new Date(completed.timestamp).getTime();
      const diff = compTime - subTime;
      if (diff >= 0) {
        return parseFloat((diff / (1000 * 60 * 60 * 24)).toFixed(1));
      }
    }
    return null;
  }

  private formatDate(date: string | Date): string {
    if (typeof date === 'string') {
      if (date.includes('T') || date.includes('-')) {
        return date.split('T')[0];
      }
      return date;
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}

