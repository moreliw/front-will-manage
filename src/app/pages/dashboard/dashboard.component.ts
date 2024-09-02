import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EScheduleStatusLabel } from 'src/app/models/Enum/EScheduleStatus';
import { Schedule, ScheduleGrid } from 'src/app/models/schedule';
import { ScheduleService } from 'src/app/service/schedule.service';

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
  weekDays = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];

  appointments = {
    Segunda: [],
    Terça: [],
    Quarta: [],
    Quinta: [],
    Sexta: [],
  };
  placeholders = Array(5).fill(null);

  dayOfWeekMapping: { [key: string]: string } = {
    'segunda-feira': 'Segunda',
    'terça-feira': 'Terça',
    'quarta-feira': 'Quarta',
    'quinta-feira': 'Quinta',
    'sexta-feira': 'Sexta',
  };
  constructor(
    private router: Router,
    private scheduleService: ScheduleService
  ) {}

  ngOnInit(): void {
    this.loadSchedule();
    this.loadWeekSchedule();
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
        });
      } else {
        console.warn('Invalid day:', dayOfWeekFull);
      }
    });
  }

  convertDurationToMinutes(duration: string): number {
    const [hours, minutes] = duration.split(':').map(Number);
    return hours * 60 + minutes;
  }

  loadWeekSchedule() {
    this.loading = true;
    this.scheduleService
      .getSchedulesForWeek(this.selectWeekDate, this.page)
      .subscribe((result) => {
        this.updateAppointments(result.scheduleList);
      });
  }

  isToday(day: string): boolean {
    const today = new Date().toLocaleDateString('pt-BR', { weekday: 'long' });
    const normalizedDay = this.dayOfWeekMapping[today];
    return day === normalizedDay;
  }

  toggle() {
    document.querySelector('#sidebar').classList.toggle('expand');
  }

  goToCustomers() {
    this.router.navigate(['/customers']);
  }

  applyFilter(filter: number) {
    this.selectedFilter = filter;
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

  goToPreviousWeek() {
    this.selectWeekDate = this.addWeeks(this.selectWeekDate, -1);
    this.loadWeekSchedule();
  }

  goToNextWeek() {
    this.selectWeekDate = this.addWeeks(this.selectWeekDate, 1);
    this.loadWeekSchedule();
  }

  // Adiciona ou subtrai semanas à data fornecida
  addWeeks(date: Date, weeks: number): Date {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + weeks * 7);
    return newDate;
  }

  getWeekLabel(): string {
    const startOfWeek = this.getStartOfWeek(this.selectWeekDate);
    const endOfWeek = this.getEndOfWeek(this.selectWeekDate);
    return `${this.formatDate(startOfWeek.toDateString())} - ${this.formatDate(
      endOfWeek.toDateString()
    )}`;
  }

  getStartOfWeek(date: Date): Date {
    const start = new Date(date);
    const day = start.getDay();
    const difference = day === 0 ? 6 : day - 1; // Ajuste se o domingo for o primeiro dia
    start.setDate(start.getDate() - difference);
    return start;
  }

  // Obtém o final da semana (domingo)
  getEndOfWeek(date: Date): Date {
    const end = new Date(date);
    const day = end.getDay();
    const difference = day === 0 ? 0 : 7 - day; // Ajuste se o domingo for o primeiro dia
    end.setDate(end.getDate() + difference);
    return end;
  }
}
