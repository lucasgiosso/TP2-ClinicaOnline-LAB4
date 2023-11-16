import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bienvenida',
  templateUrl: './bienvenida.component.html',
  styleUrls: ['./bienvenida.component.scss']
})
export class BienvenidaComponent implements OnInit{

  btnIniciar = 'Iniciar sesión';
  btnRegistrar = 'Registrarse';

  constructor(private router: Router) { }

  ngOnInit() : void{
    
}

  public onClick(event: any): void 
  {
    this.router.navigate(['/login']);

  }

  public onClickReg(event: any): void 
  {
    this.router.navigate(['/register']);

  }
}
