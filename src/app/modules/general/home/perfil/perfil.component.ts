import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit{

  btnVolver = 'Volver a home';
  usuariosPendientes: any[] = [];
  usuarioLogueado: any;

  constructor(private router: Router, private userService: UserService){}

  ngOnInit() {

    this.obtenerInfoUsuarioLogueado();
  }

  public onClickHome(event: any): void 
  {
    this.router.navigate(['home']);
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

  disponibilidadHoraria(userId: string) {
    this.userService.aprobarUsuario(userId)
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Usuario habilitado',
          text: 'El usuario ha sido aprobado exitosamente.',
        });

        //this.editar();
      })
      .catch((error) => {
        
        Swal.fire({
          icon: 'error',
          title: 'Error al aprobar usuario',
          text: 'Hubo un error al aprobar el usuario. Por favor, inténtalo de nuevo.',});

      });
  }

  async obtenerInfoUsuarioLogueado() {

    try {
      this.usuarioLogueado = await this.userService.obtenerInfoUsuarioActual();
    } catch (error) {
      // Manejar errores, por ejemplo, mostrar un mensaje al usuario
      console.error('Error al obtener información del usuario logueado:', error);
    }
  }


}
