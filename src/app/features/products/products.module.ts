import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductFormComponent } from './product-form/product-form.component';

// Definir as rotas do módulo
const routes: Routes = [
  { 
    path: '', 
    redirectTo: 'list',
    pathMatch: 'full' 
  },
  {
    path: 'list',
    component: ProductListComponent
  },
  {
    path: 'create',
    component: ProductFormComponent
  },
  {
    path: 'edit/:id',
    component: ProductFormComponent
  }
];

@NgModule({
  declarations: [
    ProductListComponent,
    ProductFormComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule
  ]
})
export class ProductsModule { } 