import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Customer } from 'src/app/models/customer';
import { CustomersService } from 'src/app/service/customers.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { BalanceComponent } from 'src/app/components/balance/balance.component';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss'],
})
export class CustomerComponent implements OnInit {
  customerList: Customer[] = [];
  loading = false;

  constructor(
    private customersService: CustomersService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers() {
    this.loading = true;
    this.customersService.getCustomers().subscribe((result) => {
      this.customerList = result;
      this.loading = false;
    });
  }

  addCustomer() {
    this.router.navigate(['/customers/new']);
  }

  openEditCustomer(id: string) {
    this.router.navigate(['./edit/' + id], { relativeTo: this.route });
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

  openBalance(id: string, balance: number) {
    const data = {
      id: id,
      balance: balance,
    };
    const dialogRef = this.dialog.open(BalanceComponent, {
      width: '500px',
      data: data,
    });

    dialogRef.afterClosed().subscribe(() => {
      this.loadCustomers();
    });
  }

  deleteCustomer(id: string) {
    Swal.fire({
      title: 'Tem certeza que deseja excluir esse cliente?',
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
        this.customersService.deleteCustomer(id).subscribe(
          () => {
            this.loadCustomers();
            this.loading = false;
            Swal.fire('Deletado!', 'O cliente foi deletado.', 'success');
          },
          (error) => {
            console.error('Erro ao deletar cliente', error);
            this.loading = false;
            Swal.fire(
              'Erro!',
              'Houve um problema ao deletar o cliente.',
              'error'
            );
          }
        );
      }
    });
  }
}
