import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AddCustomerComponent } from 'src/app/components/add-customer/add-customer.component';
import { ProcedureComponent } from 'src/app/components/procedure/procedure.component';
import { Customer } from 'src/app/models/customer';
import { Schedule } from 'src/app/models/schedule';
import { CustomersService } from 'src/app/service/customers.service';
import { ScheduleService } from 'src/app/service/schedule.service';

@Component({
  selector: 'app-schedule-form',
  templateUrl: './schedule-form.component.html',
  styleUrls: ['./schedule-form.component.scss'],
})
export class ScheduleFormComponent implements OnInit {
  formValue: FormGroup;
  isEdit: boolean;
  title: string = 'Agendamento';
  id: string;
  schedule: Schedule;
  loading = false;
  customerList: Customer[] = [];
  proceduresCount: number = 0;

  status = [
    { value: 1, description: 'Agendado' },
    { value: 2, description: 'Cancelado' },
    { value: 3, description: 'Concluído' },
  ];

  constructor(
    public fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private scheduleService: ScheduleService,
    private customersService: CustomersService,
    private dialog: MatDialog
  ) {
    this.isEdit = this.route.snapshot.paramMap.has('id');

    if (this.isEdit) {
      this.id = this.route.snapshot.paramMap.get('id');
    }

    this.formValue = fb.group({
      customerId: [null, Validators.required],
      scheduleDate: [null, Validators.required],
      scheduleTime: [null, Validators.required],
      status: [1],
      observations: [null],
      procedures: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.getData();
    this.loadCustomers();
  }

  private getData() {
    if (this.isEdit) {
      this.loading = true;
      this.scheduleService.getScheduleById(this.id).subscribe((schedule) => {
        const scheduleDateTime = new Date(schedule.scheduleDate);
        const localDateTime = new Date(
          scheduleDateTime.getTime() -
            scheduleDateTime.getTimezoneOffset() * 60000
        );
        this.formValue.patchValue({
          ...schedule,
          scheduleDate: localDateTime.toISOString().split('T')[0],
          scheduleTime: localDateTime
            .toTimeString()
            .split(' ')[0]
            .substring(0, 5),
        });

        if (schedule.procedures) {
          this.proceduresCount = schedule.procedures.length;

          const proceduresArray = this.formValue.get('procedures') as FormArray;
          schedule.procedures.forEach((proc) => {
            proceduresArray.push(
              this.fb.group({
                id: [proc.id],
                name: [proc.name, Validators.required],
                done: [proc.done],
                procedureDate: [proc.procedureDate],
              })
            );
          });
        }

        this.loading = false;
      });
    }
  }

  combineDateAndTime(date: string, time: string): string {
    const [year, month, day] = date.split('-').map(Number);
    const [hours, minutes] = time.split(':').map(Number);
    const localDateTime = new Date(year, month - 1, day, hours, minutes);

    const isoString = localDateTime.toISOString();
    const localDateString = `${isoString.substring(
      0,
      10
    )}T${isoString.substring(11, 19)}`;

    return localDateString;
  }

  addSchedule() {
    this.loading = true;
    const formValue = this.formValue.value;
    const scheduleDateTime = this.combineDateAndTime(
      formValue.scheduleDate,
      formValue.scheduleTime
    );

    const payload = {
      ...formValue,
      scheduleDate: scheduleDateTime,
    };

    this.scheduleService.addSchedule(payload).subscribe(
      () => {
        this.loading = false;
        this.goBack();
      },
      () => {
        this.loading = false;
      }
    );
  }

  updateSchedule() {
    const formValue = this.formValue.value;
    const scheduleDateTime = this.combineDateAndTime(
      formValue.scheduleDate,
      formValue.scheduleTime
    );

    const payload = {
      ...formValue,
      scheduleDate: scheduleDateTime,
    };

    this.scheduleService.updateSchedule(this.id, payload).subscribe(
      () => {
        this.goBack();
      },
      () => {}
    );
  }

  loadCustomers() {
    this.loading = true;
    this.customersService.getCustomers().subscribe((result) => {
      this.customerList = result;
      this.loading = false;
    });
  }

  addCustomer() {
    const dialogRef = this.dialog.open(AddCustomerComponent, {});

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadCustomers();
      }
    });
  }

  openProcedure() {
    const dialogRef = this.dialog.open(ProcedureComponent, {
      width: '800px',
      data: {
        procedures: this.formValue.get('procedures').value,
        scheduleId: this.id,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const procedures = this.formValue.get('procedures') as FormArray;
        procedures.clear();
        this.getData();
      }
    });
  }

  goBack() {
    const currentUrl = this.route.snapshot.url;
    if (currentUrl[currentUrl.length - 1].path === 'new') {
      this.router.navigate(['../'], { relativeTo: this.route });
    } else {
      this.router.navigate(['../../'], { relativeTo: this.route });
    }
  }
}
