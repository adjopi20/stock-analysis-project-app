import { Routes } from '@angular/router';
import { DashboardCanvasComponent } from './core/layout/dashboard-canvas/dashboard-canvas.component';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./core/layout/homepage/homepage.component').then(
        (m) => m.HomepageComponent
      ),
  },
  {
    path: 'histogram-analysis',
    loadComponent: () =>
      import('./core/layout/dashboard-canvas/dashboard-canvas.component').then(
        (m) => m.DashboardCanvasComponent
      ),
  },
  

  // {
  //   path: '',
  //   loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent)
  // },
  {
    path: 'auth/register',
    loadComponent: () =>
      import('./core/auth/register/register.component').then(
        (m) => m.RegisterComponent
      ),
  },
  {
    path: 'auth/signin',
    loadComponent: () =>
      import('./core/auth/signin/signin.component').then(
        (m) => m.SigninComponent
      ),
  },
];
