import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { InventoryComponent } from 'src/app/pages/inventory/inventory.component';
import { InventoryService } from 'src/app/service/inventory.service';
import { ProductService } from 'src/app/service/product.service';
import { UtilService } from 'src/app/service/util.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
})
export class HistoryComponent implements OnInit {
  loading = false;
  history: any;

  page = {
    limit: 15,
    count: 0,
    offset: 0,
    descricao: '',
    ativo: true,
  };
  currentPage = 1;
  startDate: Date;
  endDate: Date;
  search = '';
  startDateString: string;
  endDateString: string;
  searchTimeout: any;

  constructor(
    private inventoryService: InventoryService,
    public dialogRef: MatDialogRef<InventoryComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: any,
    public util: UtilService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.adjustDates();
    this.loadInventory();
  }

  adjustDates() {
    const today = new Date();
    const monthAgo = new Date();
    monthAgo.setMonth(today.getMonth() - 1);

    this.startDate = monthAgo;
    this.endDate = today;
    this.startDateString = this.util.formatDateToString(this.startDate);
    this.endDateString = this.util.formatDateToString(this.endDate);
  }

  loadInventory() {
    this.loading = true;
    this.inventoryService
      .getInventory(
        this.page,
        this.search,
        this.startDateString,
        this.endDateString
      )
      .subscribe((result) => {
        this.history = result.inventoryList;
        this.page.count = result.totalCount;
        this.loading = false;
      });
  }

  getTotalPages(): number {
    return Math.ceil(this.page.count / this.page.limit);
  }

  updateDate() {
    this.loadInventory();
  }

  pageCallback(page: number) {
    this.currentPage = page;
    this.page.offset = page - 1;
    this.loadInventory();
  }

  formatDateToInput(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  onSearch(searchTerm: string = ''): void {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    this.searchTimeout = setTimeout(() => {
      this.search = searchTerm;
      this.loadInventory();
    }, 500);
  }

  generatePdf() {
    this.loading = true;
    this.inventoryService
      .getNoPageInventory(this.search, this.startDateString, this.endDateString)
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

  generateHtml(history: any[]): string {
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
            text-align: center;
            padding: 8px;
            border: 1px solid #dddddd;
            position: sticky;
            top: 0;
          }
  
          table.styled-table td {
            border: 1px solid #dddddd;
            padding: 8px;
            text-align: center;
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
              <th class="text-left">Item</th>
              <th class="text-center">Quantidade</th>
              <th class="text-center">Unidades</th>
              <th class="text-center">Transação</th>
              <th class="text-center">Data</th>
            </tr>
          </thead>
          <tbody>`;

    history.forEach((inventory) => {
      htmlContent += `
        <tr>
          <td class="text-left">${this.util.escapeHtml(
            inventory.product.name
          )}</td>
          <td class="text-center">${inventory.quantity}</td>
          <td class="text-center">${
            inventory.unity === null ? 0 : inventory.unity
          }</td>
          <td class="text-center">${
            inventory.transactionType === 1 ? 'Entrada' : 'Saída'
          }</td>
          <td class="text-center">${this.util.formatDateTime(
            inventory.transactionDate
          )}</td>
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

  onClose(): void {
    this.dialogRef.close(false);
  }
}
