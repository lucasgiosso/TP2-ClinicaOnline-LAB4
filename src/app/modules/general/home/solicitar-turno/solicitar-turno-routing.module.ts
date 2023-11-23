import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SolicitarTurnoComponent } from './solicitar-turno.component';

const routes: Routes = [
  { path: '', component: SolicitarTurnoComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SolicitarTurnoRoutingModule { }