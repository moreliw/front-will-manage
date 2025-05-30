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
import { MatPaginatorModule } from '@angular/material/paginator';
import { RouterModule } from '@angular/router';

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
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { TenantInterceptor } from './core/interceptors/tenant.interceptor';
import { ProcedureComponent } from './components/procedure/procedure.component';
import { CheckComponent } from './components/check/check.component';
import { CategoryComponent } from './pages/category/category.component';
import { ProductComponent } from './pages/product/product.component';
import { ProductFormComponent } from './pages/product/product-form/product-form.component';
import { CategoryFormComponent } from './pages/category/category-form/category-form.component';
import { InventoryComponent } from './pages/inventory/inventory.component';
import { InventoryHistoryComponent } from './pages/inventory/inventory-history/inventory-history.component';
import { SearchComponent } from './components/search/search.component';
import { InventoryControlComponent } from './components/inventory-control/inventory-control.component';
import { InventoryListControlComponent } from './components/inventory-list-control/inventory-list-control.component';
import { UpdateStatusScheduleComponent } from './components/update-status-schedule/update-status-schedule.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { AddCustomerComponent } from './components/add-customer/add-customer.component';
import { ResponsibleComponent } from './pages/responsible/responsible.component';
import { ResponsibleFormComponent } from './pages/responsible/responsible-form/responsible-form.component';
import { SortButtonsComponent } from './components/sort-buttons/sort-buttons.component';
import { HistoryComponent } from './components/history/history.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { InfoScheduleComponent } from './components/info-schedule/info-schedule.component';
import { PartnerComponent } from './pages/partner/partner.component';
import { PartnerFormComponent } from './pages/partner/partner-form/partner-form.component';
import { FinanceComponent } from './pages/finance/finance.component';
import { TenantSelectorComponent } from './components/tenant-selector/tenant-selector.component';
import { TestDashboardComponent } from './pages/test-dashboard/test-dashboard.component';

// Services
import { AuthService } from './core/services/auth.service';
import { ProductService } from './core/services/product.service';
import { ProductCategoryService } from './core/services/product-category.service';
import { InventoryService } from './core/services/inventory.service';

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
    InventoryHistoryComponent,
    SearchComponent,
    InventoryControlComponent,
    InventoryListControlComponent,
    UpdateStatusScheduleComponent,
    PaginationComponent,
    AddCustomerComponent,
    ResponsibleComponent,
    ResponsibleFormComponent,
    SortButtonsComponent,
    HistoryComponent,
    CalendarComponent,
    InfoScheduleComponent,
    PartnerComponent,
    PartnerFormComponent,
    FinanceComponent,
    TenantSelectorComponent,
    TestDashboardComponent
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
    MatPaginatorModule,
    RouterModule
  ],
  providers: [
    // Services
    AuthService,
    ProductService,
    ProductCategoryService,
    InventoryService,
    
    // Interceptors
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: TenantInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
