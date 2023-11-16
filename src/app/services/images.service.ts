import { Injectable,ElementRef  } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class ImagesService {

  private imagenesUsuarios: { [key: string]: string } = {
    admin: 'assets/admin.png',
    especialista1: 'assets/especialista1.png',
    especialista2: 'assets/especialista2.png',
    paciente1: 'assets/paciente1.png',
    paciente2: 'assets/paciente2.png',
    paciente3: 'assets/paciente3.png',
  };

  constructor() { }

  getImagenUsuario(usuario: string): string {
    return this.imagenesUsuarios[usuario] || 'assets/logo.png';
  }
}
