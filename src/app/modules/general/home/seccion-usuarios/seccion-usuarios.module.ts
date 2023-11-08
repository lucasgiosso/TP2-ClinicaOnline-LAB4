import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SeccionUsuariosComponent } from './seccion-usuarios.component';
import { SeccionUsuariosRoutingModule } from './seccion-usuarios-routing.module';

@NgModule({
  imports: [
    CommonModule,
    SeccionUsuariosRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    SeccionUsuariosComponent
  ]
})
export class SeccionUsuariosModule { }