import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CalendarComponent } from "./calendar/calendar.component";
import { DateRangeModel } from './models/interfaes';
import dayjs from 'dayjs';
import { Subject } from 'rxjs';

@Component({
  selector: 'ngx-daterangepicker-pro',
  standalone: true,
  imports: [CalendarComponent],
  templateUrl: './ngx-daterangepicker-pro.component.html',
  styleUrls: [`./ngx-daterangepicker-pro.component.scss`]
})
export class NgxDaterangepickerProComponent {
  private currentDate = dayjs().startOf('day').toDate()
  @Input() selectedRange: DateRangeModel = { from: this.currentDate, to: this.currentDate };
  @Output() dateSelected = new EventEmitter<DateRangeModel>();

  ranges = [{
    label: 'Today',
    from: dayjs(),
    to: dayjs()
  }, {
    label: 'Yesterday',
    from: dayjs().subtract(1, 'day'),
    to: dayjs().subtract(1, 'day')
  },
  {
    label: 'This week',
    from: dayjs().subtract(7, 'day'),
    to: dayjs()
  },
  {
    label: 'Last week',
    from: dayjs().subtract(14, 'day'),
    to: dayjs().subtract(7, 'day')
  },
  {
    label: 'this Month',
    from: dayjs().startOf('month'),
    to: dayjs().endOf('month')
  },
  {
    label: 'Last Month',
    from: dayjs().subtract(1, 'month').startOf('month'),
    to: dayjs().subtract(1, 'month').endOf('month')
  },
  {
    label: 'Last 90 Days',
    from: dayjs().subtract(90, 'day'),
    to: dayjs()
  },
  {
    label: 'This Year',
    from: dayjs().startOf('year'),
    to: dayjs().endOf('year')
  },
  {
    label: 'Last Year',
    from: dayjs().subtract(1, 'year').startOf('year'),
    to: dayjs().subtract(1, 'year').endOf('year')
  }
  ]

  defaultCustomRange = {
    label: 'Custom',
    from: dayjs().subtract(1, 'day'),
    to: dayjs()
  }


  public setRange(range: any, isCustomRange: boolean = false, publishEvent: boolean = true): void {
    if (isCustomRange) {
      this.defaultCustomRange.from = range.from;
      this.defaultCustomRange.to = range.to;
    }
    this.selectedRange = { from: range.from.toDate(), to: range.to.toDate() };
    if (!publishEvent) {
      return;
    }
    this.dateSelected.emit(this.selectedRange);
  }


}
