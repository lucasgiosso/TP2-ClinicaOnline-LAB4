import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { AdminGuard } from 'src/app/guards/admin.guard';
import { PacienteAdminGuard } from 'src/app/guards/paciente-admin.guard';
import { PacienteEspecialistaGuard } from 'src/app/guards/paciente-especialista.guard';


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
      .then(mod => mod.MisTurnosModule),
      canActivate: [PacienteEspecialistaGuard],
  },

  {
    path: 'solicitar',
    loadChildren: () => import('./solicitar-turno/solicitar-turno.module')
      .then(mod => mod.SolicitarTurnoModule),
      canActivate: [PacienteAdminGuard],
      
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