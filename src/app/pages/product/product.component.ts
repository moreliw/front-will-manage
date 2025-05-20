import { ResourceLoader } from '@angular/compiler';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from '../../models/category';
import { Product } from '../../models/product';
import { CategoryService } from '../../service/category.service';
import { ProductService } from '../../service/product.service';
import { UtilService } from '../../service/util.service';
import Swal from 'sweetalert2';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {
  productList: Product[] = [];
  loading = false;
  categoryList: Category[] = [];
  loadingCategories = false;
  currentSortOrder: number = 1;
  categoryId: string = '';
  page = {
    limit: 15,
    count: 0,
    offset: 0,
    descricao: '',
    ativo: true,
  };
  totalCount: number;
  currentPage = 1;
  search: string = '';
  selectedProductId: string | null = null;
  searchTimeout: any;

  // Modal properties
  isModalOpen = false;
  isEditMode = false;
  productForm: FormGroup;
  currentProductId: string | null = null;
  
  // Nova categoria
  showNewCategoryForm = false;
  newCategoryName: string = '';
  loadingNewCategory = false;

  @Output() sortOrderChanged = new EventEmitter<string>();

  constructor(
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute,
    private util: UtilService,
    private categoryService: CategoryService,
    private fb: FormBuilder
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  initForm(): void {
    this.productForm = this.fb.group({
      code: [null],
      name: ['', Validators.required],
      description: [''],
      costPrice: [0],
      salePrice: [0],
      quantity: [0],
      unity: [0],
      categoryId: ['', Validators.required]
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
      .subscribe({
        next: (result) => {
          this.productList = result.productList;
          this.page.count = result.totalCount;
          this.totalCount = result.totalCount;
          this.loading = false;
        },
        error: (error) => {
          console.error('Erro ao carregar produtos', error);
          this.loading = false;
          this.showErrorMessage('Não foi possível carregar os produtos. Tente novamente mais tarde.');
        }
      });
  }

  loadCategories() {
    this.loadingCategories = true;
    this.categoryService.getCategories().subscribe({
      next: (result) => {
        this.categoryList = result;
        this.loadingCategories = false;
      },
      error: (error) => {
        console.error('Erro ao carregar categorias', error);
        this.loadingCategories = false;
        this.showErrorMessage('Não foi possível carregar as categorias. Tente novamente mais tarde.');
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

  generatePdf() {
    this.loading = true;
    this.productService
      .getAllProducts(this.currentSortOrder, this.search, this.categoryId)
      .subscribe({
        next: (products) => {
          const htmlContent = this.generateHtml(products);
          this.productService.generatePdf(htmlContent).subscribe({
            next: (blob: Blob) => {
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'produtos.pdf';
              document.body.appendChild(a);
              a.click();
              window.URL.revokeObjectURL(url);
              this.loading = false;
            },
            error: (error) => {
              console.error('Erro ao gerar PDF', error);
              this.loading = false;
              this.showErrorMessage('Não foi possível gerar o PDF. Tente novamente mais tarde.');
            }
          });
        },
        error: (error) => {
          console.error('Erro ao obter produtos para PDF', error);
          this.loading = false;
          this.showErrorMessage('Não foi possível gerar o PDF. Tente novamente mais tarde.');
        }
      });
  }

  // Modal functions
  openProductModal(productId?: string) {
    this.isModalOpen = true;
    this.currentProductId = productId || null;
    this.isEditMode = !!productId;
    
    if (this.isEditMode && productId) {
      this.loadProductDetails(productId);
    } else {
      this.resetForm();
    }
    
    // Impede o scroll do body enquanto o modal estiver aberto
    document.body.style.overflow = 'hidden';
  }
  
  closeModalCompletely() {
    this.isModalOpen = false;
    this.showNewCategoryForm = false;
    this.newCategoryName = '';
    document.body.style.overflow = '';
  }
  
  loadProductDetails(productId: string) {
    this.loading = true;
    this.productService.getProductById(productId).subscribe({
      next: (product) => {
        this.productForm.patchValue({
          code: product.code,
          name: product.name,
          description: product.description,
          costPrice: product.costPrice,
          salePrice: product.salePrice,
          quantity: product.quantity,
          unity: product.unity,
          categoryId: product.categoryId
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar detalhes do produto', error);
        this.loading = false;
        this.showErrorMessage('Não foi possível carregar os detalhes do produto.');
        this.closeModalCompletely();
      }
    });
  }
  
  resetForm() {
    this.productForm.reset({
      code: null,
      name: '',
      description: '',
      costPrice: 0,
      salePrice: 0,
      quantity: 0,
      unity: 0,
      categoryId: ''
    });
  }
  
  saveProduct() {
    if (this.productForm.invalid) {
      // Marca todos os campos como touched para mostrar os erros
      Object.keys(this.productForm.controls).forEach(key => {
        this.productForm.get(key)?.markAsTouched();
      });
      return;
    }
    
    this.loading = true;
    const productData = this.productForm.value;
    
    if (this.isEditMode && this.currentProductId) {
      // Atualizar produto existente
      this.productService.updateProduct(this.currentProductId, productData).subscribe({
        next: () => {
          this.loading = false;
          this.closeModalCompletely();
          this.loadProducts();
          this.showSuccessMessage('Produto atualizado com sucesso!');
        },
        error: (error) => {
          console.error('Erro ao atualizar produto', error);
          this.loading = false;
          this.showErrorMessage('Não foi possível atualizar o produto. Tente novamente mais tarde.');
        }
      });
    } else {
      // Criar novo produto
      this.productService.addProduct(productData).subscribe({
        next: () => {
          this.loading = false;
          this.closeModalCompletely();
          this.loadProducts();
          this.showSuccessMessage('Produto criado com sucesso!');
        },
        error: (error) => {
          console.error('Erro ao criar produto', error);
          this.loading = false;
          this.showErrorMessage('Não foi possível criar o produto. Tente novamente mais tarde.');
        }
      });
    }
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

  onRowClick(product: Product) {
    this.selectedProductId = product.id;
  }

  onSearch(searchTerm: string = ''): void {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    this.searchTimeout = setTimeout(() => {
      this.search = searchTerm;
      this.loadProducts();
    }, 500);
  }

  deleteProduct(id: string) {
    Swal.fire({
      title: 'Tem certeza que deseja excluir esse produto?',
      text: 'Você não poderá reverter isso!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, excluir',
      cancelButtonText: 'Cancelar',
      customClass: {
        cancelButton: 'order-1',
        confirmButton: 'order-2',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;
        this.productService.deleteProduct(id).subscribe({
          next: () => {
            this.loadProducts();
            this.showSuccessMessage('Produto excluído com sucesso!');
          },
          error: (error) => {
            console.error('Erro ao deletar produto', error);
            this.loading = false;
            this.showErrorMessage('Não foi possível excluir o produto. Tente novamente mais tarde.');
          }
        });
      }
    });
  }

  // Helpers e formatadores
  getStockClass(quantity: number): string {
    if (quantity <= 5) {
      return 'stock-low';
    } else if (quantity <= 10) {
      return 'stock-medium';
    } else {
      return 'stock-good';
    }
  }

  showSuccessMessage(message: string): void {
    Swal.fire({
      icon: 'success',
      title: 'Sucesso',
      text: message,
      timer: 2000,
      showConfirmButton: false
    });
  }

  showErrorMessage(message: string): void {
    Swal.fire({
      icon: 'error',
      title: 'Erro',
      text: message
    });
  }

  generateHtml(products: Product[]): string {
    let htmlContent = `
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          table {
            width: 100%;
            border-collapse: collapse;
            page-break-inside: auto;
          }
  
          table th {
            background-color: #f2f2f2;
            text-align: left;
            padding: 8px;
            border: 1px solid #dddddd;
            position: sticky;
            top: 0;
          }
  
          table td {
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

          h1 {
            text-align: center;
            margin-bottom: 20px;
          }
        </style>
      </head>
      <body>
        <h1>Relatório de Produtos</h1>
        <table>
          <thead>
            <tr>
              <th>Código</th>
              <th>Nome</th>
              <th>Categoria</th>
              <th>Descrição</th>
              <th>Custo</th>
              <th>Venda</th>
              <th>Estoque</th>
            </tr>
          </thead>
          <tbody>
    `;

    products.forEach((product) => {
      htmlContent += `
        <tr>
          <td>${product.code || '-'}</td>
          <td>${product.name}</td>
          <td>${product.category?.name || '-'}</td>
          <td>${product.description || '-'}</td>
          <td>${this.util.toMoney(product.costPrice)}</td>
          <td>${this.util.toMoney(product.salePrice)}</td>
          <td>${product.quantity}</td>
        </tr>
      `;
    });

    htmlContent += `
          </tbody>
        </table>
        <p style="text-align: right; margin-top: 20px;">
          Total de produtos: ${products.length}
        </p>
        <p style="text-align: right;">
          Gerado em: ${new Date().toLocaleDateString()} às ${new Date().toLocaleTimeString()}
        </p>
      </body>
      </html>
    `;

    return htmlContent;
  }

  // Métodos para o gerenciamento de categorias
  toggleNewCategoryForm() {
    this.showNewCategoryForm = !this.showNewCategoryForm;
    if (!this.showNewCategoryForm) {
      this.newCategoryName = '';
    }
  }
  
  createNewCategory() {
    if (!this.newCategoryName || this.newCategoryName.trim() === '') {
      return;
    }
    
    this.loadingNewCategory = true;
    
    const newCategory = {
      name: this.newCategoryName.trim()
    };
    
    this.categoryService.addCategory(newCategory).subscribe({
      next: (result) => {
        // Atualiza a lista de categorias
        this.loadCategories();
        
        // Seleciona a nova categoria no formulário
        setTimeout(() => {
          this.productForm.patchValue({
            categoryId: result.id
          });
          
          this.loadingNewCategory = false;
          this.showNewCategoryForm = false;
          this.newCategoryName = '';
          this.showSuccessMessage('Categoria criada com sucesso!');
        }, 300);
      },
      error: (error) => {
        console.error('Erro ao criar categoria', error);
        this.loadingNewCategory = false;
        this.showErrorMessage('Não foi possível criar a categoria. Tente novamente mais tarde.');
      }
    });
  }
  
  // Cálculo de margem de lucro
  showProfitMargin(): boolean {
    const costPrice = this.productForm?.get('costPrice')?.value;
    const salePrice = this.productForm?.get('salePrice')?.value;
    
    return costPrice > 0 && salePrice > 0;
  }
  
  calculateProfitMargin(): number {
    const costPrice = this.productForm?.get('costPrice')?.value || 0;
    const salePrice = this.productForm?.get('salePrice')?.value || 0;
    
    if (costPrice <= 0 || salePrice <= 0) {
      return 0;
    }
    
    const margin = ((salePrice - costPrice) / costPrice) * 100;
    return Math.round(margin);
  }
  
  getProfitMarginClass(): string {
    const margin = this.calculateProfitMargin();
    
    if (margin < 15) {
      return 'margin-low';
    } else if (margin < 30) {
      return 'margin-medium';
    } else {
      return 'margin-good';
    }
  }
}
