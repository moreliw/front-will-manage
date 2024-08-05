import { Component, OnInit } from '@angular/core';
import { Schedule } from '../../models/schedule';
import { ScheduleService } from '../../service/schedule.service';
import { EScheduleStatusLabel } from '../../models/Enum/EScheduleStatus';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomersService } from 'src/app/service/customers.service';
import { Customer } from 'src/app/models/customer';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
})
export class ScheduleComponent implements OnInit {
  scheduleList: Schedule[] = [];
  loading = false;

  EScheduleStatusLabel = EScheduleStatusLabel;

  constructor(
    private scheduleService: ScheduleService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadSchedule();
  }

  loadSchedule() {
    this.loading = true;
    this.scheduleService.getScheduleList().subscribe((result) => {
      this.scheduleList = result;
      this.loading = false;
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
}
