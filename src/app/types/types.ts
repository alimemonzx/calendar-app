export interface Appointment {
  id: string;
  date: Date;
  title: string;
}

export interface CalendarDate {
  currentDate: Date;
  selectedDate: Date;
  calendarDays: CalendarDay[];
  appointments: Appointment[];
}

export interface CalendarDay {
  currentMonth: boolean;
  date: Date;
  month: number;
  number: number;
  year: number;
  appointments: Appointment[];
}
