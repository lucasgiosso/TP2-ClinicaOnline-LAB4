import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-seccion-usuarios',
  templateUrl: './seccion-usuarios.component.html',
  styleUrls: ['./seccion-usuarios.component.scss']
})
export class SeccionUsuariosComponent {

  btnVolver = 'Volver a inicio';
  formReg: FormGroup;
  selectedRole: string = '';

  constructor (private router: Router, private formBuilder : FormBuilder) {
    this.formReg = new FormGroup({
      nombre: new FormControl('', [Validators.required, Validators.minLength(6)]),
      apellido: new FormControl('', [Validators.required, Validators.minLength(6)]),
      edad: new FormControl('', [Validators.required, Validators.minLength(6)]),
      dni: new FormControl('', [Validators.required, Validators.minLength(6)]),
      obraSocial: new FormControl('', [Validators.required, Validators.minLength(6)]),
      email: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required]),
      selectedRole: new FormControl('', [Validators.required]),
      especialidad: new FormControl(''),
      otraEspecialidad: new FormControl('', [Validators.minLength(4), Validators.maxLength(25)]),
      imagenPerfil: new FormControl('', [Validators.required, Validators.minLength(6)]),
      imagenPerfil1: new FormControl('', [Validators.required, Validators.minLength(6)]),
      imagenPerfil2: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
    
  }

  onSubmit() {};

  public onClickHome(event: any): void 
  {
    this.router.navigate(['home']);
    //console.log(event);
  }
}
