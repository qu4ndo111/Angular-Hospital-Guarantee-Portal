import { Component, OnInit } from '@angular/core';
import { Card } from '@app/shared/ui/card/card';
import { Title } from '@app/shared/components/title/title';
import { TranslocoPipe } from '@jsverse/transloco';
import { AsyncPipe } from '@angular/common';
import { Observable, map } from 'rxjs';
import { GuaranteeService } from '../guarantee/services/guarantee.service';

@Component({
  selector: 'app-dashboard',
  imports: [Card, Title, TranslocoPipe, AsyncPipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  stats$!: Observable<{
    total: number;
    reviewing: number;
    approved: number;
    rejected: number;
  }>;

  constructor(private guaranteeService: GuaranteeService) { }

  ngOnInit() {
    this.stats$ = this.guaranteeService.getGuaranteeRequests().pipe(
      map(requests => {
        return {
          total: requests.length,
          reviewing: requests.filter(r => r.status === 'SUBMITTED' || r.status === 'REVIEWING').length,
          approved: requests.filter(r => r.status === 'APPROVED' || r.status === 'PAID').length,
          rejected: requests.filter(r => r.status === 'REJECTED').length,
        };
      })
    );
  }
}
