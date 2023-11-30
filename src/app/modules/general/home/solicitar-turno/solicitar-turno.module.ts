import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SolicitarTurnoRoutingModule } from './solicitar-turno-routing.module';
import { FilterEspPipe } from 'src/app/pipes/filter-esp.pipe';
import { FormatoHoraPipe } from 'src/app/pipes/formato-hora.pipe';

@NgModule({
  imports: [
    CommonModule,
    SolicitarTurnoRoutingModule,
    FormsModule

  ],
  declarations: [
    FormatoHoraPipe
  ],
})
export class SolicitarTurnoModule { }