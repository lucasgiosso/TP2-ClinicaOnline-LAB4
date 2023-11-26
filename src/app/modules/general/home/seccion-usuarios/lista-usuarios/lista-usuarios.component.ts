import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service'; 
import Swal from 'sweetalert2';

@Component({
  selector: 'app-lista-usuarios',
  templateUrl: './lista-usuarios.component.html',
  styleUrls: ['./lista-usuarios.component.scss']
})

export class ListaUsuariosComponent implements OnInit{

  usuarios: any[] = [];
  filtro: string = '';
  datos: any[] = [];

  constructor(private userService: UserService){

  }

  ngOnInit(): void {
    this.obtenerUsuarios();

  }

  async obtenerUsuarios() {
    try {
      this.usuarios = await this.userService.obtenerUsuarios();
    } catch (error) {
      console.error('Error al obtener usuarios en el componente:', error);
    }
  }

    aprobarUsuario(userId: string) {
    this.userService.aprobarUsuario(userId)
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Usuario habilitado',
          text: 'El usuario ha sido habilitado exitosamente.',
        });
        this.obtenerUsuarios();
      })
      .catch((error) => {
        
        Swal.fire({
          icon: 'error',
          title: 'Error al aprobar usuario',
          text: 'Hubo un error al aprobar el usuario. Por favor, inténtalo de nuevo.',});

      });
  }

  inhabilitarUsuario(userId: string) {
    this.userService.inhabilitarUsuario(userId)
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Usuario inhabilitado',
          text: 'El usuario ha sido inhabilitado exitosamente.',
        });
        this.obtenerUsuarios();

      })
      .catch((error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error al aprobar usuario',
          text: 'Hubo un error al aprobar el usuario. Por favor, inténtalo de nuevo.',});
      });
  }
}

