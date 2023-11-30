import { Component, OnDestroy, OnInit  } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { EspecialistaService } from 'src/app/services/especialista.service';
import Swal from 'sweetalert2';

export interface Horario {
  id?: number;
  especialidad: string;
  dias: string;
  horaInicio: string;
  horaFin: string;
}

@Component({
  selector: 'app-especialista-dispo',
  templateUrl: './especialista-dispo.component.html',
  styleUrls: ['./especialista-dispo.component.scss']
})
export class EspecialistaDispoComponent implements OnInit, OnDestroy {

  private unsubscribe$ = new Subject<void>();
  disponibilidadForm: FormGroup;
  horariosDisponibles: Horario[] = [];
  mostrarBotonGuardar = true;
  horasDisponibles: string[] = [];
  editandoHorario: boolean = false;

  constructor(private fb: FormBuilder, public especialistaService: EspecialistaService) {
    this.disponibilidadForm = this.fb.group({
      id: [''],
      //especialidad: ['', Validators.required],
      dias: this.fb.array([], Validators.required),
      horaInicio: ['', Validators.required],
      horaFin: ['', Validators.required],
    });
  }

  ngOnInit() {

    this.especialistaService.disponibilidad$.subscribe((horarios) => {
      this.horariosDisponibles = horarios;
  
      if (this.editandoHorario && this.diasFormArray.length === 0) {
        this.cargarDias();
      }
    });

    this.especialistaService.cargarDisponibilidad();

    this.generarHorasDisponibles();
    
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getDiasString(dias: string[] | string): string {
    if (Array.isArray(dias)) {
      return dias.join(', ');
    } else {
      return dias;
    }
  }

  get diasFormArray() {
    return this.disponibilidadForm.get('dias') as FormArray;
  }

  cargarDias() {
    const horarioAModificar = this.horariosDisponibles.find(horario =>
      horario.especialidad === this.disponibilidadForm.value.especialidad &&
      horario.dias === this.disponibilidadForm.value.dias &&
      horario.horaInicio === this.disponibilidadForm.value.horaInicio &&
      horario.horaFin === this.disponibilidadForm.value.horaFin
    );
  
    if (horarioAModificar) {
      this.toggleDias(horarioAModificar.dias);
    }
  }

  toggleDias(dias: string | string[]) {
    const diasControl = this.disponibilidadForm.get('dias') as FormArray;
    diasControl.clear();
    if (Array.isArray(dias)) {
      dias.forEach(dia => diasControl.push(this.fb.control(dia)));
    } else {
      diasControl.push(this.fb.control(dias));
    }
  }

  private generarHorasDisponibles() {
    const horaInicial = 8;
    const horaFinal = 21; 

    for (let hora = horaInicial; hora <= horaFinal; hora++) {
      for (let minuto = 0; minuto < 60; minuto += 45) {
        const horaFormateada = `${hora.toString().padStart(2, '0')}:${minuto.toString().padStart(2, '0')}`;
        this.horasDisponibles.push(horaFormateada);
      }
    }
  }

  isDiaSeleccionado(dia: string): boolean {
    return this.disponibilidadForm.value.dias.includes(dia);
  }

  toggleDia(dia: string): void {
    const diasControl = this.disponibilidadForm.get('dias') as FormArray;

    if (this.isDiaSeleccionado(dia)) {
      const index = diasControl.value.indexOf(dia);
      diasControl.removeAt(index);
    } else {
      diasControl.push(this.fb.control(dia));
    }

  }

  obtenerIdHorarioAModificar(): number | null {
    return this.editandoHorario ? this.disponibilidadForm.value.id || null : null;
  }

  guardarDisponibilidad() {
    if (this.disponibilidadForm.valid) {
      const diasSeleccionados = this.disponibilidadForm.value.dias || [];
      const diasFiltrados = diasSeleccionados.filter((dia: string | null) => dia !== null);
  
      const nuevoHorario = {
        ...this.disponibilidadForm.value,
        dias: Array.isArray(diasFiltrados) ? diasFiltrados : [diasFiltrados],
      };
  
      if (this.esHorarioValido(nuevoHorario.horaInicio, nuevoHorario.horaFin)) {
        const idHorarioAModificar = this.obtenerIdHorarioAModificar();
  
        if (idHorarioAModificar !== null) {
          const index = this.horariosDisponibles.findIndex(h => h.id === idHorarioAModificar);
  
          if (index !== -1) {
            //this.horariosDisponibles[index] = nuevoHorario;
            this.especialistaService.modificarDisponibilidad(idHorarioAModificar, nuevoHorario);
                    
          }
        } else {
          this.especialistaService.guardarDisponibilidad(nuevoHorario);
        }
  
        this.disponibilidadForm.reset();
        this.mostrarBotonGuardar = true;
        this.editandoHorario = false;
  
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
          text: 'El horario seleccionado no es válido.'
        });
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor, completa todos los campos del formulario.'
      });
    }
  }
  

  esHorarioValido(horaInicio: string, horaFin: string): boolean {
    const horaInicioDate = new Date(`2000-01-01T${horaInicio}`);
    const horaFinDate = new Date(`2000-01-01T${horaFin}`);
    
    return horaInicioDate.getTime() < horaFinDate.getTime();
  }

  modificarHorario(horario: Horario) {

    this.toggleDias(horario.dias);
    this.editandoHorario = true;
    this.mostrarBotonGuardar = true;
    
    this.disponibilidadForm.patchValue({
      ...horario,
    });
    // this.disponibilidadForm.patchValue({
    //   especialidad: horario.especialidad || '',
    //   dias: horario.dias || '',
    //   horaInicio: horario.horaInicio || '',
    //   horaFin: horario.horaFin || '',
    // });

  }

  cancelarModificacion(): void {
    this.editandoHorario = false;
    this.disponibilidadForm.reset(); 
  }
}
