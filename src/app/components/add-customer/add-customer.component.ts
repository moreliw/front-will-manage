import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ScheduleFormComponent } from 'src/app/pages/schedule/schedule-form/schedule-form.component';
import { CustomersService } from 'src/app/service/customers.service';

@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.scss'],
})
export class AddCustomerComponent implements OnInit {
  formValue: FormGroup;
  loading = false;
  saveButton = false;
  constructor(
    public dialogRef: MatDialogRef<ScheduleFormComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: any,
    public fb: FormBuilder,
    private customerService: CustomersService
  ) {
    this.formValue = fb.group({
      name: [null, Validators.required],
      email: [null, null],
      phone: [null, null],
    });
  }

  ngOnInit(): void {}

  onClose(): void {
    this.dialogRef.close(false);
  }

  submit() {
    this.loading = true;
    this.customerService.addCustomer(this.formValue.value).subscribe(
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
