import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Appointment, CalendarDate, CalendarDay } from '../types/types';
import { CalenderService } from './calender.service';

@Injectable({ providedIn: 'root' })
export class CalendarStore {
  private messageSubject = new BehaviorSubject<CalendarDate>({
    currentDate: new Date(),
    selectedDate: new Date(),
    calendarDays: [],
    appointments: [
      {
        id: '5_August_2024_a',
        title: 'Meeting with Lane',
        date: new Date('2024-08-05'),
      },
      {
        id: '3_August_2024_a',
        title: 'Meeting with Ali',
        date: new Date('2024-08-03'),
      },
    ],
  });

  constructor(private _calendarService: CalenderService) {
    this.generateCalendarDays(this.messageSubject.value.currentDate);
    this.addAppointmentsToCalendar();
  }
  dateSubject$ = this.messageSubject.asObservable();
  changeCurrentDate(date: Date) {
    this.messageSubject.next({
      ...this.messageSubject.value,
      currentDate: date,
    });
    this.generateCalendarDays(date);
    this.addAppointmentsToCalendar();
  }
  changeSelectedDate(date: Date) {
    this.messageSubject.next({
      ...this.messageSubject.value,
      selectedDate: date,
    });
  }
  addAppointments(appointment: Appointment) {
    let localAppointments = [...this.messageSubject.value.appointments];
    localAppointments.push(appointment);
    this.messageSubject.next({
      ...this.messageSubject.value,
      appointments: localAppointments,
    });
    this.addAppointmentsToCalendar();
  }

  generateCalendarDays(currentDay: Date): void {
    const firstDayOfMonth = new Date(
      currentDay.getFullYear(),
      currentDay.getMonth(),
      1
    );
    const currentDays: CalendarDay[] = [];
    const weekdayOfFirstDay = firstDayOfMonth.getDay();
    let date = new Date(firstDayOfMonth);
    if (weekdayOfFirstDay === 0) {
      date.setDate(date.getDate() - 7);
    }
    for (let day = 0; day < 42; day++) {
      if (day == 0) {
        date.setDate(date.getDate() + (day - weekdayOfFirstDay));
      } else if (day > 0) {
        date.setDate(date.getDate() + 1);
      }
      const calendarDay: CalendarDay = {
        id: this._calendarService.createId(date),
        currentMonth: date.getMonth() === currentDay.getMonth(),
        date: new Date(date),
        month: date.getMonth(),
        number: date.getDate(),
        year: date.getFullYear(),
        appointments: [],
      };
      currentDays.push(calendarDay);
    }
    this.messageSubject.next({
      ...this.messageSubject.value,
      calendarDays: currentDays,
    });
  }

  addAppointmentsToCalendar() {
    const { calendarDays, appointments } = this.messageSubject.value;

    calendarDays.forEach((day) => {
      const appointmentId = this._calendarService.createAppointmentId(day.date);

      const appointment = appointments.find((app) => app.id === appointmentId);

      if (
        appointment &&
        !day.appointments.some((app) => app.id === appointmentId)
      ) {
        day.appointments.push(appointment);
      }
    });
    this.messageSubject.next({
      ...this.messageSubject.value,
      calendarDays,
    });
  }

  moveAppointments(fromIdx: number, toIdx: number) {
    const currentDays = this.messageSubject.value.calendarDays;
    var appointment = currentDays[fromIdx].appointments;
    appointment[0].date = currentDays[toIdx].date;
    appointment[0].id = this._calendarService.createAppointmentId(
      currentDays[toIdx].date
    );
    currentDays[fromIdx].appointments = [];
    currentDays[toIdx].appointments = appointment;
    this.messageSubject.next({
      ...this.messageSubject.value,
      calendarDays: currentDays,
    });
  }

  deleteAppointments(id: string) {
    const appointments = this.messageSubject.value.appointments.filter(
      (appointment) => appointment.id !== id
    );
    const currentDays = this.messageSubject.value.calendarDays.map((day) => {
      if (day.id === id.slice(0, -2)) {
        day.appointments = [];
      }
      return day;
    });
    this.messageSubject.next({
      ...this.messageSubject.value,
      appointments: appointments,
      calendarDays: currentDays,
    });
  }
}
