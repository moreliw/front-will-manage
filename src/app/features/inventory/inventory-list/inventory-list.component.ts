import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inventory-list',
  templateUrl: './inventory-list.component.html',
  styleUrls: ['./inventory-list.component.scss']
})
export class InventoryListComponent implements OnInit {
  inventoryItems: any[] = [];
  loading = false;
  
  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadInventory();
  }

  loadInventory(): void {
    this.loading = true;
    // Implementar chamada ao serviço de inventário
    // Temporariamente, vamos usar dados mock
    setTimeout(() => {
      this.inventoryItems = [
        { id: 1, product: 'Produto 1', stock: 10, minStock: 5, category: 'Categoria 1', lastUpdate: new Date() },
        { id: 2, product: 'Produto 2', stock: 5, minStock: 10, category: 'Categoria 2', lastUpdate: new Date() },
        { id: 3, product: 'Produto 3', stock: 15, minStock: 5, category: 'Categoria 1', lastUpdate: new Date() }
      ];
      this.loading = false;
    }, 500);
  }

  addTransaction(): void {
    this.router.navigate(['/inventory/transaction']);
  }

  viewTransactions(productId: number): void {
    this.router.navigate(['/inventory/transactions', productId]);
  }

  adjustStock(productId: number): void {
    this.router.navigate(['/inventory/adjust', productId]);
  }
} 