import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CalendarDaysComponent } from '../calendar-days/calendar-days.component';
import { MatIconModule } from '@angular/material/icon';
import { CalendarStore } from '../../services/store';
import { CalenderService } from '../../services/calender.service';
import { MatButtonModule } from '@angular/material/button';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    CommonModule,
    CalendarDaysComponent,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
})
export class CalendarComponent implements OnInit {
  constructor(
    private _calendarStore: CalendarStore,
    private _calendarService: CalenderService
  ) {}
  weekdays = this._calendarService.weekdays;
  months = this._calendarService.months;
  currentDay: Date = new Date('2021-08-09');
  dateSubscriber: Subscription = new Subscription();

  ngOnInit(): void {
    this.dateSubscriber = this._calendarStore.dateSubject$.subscribe((res) => {
      this.currentDay = res.currentDate;
    });
  }
  prevMonth() {
    let prevMonthDate = new Date(
      this.currentDay.getFullYear(),
      this.currentDay.getMonth() - 1,
      1
    );
    this._calendarStore.changeCurrentDate(prevMonthDate);
  }
  nextMonth() {
    let prevMonthDate = new Date(
      this.currentDay.getFullYear(),
      this.currentDay.getMonth() + 1,
      1
    );
    this._calendarStore.changeCurrentDate(prevMonthDate);
  }
  ngOnDestroy(): void {
    this.dateSubscriber.unsubscribe();
  }
}
