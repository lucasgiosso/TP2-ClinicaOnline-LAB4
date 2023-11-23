import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';

import { PerfilComponent } from './perfil.component';
import { PerfilRoutingModule } from './perfil-routing.module';
import { SharedModule } from '../../../../shared/shared.module';
import { EspecialistaDispoComponent } from './especialista-dispo/especialista-dispo.component';


@NgModule({
  imports: [
    CommonModule,
    PerfilRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
    
  ],
  declarations: [
    PerfilComponent,
    EspecialistaDispoComponent

  ]
})
export class PerfilModule { }
