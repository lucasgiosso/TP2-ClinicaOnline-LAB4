import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SeccionUsuariosComponent } from './seccion-usuarios.component';


const routes: Routes = [
  { path: '', component: SeccionUsuariosComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SeccionUsuariosRoutingModule { }