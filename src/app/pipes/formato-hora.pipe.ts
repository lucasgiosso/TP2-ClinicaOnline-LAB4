import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatoHora'
})
export class FormatoHoraPipe implements PipeTransform {
  transform(hora: string): string {

    if (/^\d{2}:\d{2}$/.test(hora)) {
      const [horas, minutos] = hora.split(':');
      const horaNum = parseInt(horas, 10);

      return `${horaNum}:${minutos}`;
    } else {

      return hora;
    }
  }
}
