import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mis-turnos',
  templateUrl: './mis-turnos.component.html',
  styleUrls: ['./mis-turnos.component.scss']
})
export class MisTurnosComponent {

  btnVolver = 'Volver a inicio';

  constructor (private router: Router) {}

  public onClickHome(event: any): void 
  {
    this.router.navigate(['home']);

  }
}
