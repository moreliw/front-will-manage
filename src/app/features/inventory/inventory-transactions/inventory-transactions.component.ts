import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-inventory-transactions',
  templateUrl: './inventory-transactions.component.html',
  styleUrls: ['./inventory-transactions.component.scss']
})
export class InventoryTransactionsComponent implements OnInit {
  transactionForm: FormGroup;
  loading = false;
  products: any[] = [];
  transactionTypes = [
    { id: 'entrada', name: 'Entrada' },
    { id: 'saida', name: 'Saída' },
    { id: 'ajuste', name: 'Ajuste' }
  ];
  productId: number | null = null;
  viewMode = false;
  transactions: any[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.transactionForm = this.fb.group({
      productId: ['', [Validators.required]],
      type: ['entrada', [Validators.required]],
      quantity: [1, [Validators.required, Validators.min(1)]],
      notes: [''],
      date: [new Date().toISOString().substring(0, 10)]
    });
  }

  ngOnInit(): void {
    this.loadProducts();
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productId = +id;
      this.viewMode = true;
      this.loadTransactions(this.productId);
      this.transactionForm.get('productId')?.setValue(this.productId);
      this.transactionForm.get('productId')?.disable();
    }
  }

  loadProducts(): void {
    // Implementar chamada ao serviço de produtos
    // Temporariamente, vamos usar dados mock
    this.products = [
      { id: 1, name: 'Produto 1' },
      { id: 2, name: 'Produto 2' },
      { id: 3, name: 'Produto 3' }
    ];
  }

  loadTransactions(productId: number): void {
    this.loading = true;
    // Implementar chamada ao serviço de transações
    // Temporariamente, vamos usar dados mock
    setTimeout(() => {
      this.transactions = [
        { id: 1, product: 'Produto ' + productId, type: 'entrada', quantity: 10, date: new Date(), notes: 'Compra inicial' },
        { id: 2, product: 'Produto ' + productId, type: 'saida', quantity: 2, date: new Date(), notes: 'Venda' },
        { id: 3, product: 'Produto ' + productId, type: 'ajuste', quantity: -1, date: new Date(), notes: 'Perda' }
      ];
      this.loading = false;
    }, 500);
  }

  onSubmit(): void {
    if (this.transactionForm.invalid) {
      this.markFormGroupTouched(this.transactionForm);
      return;
    }

    const formData = this.viewMode ? 
      { ...this.transactionForm.value, productId: this.productId } : 
      this.transactionForm.value;

    this.loading = true;
    // Implementar lógica de salvamento
    setTimeout(() => {
      this.loading = false;
      if (this.viewMode) {
        // Recarregar transações
        this.loadTransactions(this.productId!);
        this.transactionForm.reset({
          productId: this.productId,
          type: 'entrada',
          quantity: 1,
          notes: '',
          date: new Date().toISOString().substring(0, 10)
        });
      } else {
        this.router.navigate(['/inventory/list']);
      }
    }, 500);
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/inventory/list']);
  }

  getTypeLabel(type: string): string {
    const found = this.transactionTypes.find(t => t.id === type);
    return found ? found.name : type;
  }

  getTypeClass(type: string): string {
    switch (type) {
      case 'entrada':
        return 'text-success';
      case 'saida':
        return 'text-danger';
      case 'ajuste':
        return 'text-warning';
      default:
        return '';
    }
  }
} 