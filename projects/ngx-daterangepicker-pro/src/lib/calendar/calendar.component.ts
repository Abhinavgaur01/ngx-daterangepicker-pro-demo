import { Component, OnInit, effect, computed, input, signal, EventEmitter, Output } from '@angular/core';
import dayjs from 'dayjs';
import { calanderViewTypes } from "../models/constants"
import { NgClass } from '@angular/common';
import { DateRangeModel } from '../models/interfaes';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

@Component({
  selector: 'lib-calendar',
  standalone: true,
  imports: [NgClass],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent implements OnInit {
  selectedRange = input<DateRangeModel>({ from: null, to: null });
  @Output() onCustomRangeSelection = new EventEmitter<{ from: any, to: any }>()

  fromDate = signal<Date | null>(null);
  toDate = signal<Date | null>(null);

  dayJs = dayjs;
  currentDate = dayjs();
  weeks: Array<Array<dayjs.Dayjs | null>> = [];
  viewType = signal<string>(calanderViewTypes.Days);
  months: string[] = Array.from({ length: 12 }, (_, i) => dayjs().month(i).format('MMM'));
  startYear = signal<number>(2010);
  years = computed<number[]>(() => Array.from({ length: 20 }, (_, i) => this.startYear() + i));
  calanderViewTypes = calanderViewTypes;

  constructor() {
    // update fromDate toDate on seletedRange changes
    effect(() => {
      const value = this.selectedRange();
      this.fromDate.set(value.from);
      this.toDate.set(value.to);
      this.currentDate = dayjs(value.to) || dayjs(value.from) || this.currentDate;
      this.generateCalendar();
    });
  }

  ngOnInit(): void {
    this.generateCalendar();
  }

  private generateCalendar() {
    const startOfMonth = this.currentDate.startOf('month');
    const endOfMonth = this.currentDate.endOf('month');
    const startDay = startOfMonth.day(); // 0 (Sun) - 6 (Sat)
    const totalDays = endOfMonth.date();

    const days: Array<dayjs.Dayjs | null> = [];

    // Fill empty cells before start of month
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }

    // Fill in the days of the month
    for (let date = 1; date <= totalDays; date++) {
      days.push(startOfMonth.date(date));
    }

    if (endOfMonth.day() != 6) {
      for (let i = endOfMonth.day(); i < 6; i++) {
        days.push(null);
      }
    }

    // Group days into weeks
    this.weeks = [];
    for (let i = 0; i < days.length; i += 7) {
      this.weeks.push(days.slice(i, i + 7));
    }

  }

  prevMonth(): void {
    this.currentDate = this.currentDate.subtract(1, 'month');
    this.generateCalendar();
  }

  nextMonth(): void {
    this.currentDate = this.currentDate.add(1, 'month');
    this.generateCalendar();
  }

  changeViewType(selectedType: string) {
    this.viewType.set(selectedType);
  }

  setMonth(month: number) {
    this.currentDate = this.currentDate.month(month);
    this.viewType.set(calanderViewTypes.Days);
    this.generateCalendar();
  }

  shiftYearRangeBackward() {
    this.startYear.update(value => (value - 10));
  }

  shiftYearRangeForward() {
    this.startYear.update(value => (value + 10));
    console.log(this.startYear());
  }

  onYearSelection(year: number) {
    this.currentDate = this.currentDate.year(year);
    this.viewType.set(calanderViewTypes.Months);
    this.generateCalendar();
  }


  onDateSelection(date: Date | null): void {
    if (!date) {
      return;
    }
    if (this.fromDate() && !this.toDate() && dayjs(date).isAfter(this.fromDate())) {
      this.toDate.set(date);
      this.onCustomRangeSelection.emit({ from: dayjs(this.fromDate()), to: dayjs(this.toDate()) })
    } else {
      this.fromDate.set(date);
      this.toDate.set(null);
    }
  }

}
