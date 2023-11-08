import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SeccionUsuariosComponent } from './seccion-usuarios.component';
import { SeccionUsuariosRoutingModule } from './seccion-usuarios-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SeccionUsuariosRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [
    SeccionUsuariosComponent
  ]
})
export class SeccionUsuariosModule { }