import { Component, OnInit } from '@angular/core';
import { ScheduleGrid } from '../../models/schedule';
import { ScheduleService } from '../../service/schedule.service';
import {
  EScheduleStatus,
  EScheduleStatusColors,
  EScheduleStatusLabel,
} from '../../models/Enum/EScheduleStatus';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { UpdateStatusScheduleComponent } from 'src/app/components/update-status-schedule/update-status-schedule.component';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
})
export class ScheduleComponent implements OnInit {
  scheduleGrid: ScheduleGrid;
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
  currentPage = 1;
  search: string = '';
  selectedDate: string;
  searchTimeout: any;
  showCalendar = false;
  selectWeekDate = new Date();
  constructor(
    private scheduleService: ScheduleService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadSelectedFilter();
    this.loadSchedule();
    this.loadWeekSchedule();
  }

  applyFilter(filter: number) {
    this.selectedFilter = filter;
    this.loadSchedule();
    localStorage.setItem('selectedFilter', filter.toString());

    if (filter === 0) {
      this.selectedDate = null;
      this.search = '';
    }
  }

  loadSelectedFilter() {
    const savedFilter = localStorage.getItem('selectedFilter');
    if (savedFilter) {
      this.selectedFilter = +savedFilter;
    } else {
      this.selectedFilter = 1;
    }
  }

  changeSelectedDate() {
    this.loadSchedule();
  }

  loadSchedule() {
    this.loading = true;
    this.scheduleService
      .getScheduleList(
        this.selectedFilter,
        this.page,
        this.search,
        this.selectedDate
      )
      .subscribe((result) => {
        this.scheduleGrid = result;
        this.page.count = result.totalCount;
        this.loading = false;
      });
  }

  loadWeekSchedule() {
    this.loading = true;
    this.scheduleService
      .getSchedulesForWeek(this.selectWeekDate, this.page)
      .subscribe((result) => {
        console.log(result);
      });
  }

  formatDate(datetime: string): string {
    const date = new Date(datetime);
    const localDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    );
    return localDate.toLocaleDateString();
  }

  formatTime(datetime: string): string {
    const date = new Date(datetime);
    const localDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    );
    return localDate.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  addSchedule() {
    this.router.navigate(['/schedule/new']);
  }

  openEditSchedule(id: string) {
    this.router.navigate(['./edit/' + id], { relativeTo: this.route });
  }

  openUpdateStatus(
    status: EScheduleStatus,
    scheduleId: string,
    name: string,
    scheduleDate: string
  ) {
    const data = {
      id: scheduleId,
      status: status,
      name: name,
      scheduleDate: scheduleDate,
    };
    const dialogRef = this.dialog.open(UpdateStatusScheduleComponent, {
      width: '500px',
      data: data,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadSchedule();
      }
    });
  }

  deleteSchedule(id: string) {
    Swal.fire({
      title: 'Tem certeza que deseja excluir esse agendamento?',
      text: 'Você não poderá reverter isso!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',

      customClass: {
        cancelButton: 'order-1',
        confirmButton: 'order-2',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;
        this.scheduleService.deleteSchedule(id).subscribe(
          () => {
            this.loadSchedule();
            this.loading = false;
            Swal.fire('Deletado!', 'O agendamento foi deletado.', 'success');
          },
          (error) => {
            console.error('Erro ao deletar agendamento', error);
            this.loading = false;
            Swal.fire(
              'Erro!',
              'Houve um problema ao deletar o agendamento.',
              'error'
            );
          }
        );
      }
    });
  }

  getColorByStatus(status: EScheduleStatus): string {
    return EScheduleStatusColors[status] || '#2c5aa0';
  }

  selecionarNumeroRegistros(value) {
    this.page.limit = parseInt(value, 10);
    this.loadSchedule();
  }

  getTotalPages(): number {
    return Math.ceil(this.page.count / this.page.limit);
  }

  pageCallback(page: number) {
    this.currentPage = page;
    this.page.offset = page - 1;
    this.loadSchedule();
  }

  onSearch(searchTerm: string = ''): void {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    this.searchTimeout = setTimeout(() => {
      this.search = searchTerm;
      this.loadSchedule();
    }, 500);
  }

  onDaySelect(date: Date): void {}
}
