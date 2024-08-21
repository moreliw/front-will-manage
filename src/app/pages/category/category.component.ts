import { Component, OnInit } from '@angular/core';
import { Category } from '../../models/category';
import { CategoryService } from 'src/app/service/category.service';
import { UtilService } from 'src/app/service/util.service';

import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit {
  categoryList: Category[] = [];
  loading = false;

  constructor(
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute,
    private util: UtilService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this.loading = true;
    this.categoryService.getCategories().subscribe((result) => {
      this.categoryList = result;
      this.loading = false;
    });
  }

  addCategory() {
    this.router.navigate(['/category/new']);
  }

  openEditCategory(id: string) {
    this.router.navigate(['./edit/' + id], { relativeTo: this.route });
  }

  deleteCategory(id: string) {
    Swal.fire({
      title: 'Tem certeza que deseja excluir essa categoria?',
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
        this.categoryService.deleteCategory(id).subscribe(
          () => {
            this.loadCategories();
            this.loading = false;
            Swal.fire('Deletado!', 'A categoria foi deletada.', 'success');
          },
          (error: HttpErrorResponse) => {
            this.loading = false;
            const errorMessage =
              error.error?.messages[0] ||
              'Houve um problema ao deletar a categoria.';

            Swal.fire(
              'Houve um problema ao deletar a categoria!',
              errorMessage,
              'error'
            );
          }
        );
      }
    });
  }
}
