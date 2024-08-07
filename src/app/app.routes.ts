import { Routes } from '@angular/router';
import { CalendarComponent } from './components/calendar/calendar.component';

export const routes: Routes = [
  { path: '', component: CalendarComponent },
  {
    path: 'book-appointment',
    loadComponent: () =>
      import('./components/book-appointment/book-appointment.component').then(
        (c) => c.BookAppointmentComponent
      ),
  },
  {
    path: 'appointments',
    loadComponent: () =>
      import('./components/appointment/appointment.component').then(
        (c) => c.AppointmentComponent
      ),
  },
];
