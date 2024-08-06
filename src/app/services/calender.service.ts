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
  hours = [
    '00',
    '01',
    '02',
    '03',
    '04',
    '05',
    '06',
    '07',
    '08',
    '09',
    '10',
    '11',
  ];

  minutes = ['00', '15', '30', '45'];
  formattedHours: string[] = [];

  generateFormattedHours() {
    for (let i = 0; i < this.hours.length * 2; i++) {
      const hourIndex = i % this.hours.length;
      const period = i < 12 ? 'AM' : 'PM';

      for (let j = 0; j < this.minutes.length; j++) {
        this.formattedHours.push(
          `${this.hours[hourIndex]}:${this.minutes[j]} ${period}`
        );
      }
    }
  }

  constructor() {
    this.generateFormattedHours();
  }
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

  createAppointmentId(date: Date, start_hour: string, end_hour: string) {
    return `${date.getDate()}_${
      this.months[date.getMonth()]
    }_${date.getFullYear()}_${start_hour.split(' ').join('_')}_${end_hour
      .split(' ')
      .join('_')}`;
  }
}
