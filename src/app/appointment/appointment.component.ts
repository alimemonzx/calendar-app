import { Component, OnInit, signal, model, inject } from '@angular/core';
import { CalendarStore } from '../services/store';
import { Subscription } from 'rxjs';
import { CalenderService } from '../services/calender.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Appointment } from '../types/types';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { AppointmentDeleteDialog } from './appointment-delete-dialog';

@Component({
  selector: 'app-appointment',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    MatCardModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './appointment.component.html',
  styleUrl: './appointment.component.scss',
})
export class AppointmentComponent implements OnInit {
  dateSubscriber: Subscription = new Subscription();
  selectedDate: Date = new Date();
  appointments: Appointment[] = [];
  months = this._calendarService.months;

  readonly dialog = inject(MatDialog);
  readonly title = model('');
  readonly eventId = signal('');

  constructor(
    private _calendarStore: CalendarStore,
    public _calendarService: CalenderService,
    private _formBuilder: FormBuilder
  ) {}

  meetingForm = this._formBuilder.group({
    title: [
      '',
      {
        validators: [Validators.minLength(5)],
        updateOn: 'blur',
      },
    ],
  });

  ngOnInit(): void {
    this.dateSubscriber = this._calendarStore.dateSubject$.subscribe((res) => {
      this.selectedDate = res.selectedDate;
      this.appointments = res.appointments;
    });
  }
  openDialog(title: string, id: string): void {
    const dialogRef = this.dialog.open(AppointmentDeleteDialog, {
      data: { title: title, eventId: id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        this.deleteAppointment(result);
      }
    });
  }
  deleteAppointment(id: string) {
    this._calendarStore.deleteAppointments(id);
  }
  bookAppointment() {
    if (this.meetingForm.valid && this.meetingForm.controls.title.value) {
      const appointment: Appointment = {
        id: this._calendarService.createId(this.selectedDate),
        date: this.selectedDate,
        title: this.meetingForm.controls.title.value!,
      };
      this._calendarStore.addAppointments(appointment);
      this.meetingForm.controls.title.setValue('');
    } else {
      this.meetingForm.controls.title.setErrors({ incorrect: true });
    }
  }
}
