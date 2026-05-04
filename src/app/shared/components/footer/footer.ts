import { Component } from '@angular/core';

import dayjs from 'dayjs';

import { environment } from '../../../../environments/environments';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  currentYear = dayjs().year();
  appVersion = environment.app.version;
}

