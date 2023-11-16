import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { AdminGuard } from 'src/app/guards/admin.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },

  {
    path: 'config',
    loadChildren: () => import('./seccion-usuarios/seccion-usuarios.module')
      .then(mod => mod.SeccionUsuariosModule),
      canActivate: [AdminGuard],
  },

  {
    path: 'turnos',
    loadChildren: () => import('./mis-turnos/mis-turnos.module')
      .then(mod => mod.MisTurnosModule)
  },

  {
    path: 'perfil',
    loadChildren: () => import('./perfil/perfil.module')
      .then(mod => mod.PerfilModule)
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }