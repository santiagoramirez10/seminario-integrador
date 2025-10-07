import { Routes } from '@angular/router';
export const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: 'inicio', loadComponent: () => import('./pages/inicio/inicio.component').then(m => m.InicioComponent) },
  { path: 'cargar-datos', loadComponent: () => import('./pages/cargar-datos/cargar-datos.component').then(m => m.CargarDatosComponent) },
  { path: 'configuracion', loadComponent: () => import('./pages/configuracion/configuracion.component').then(m => m.ConfiguracionComponent) },
  { path: 'resultados', loadComponent: () => import('./pages/resultados/resultados.component').then(m => m.ResultadosComponent) },
  { path: 'ayuda', loadComponent: () => import('./pages/ayuda/ayuda.component').then(m => m.AyudaComponent) },
  { path: '**', redirectTo: 'inicio' }
];
