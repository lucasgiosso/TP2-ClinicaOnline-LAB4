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

interface Turno {
  id: string,
  especialidad: string;
  especialista: string;
  estado: string;
  resena?: string; 
  encuestaRealizada?: boolean;
}

interface EncuestaRespuestas {
  pregunta1: string;
  pregunta2: number;
  respuestas: string[];
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
  filtroEspecialidad: any;
  filtroEspecialista: any;
  turnos: Turno[] = [];  
  motivo: string = "";

  constructor (private router: Router, private userService: UserService, private turnosService: TurnosService, private auth: Auth) {
    this.currentUser$ = this.userService.getCurrentUser();
  }

  ngOnInit() : void{
    
    setTimeout(() => {
    this.showLoading = false;
  }, 2000);}

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

  cancelarTurno(turno: Turno, motivo: string) {
    
    if (!turno) {
      console.error('No se proporcionó un turno válido.');
      return;
    }
  
    // Puedes mostrar un cuadro de diálogo de confirmación antes de cancelar el turno
    const confirmacion = window.confirm('¿Estás seguro de que deseas cancelar este turno?');
    if (!confirmacion) {
      return;
    }
  
    this.turnosService.cancelarTurno(parseInt(turno.id,10), 'Motivo de cancelación').subscribe(
      () => {
        console.log('Turno cancelado con éxito');
        // Actualizar la lista de turnos después de la cancelación si es necesario
        this.actualizarListaTurnos([turno]);
      },
      error => {
        console.error('Error al cancelar el turno', error);
      }
    );
  }

  actualizarListaTurnos(nuevosTurnos: Turno[]) {

    this.turnos = nuevosTurnos;
  }


  verResena(turno: Turno) {

    if (turno && turno.resena) {

      console.log('Reseña del turno:', turno.resena);
    } else {
      console.warn('El turno no tiene una reseña.');
    }
  }

  completarEncuesta(turno: Turno) {
    // Aquí puedes abrir un formulario o modal para que el usuario complete la encuesta
    // Por ejemplo, podrías utilizar Angular Forms o alguna biblioteca de UI como Angular Material
  
    // Después de que el usuario haya completado la encuesta, podrías obtener las respuestas y enviarlas al servidor
    const respuestas: EncuestaRespuestas = {
      pregunta1: 'Respuesta1', // Sustituye con la respuesta real
      pregunta2: 5,            // Sustituye con la respuesta real
      respuestas: ['RespuestaA', 'RespuestaB'],
      // Agrega más respuestas según sea necesario
    };
  
    // Ahora, podrías enviar las respuestas al servidor a través de tu servicio
    this.turnosService.enviarEncuesta(turno.id, respuestas).subscribe(
      () => {
        console.log('Encuesta completada con éxito');
        // Puedes realizar alguna acción adicional si es necesario
      },
      error => {
        console.error('Error al completar la encuesta', error);
      }
    );
  }

  calificarAtencion(turno: Turno) {
    // Aquí puedes abrir un formulario o modal para que el usuario deje una calificación y comentario
    // Por ejemplo, podrías utilizar Angular Forms o alguna biblioteca de UI como Angular Material
    
    // Después de que el usuario haya dejado la calificación y comentario, puedes enviarlos al servidor
    const calificacion: number = 5; // Sustituye con la calificación real
    const comentario: string = 'Excelente atención'; // Sustituye con el comentario real
  
    // Ahora, puedes enviar la calificación y comentario al servidor a través de tu servicio
    this.turnosService.enviarCalificacion(turno.id, calificacion, comentario).subscribe(
      () => {
        console.log('Calificación completada con éxito');
        // Puedes realizar alguna acción adicional si es necesario
      },
      error => {
        console.error('Error al completar la calificación', error);
      }
    );
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
