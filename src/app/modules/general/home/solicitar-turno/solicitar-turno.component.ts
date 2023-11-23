import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TurnosService } from 'src/app/services/turnos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-solicitar-turno',
  templateUrl: './solicitar-turno.component.html',
  styleUrls: ['./solicitar-turno.component.scss']
})
export class SolicitarTurnoComponent {
  solicitarTurnoForm: FormGroup;
  pacienteId = 1;
  especialidad: string = '';
  especialista: string = '';
  especialidades: string[] = ['Cardiología', 'Dermatología', 'Oftalmología']; 
  especialistas: string[] = ['Dr. García', 'Dra. López', 'Dr. Martínez']; 
  fechaSeleccionada: string = '';
  selectedDay: number = 1;
  selectedMonth: number = 1;
  selectedYear: number = new Date().getFullYear();
  formSubmitted: boolean;
  months: { value: string; name: string }[] = [];
  btnVolver = 'Volver a home';
  horaInicio = '';
  horaFin = '';
  fechaSeleccionadaComoDate = new Date();
  years: number[] = [2022, 2023, 2024, 2025, 2026];

  constructor(private turnosService: TurnosService, private router: Router, private fb: FormBuilder) {
    
    this.formSubmitted = false;

    this.solicitarTurnoForm = this.fb.group({
      especialidad: ['', Validators.required],
      especialista: ['', Validators.required],
      day: ['', Validators.required],
      months: ['', Validators.required],
      years: ['', Validators.required],
      horaInicio: ['', Validators.required],
      horaFin: ['', Validators.required],
    });
  
    this.months = [
      { value: '01', name: 'Enero' },
      { value: '02', name: 'Febrero' },
      { value: '03', name: 'Marzo' },
      { value: '04', name: 'Abril' },
      { value: '05', name: 'Mayo' },
      { value: '06', name: 'Junio' },
      { value: '07', name: 'Julio' },
      { value: '08', name: 'Agosto' },
      { value: '09', name: 'Septiembre' },
      { value: '10', name: 'Octubre' },
      { value: '11', name: 'Noviembre' },
      { value: '12', name: 'Diciembre' },
    ];

    const fechaManana: Date = new Date();
    fechaManana.setDate(fechaManana.getDate() + 1);
  
    const fechaActual: Date = new Date();
    const mesActual = fechaActual.getMonth() + 1; 
  
    this.months = this.months.filter(month => parseInt(month.value) >= mesActual);
  
    this.selectedMonth = mesActual;
    this.selectedYear = fechaActual.getFullYear();
  
    const fechaLimite: Date = new Date();
    fechaLimite.setDate(fechaActual.getDate() + 15);
    this.selectedDay = fechaActual.getDate();
  
    this.daysInMonth(this.selectedYear, this.selectedMonth);
    this.months = this.monthsInYear(this.selectedYear);
  }

   solicitarTurno() {
    const fechaActual: Date = new Date();
    const fechaLimite: Date = new Date();
    fechaLimite.setDate(fechaActual.getDate() + 15);
  
    if (this.especialidad && this.especialista) {
      const fechaSeleccionadaComoDate: Date = new Date(
        this.selectedYear,
        this.selectedMonth - 1,
        this.selectedDay
      );
  
      if (fechaSeleccionadaComoDate >= fechaActual && fechaSeleccionadaComoDate <= fechaLimite) {
        const nuevoTurno = this.turnosService.solicitarTurno(
          this.pacienteId,
          this.especialidad,
          this.especialista,
          this.selectedYear,
          this.selectedMonth,
          this.selectedDay,
          this.horaInicio,
          this.horaFin
        );
  
        console.log('Nuevo turno solicitado:', nuevoTurno);
  
        this.router.navigate(['/lista-turnos']);
      } else {
        console.error('La fecha del turno debe estar dentro de los próximos 15 días.');
      }
    } else {
      console.error('Por favor, seleccione una especialidad y un especialista antes de solicitar el turno.');
    }
  }

