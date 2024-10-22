import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './pages/auth/auth.guard';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CustomerComponent } from './pages/customer/customer.component';
import { CustomerFormComponent } from './pages/customer/customer-form/customer-form.component';
import { ScheduleComponent } from './pages/schedule/schedule.component';
import { ScheduleFormComponent } from './pages/schedule/schedule-form/schedule-form.component';
import { CategoryComponent } from './pages/category/category.component';
import { CategoryFormComponent } from './pages/category/category-form/category-form.component';
import { ProductComponent } from './pages/product/product.component';
import { ProductFormComponent } from './pages/product/product-form/product-form.component';
import { InventoryComponent } from './pages/inventory/inventory.component';
import { InventoryHistoryComponent } from './pages/inventory/inventory-history/inventory-history.component';
import { ResponsibleComponent } from './pages/responsible/responsible.component';
import { ResponsibleFormComponent } from './pages/responsible/responsible-form/responsible-form.component';
import { PartnerComponent } from './pages/partner/partner.component';
import { PartnerFormComponent } from './pages/partner/partner-form/partner-form.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
    canActivate: [AuthGuard],
  },
  { path: 'login', component: LoginComponent },
  {
    path: 'admin',
    canActivate: [AuthGuard],
    loadChildren: () => import('./app.module').then((m) => m.AppModule),
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },

  { path: 'customers', component: CustomerComponent, canActivate: [AuthGuard] },
  {
    path: 'customers/new',
    component: CustomerFormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'customers/edit/:id',
    component: CustomerFormComponent,
    canActivate: [AuthGuard],
  },

  {
    path: 'schedule',
    component: ScheduleComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'schedule/new',
    component: ScheduleFormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'schedule/edit/:id',
    component: ScheduleFormComponent,
    canActivate: [AuthGuard],
  },

  { path: 'category', component: CategoryComponent, canActivate: [AuthGuard] },
  {
    path: 'category/new',
    component: CategoryFormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'category/edit/:id',
    component: CategoryFormComponent,
    canActivate: [AuthGuard],
  },

  { path: 'product', component: ProductComponent, canActivate: [AuthGuard] },
  {
    path: 'product/new',
    component: ProductFormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'product/edit/:id',
    component: ProductFormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'inventory',
    component: InventoryComponent,
    canActivate: [AuthGuard],
  },

  {
    path: 'inventory-history',
    component: InventoryHistoryComponent,
    canActivate: [AuthGuard],
  },

  {
    path: 'responsible',
    component: ResponsibleComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'responsible/new',
    component: ResponsibleFormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'responsible/edit/:id',
    component: ResponsibleFormComponent,
    canActivate: [AuthGuard],
  },

  {
    path: 'partner',
    component: PartnerComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'partner/new',
    component: PartnerFormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'partner/edit/:id',
    component: PartnerFormComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule],
})
export class AppRoutingModule {}
