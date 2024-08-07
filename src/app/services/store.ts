import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Appointment, CalendarDate, CalendarDay } from '../types/types';
import { CalenderService } from './calender.service';

@Injectable({ providedIn: 'root' })
export class CalendarStore {
  private messageSubject = new BehaviorSubject<CalendarDate>({
    currentDate: new Date(),
    calendarDays: [],
    appointments: [
      {
        identifier: '5_August_2024_10:15_AM_10:30_AM',
        title: 'Meeting with Lane',
        date: new Date('2024-08-05'),
        start_hour: '10:15_AM',
        end_hour: '10:30_AM',
      },
      {
        identifier: '3_August_2024_11:25_PM_11:30_PM',
        title: 'Meeting with Ali',
        date: new Date('2024-08-03'),
        start_hour: '11:25_PM',
        end_hour: '11:30_PM',
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
      const dayAppointments = appointments.filter((app) => {
        let dayId = this._calendarService.createId(app.date);
        return dayId === day.id;
      });

      dayAppointments.forEach((appointment) => {
        if (
          !day.appointments.some(
            (app) => app.identifier === appointment.identifier
          )
        ) {
          day.appointments.push(appointment);
        }
      });
    });

    this.messageSubject.next({
      ...this.messageSubject.value,
      calendarDays,
    });
  }

  moveAppointment(fromIdx: number, toIdx: number, appointmentId: string) {
    const currentDays = this.messageSubject.value.calendarDays;
    const appointmentToMoveIndex = currentDays[fromIdx].appointments.findIndex(
      (app) => app.identifier === appointmentId
    );

    const appointmentToMove =
      currentDays[fromIdx].appointments[appointmentToMoveIndex];
    const updatedAppointment: Appointment = {
      ...appointmentToMove,
      date: currentDays[toIdx].date,
      identifier: this._calendarService.createAppointmentId(
        currentDays[toIdx].date,
        appointmentToMove.start_hour,
        appointmentToMove.end_hour
      ),
    };
    currentDays[fromIdx].appointments.splice(appointmentToMoveIndex, 1);
    currentDays[toIdx].appointments.push(updatedAppointment);

    // Updates the time in appointments array
    const appointmentToUpdateIndex =
      this.messageSubject.value.appointments.findIndex((appointment) => {
        appointment.identifier === appointmentId;
      });
    const appointments = this.messageSubject.value.appointments;
    appointments.splice(appointmentToUpdateIndex, 1, updatedAppointment);

    this.messageSubject.next({
      ...this.messageSubject.value,
      calendarDays: currentDays,
      appointments: appointments,
    });
  }

  deleteAppointments(id: string) {
    const appointments = this.messageSubject.value.appointments.filter(
      (appointment) => appointment.identifier !== id
    );
    const currentDays = this.messageSubject.value.calendarDays.map((day) => {
      let appointments = day.appointments.filter(
        (appointment) => appointment.identifier != id
      );
      day.appointments = appointments;
      return day;
    });
    this.messageSubject.next({
      ...this.messageSubject.value,
      appointments: appointments,
      calendarDays: currentDays,
    });
  }
}
