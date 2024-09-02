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
import { HistoryComponent } from 'src/app/components/history/history.component';

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
    limit: 15,
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

  openHistory() {
    this.dialog.open(HistoryComponent, {
      width: '900px',
      height: '100vh',
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

  generatePdf() {
    this.loading = true;
    this.productService
      .getAllProducts(this.currentSortOrder, this.search, this.categoryId)
      .subscribe((products) => {
        const htmlContent = this.generateHtml(products);
        this.productService.generatePdf(htmlContent).subscribe((blob: Blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'document.pdf';
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          this.loading = false;
        });
      });
  }

  generateHtml(products: Product[]): string {
    let htmlContent = `
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          table.styled-table {
            width: 100%;
            border-collapse: collapse;
            page-break-inside: auto;
          }
  
          table.styled-table th {
            background-color: #f2f2f2;
            text-align: left;
            padding: 8px;
            border: 1px solid #dddddd;
            position: sticky;
            top: 0;
          }
  
          table.styled-table td {
            border: 1px solid #dddddd;
            text-align: left;
            padding: 8px;
          }

          tr {
            page-break-inside: avoid;
            page-break-after: auto;
          }
  
          thead {
            display: table-header-group;
          }

          tbody {
            display: table-row-group;
          }

          tfoot {
            display: table-footer-group;
          }
        </style>
      </head>
      <body>
        <table class="styled-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Nome</th>
              <th>Categoria</th>
              <th class="text-center">Quantidade</th>
              <th class="text-center">Unidades</th>
            </tr>
          </thead>
          <tbody>`;

    products.forEach((product) => {
      htmlContent += `
        <tr>
          <td>${product.code ? product.code : '-'}</td>
          <td>${this.util.escapeHtml(product.name)}</td>
          <td>${this.util.escapeHtml(product.category.name)}</td>
          <td class="text-center">${product.quantity}</td>
          <td class="text-center">${
            product.unity === null ? 0 : product.unity
          }</td>
        </tr>`;
    });

    htmlContent += `
          </tbody>
        </table>
      </body>
      </html>
    `;

    return htmlContent;
  }
}
