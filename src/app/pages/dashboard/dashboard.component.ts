import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { InfoScheduleComponent } from 'src/app/components/info-schedule/info-schedule.component';
import {
  EScheduleStatus,
  EScheduleStatusColors,
  EScheduleStatusLabel,
} from 'src/app/models/Enum/EScheduleStatus';
import { Schedule, ScheduleGrid } from 'src/app/models/schedule';
import { ScheduleService } from 'src/app/service/schedule.service';
import { UtilService } from 'src/app/service/util.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  hamBurger = document.querySelector('.toggle-btn');
  scheduleList: Schedule[] = [];
  loading = false;
  selectedFilter = 1;
  EScheduleStatusLabel = EScheduleStatusLabel;
  page = {
    limit: 10,
    count: 0,
    offset: 0,
    descricao: '',
    ativo: true,
  };
  scheduleGrid: ScheduleGrid;
  selectWeekDate = new Date();
  weekDays: Array<{ name: string; date: string }> = [];

  appointments = {
    Segunda: [],
    Terça: [],
    Quarta: [],
    Quinta: [],
    Sexta: [],
  };

  placeholders = Array(6).fill(null);

  dayOfWeekMapping: { [key: string]: string } = {
    'segunda-feira': 'Segunda',
    'terça-feira': 'Terça',
    'quarta-feira': 'Quarta',
    'quinta-feira': 'Quinta',
    'sexta-feira': 'Sexta',
  };
  constructor(
    private router: Router,
    private scheduleService: ScheduleService,
    private dialog: MatDialog,
    private util: UtilService
  ) {}

  ngOnInit(): void {
    this.loadWeekSchedule();
    this.loadSchedule();
  }

  loadSchedule() {
    this.loading = true;
    this.scheduleService.getScheduleList(0, this.page).subscribe((result) => {
      this.scheduleGrid = result;
      this.scheduleList = result.scheduleList;
      this.loading = false;
    });
  }

  updateAppointments(schedules: Schedule[]) {
    schedules.forEach((schedule) => {
      const scheduleDate = new Date(schedule.scheduleDate);
      const dayOfWeekFull = scheduleDate.toLocaleDateString('pt-BR', {
        weekday: 'long',
      });
      const dayOfWeek = this.dayOfWeekMapping[dayOfWeekFull];

      if (dayOfWeek && this.appointments[dayOfWeek]) {
        const durationInMinutes = this.convertDurationToMinutes(
          schedule.duration || '00:30:00'
        );
        const endTime = new Date(
          scheduleDate.getTime() + durationInMinutes * 60000
        );
        this.appointments[dayOfWeek].push({
          time: `${this.formatTime(scheduleDate)} - ${this.formatTime(
            endTime
          )}`,
          name: schedule.customer.name,
          scheduleId: schedule.id,
          status: schedule.status,
          dentist: schedule.responsible?.name,
        });
      } else {
        console.warn('Invalid day:', dayOfWeekFull);
      }
    });
  }
  tooltipInfo(info) {
    return EScheduleStatusLabel[info.status];
  }

  onTooltipMouseEnter(event: MouseEvent) {
    event.stopPropagation();
  }

  convertDurationToMinutes(duration: string): number {
    const [hours, minutes] = duration.split(':').map(Number);
    return hours * 60 + minutes;
  }

  loadWeekSchedule() {
    this.appointments = {
      Segunda: [],
      Terça: [],
      Quarta: [],
      Quinta: [],
      Sexta: [],
    };
    this.loading = true;
    console.log(this.selectWeekDate);
    this.scheduleService
      .getSchedulesForWeek(this.selectWeekDate, this.page)
      .subscribe((result) => {
        this.updateAppointments(result.scheduleList);
        this.generateWeekDays();
        this.loading = false;
      });
  }

  isToday(day: string): boolean {
    const today = new Date();
    const todayFormatted = today.toISOString().split('T')[0];
    return day === todayFormatted;
  }

  toggle() {
    document.querySelector('#sidebar').classList.toggle('expand');
  }

  newCustomer() {
    this.router.navigate(['/customers/new']);
  }

  newSchedule() {
    this.router.navigate(['/schedule/new']);
  }

  applyFilter(filter: number) {
    this.selectedFilter = filter;
  }

  generateWeekDays(): void {
    const startOfWeek = this.getMonday(this.selectWeekDate);

    this.weekDays = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'].map(
      (day, index) => {
        const currentDay = new Date(startOfWeek);
        currentDay.setDate(startOfWeek.getDate() + index);
        return {
          name: day,
          date: currentDay.toISOString().split('T')[0],
        };
      }
    );
  }

  getMonday(date: Date): Date {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  }

  formatDate(datetime: string): string {
    const date = new Date(datetime);
    const localDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    );
    return localDate.toLocaleDateString();
  }

  formatTime(date: Date): string {
    const datelocal = new Date(date);
    const localDate = new Date(
      datelocal.getTime() - datelocal.getTimezoneOffset() * 60000
    );

    return localDate.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  navigateToServicosPage(): void {
    this.router.navigate(['/servicos']);
  }

  goTo(path: string) {
    this.router.navigate(['/' + path]);
  }

  onDaySelect(date: Date): void {}

  addScheduleOnDay(day: { name: string; date: string }, scheduleId?: string) {
    const queryParams: any = { day: day.date };
    if (scheduleId) {
      queryParams.scheduleId = scheduleId;
    }

    this.router.navigate(['/schedule/new'], { queryParams });
  }

  goToPreviousWeek() {
    this.selectWeekDate = this.addWeeks(this.selectWeekDate, -1);
    this.loadWeekSchedule();
  }

  goToNextWeek() {
    this.selectWeekDate = this.addWeeks(this.selectWeekDate, 1);
    this.loadWeekSchedule();
  }

  addWeeks(date: Date, weeks: number): Date {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + weeks * 7);
    return newDate;
  }

  getWeekLabel(): string {
    const startOfWeek = this.getStartOfWeek(this.selectWeekDate);
    const endOfWeek = this.getEndOfWeek(this.selectWeekDate);

    return `${this.formatDate(startOfWeek.toISOString())} - ${this.formatDate(
      endOfWeek.toISOString()
    )}`;
  }

  getStartOfWeek(date: Date): Date {
    const start = new Date(date);
    const day = start.getDay();
    const difference = (day === 0 ? 7 : day) - 1;
    start.setDate(start.getDate() - difference);
    return start;
  }

  getEndOfWeek(date: Date): Date {
    const startOfWeek = this.getStartOfWeek(date);
    const endOfWorkWeek = new Date(startOfWeek);
    endOfWorkWeek.setDate(startOfWeek.getDate() + 4);
    return endOfWorkWeek;
  }

  getColorByStatus(status: EScheduleStatus): string {
    return EScheduleStatusColors[status] || '#2c5aa0';
  }

  info(scheduleId: any, event: MouseEvent) {
    event.stopPropagation();
    const data = {
      id: scheduleId,
    };
    this.dialog.open(InfoScheduleComponent, {
      width: '500px',
      data: data,
    });
  }
}
