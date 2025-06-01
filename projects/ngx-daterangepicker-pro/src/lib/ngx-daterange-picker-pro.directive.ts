import {
  Directive,
  ElementRef,
  HostListener,
  ComponentRef,
  Injector,
  ApplicationRef,
  signal,
  inject,
  forwardRef
} from '@angular/core';
import { NgxDaterangepickerProComponent } from './ngx-daterangepicker-pro.component';
import { DateRangeModel } from './models/interfaes';
import { createComponent } from '@angular/core';
import dayjs from 'dayjs';
import {
  NG_VALUE_ACCESSOR,
  ControlValueAccessor
} from '@angular/forms';

@Directive({
  selector: '[ngxDaterangePickerPro]',
  standalone: true,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NgxDaterangePickerProDirective),
    multi: true
  }]
})
export class NgxDaterangePickerProDirective implements ControlValueAccessor {
  private calendarRef: ComponentRef<NgxDaterangepickerProComponent> | null = null;
  private isOpen = signal(false);
  private onChange = (value: DateRangeModel) => { };
  private onTouched = () => { };
  private internalValue: DateRangeModel = { from: null, to: null };

  private el = inject(ElementRef<HTMLInputElement>);
  private appRef = inject(ApplicationRef);

  @HostListener('focusin', ['$event'])
  onFocus() {
    this.openCalendarIfNotOpen();
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const clickedInside = this.el.nativeElement.contains(event.target as Node) ||
      this.calendarRef?.location.nativeElement.contains(event.target as Node);

    if (!clickedInside) {
      this.closeCalendar();
    }
  }

  openCalendar() {
    this.isOpen.set(true);

    this.createCalendarComponent();
    this.attachCalendarToDOM();
    this.setInitialRangeFromInput();
    this.validateSelectedRangeWithRangeArray();
    this.positionCalendar();
    this.listenToDateSelection();
  }

  private createCalendarComponent() {
    this.calendarRef = createComponent(NgxDaterangepickerProComponent, {
      environmentInjector: this.appRef.injector
    });
  }

  private attachCalendarToDOM() {
    const calendarEl = this.calendarRef!.location.nativeElement as HTMLElement;
    document.body.appendChild(calendarEl);
    this.appRef.attachView(this.calendarRef!.hostView);
  }

  private setInitialRangeFromInput() {
    const inputValue = this.el.nativeElement.value.trim();
    const [fromStr, toStr] = inputValue.split('-').map((v: string) => v.trim());

    const from = this.parseDate(fromStr) ?? dayjs().toDate();
    const to = this.parseDate(toStr) ?? dayjs().toDate();

    this.calendarRef!.instance.selectedRange = { from, to };
  }

  private parseDate(value: string): Date | null {
    const parsed = dayjs(value, 'DD/MM/YYYY', true);
    return parsed.isValid() ? parsed.toDate() : null;
  }

  private positionCalendar() {
    const calendarEl = this.calendarRef!.location.nativeElement as HTMLElement;
    const inputRect = this.el.nativeElement.getBoundingClientRect();
    const calendarWidth = 511; // Approximate width of the calendar (adjust if dynamic)
    const calendarHeight = 352; // Approximate height of the calendar (adjust if dynamic)
    const margin = 8; // Space between input and calendar

    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    let top = inputRect.bottom + margin + window.scrollY;
    let left = inputRect.left + window.scrollX;

    // Adjust if not enough space below input
    if (inputRect.bottom + calendarHeight + margin > viewportHeight) {
      top = inputRect.top - calendarHeight - margin + window.scrollY;
    }

    // Adjust if calendar overflows right edge
    if (inputRect.left + calendarWidth > viewportWidth) {
      left = viewportWidth - calendarWidth - margin + window.scrollX;
    }

    Object.assign(calendarEl.style, {
      position: 'absolute',
      top: `${top}px`,
      left: `${left}px`,
      zIndex: '1000',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      width: `${calendarWidth}px`
    });
  }


  private listenToDateSelection() {
    this.calendarRef!.instance.dateSelected.subscribe((dateRange: DateRangeModel) => {
      const formatted = this.formatSelectedRange(dateRange);
      this.el.nativeElement.value = formatted;

      // Notify Angular Forms
      this.onChange(dateRange);
      this.onTouched();

      this.closeCalendar();
    });
  }

  private formatSelectedRange(range: DateRangeModel): string {
    const { from, to } = range;

    if (from && to) {
      return `${dayjs(from).format('DD/MM/YYYY')} - ${dayjs(to).format('DD/MM/YYYY')}`;
    }

    return from ? dayjs(from).format('DD/MM/YYYY') : '';
  }

  closeCalendar() {
    this.isOpen.set(false);
    if (this.calendarRef) {
      this.appRef.detachView(this.calendarRef.hostView);
      this.calendarRef.destroy();
      this.calendarRef = null;
    }
  }

  validateSelectedRangeWithRangeArray() {
    const { from, to } = this.calendarRef!.instance.selectedRange;
    let isRangeMatched: boolean = false;
    for (const x of this.calendarRef!.instance.ranges) {
      if (x.from.isSame(from, 'day') && x.to.isSame(to, 'day')) {
        isRangeMatched = true;
        break;
      }
    }
    if (isRangeMatched) {
      return;
    }
    this.calendarRef!.instance.defaultCustomRange = { ...this.calendarRef!.instance.defaultCustomRange, from: dayjs(from), to: dayjs(to) };
  }

  openCalendarIfNotOpen() {
    if (!this.isOpen()) {
      this.openCalendar();
    }
  }

  // ControlValueAccessor
  writeValue(value: DateRangeModel): void {
    this.internalValue = value || { from: null, to: null };
    const fromStr = value?.from ? dayjs(value.from).format('DD/MM/YYYY') : '';
    const toStr = value?.to ? dayjs(value.to).format('DD/MM/YYYY') : '';
    this.el.nativeElement.value = fromStr && toStr ? `${fromStr} - ${toStr}` : fromStr;
  }

  registerOnChange(fn: (value: DateRangeModel) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.el.nativeElement.disabled = isDisabled;
  }
} 
