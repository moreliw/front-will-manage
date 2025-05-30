import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products: any[] = [];
  loading = false;

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    // Implementar chamada ao serviço de produtos
    // Temporariamente, vamos usar dados mock
    setTimeout(() => {
      this.products = [
        { id: 1, name: 'Produto 1', category: 'Categoria 1', price: 19.99, stock: 10 },
        { id: 2, name: 'Produto 2', category: 'Categoria 2', price: 29.99, stock: 5 },
        { id: 3, name: 'Produto 3', category: 'Categoria 1', price: 9.99, stock: 15 }
      ];
      this.loading = false;
    }, 500);
  }

  editProduct(id: number): void {
    this.router.navigate(['/products/edit', id]);
  }

  deleteProduct(id: number): void {
    // Implementar lógica de exclusão
    alert('Função de exclusão será implementada posteriormente');
  }

  createProduct(): void {
    this.router.navigate(['/products/create']);
  }
} 