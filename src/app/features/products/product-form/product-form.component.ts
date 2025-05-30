import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  isEditMode = false;
  productId: number | null = null;
  loading = false;
  categories: any[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required]],
      categoryId: ['', [Validators.required]],
      description: [''],
      price: ['', [Validators.required, Validators.min(0)]],
      cost: ['', [Validators.min(0)]],
      stock: ['0', [Validators.required, Validators.min(0)]],
      minStock: ['0', [Validators.min(0)]],
      sku: [''],
      barcode: [''],
      active: [true]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.productId = +id;
      this.loadProductDetails(this.productId);
    }
  }

  loadCategories(): void {
    // Implementar chamada ao serviço de categorias
    // Temporariamente, vamos usar dados mock
    this.categories = [
      { id: 1, name: 'Categoria 1' },
      { id: 2, name: 'Categoria 2' },
      { id: 3, name: 'Categoria 3' }
    ];
  }

  loadProductDetails(id: number): void {
    this.loading = true;
    // Implementar chamada ao serviço de produtos
    // Temporariamente, vamos usar dados mock
    setTimeout(() => {
      const product = {
        id: id,
        name: 'Produto ' + id,
        categoryId: 1,
        description: 'Descrição do produto ' + id,
        price: 19.99,
        cost: 10.00,
        stock: 10,
        minStock: 5,
        sku: 'SKU-00' + id,
        barcode: '789' + id,
        active: true
      };
      
      this.productForm.patchValue(product);
      this.loading = false;
    }, 500);
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.markFormGroupTouched(this.productForm);
      return;
    }

    const productData = this.productForm.value;
    
    this.loading = true;
    if (this.isEditMode && this.productId) {
      // Implementar lógica de atualização
      setTimeout(() => {
        this.loading = false;
        this.router.navigate(['/products/list']);
      }, 500);
    } else {
      // Implementar lógica de criação
      setTimeout(() => {
        this.loading = false;
        this.router.navigate(['/products/list']);
      }, 500);
    }
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/products/list']);
  }
} 