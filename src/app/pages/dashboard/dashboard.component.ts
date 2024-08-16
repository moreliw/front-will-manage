import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EScheduleStatusLabel } from 'src/app/models/Enum/EScheduleStatus';
import { Schedule } from 'src/app/models/schedule';
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
  constructor(
    private router: Router,
    private scheduleService: ScheduleService
  ) {}

  ngOnInit(): void {
    // this.loadSchedule();
  }

  // loadSchedule() {
  //   this.loading = true;
  //   this.scheduleService.getScheduleList().subscribe((result) => {
  //     this.scheduleList = result;
  //     this.loading = false;
  //   });
  // }

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
}
