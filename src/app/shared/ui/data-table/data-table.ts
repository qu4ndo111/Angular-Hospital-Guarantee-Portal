import { CommonModule } from '@angular/common';
import { Component, ContentChildren, EventEmitter, Input, Output, QueryList, TemplateRef } from '@angular/core';
import { PrimeTemplate, SharedModule } from 'primeng/api';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TableColumn } from './data-table.model';

/**
 * Simple DataTable wrapper component
 *
 * @example
 * <app-data-table
 *   [value]="users"
 *   [columns]="columns"
 * >
 *   <ng-template pTemplate="status" let-rowData>
 *     <span class="badge">{{ rowData.status }}</span>
 *   </ng-template>
 * </app-data-table>
 */
@Component({
  selector: 'app-data-table',
  imports: [
    CommonModule,
    TableModule,
    SharedModule
  ],
  templateUrl: './data-table.html',
  styleUrl: './data-table.scss',
})
export class DataTable<T = any> {
  @Input() value: T[] = [];
  @Input() columns: TableColumn[] = [];
  @Input() loading: boolean = false;
  @Input() paginator: boolean = true;
  @Input() rows: number = 10;
  @Input() rowsPerPageOptions: number[] = [10, 25, 50];
  @Input() selectionMode: 'single' | 'multiple' | null = null;

  @Output() rowSelect = new EventEmitter<T | T[]>();


  private templateMap: Map<string, TemplateRef<any>> = new Map();



  getTemplate(name: string): TemplateRef<any> | null {
    return this.templateMap.get(name) || null;
  }

  hasTemplate(name: string): boolean {
    return this.templateMap.has(name);
  }

  getCellValue(rowData: any, col: TableColumn): string {
    const value = rowData[col.field];
    return value !== null && value !== undefined ? String(value) : '';
  }

}
