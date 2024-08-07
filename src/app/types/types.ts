export interface Appointment {
  identifier: string;
  date: Date;
  title: string;
  start_hour: string;
  end_hour: string;
}

export interface CalendarDate {
  currentDate: Date;
  calendarDays: CalendarDay[];
  appointments: Appointment[];
}

export interface CalendarDay {
  id: string;
  currentMonth: boolean;
  date: Date;
  month: number;
  number: number;
  year: number;
  appointments: Appointment[];
}

export interface DialogData {
  title: string;
  eventId: string;
}

export interface AppointmentForm {
  title: string;
  start_hour: string;
  end_hour: string;
}
