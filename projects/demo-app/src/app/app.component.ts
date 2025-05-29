import { Component } from '@angular/core';
import { NgxDaterangePickerProDirective } from '../../../ngx-daterangepicker-pro/src/lib/ngx-daterange-picker-pro.directive';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DatePipe, JsonPipe } from '@angular/common';
import dayjs from 'dayjs';
import { DateRangeModel } from '../../../ngx-daterangepicker-pro/src/lib/models/interfaes';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgxDaterangePickerProDirective, ReactiveFormsModule, DatePipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'demo-app';

  form = new FormGroup({
    range: new FormControl<DateRangeModel | null>(null),
  });
}
