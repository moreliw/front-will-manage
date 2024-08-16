import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/models/product';
import { InventorySummary } from 'src/app/models/inventory-summary';

import { ProductService } from 'src/app/service/product.service';
import { InventoryService } from 'src/app/service/inventory.service';

import { UtilService } from 'src/app/service/util.service';
import { MatDialog } from '@angular/material/dialog';
import { InventoryControlComponent } from 'src/app/components/inventory-control/inventory-control.component';
import { EInventoryType } from 'src/app/models/Enum/EInventoryType';
import { InventoryListControlComponent } from 'src/app/components/inventory-list-control/inventory-list-control.component';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss'],
})
export class InventoryComponent implements OnInit {
  inventoryList: Product[] = [];
  inventorySummary: InventorySummary;
  loading = false;

  constructor(
    private productService: ProductService,
    private inventoryService: InventoryService,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private util: UtilService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadSummaryInventory();
  }

  loadSummaryInventory() {
    this.loading = true;
    this.inventoryService.getSummaryInventory().subscribe((result) => {
      this.inventorySummary = result;
      this.loading = false;
    });
  }

  loadProducts() {
    this.loading = true;
    this.productService.getProducts().subscribe((result) => {
      this.inventoryList = result;
      this.loading = false;
    });
  }

  onSearch(searchTerm: string = ''): void {
    this.loading = true;
    this.productService.getProductsOnSearch(searchTerm).subscribe((result) => {
      this.inventoryList = result;
      this.loading = false;
    });
  }

  openMultiStockControl(transactionType: EInventoryType) {
    const data = {
      transactionType: transactionType,
    };
    const dialogRef = this.dialog.open(InventoryListControlComponent, {
      width: '700px',
      data: data,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadProducts();
        this.loadSummaryInventory();
      }
    });
  }

  openSingleStockControl(productId: string, transactionType: EInventoryType) {
    const data = {
      id: productId,
      transactionType: transactionType,
    };
    const dialogRef = this.dialog.open(InventoryControlComponent, {
      width: '500px',
      data: data,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadProducts();
      }
    });
  }

  inventoryHistory() {
    this.router.navigate(['/inventory-history']);
  }
}
