import { Component, OnInit } from '@angular/core';
import { CalendarStore } from '../services/store';
import { Subscription } from 'rxjs';
import { CalenderService } from '../services/calender.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { Appointment } from '../types/types';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-appointment',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    MatCardModule,
  ],
  templateUrl: './appointment.component.html',
  styleUrl: './appointment.component.scss',
})
export class AppointmentComponent implements OnInit {
  dateSubscriber: Subscription = new Subscription();
  selectedDate: Date = new Date();
  appointmentTitle: string = '';
  appointments: Appointment[] = [];
  months = this._calendarService.months;
  constructor(
    private _calendarStore: CalendarStore,
    public _calendarService: CalenderService
  ) {}

  ngOnInit(): void {
    this.dateSubscriber = this._calendarStore.dateSubject$.subscribe((res) => {
      this.selectedDate = res.selectedDate;
      this.appointments = res.appointments;
    });
  }

  bookAppointment() {
    const appointment: Appointment = {
      id: this._calendarService.createAppointmentId(this.selectedDate),
      date: this.selectedDate,
      title: this.appointmentTitle,
    };
    this._calendarStore.addAppointments(appointment);
  }
}
