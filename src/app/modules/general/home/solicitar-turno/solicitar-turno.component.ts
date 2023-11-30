import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TurnosService } from 'src/app/services/turnos.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';
import { addDays, format, startOfTomorrow } from 'date-fns';
import { DomSanitizer, SafeUrl  } from '@angular/platform-browser';
import { EspecialistaService } from 'src/app/services/especialista.service';

interface Especialista {
  nombre: string;
  imagenPerfil: string;
}

interface TurnoDisponible {
  id: number;
  dias: string[];
  horaInicio: string;
  horaFin: string;
}



@Component({
  selector: 'app-solicitar-turno',
  templateUrl: './solicitar-turno.component.html',
  styleUrls: ['./solicitar-turno.component.scss']
})
export class SolicitarTurnoComponent implements OnInit{
  solicitarTurnoForm: FormGroup;
  pacienteId = 1;
  especialidad: string = '';
  especialista: string = '';
  especialidades: string[] = []; 
  especialistas: { nombre: string, imagenPerfil: string }[] = [];
  availableDates: string[] = [];
  fechaSeleccionada: string = '';
  selectedDay: number = 1;
  formSubmitted: boolean;
  btnVolver = 'Volver a home';
  horaInicio = '';
  horaFin = '';
  filtro: string = '';
  fechaSeleccionadaComoDate = new Date();
  especialidadesConImagenes: { [key: string]: string } = {};
  imagenPorDefecto: string = 'assets/imagenesEspecialidades/noimage.png';
  imagenEspecialidadSeleccionada: string = '';
  seleccionado: string | null = null;
  especialistaSeleccionado: any | null = null;
  fechaString = '';
  especialidadSeleccionada: boolean = false;
  especialistaSeleccionadoHorario: boolean = false;
  especialidadIndex: number | null = null;
  horariosDisponibles: string[] = [];

  constructor(private sanitizer: DomSanitizer, public especialistaService: EspecialistaService, private turnosService: TurnosService, private router: Router, private fb: FormBuilder, private userService: UserService) {
    
    this.formSubmitted = false;

    this.solicitarTurnoForm = this.fb.group({
      especialidad: ['', Validators.required],
      especialista: ['', Validators.required],
      date: ['', Validators.required],
      day: ['', Validators.required],
      months: ['', Validators.required],
      years: ['', Validators.required],
      horaInicio: ['', Validators.required],
      horaFin: ['', Validators.required],
    });

    const tomorrow = startOfTomorrow();
    this.availableDates = [];

    for (let i = 0; i < 15; i++) {
      const currentDate = addDays(tomorrow, i);
      const formattedDate = format(currentDate, 'dd-MM-yyyy');
      this.availableDates.push(formattedDate);
    }
  }

  async ngOnInit() {

    this.inicializarEspecialidades();

    this.especialidadesConImagenes = {
      ginecologia: 'assets/imagenesEspecialidades/ginecologia.png',
      kinesiologia: 'assets/imagenesEspecialidades/kinesiologia.png',
      nutricionista: 'assets/imagenesEspecialidades/nutricionista.png',
      cardiologia: 'assets/imagenesEspecialidades/cardiologia.png',
    };
    this.especialidadSeleccionada = false;
  }

  public onClickHome(event: any): void 
  {
    this.router.navigate(['home']);
  }

  toggleEspecialidad(index: number) {
    if (this.especialidadIndex === index) {

      this.especialidadSeleccionada = !this.especialidadSeleccionada;
    } else {

      this.especialidadSeleccionada = true;
      this.especialidadIndex = index;
    }
  }
  onEspecialidadButtonClick(especialidad: string) {

    this.seleccionado = especialidad === this.seleccionado ? null : especialidad;
    this.especialistaSeleccionadoHorario = false;
    
  }

  // onEspecialidadButtonClick1(especialista: any) {
  //   this.especialistaSeleccionado = this.especialistaSeleccionado === especialista ? null : especialista;
  //   this.especialistaSeleccionadoHorario = true;

  // }

  onEspecialidadButtonClick1(especialista: any) {
    this.especialistaSeleccionado = this.especialistaSeleccionado === especialista ? null : especialista;
    this.especialistaSeleccionadoHorario = true;
  
    if (this.especialistaSeleccionado) {
      const especialistaId = this.especialistaSeleccionado.id; 
      this.especialistaService.obtenerTurnosDisponiblesParaEspecialista(especialistaId)
      .then((turnosDisponibles: TurnoDisponible[]) => {
        console.log(turnosDisponibles);
          //this.horariosDisponibles = turnosDisponibles;
        })
        .catch(error => {
          console.error('Error al obtener turnos disponibles:', error);
        });
    }
  }

  onTurnoSeleccionado(turno: Date) {

    console.log('Turno seleccionado:', turno);
  }

  getSafeImageURL(url: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  obtenerImagenEspecialista(especialista: Especialista): string {

    return especialista.imagenPerfil || this.imagenPorDefecto;
  }

  obtenerImagenEspecialidad(especialidad: string): string {
    
    //console.log('Nombre de la especialidad:', especialidad);

    return this.especialidadesConImagenes[especialidad.trim().toLowerCase()] || this.imagenPorDefecto;
    
  }

  async inicializarEspecialidades() {

    await this.obtenerEspecialidades();
  
    for (const especialidad of this.especialidades) {
      const nombreEspecialidad = especialidad.toLowerCase();

      const rutaImagen = `assets/imagenesEspecialidades/${nombreEspecialidad}.png`;

      this.especialidadesConImagenes[nombreEspecialidad] = rutaImagen;

    }
  }

  obtenerEspecialidades() {
    this.userService.obtenerListaEspecialidades().then((especialidades) => {
      this.especialidades = especialidades;
    }).catch((error) => {
      console.error('Error al obtener especialidades:', error);
    });
  }

  onEspecialidadChange(especialidad: string) {
    if (especialidad) {
      this.userService.obtenerEspecialistasPorEspecialidad(especialidad)
        .then((especialistas: { nombre: string, imagenPerfil: string }[]) => {
          if (especialistas.length > 0) {
            this.especialistas = especialistas;
          } else {
            console.warn('No se encontraron especialistas para la especialidad seleccionada.');
          }
        })
        .catch(error => {
          console.error('Error al obtener especialistas:', error);
        });
    } else {
      console.warn('Especialidad seleccionada no válida.');
    }
  }

  guardarTurno() {

    const fechaActual: Date = new Date();
    const fechaLimite: Date = new Date();
    fechaLimite.setDate(fechaActual.getDate() + 15);
  
    if (this.especialidad && this.especialista) {
      const fechaSeleccionadaComoDate: Date = new Date(

        this.selectedDay
      );
  
      if (fechaSeleccionadaComoDate >= fechaActual && fechaSeleccionadaComoDate <= fechaLimite) {
        const nuevoTurno = this.turnosService.solicitarTurno(
          this.pacienteId,
          this.especialidad,
          this.especialista,
          this.selectedDay,
          this.horaInicio,
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

  mostrarMensajeError(mensaje: string) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: mensaje
    });
  }
}

