import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from 'src/app/models/category';
import { Product } from 'src/app/models/product';
import { CategoryService } from 'src/app/service/category.service';
import { ProductService } from 'src/app/service/product.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
})
export class ProductFormComponent implements OnInit {
  formValue: FormGroup;
  isEdit: boolean;
  title: string = 'Produto';
  id: string;
  customer: Product;
  loading = false;
  categoryList: Category[] = [];

  constructor(
    public fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private categoryService: CategoryService
  ) {
    this.isEdit = this.route.snapshot.paramMap.has('id');

    if (this.isEdit) {
      this.id = this.route.snapshot.paramMap.get('id');
    }

    this.formValue = fb.group({
      name: [null, Validators.required],
      description: [null, null],
      costPrice: [null, null],
      salePrice: [null, null],
      quantity: [null, null],
      categoryId: [null, null],
    });
  }

  ngOnInit(): void {
    this.getData();
    this.loadCategories();
  }

  private getData() {
    this.id = this.route.snapshot.paramMap.get('id');

    if (this.id !== undefined && this.id != null) {
      this.loading = true;
      this.productService.getProductById(this.id).subscribe((product) => {
        this.formValue.patchValue({
          ...product,
        });
        this.loading = false;
      });
    }
  }

  loadCategories() {
    this.loading = true;
    this.categoryService.getCategories().subscribe((result) => {
      this.categoryList = result;
      this.loading = false;
    });
  }

  addProduct() {
    this.loading = true;
    this.productService.addProduct(this.formValue.value).subscribe(
      () => {
        this.loading = false;
        this.goBack();
      },
      () => {
        this.loading = false;
      }
    );
  }

  updateProduct() {
    this.loading = true;

    this.productService.updateProduct(this.id, this.formValue.value).subscribe(
      () => {
        this.loading = false;
        this.goBack();
      },
      () => {
        this.loading = false;
      }
    );
  }

  goBack() {
    const currentUrl = this.route.snapshot.url;
    if (currentUrl[currentUrl.length - 1].path === 'new') {
      this.router.navigate(['../'], { relativeTo: this.route });
    } else {
      this.router.navigate(['../../'], { relativeTo: this.route });
    }
  }
}
