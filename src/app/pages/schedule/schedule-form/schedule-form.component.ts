import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AddCustomerComponent } from 'src/app/components/add-customer/add-customer.component';
import { ProcedureComponent } from 'src/app/components/procedure/procedure.component';
import { Customer } from 'src/app/models/customer';
import { Responsible } from 'src/app/models/responsible';
import { Schedule } from 'src/app/models/schedule';
import { CustomersService } from 'src/app/service/customers.service';
import { ResponsibleService } from 'src/app/service/responsible.service';
import { ScheduleService } from 'src/app/service/schedule.service';
import { Location } from '@angular/common';
import { duration } from 'moment';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';

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
  customerListWithAddOption: Customer[] = [];
  responsibleList: Responsible[] = [];

  proceduresCount: number = 0;
  day: any;
  status = [
    { value: 1, description: 'Agendado', color: '#007bff' },
    { value: 2, description: 'Cancelado', color: '#dc3545' },
    { value: 3, description: 'Concluído', color: '#28a745' },
    { value: 4, description: 'Em andamento', color: '#ffc107' },
    { value: 5, description: 'Confirmado', color: '#17a2b8' },
    { value: 6, description: 'Não compareceu', color: '#6c757d' },
    { value: 7, description: 'Remarcado', color: '#fd7e14' },
    { value: 8, description: 'Na sala de espera', color: '#e83e8c' },
    { value: 9, description: 'Acompanhamento', color: '#343a40' },
  ];

  constructor(
    public fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private scheduleService: ScheduleService,
    private customersService: CustomersService,
    private responsibleService: ResponsibleService,
    private dialog: MatDialog,
    private location: Location
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
      responsibleId: [null],
      duration: ['00:30', Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.day = params['day'];
      if (params.scheduleId !== null && params.scheduleId) {
        this.id = params['scheduleId'];
        this.isEdit = true;
      }

      if (this.day) {
        this.formValue.patchValue({
          scheduleDate: this.day,
        });
      }
    });

    this.getData();
    this.loadCustomers();
    this.loadResponsible();
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
      (error) => {
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Algo deu errado!',
          text: error.error.error,
        });
      }
    );
  }

  updateSchedule() {
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

    this.scheduleService.updateSchedule(this.id, payload).subscribe(
      () => {
        this.loading = false;
        this.goBack();
      },
      (error) => {
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Algo deu errado!',
          text: error.error.error,
        });
      }
    );
  }

  loadCustomers() {
    this.loading = true;
    this.customersService.getCustomers().subscribe((result) => {
      this.customerList = result;

      this.customerListWithAddOption = [
        ...this.customerList,
        {
          id: null,
          name: 'Adicionar novo cliente',
          phone: null,
          balance: null,
          email: null,
          userId: null,
        },
      ];

      this.loading = false;
    });
  }

  onCustomerChange(selectedCustomer: any) {
    if (
      selectedCustomer &&
      selectedCustomer.name === 'Adicionar novo cliente'
    ) {
      this.router.navigate(['/add-customer']);
    }
  }

  loadResponsible() {
    this.loading = true;
    this.responsibleService.getResponsibles().subscribe((result) => {
      this.responsibleList = result;
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

  addCustomerTag = (name: string) => {
    Swal.fire({
      title: 'Deseja adicionar novo cliente?',
      text: 'O cliente será cadastrado na sua lista de clientes',
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
        const entity = {
          name: name,
        };
        this.customersService.addCustomer(entity).subscribe(
          (newCustomer) => {
            console.log(newCustomer);
            this.loading = false;
            Swal.fire('Adicionado!', 'Cliente adicionado', 'success');

            this.loadCustomers();

            this.formValue.patchValue({ customerId: newCustomer.id });
          },
          (error: HttpErrorResponse) => {
            this.loading = false;
            const errorMessage =
              error.error?.messages[0] ||
              'Houve um problema ao adicionar o cliente.';

            Swal.fire(
              'Houve um problema ao adicionar o cliente!',
              errorMessage,
              'error'
            );
          }
        );
      }
    });
  };

  goBack() {
    this.location.back();
  }
}
