import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CustomerComponent } from 'src/app/pages/customer/customer.component';
import { CustomersService } from 'src/app/service/customers.service';

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.scss'],
})
export class BalanceComponent implements OnInit {
  addBalance: number = 0;
  balance: number;
  constructor(
    public dialogRef: MatDialogRef<CustomerComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: any,
    private customerService: CustomersService
  ) {}

  ngOnInit(): void {
    this.balance = this.data.balance;
    console.log(this.data);
  }

  onClose(): void {
    this.dialogRef.close();
  }

  submit() {
    this.customerService
      .updateBalance(this.data.id, this.balance + this.addBalance)
      .subscribe(
        (result) => {
          console.log(result);
          this.onClose();
        },
        () => {}
      );
  }

  toMoney(value: number): string {
    if (value === null || value === undefined) {
      return '';
    }
    return (
      'R$ ' +
      value.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );
  }
}
