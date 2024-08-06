import { Component, OnInit, signal, model, inject } from '@angular/core';
import { CalendarStore } from '../../services/store';
import { Subscription } from 'rxjs';
import { CalenderService } from '../../services/calender.service';
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
import { Appointment, AppointmentForm } from '../../types/types';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { AppointmentDeleteDialog } from './appointment-delete-dialog';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { values } from 'cypress/types/lodash';
import { RemoveUnderscorePipe } from '../../pipes/remove-underscore.pipe';

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
    MatSelectModule,
    MatRadioModule,
    RemoveUnderscorePipe,
  ],
  templateUrl: './appointment.component.html',
  styleUrl: './appointment.component.scss',
})
export class AppointmentComponent implements OnInit {
  dateSubscriber: Subscription = new Subscription();
  selectedDate: Date = new Date();
  appointments: Appointment[] = [];
  months = this._calendarService.months;
  end_hours: string[] = [];
  readonly dialog = inject(MatDialog);
  readonly title = model('');
  readonly eventId = signal('');

  constructor(
    private _calendarStore: CalendarStore,
    public _calendarService: CalenderService,
    private _formBuilder: FormBuilder
  ) {}

  meetingForm = this._formBuilder.group({
    start_hour: [
      '',
      {
        validators: [Validators.required],
        updateOn: 'blur',
      },
    ],
    end_hour: [
      '',
      {
        validators: [Validators.required],
        updateOn: 'blur',
      },
    ],
    title: [
      '',
      {
        validators: [Validators.minLength(5)],
        updateOn: 'change',
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

  selectStartHour($event: MatSelectChange) {
    this.meetingForm.controls.end_hour.enable();
    const index = this._calendarService.formattedHours.findIndex(
      (hour) => $event.value == hour
    );
    this.end_hours = this._calendarService.formattedHours.slice(index + 1);
  }

  deleteAppointment(id: string) {
    this._calendarStore.deleteAppointments(id);
  }
  bookAppointment() {
    if (this.meetingForm.valid) {
      const formValues = this.meetingForm.value;
      const appointment: Appointment = {
        identifier: this._calendarService.createAppointmentId(
          this.selectedDate,
          formValues.start_hour!,
          formValues.end_hour!
        ),
        date: this.selectedDate,
        title: formValues.title!,
        start_hour: formValues.start_hour!,
        end_hour: formValues.end_hour!,
      };
      this._calendarStore.addAppointments(appointment);
      this.meetingForm.reset();
    } else {
      this.meetingForm.controls.title.setErrors({ incorrect: true });
    }
  }
}
