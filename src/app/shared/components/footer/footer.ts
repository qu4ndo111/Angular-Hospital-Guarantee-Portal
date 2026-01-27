import { Component } from '@angular/core';

import moment from 'moment';

import { environment } from '../../../../environments/environments';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  currentYear = moment().year();
  appVersion = environment.app.version;
}

