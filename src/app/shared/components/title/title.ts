import { Component, Input } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';

@Component({
  selector: 'app-title',
  imports: [Breadcrumb],
  templateUrl: './title.html',
  styleUrl: './title.scss',
})
export class Title {
  @Input() title: string = '';
  @Input() menu: MenuItem[] = [];
}
