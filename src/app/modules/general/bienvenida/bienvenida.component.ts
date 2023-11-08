import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bienvenida',
  templateUrl: './bienvenida.component.html',
  styleUrls: ['./bienvenida.component.scss']
})
export class BienvenidaComponent {

  btnIniciar = 'Iniciar sesión';
  btnRegistrar = 'Registrarse';

  constructor(private router: Router) { }

  public onClick(event: any): void 
  {
    this.router.navigate(['/login']);

  }

  public onClickReg(event: any): void 
  {
    this.router.navigate(['/register']);

  }
}
