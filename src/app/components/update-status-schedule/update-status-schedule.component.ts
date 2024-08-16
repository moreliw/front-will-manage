import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EScheduleStatus } from 'src/app/models/Enum/EScheduleStatus';
import { ScheduleComponent } from 'src/app/pages/schedule/schedule.component';
import { ScheduleService } from 'src/app/service/schedule.service';
import { UtilService } from 'src/app/service/util.service';

@Component({
  selector: 'app-update-status-schedule',
  templateUrl: './update-status-schedule.component.html',
  styleUrls: ['./update-status-schedule.component.scss'],
})
export class UpdateStatusScheduleComponent implements OnInit {
  status = [
    { value: 1, description: 'Agendado' },
    { value: 2, description: 'Cancelado' },
    { value: 3, description: 'Concluído' },
  ];
  saveButton = true;
  selectedStatus: EScheduleStatus;
  loading = false;
  constructor(
    public dialogRef: MatDialogRef<ScheduleComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: any,
    public util: UtilService,
    private scheduleService: ScheduleService
  ) {}

  ngOnInit(): void {
    this.selectedStatus = this.data.status;
    console.log(this.data);
  }

  onClose(): void {
    this.dialogRef.close(false);
  }

  onChangeStatus() {
    this.saveButton = this.data.status === this.selectedStatus;
  }

  submit() {
    this.loading = true;
    this.scheduleService
      .updateStatus(this.data.id, this.selectedStatus)
      .subscribe(
        () => {
          this.loading = false;
          this.dialogRef.close(true);
        },
        () => {
          this.loading = false;
        }
      );
  }
}
