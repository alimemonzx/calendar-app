import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CalenderService {
  weekdays = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  constructor() {}
  formatDate(date: Date) {
    return `${date.getDate()} ${
      this.months[date.getMonth()]
    } ${date.getFullYear()}`;
  }

  createId(date: Date) {
    return `${date.getDate()}_${
      this.months[date.getMonth()]
    }_${date.getFullYear()}`;
  }
  createAppointmentId(date: Date) {
    return `${date.getDate()}_${
      this.months[date.getMonth()]
    }_${date.getFullYear()}_a`;
  }
}
