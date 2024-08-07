import { Component } from '@angular/core';
import { CalenderService } from '../../services/calender.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { Appointment } from '../../types/types';
import { CalendarStore } from '../../services/store';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-book-appointment',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatRadioModule,
    MatButtonModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './book-appointment.component.html',
  styleUrl: './book-appointment.component.scss',
})
export class BookAppointmentComponent {
  end_hours: string[] = [];
  months = this._calendarService.months;

  constructor(
    public _calendarService: CalenderService,
    private _formBuilder: FormBuilder,
    private _calendarStore: CalendarStore,
    private _router: Router
  ) {}

  meetingForm = this._formBuilder.group({
    date: [new Date(), { validators: [Validators.required], updateOn: 'blur' }],
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
    title: ['', { validators: [Validators.minLength(5)], updateOn: 'change' }],
  });
  selectStartHour($event: MatSelectChange) {
    this.meetingForm.controls.end_hour.enable();
    const index = this._calendarService.formattedHours.findIndex(
      (hour) => $event.value == hour
    );
    this.end_hours = this._calendarService.formattedHours.slice(index + 1);
  }

  bookAppointment() {
    if (this.meetingForm.valid) {
      const formValues = this.meetingForm.value;
      const appointment: Appointment = {
        identifier: this._calendarService.createAppointmentId(
          formValues.date!,
          formValues.start_hour!,
          formValues.end_hour!
        ),
        date: formValues.date!,
        title: formValues.title!,
        start_hour: formValues.start_hour!,
        end_hour: formValues.end_hour!,
      };
      this._calendarStore.addAppointments(appointment);
      this.meetingForm.reset();
      this._router.navigate(['/']);
    } else {
      this.meetingForm.controls.title.setErrors({ incorrect: true });
    }
  }
}
