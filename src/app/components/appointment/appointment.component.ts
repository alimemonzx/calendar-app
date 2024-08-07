import { Component, OnInit, signal, model, inject } from '@angular/core';
import { CalendarStore } from '../../services/store';
import { Subscription } from 'rxjs';
import { CalenderService } from '../../services/calender.service';
import { MatButtonModule } from '@angular/material/button';

import { MatDialog } from '@angular/material/dialog';
import { Appointment } from '../../types/types';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { AppointmentDeleteDialog } from './appointment-delete-dialog';
import { RemoveUnderscorePipe } from '../../pipes/remove-underscore.pipe';

@Component({
  selector: 'app-appointment',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    RemoveUnderscorePipe,
  ],
  templateUrl: './appointment.component.html',
  styleUrl: './appointment.component.scss',
})
export class AppointmentComponent implements OnInit {
  dateSubscriber: Subscription = new Subscription();
  appointments: Appointment[] = [];
  readonly dialog = inject(MatDialog);
  readonly title = model('');
  readonly eventId = signal('');

  constructor(
    private _calendarStore: CalendarStore,
    public _calendarService: CalenderService
  ) {}

  ngOnInit(): void {
    this.dateSubscriber = this._calendarStore.dateSubject$.subscribe((res) => {
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
}
