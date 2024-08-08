import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from 'src/app/models/category';
import { CategoryService } from 'src/app/service/category.service';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss'],
})
export class CategoryFormComponent implements OnInit {
  formValue: FormGroup;
  isEdit: boolean;
  title: string = 'Categoria';
  id: string;
  customer: Category;
  loading = false;

  constructor(
    public fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService
  ) {
    this.isEdit = this.route.snapshot.paramMap.has('id');

    if (this.isEdit) {
      this.id = this.route.snapshot.paramMap.get('id');
    }

    this.formValue = fb.group({
      name: [null, Validators.required],
      description: [null, null],
      createdAt: [null, null],
    });
  }

  ngOnInit(): void {
    this.getData();
  }

  private getData() {
    this.id = this.route.snapshot.paramMap.get('id');

    if (this.id !== undefined && this.id != null) {
      this.loading = true;
      this.categoryService.getCategoryById(this.id).subscribe((category) => {
        this.formValue.patchValue({
          ...category,
        });
        this.loading = false;
      });
    }
  }

  addCategory() {
    this.loading = true;
    this.categoryService.addCategory(this.formValue.value).subscribe(
      () => {
        this.loading = false;
        this.goBack();
      },
      () => {
        this.loading = false;
      }
    );
  }

  updateCategory() {
    this.loading = true;

    this.categoryService
      .updateCategory(this.id, this.formValue.value)
      .subscribe(
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
