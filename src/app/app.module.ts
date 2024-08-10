import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { AppRoutingModule } from './app-routing.module';
import { NgSelectModule } from '@ng-select/ng-select';

import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CustomerComponent } from './pages/customer/customer.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { CustomerFormComponent } from './pages/customer/customer-form/customer-form.component';
import { LoadingComponent } from './components/loading/loading.component';
import { BalanceComponent } from './components/balance/balance.component';
import { ScheduleComponent } from './pages/schedule/schedule.component';
import { ScheduleFormComponent } from './pages/schedule/schedule-form/schedule-form.component';
import { AuthInterceptor } from './pages/auth/auth-interceptor.service';
import { ProcedureComponent } from './components/procedure/procedure.component';
import { CheckComponent } from './components/check/check.component';
import { CategoryComponent } from './pages/category/category.component';
import { ProductComponent } from './pages/product/product.component';
import { ProductFormComponent } from './pages/product/product-form/product-form.component';
import { CategoryFormComponent } from './pages/category/category-form/category-form.component';
import { InventoryComponent } from './pages/inventory/inventory.component';
import { InventoryFormComponent } from './pages/inventory/inventory-form/inventory-form.component';
import { SearchComponent } from './components/search/search.component';
import { InventoryControlComponent } from './components/inventory-control/inventory-control.component';
import { InventoryListControlComponent } from './components/inventory-list-control/inventory-list-control.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    CustomerComponent,
    SidebarComponent,
    CustomerFormComponent,
    LoadingComponent,
    BalanceComponent,
    ScheduleComponent,
    ScheduleFormComponent,
    ProcedureComponent,
    CheckComponent,
    CategoryComponent,
    ProductComponent,
    ProductFormComponent,
    CategoryFormComponent,
    InventoryComponent,
    InventoryFormComponent,
    SearchComponent,
    InventoryControlComponent,
    InventoryListControlComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatTooltipModule,
    BrowserAnimationsModule,
    MatDialogModule,
    NgSelectModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
