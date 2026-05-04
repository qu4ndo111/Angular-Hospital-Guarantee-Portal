import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { TranslocoModule } from '@jsverse/transloco';

import { AccordionModule } from 'primeng/accordion';
import { BadgeModule } from 'primeng/badge';
import { RippleModule } from 'primeng/ripple';
import { DrawerModule } from 'primeng/drawer';
import { LayoutService } from '@app/shared/services/layout.service';
import { MENU_ITEMS, MenuItem, hasChildren } from '@app/core/config/menu';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule, AccordionModule, BadgeModule, RippleModule, TranslocoModule, DrawerModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  constructor(public layoutService: LayoutService) {}
 
  menuItems: MenuItem[] = MENU_ITEMS;

  hasChildren = hasChildren;
}

