import { Component, OnInit  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EspecialistaService } from 'src/app/services/especialista.service';
import Swal from 'sweetalert2';

export interface Horario {
  especialidad: string;
  dia: string;
  horaInicio: string;
  horaFin: string;
}

@Component({
  selector: 'app-especialista-dispo',
  templateUrl: './especialista-dispo.component.html',
  styleUrls: ['./especialista-dispo.component.scss']
})
export class EspecialistaDispoComponent implements OnInit{

  disponibilidadForm: FormGroup;
  horariosDisponibles: Horario[] = [];

  constructor(private fb: FormBuilder, private especialistaService: EspecialistaService) {
    this.disponibilidadForm = this.fb.group({
      especialidad: ['', Validators.required],
      dia: ['', Validators.required],
      horaInicio: ['', Validators.required],
      horaFin: ['', Validators.required],
    });
  }

  ngOnInit() {

    this.especialistaService.disponibilidad$.subscribe(
      (horarios) => {

        this.horariosDisponibles = horarios.sort((a, b) => {
          const dayComparison = a.dia.localeCompare(b.dia);
          return dayComparison === 0 ? a.horaInicio.localeCompare(b.horaInicio) : dayComparison;
        });
      }
    );
  }
  guardarDisponibilidad() {

    if (this.disponibilidadForm.valid) {
      const nuevoHorario = this.disponibilidadForm.value as Horario;
      this.especialistaService.guardarDisponibilidad(nuevoHorario);
      this.disponibilidadForm.reset();
  
      Swal.fire({
        icon: 'success',
        title: 'Disponibilidad guardada con éxito',
        showConfirmButton: false,
        timer: 1500
      });
    } else {
      
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor, completa todos los campos del formulario.'
      });
    }

  }
}
