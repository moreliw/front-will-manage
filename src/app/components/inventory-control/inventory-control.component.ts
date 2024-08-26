import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EInventoryType } from 'src/app/models/Enum/EInventoryType';
import { InventoryComponent } from 'src/app/pages/inventory/inventory.component';
import { InventoryService } from 'src/app/service/inventory.service';
import { ProductService } from 'src/app/service/product.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-inventory-control',
  templateUrl: './inventory-control.component.html',
  styleUrls: ['./inventory-control.component.scss'],
})
export class InventoryControlComponent implements OnInit {
  id: string;
  loading: boolean;
  quantity: number;
  unity: number;
  quantityToSend: number = 0;
  unityToSend = 0;
  nameProduct: string;
  transactionType: EInventoryType;
  constructor(
    public dialogRef: MatDialogRef<InventoryComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: any,
    private productService: ProductService,
    private inventoryService: InventoryService
  ) {}

  ngOnInit(): void {
    this.transactionType = this.data.transactionType;
    this.getData();
  }

  private getData() {
    this.loading = true;
    this.productService.getProductById(this.data.id).subscribe((product) => {
      if (product) {
        this.quantity = product.quantity;
        this.unity = product.unity;
        this.nameProduct = product.name;
        this.loading = false;
      }
    });
  }

  addInventory(): void {
    const entity = [
      {
        productId: this.data.id,
        quantity: this.quantityToSend,
        unity: this.unityToSend,
        transactionType: this.transactionType,
      },
    ];
    this.loading = true;
    this.inventoryService.addInventory(entity).subscribe(
      (result) => {
        this.loading = false;
        this.dialogRef.close(true);
      },
      (error) => {
        this.loading = false;
        console.error('Erro ao adicionar inventário:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: 'Ocorreu um erro ao adicionar o inventário. Tente novamente.',
        });
      }
    );
  }

  onClose(): void {
    this.dialogRef.close(false);
  }

  submit() {
    console.log(this.nameProduct);
    console.log(this.quantity);
    console.log(this.quantityToSend);
  }
}
