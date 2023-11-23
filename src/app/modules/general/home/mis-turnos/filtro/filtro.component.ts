import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-filtro',
  templateUrl: './filtro.component.html',
  styleUrls: ['./filtro.component.scss']
})
export class FiltroComponent {

  @Output() filtroAplicado = new EventEmitter<any>();

  filtro: any = { especialidad: '', especialista: '' };
  especialidades: string[] = ['Cardiología', 'Dermatología', 'Oftalmología'];
  sugerenciasEspecialidad: string[] = [];
  medicosPorEspecialidad: { [especialidad: string]: string[] } = {
    'Cardiología': ['Dr. García', 'Dra. Rodríguez', 'Dr. Sánchez'],
    'Dermatología': ['Dra. López', 'Dr. Fernández', 'Dra. Pérez'],
    'Oftalmología': ['Dr. Martínez', 'Dra. Gómez', 'Dr. Torres'],
  };
  sugerenciasEspecialista: string[] = [];

  aplicarFiltro() {
    this.filtroAplicado.emit(this.filtro);
  }

  autocompletarEspecialidad(value: string): void {
    if (value.trim() === '') {
      this.sugerenciasEspecialidad = [];
      this.filtro.especialista = '';
      return;
    }

    this.sugerenciasEspecialidad = this.especialidades.filter(especialidad =>
      especialidad.toLowerCase().includes(value.toLowerCase())
    );
  }

  seleccionarEspecialidad(sugerencia: string): void {
    this.filtro.especialidad = sugerencia;
    this.sugerenciasEspecialidad = [];
  }

  autocompletarEspecialista(value: string): void {
    if (this.filtro.especialidad && value.trim() !== '') {
      const especialidadSeleccionada = this.filtro.especialidad;
      const medicos = this.medicosPorEspecialidad[especialidadSeleccionada] || [];

      this.sugerenciasEspecialista = medicos.filter(medico =>
        medico.toLowerCase().includes(value.toLowerCase())
      );
    } else {
      this.sugerenciasEspecialista = [];
    }
  }

  seleccionarEspecialista(sugerencia: string): void {
    this.filtro.especialista = sugerencia;
    this.sugerenciasEspecialista = [];
  }
}
