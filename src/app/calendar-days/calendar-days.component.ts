import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CalendarStore } from '../services/store';
import { Subscription } from 'rxjs';
import { Appointment, CalendarDay } from '../types/types';
import {
  CdkDragDrop,
  CdkDropList,
  CdkDrag,
  moveItemInArray,
  DragDropModule,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-calendar-days',
  standalone: true,
  imports: [CommonModule, CdkDrag, CdkDropList, DragDropModule],
  templateUrl: './calendar-days.component.html',
  styleUrl: './calendar-days.component.scss',
})
export class CalendarDaysComponent implements OnInit {
  firstDayOfMonth: Date;
  currentDays: CalendarDay[];
  dateSubscriber: Subscription = new Subscription();
  dateToday = new Date();
  dropTargetIds = [];
  constructor(private _calendarStore: CalendarStore) {
    this.firstDayOfMonth = new Date();
    this.currentDays = [];
    this.dateToday.setHours(0, 0, 0, 0);
  }
  items = [
    'Zero',
    'One',
    'Two',
    'Three',
    'Four',
    'Five',
    'Six',
    'Seven',
    'Eight',
    'Nine',
  ];

  ngOnInit(): void {
    this.dateSubscriber = this._calendarStore.dateSubject$.subscribe((res) => {
      this.currentDays = res.calendarDays;
    });
  }

  changeDate(date: Date) {
    this._calendarStore.changeSelectedDate(date);
  }

  ngOnDestroy() {
    this.dateSubscriber.unsubscribe();
  }

  drop($event: CdkDragDrop<CalendarDay[]>) {
    console.log($event);
  }
}
