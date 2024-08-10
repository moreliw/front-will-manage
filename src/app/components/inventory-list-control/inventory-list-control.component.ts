import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EInventoryType } from 'src/app/models/Enum/EInventoryType';
import { Product } from 'src/app/models/product';
import { InventoryComponent } from 'src/app/pages/inventory/inventory.component';
import { InventoryService } from 'src/app/service/inventory.service';
import { ProductService } from 'src/app/service/product.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-inventory-list-control',
  templateUrl: './inventory-list-control.component.html',
  styleUrls: ['./inventory-list-control.component.scss'],
})
export class InventoryListControlComponent implements OnInit {
  transactionType: EInventoryType;
  loading: boolean;
  productList: Product[] = [];
  productListSelect = [];
  items: Array<{
    productId: string;
    quantity: number;
    transactionType: EInventoryType;
  }> = [];
  errors: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<InventoryComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: any,
    private productService: ProductService,
    private inventoryService: InventoryService
  ) {}

  ngOnInit(): void {
    this.transactionType = this.data.transactionType;
    this.loadProducts();
    this.addItem();
  }

  onClose(): void {
    this.dialogRef.close(false);
  }

  loadProducts() {
    this.loading = true;
    this.productService.getProducts().subscribe((result) => {
      this.productList = result;
      this.loading = false;
    });
  }

  addItem(): void {
    this.items.push({
      productId: null,
      quantity: null,
      transactionType: this.transactionType,
    });
    this.errors.push('');
  }

  removeItem(index: number): void {
    this.items.splice(index, 1);
    this.errors.splice(index, 1);
  }

  onProductSelect(i: number): void {
    const selectedProductId = this.items[i].productId;

    if (
      this.items.filter(
        (item, index) => item.productId === selectedProductId && index !== i
      ).length > 0
    ) {
      this.errors[i] = 'Produto já selecionado!';
    } else {
      this.errors[i] = '';
    }
  }

  get hasErrors(): boolean {
    return (
      this.errors.some((error) => error !== '') ||
      this.items.some((item) => !item.quantity) ||
      this.items.some((item) => !item.productId) ||
      this.items.length === 0
    );
  }

  submit(): void {
    this.loading = true;
    this.inventoryService.addInventory(this.items).subscribe(
      (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Sucesso!',
          text: 'Os dados foram salvos com sucesso.',
        });
        this.loading = false;
      },
      (error) => {
        const errorMessage =
          error.error?.error || 'Ocorreu um erro ao processar sua solicitação.';
        Swal.fire({
          icon: 'error',
          title: 'Erro!',
          text: errorMessage,
        });
        this.loading = false;
      }
    );
  }
}
