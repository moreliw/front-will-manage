import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Customer } from 'src/app/models/customer';
import { CustomersService } from 'src/app/service/customers.service';

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.scss'],
})
export class CustomerFormComponent implements OnInit {
  formValue: FormGroup;
  isEdit: boolean;
  title: string = 'Cliente';
  id: string;
  customer: Customer;
  loading = false;

  constructor(
    public fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private customerService: CustomersService
  ) {
    this.isEdit = this.route.snapshot.paramMap.has('id');

    if (this.isEdit) {
      this.id = this.route.snapshot.paramMap.get('id');
    }

    this.formValue = fb.group({
      name: [null, Validators.required],
      email: [null, null],
      phone: [null, null],
      balance: [0],
    });
  }

  ngOnInit(): void {
    this.getData();
  }

  private getData() {
    this.id = this.route.snapshot.paramMap.get('id');

    if (this.id !== undefined && this.id != null) {
      this.loading = true;
      this.customerService.getCustomerById(this.id).subscribe((customer) => {
        this.formValue.patchValue({
          ...customer,
        });
        this.loading = false;
      });
    }
  }

  addCustomer() {
    this.customerService.addCustomer(this.formValue.value).subscribe(
      () => {
        this.goBack();
      },
      () => {}
    );
  }

  updateCustomer() {
    this.customerService
      .updateCustomer(this.id, this.formValue.value)
      .subscribe(
        () => {
          this.goBack();
        },
        () => {}
      );
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
