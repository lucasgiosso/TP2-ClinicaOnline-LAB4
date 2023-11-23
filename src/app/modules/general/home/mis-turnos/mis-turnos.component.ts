import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Auth,User } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';
import { TurnosService } from 'src/app/services/turnos.service';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-mis-turnos',
  templateUrl: './mis-turnos.component.html',
  styleUrls: ['./mis-turnos.component.scss']
})
export class MisTurnosComponent implements OnInit{

  btnVolver = 'Volver a home';
  showLoading: boolean = true;

  @Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter();

  collapsed = false;
  screenWidth = 0;
  currentUser$: Observable<User | null>;
  isDropdownOpen = false;
  showLogoutButton = false;
  pacienteId = 1;
  turnos: any[] = [];
  turno: any;
  turnosFiltrados: any[] = [];
  especialidades: string[] = ['Cardiología', 'Dermatología', 'Oftalmología'];
  especialistas: string[] = ['Dr. García', 'Dra. López', 'Dr. Martínez'];
  fechaSeleccionada: Date = new Date();
  horaInicio: string = '';
  horaFin: string = '';
  selectedYear: number;
  selectedMonth: number;
  selectedDay: number;

  constructor (private router: Router, private userService: UserService, private turnosService: TurnosService, private auth: Auth) {
    this.currentUser$ = this.userService.getCurrentUser();
    this.selectedYear = 0; 
    this.selectedMonth = 0;
    this.selectedDay = 0;
  }

  ngOnInit() : void{
    
    setTimeout(() => {
    this.showLoading = false;
  }, 2000);

  //this.turnos = this.turnosService.getTurnosByPaciente(this.pacienteId);
  this.turnosFiltrados = this.turnos;
}

  public onClickHome(event: any): void 
  {
    this.router.navigate(['home']);
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
    this.showLogoutButton = this.isDropdownOpen; 
  }

  async logout() {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Lamentamos que quieras salir...',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, salir'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          console.log('Route link clicked: logout');
          await this.auth.signOut();
          this.router.navigate(['/login']);
        } catch (error) {
          console.error('Error al cerrar sesión:', error);
        }
      } else {

      }
    });
  }

  filtrarTurnos(filtro: any) {
    
    this.turnosFiltrados = this.turnos.filter(
      (turno) =>
        (!filtro.especialidad || turno.especialidad === filtro.especialidad) &&
        (!filtro.especialista || turno.especialista === filtro.especialista)
    );
  }

  solicitarTurno() {

    const especialidad = 'Cardiología'; 
    const especialista = 'Dr. García'; 

    const nuevoTurno = this.turnosService.solicitarTurno(this.pacienteId, especialidad, especialista, this.selectedYear, this.selectedMonth,this.selectedDay, this.horaInicio , this.horaFin);
    console.log('Nuevo turno solicitado:', nuevoTurno);

  }

  cancelarTurno(turno: any) {
    const motivo = prompt('Ingrese el motivo de la cancelación:');
    
    if (motivo !== null && motivo !== '') {
      this.turnosService.cancelarTurno(turno.id, motivo);
    }
  }

  verResena(turno: any) {
    const reseña = this.turnosService.obtenerResena(turno.id);

    if (reseña) {
      alert(`Reseña del turno:\n${reseña}`);
    } else {
      alert('El turno no tiene una reseña disponible.');
    }
  }

  completarEncuesta(turno: any) {
    const encuesta = prompt('Ingrese su encuesta:');
    
    if (encuesta !== null && encuesta !== '') {
      this.turnosService.completarEncuesta(turno.id, encuesta);
      alert('Encuesta completada exitosamente.');
    }
  }

  calificarAtencion(turno: any) {
    const calificacionInput = prompt('Ingrese la calificación (de 1 a 5):');
    const calificacion = calificacionInput !== null ? parseFloat(calificacionInput) : NaN;

    if (!isNaN(calificacion) && calificacion >= 1 && calificacion <= 5) {
      const comentario = prompt('Ingrese un comentario de la atención:');

      if (comentario !== null) {
        this.turnosService.calificarAtencion(turno.id, calificacion, comentario);
        alert('Calificación realizada exitosamente.');
      } else {
        alert('Ingrese un comentario válido.');
      }
    } else {
      alert('Ingrese una calificación válida.');
    }
  }

  userLogged() {
    this.userService.getCurrentUser().subscribe(
      (user) => {
        console.log(user?.email);
      },
      (error) => {
        console.error('Error al obtener el usuario actual:', error);
      }
    );
  }
}
