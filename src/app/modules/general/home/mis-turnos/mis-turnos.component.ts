import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mis-turnos',
  templateUrl: './mis-turnos.component.html',
  styleUrls: ['./mis-turnos.component.scss']
})
export class MisTurnosComponent implements OnInit{

  btnVolver = 'Volver a inicio';
  showLoading: boolean = true;

  constructor (private router: Router) {}

  ngOnInit() : void{
    
    setTimeout(() => {
    this.showLoading = false;
  }, 1000);}

  public onClickHome(event: any): void 
  {
    this.router.navigate(['home']);

  }
}
