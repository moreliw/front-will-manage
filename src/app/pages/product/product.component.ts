import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/service/product.service';
import { UtilService } from 'src/app/service/util.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {
  productList: Product[] = [];
  loading = false;

  constructor(
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute,
    private util: UtilService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;
    this.productService.getProducts().subscribe((result) => {
      this.productList = result;
      this.loading = false;
    });
  }

  addProduct() {
    this.router.navigate(['/product/new']);
  }

  openEditProduct(id: string) {
    this.router.navigate(['./edit/' + id], { relativeTo: this.route });
  }

  deleteCategory(id: string) {
    Swal.fire({
      title: 'Tem certeza que deseja excluir esse produto?',
      text: 'Você não poderá reverter isso!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',

      customClass: {
        cancelButton: 'order-1',
        confirmButton: 'order-2',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;
        this.productService.deleteProduct(id).subscribe(
          () => {
            this.loadProducts();
            this.loading = false;
            Swal.fire('Deletado!', 'O produto foi deletado.', 'success');
          },
          (error) => {
            console.error('Erro ao deletar produto', error);
            this.loading = false;
            Swal.fire(
              'Erro!',
              'Houve um problema ao deletar o produto.',
              'error'
            );
          }
        );
      }
    });
  }
}
