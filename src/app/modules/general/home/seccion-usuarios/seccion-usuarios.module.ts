import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SeccionUsuariosComponent } from './seccion-usuarios.component';
import { SeccionUsuariosRoutingModule } from './seccion-usuarios-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ListaUsuariosComponent } from './lista-usuarios/lista-usuarios.component';
import { FilterPipe } from 'src/app/pipes/filter.pipe'


@NgModule({
  imports: [
    CommonModule,
    SeccionUsuariosRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,

  ],
  declarations: [
    SeccionUsuariosComponent,
    ListaUsuariosComponent,
    FilterPipe
  ]
})
export class SeccionUsuariosModule { }