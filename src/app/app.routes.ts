import { Routes } from '@angular/router';
import {Inicio} from './pages/inicio/inicio';
import {Tareas} from './pages/tareas/tareas';
import {Acerca} from './pages/acerca/acerca';

export const routes: Routes = [
  { path: '', component: Inicio },
  { path: 'tareas', component: Tareas },
  { path: 'acerca', component: Acerca },
  { path: '**', redirectTo: '' }
];
