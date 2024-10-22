import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CustomerComponent } from 'src/app/pages/customer/customer.component';
import { CustomersService } from 'src/app/service/customers.service';
import { PartnerService } from 'src/app/service/partner.service';

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.scss'],
})
export class BalanceComponent implements OnInit {
  addBalance: number = 0;
  balance: number;
  loading = false;

  constructor(
    public dialogRef: MatDialogRef<CustomerComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: any,
    private customerService: CustomersService,
    private partnerService: PartnerService
  ) {}

  ngOnInit(): void {
    this.balance = this.data.balance;
    console.log(this.data);
  }

  onClose(): void {
    this.dialogRef.close();
  }

  submitPartner() {
    this.loading = true;
    this.partnerService
      .updateBalance(this.data.id, this.balance + this.addBalance)
      .subscribe(
        (result) => {
          this.loading = false;

          this.onClose();
        },
        () => {
          this.loading = false;
        }
      );
  }

  submit() {
    this.loading = true;
    this.customerService
      .updateBalance(this.data.id, this.balance + this.addBalance)
      .subscribe(
        (result) => {
          this.loading = false;

          this.onClose();
        },
        () => {
          this.loading = false;
        }
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
