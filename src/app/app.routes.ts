import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'setup',
    pathMatch: 'full',
  },
  {
    path: 'setup',
    loadComponent: () => import('./pages/setup/setup').then((m) => m.Setup),
  },
  {
    path: 'test',
    loadComponent: () => import('./pages/test/test').then((m) => m.Test),
  },
  {
    path: 'result',
    loadComponent: () => import('./pages/result/result').then((m) => m.Result),
  },
  {
    path: '**',
    redirectTo: 'setup',
  },
];
