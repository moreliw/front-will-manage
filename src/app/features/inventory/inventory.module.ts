import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { InventoryListComponent } from './inventory-list/inventory-list.component';
import { InventoryTransactionsComponent } from './inventory-transactions/inventory-transactions.component';

// Definir as rotas do módulo
const routes: Routes = [
  { 
    path: '', 
    redirectTo: 'list',
    pathMatch: 'full' 
  },
  {
    path: 'list',
    component: InventoryListComponent
  },
  {
    path: 'transaction',
    component: InventoryTransactionsComponent
  },
  {
    path: 'transactions/:id',
    component: InventoryTransactionsComponent
  },
  {
    path: 'adjust/:id',
    component: InventoryTransactionsComponent
  }
];

@NgModule({
  declarations: [
    InventoryListComponent,
    InventoryTransactionsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule
  ]
})
export class InventoryModule { } 