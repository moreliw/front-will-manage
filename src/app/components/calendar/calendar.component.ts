class InfoDays {
  constructor(
    public day?: number,
    public month?: number,
    public year?: number,
    public type?: string,
    public selected?: boolean,
    public hasAppointment?: boolean
  ) {}
}

import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {
  today: Date = new Date();
  fixToday: Date = new Date();
  weeks: InfoDays[][] | undefined;
  daysInMonth: InfoDays[] = [];
  daySelected: number | undefined;

  param = {
    page: 1,
    pageSize: 20,
    idCustomer: null,
  };

  @Output() daySelect: EventEmitter<Date> = new EventEmitter<Date>();

  constructor() {}

  ngOnInit() {
    // this.getCustomerId();
    this.getMonthDays(this.today.getFullYear(), this.today.getMonth());
    this.daySelected = this.today.getDate();
    const selectedDate = new Date(
      this.today.getFullYear(),
      this.today.getMonth(),
      this.daySelected
    );
    this.daySelect.emit(selectedDate);

    // this.getDaysWithAppointments();
  }

  // getCustomerId() {
  //   this.param.idCustomer = this.customerLoggedService.getIdCustomer();
  // }

  selecionarData(day: InfoDays): void {
    if (day.type === 'previous') {
      this.previousMonth();
    }

    if (day.type === 'next') {
      this.nextMonth();
    }
    this.daysInMonth.forEach((d) => (d.selected = false));
    day.selected = true;
    this.daySelected = day.day;
    const selectedDate = new Date(
      this.today.getFullYear(),
      this.today.getMonth(),
      day.day
    );
    this.daySelect.emit(selectedDate);
  }

  getMonthDays(year: number, month: number): void {
    const days: InfoDays[] = [];
    const firstDay = new Date(year, month, 1);
    const lastDayPreviousMonth = new Date(year, month, 0);
    const lastDay = new Date(year, month + 1, 0);

    for (let i = firstDay.getDay() - 1; i >= 0; i--) {
      days.push({
        day: lastDayPreviousMonth.getDate() - i,
        month: lastDayPreviousMonth.getMonth(),
        year: lastDayPreviousMonth.getFullYear(),
        type: 'previous',
        hasAppointment: false,
      });
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({
        day: i,
        month: month,
        year: year,
        type: 'current',
        selected: i === this.today.getDate() && month === this.today.getMonth(),
        hasAppointment: false,
      });
    }

    const nextMonthDays = 7 - (days.length % 7);
    if (nextMonthDays < 7) {
      for (let i = 1; i <= nextMonthDays; i++) {
        days.push({
          day: i,
          month: month + 1,
          year: month === 11 ? year + 1 : year,
          type: 'next',
          hasAppointment: false,
        });
      }
    }

    this.daysInMonth = days;
    this.weeks = this.getDaysInWeeks(this.daysInMonth);
  }

  getDaysInWeeks(days: InfoDays[]): InfoDays[][] {
    const weeks: InfoDays[][] = [];

    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }

    return weeks;
  }

  nextMonth(): void {
    const date = moment(this.today).add(1, 'month').toDate();
    this.today = date;
    this.daysInMonth = [];
    this.weeks = [];
    this.getMonthDays(date.getFullYear(), date.getMonth());
  }

  previousMonth(): void {
    const date = moment(this.today).subtract(1, 'month').toDate();
    this.today = date;
    this.daysInMonth = [];
    this.getMonthDays(date.getFullYear(), date.getMonth());
  }

  returnMonthName(month: number): string {
    const months = [
      'Janeiro',
      'Fevereiro',
      'Março',
      'Abril',
      'Maio',
      'Junho',
      'Julho',
      'Agosto',
      'Setembro',
      'Outubro',
      'Novembro',
      'Dezembro',
    ];

    return months[month];
  }

  reuturnMonthAndYear(): string {
    return `${this.returnMonthName(
      this.today.getMonth()
    )} ${this.today.getFullYear()}`;
  }

  // getDaysWithAppointments(): void {
  //   this.schedulingService
  //     .getDaysWithScheduledAppointments(this.param)
  //     .subscribe({
  //       next: (days: any) => {
  //         this.markDaysWithAppointments(days.data);
  //       },
  //       error: () => {},
  //     });
  // }

  markDaysWithAppointments(daysWithAppointments: string[]): void {
    this.daysInMonth.forEach((day) => {
      const dayDate = new Date(day.year, day.month, day.day);
      const dayDateString = dayDate.toISOString().split('T')[0];
      day.hasAppointment = daysWithAppointments.includes(dayDateString);
    });
  }
}
