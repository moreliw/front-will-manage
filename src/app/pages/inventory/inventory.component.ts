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
import { Category } from 'src/app/models/category';
import { CategoryService } from 'src/app/service/category.service';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss'],
})
export class InventoryComponent implements OnInit {
  inventoryList: Product[] = [];
  inventorySummary: InventorySummary;
  loading = false;

  page = {
    limit: 10,
    count: 0,
    offset: 0,
    descricao: '',
    ativo: true,
  };
  currentPage = 1;
  search: string = '';
  categoryId: string = '';
  currentSortOrder: number = 1;
  categoryList: Category[] = [];
  totalCount: number;
  selectedProductId: string | null = null;

  constructor(
    private productService: ProductService,
    private inventoryService: InventoryService,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private util: UtilService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadSummaryInventory();
    this.loadCategories();
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
    this.productService
      .getProducts(
        this.currentSortOrder,
        this.page,
        this.search,
        this.categoryId
      )
      .subscribe((result) => {
        this.inventoryList = result.productList;
        this.page.count = result.totalCount;
        this.totalCount = result.totalCount;
        this.loading = false;
      });
  }

  loadCategories() {
    this.loading = true;
    this.categoryService.getCategories().subscribe((result) => {
      this.categoryList = result;
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

  getTotalPages(): number {
    return Math.ceil(this.page.count / this.page.limit);
  }

  pageCallback(page: number) {
    this.currentPage = page;
    this.page.offset = page - 1;
    this.loadProducts();
  }

  onRowClick(productId: string) {
    this.selectedProductId = productId;
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

  filterByCategoryId() {
    if (this.categoryId !== null) {
      this.loadProducts();
    } else {
      this.categoryId = '';
      this.loadProducts();
    }
  }

  onSortOrderChanged(order: number) {
    this.currentSortOrder = order;
    this.loadProducts();
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
