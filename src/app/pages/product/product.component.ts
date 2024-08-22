import { ResourceLoader } from '@angular/compiler';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from 'src/app/models/category';
import { Product } from 'src/app/models/product';
import { CategoryService } from 'src/app/service/category.service';
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
  categoryList: Category[] = [];
  currentSortOrder: number = 1;
  categoryId: string = '';
  page = {
    limit: 10,
    count: 0,
    offset: 0,
    descricao: '',
    ativo: true,
  };
  totalCount: number;
  currentPage = 1;
  search: string = '';
  selectedProductId: string | null = null;

  @Output() sortOrderChanged = new EventEmitter<string>();

  constructor(
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute,
    private util: UtilService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
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
        this.productList = result.productList;
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

  filterByCategoryId() {
    if (this.categoryId !== null) {
      this.loadProducts();
    } else {
      this.categoryId = '';
      this.loadProducts();
    }
  }

  addProduct() {
    this.router.navigate(['/product/new']);
  }

  openEditProduct(id: string) {
    this.router.navigate(['./edit/' + id], { relativeTo: this.route });
  }

  onSortOrderChanged(order: number) {
    this.currentSortOrder = order;
    this.loadProducts();
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

  deleteProduct(id: string) {
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
