import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MisTurnosComponent } from './mis-turnos.component';
import { MisTurnosRoutingModule } from './mis-turnos-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    MisTurnosRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [
    MisTurnosComponent
  ]
})
export class MisTurnosModule { }