  public onClickHome(event: any): void 
  {
    this.router.navigate(['home']);
  }

  daysInMonth(selectedYear: number, selectedMonth: number): number[] {
    const lastDay = new Date(selectedYear, selectedMonth, 0).getDate();
    const daysArray = Array.from({ length: lastDay }, (_, index) => index + 1);
  
    const fechaActual: Date = new Date();
    const fechaLimite: Date = new Date();
    fechaLimite.setDate(fechaActual.getDate() + 15);
  
    return daysArray.filter(day => {
      const fechaComparacion = new Date(selectedYear, selectedMonth - 1, day);
      return fechaComparacion <= fechaLimite;
    });
  }

  monthsInYear(selectedYear: number): { value: string; name: string }[] {
    const fechaActual: Date = new Date();
    const mesActual = fechaActual.getMonth() + 1; 
  
    return this.months.filter(month => {
      if (selectedYear === fechaActual.getFullYear()) {
        return parseInt(month.value) >= mesActual;
      } else {
        return true;
      }
    });
  }

  guardarTurno() {

    const fechaActual: Date = new Date();
    const fechaLimite: Date = new Date();
    fechaLimite.setDate(fechaActual.getDate() + 15);
  
    if (this.especialidad && this.especialista) {
      const fechaSeleccionadaComoDate: Date = new Date(
        this.selectedYear,
        this.selectedMonth - 1,
        this.selectedDay
      );
  
      if (fechaSeleccionadaComoDate >= fechaActual && fechaSeleccionadaComoDate <= fechaLimite) {
        const nuevoTurno = this.turnosService.solicitarTurno(
          this.pacienteId,
          this.especialidad,
          this.especialista,
          this.selectedYear,
          this.selectedMonth,
          this.selectedDay,
          this.horaInicio,
          this.horaFin
        );
        console.log('Nuevo turno solicitado:', nuevoTurno);
        this.solicitarTurnoForm.reset();

        Swal.fire({
          icon: 'success',
          title: 'Turno solicitado con éxito',
          text: 'Tu turno ha sido solicitado correctamente.',
          confirmButtonText: 'OK'
        }).then(() => {

          this.router.navigate(['/lista-turnos']);
        });
      } else {

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'La fecha del turno debe estar dentro de los próximos 15 días. No puede elegir el dia de hoy'
        });
      }
    } else {

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor, seleccione una especialidad y un especialista antes de solicitar el turno.'
      });
    }
  }

  validarFecha() {
    const fechaSeleccionadaComoDate: Date = new Date(
      this.selectedYear,
      this.selectedMonth - 1,
      this.selectedDay
    );
  
    const fechaActual: Date = new Date();
    const fechaLimite: Date = new Date();
    fechaLimite.setDate(fechaActual.getDate() + 15);
  
    if (fechaSeleccionadaComoDate < fechaActual || fechaSeleccionadaComoDate > fechaLimite) {
      // La fecha no cumple con la restricción, puedes mostrar un mensaje de error o deshabilitar el botón de envío
      this.mostrarMensajeError('La fecha del turno debe estar dentro de los próximos 15 días.');
    }
  }

  mostrarMensajeError(mensaje: string) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: mensaje
    });
  }

  formularioEsValido(): boolean {
    return this.solicitarTurnoForm.valid && this.fechaCumpleRestriccion();
  }
  
  fechaCumpleRestriccion(): boolean {
    const fechaSeleccionadaComoDate: Date = new Date(
      this.selectedYear,
      this.selectedMonth - 1,
      this.selectedDay
    );
  
    const fechaActual: Date = new Date();
    const fechaLimite: Date = new Date();
    fechaLimite.setDate(fechaActual.getDate() + 15);
  
    return fechaSeleccionadaComoDate >= fechaActual && fechaSeleccionadaComoDate <= fechaLimite;
  }

}
