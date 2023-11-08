import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';

const routes: Routes = [
  { path: '', component: HomeComponent },

  {
    path: 'config',
    loadChildren: () => import('./seccion-usuarios/seccion-usuarios.module')
      .then(mod => mod.SeccionUsuariosModule)
  },

  {
    path: 'turnos',
    loadChildren: () => import('./mis-turnos/mis-turnos.module')
      .then(mod => mod.MisTurnosModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }