import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MisTurnosRoutingModule } from './mis-turnos-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { MisTurnosComponent } from './mis-turnos.component';

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