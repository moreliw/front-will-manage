import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './pages/auth/auth.guard';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CustomerComponent } from './pages/customer/customer.component';
import { CustomerFormComponent } from './pages/customer/customer-form/customer-form.component';
import { ScheduleComponent } from './pages/schedule/schedule.component';
import { ScheduleFormComponent } from './pages/schedule/schedule-form/schedule-form.component';

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

  { path: 'schedule', component: ScheduleComponent, canActivate: [AuthGuard] },
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
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
