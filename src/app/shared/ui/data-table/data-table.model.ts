/**
 * Simple column configuration
 */
export interface TableColumn {
  /** Column field name */
  field: string;

  /** Column header text */
  header: string;

  /** Column width (optional) */
  width?: string;

  /** Enable sorting */
  sortable?: boolean;

  /** Custom template name */
  template?: string;
}
