import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MisTurnosComponent } from './mis-turnos.component';
import { MisTurnosRoutingModule } from './mis-turnos-routing.module';

@NgModule({
  imports: [
    CommonModule,
    MisTurnosRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    MisTurnosComponent
  ]
})
export class MisTurnosModule { }