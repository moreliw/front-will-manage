import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  EScheduleStatus,
  EScheduleStatusColors,
  EScheduleStatusLabel,
} from 'src/app/models/Enum/EScheduleStatus';
import { Schedule } from 'src/app/models/schedule';
import { DashboardComponent } from 'src/app/pages/dashboard/dashboard.component';
import { ScheduleService } from 'src/app/service/schedule.service';

@Component({
  selector: 'app-info-schedule',
  templateUrl: './info-schedule.component.html',
  styleUrls: ['./info-schedule.component.scss'],
})
export class InfoScheduleComponent implements OnInit {
  loading = false;
  EScheduleStatusLabel = EScheduleStatusLabel;
  schedule: Schedule;
  constructor(
    public dialogRef: MatDialogRef<DashboardComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: any,
    private scheduleService: ScheduleService
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  private getData() {
    this.loading = true;
    this.scheduleService.getScheduleById(this.data.id).subscribe((schedule) => {
      if (schedule) {
        this.schedule = schedule;
      }
      this.loading = false;
    });
  }

  formatScheduleTime(scheduleDate, duration) {
    if (scheduleDate && duration) {
      const startTime = new Date(scheduleDate);

      const [hours, minutes, seconds] = duration.split(':').map(Number);

      const endTime = new Date(startTime);
      endTime.setHours(endTime.getHours() + hours);
      endTime.setMinutes(endTime.getMinutes() + minutes);
      endTime.setSeconds(endTime.getSeconds() + seconds);

      const startFormatted = startTime.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      });
      const endFormatted = endTime.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      });

      return `${startFormatted} - ${endFormatted}`;
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
