# ngx-daterangepicker-pro

A powerful, customizable Angular date range picker built with Angular 17+ and Day.js.

![npm version](https://img.shields.io/npm/v/ngx-daterangepicker-pro.svg)
![Angular](https://img.shields.io/badge/angular-17%2B-red)
![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)

---

## ✨ Features

- 🔥 Clean and modern date range selection
- 📅 Supports predefined and custom ranges
- 🎨 Fully customizable styles
- 🔄 Two-way binding with `FormControl` and `ngModel`
- 🧩 Lightweight (uses [Day.js](https://day.js.org/))

---

## 📦 Installation

Install via npm:

```bash
npm install ngx-daterangepicker-pro dayjs
```

---

## 🚀 Usage

### 1. Import the Directive

#### In a Module:

```ts
import { NgxDaterangePickerProDirective } from 'ngx-daterangepicker-pro';

@NgModule({
  imports: [NgxDaterangePickerProDirective]
})
export class AppModule {}
```

#### Or in a Standalone Component:

```ts
import { Component } from '@angular/core';
import { NgxDaterangePickerProDirective } from 'ngx-daterangepicker-pro';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [NgxDaterangePickerProDirective],
  templateUrl: './app.component.html'
})
export class AppComponent {}
```

---

### 2. Template Usage with Reactive Forms

```html
<form [formGroup]="form">
  <input type="text" ngxDaterangePickerPro formControlName="range" />
</form>

<p>
  Selected Range:
  {{ form.get('range')?.value?.from | date: 'dd/MM/yyyy' }} -
  {{ form.get('range')?.value?.to | date: 'dd/MM/yyyy' }}
</p>
```

---

### 3. Component Code

```ts
import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { DateRangeModel } from 'ngx-daterangepicker-pro';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  form = new FormGroup({
    range: new FormControl<DateRangeModel>({ from: null, to: null })
  });
}
```

---

## 🧪 Development

To run the demo app locally:

```bash
npm install
ng serve
```

Then open [http://localhost:4200](http://localhost:4200) in your browser.

