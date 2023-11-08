import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { Firestore,collection,doc, setDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit{

  formReg: FormGroup;
  hidePassword: boolean = true; 
  btnVolver = 'Iniciar sesión';
  btnVolverBien = 'Volver a inicio';
  selectedRole: string = '';
  mostrarOtraEspecialidad: boolean = true;

  constructor(private formBuilder: FormBuilder,
    //private userService: UserService,
    private router: Router,
    //private firestore: Firestore)
  )
  {
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
      campoEspecificoPaciente: this.formBuilder.control(''),
      especialidad: new FormControl(''),
      otraEspecialidad: new FormControl('', [Validators.minLength(4), Validators.maxLength(25)]),
      imagenPerfil: new FormControl('', [Validators.required, Validators.minLength(6)]),
      imagenPerfil1: new FormControl('', [Validators.required, Validators.minLength(6)]),
      imagenPerfil2: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
  }

  ngOnInit() : void{}

    togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  // async onSubmit() {
    
  //   if (this.formReg.invalid) {
  //     return;
  //   }

  //   const passwordControl = this.formReg.get('password');
  //   const confirmPasswordControl = this.formReg.get('confirmPassword');
  //   const selectedRole = this.formReg.get('selectedRole')?.value;
  //   const { email, password, confirmPassword } = this.formReg.value;
  
  //   if (password !== confirmPassword) {
  //     Swal.fire({
  //       icon: 'error',
  //       title: 'Error en la contraseña',
  //       text: 'Las contraseñas no coinciden. Por favor, verifica.',
  //     }).then(() => {
  //       if (passwordControl && confirmPasswordControl) {
  //         passwordControl.reset();
  //         confirmPasswordControl.reset();
  //       }
  //     });
  //     return;
  //   }

  //   if (!selectedRole) {
  //     Swal.fire({
  //       icon: 'error',
  //       title: 'Perfil no seleccionado',
  //       text: 'Por favor, selecciona un perfil antes de registrarte.',
  //     });
  //     return;
  //   }
   
  //   try {
  //     const userExists = await this.userService.checkIfUserExists(email);
  
  //     if (userExists) {
  //               Swal.fire({
  //                 icon: 'error',
  //                 title: 'Usuario existente',
  //                 text: 'El correo electrónico ya está registrado. Inicia sesión en lugar de registrarte.',
  //               }).then(() => {
  //                 if (passwordControl && confirmPasswordControl) {
  //                   passwordControl.reset();
  //                   confirmPasswordControl.reset();
  //                 }
  //               });
  //     } else {
 
  //       const userCredential = await this.userService.register(email, password);
  //       const user = userCredential.user;
  //       const userDocRef = doc(collection(this.firestore, 'users&role'), user.uid);
  //       await setDoc(userDocRef, { mail: email, role: selectedRole }, { merge: true });
    
  //       Swal.fire({
  //         icon: 'success',
  //         title: 'Registro exitoso',
  //         text: '¡Bienvenido!',
  //         confirmButtonText: 'OK'
  //       }).then(() => {
  //         this.router.navigate(['/home']);
  //       });
  //     }
  //   } catch (error: any) {

  //     if (error.code === 'auth/invalid-email') {
  //       Swal.fire({
  //         icon: 'error',
  //         title: 'Error en el correo electrónico',
  //         text: 'El formato del correo electrónico es incorrecto. Por favor, verifica.',
  //       });
  //     } else if (error.code === 'auth/weak-password') {
  //       Swal.fire({
  //         icon: 'error',
  //         title: 'Contraseña débil',
  //         text: 'La contraseña es demasiado débil. Debe contener al menos 6 caracteres.',
  //       }).then(() => {
  //         if (passwordControl && confirmPasswordControl) {
  //           passwordControl.reset();
  //           confirmPasswordControl.reset();
  //         }
  //       });
  //     }else if (error.code === 'auth/email-already-in-use') {

  //       Swal.fire({
  //         icon: 'error',
  //         title: 'Correo electrónico en uso',
  //         text: 'El correo electrónico ya está registrado. Inicia sesión en lugar de registrarte.',
  //       }); 
  //     } else {
  //       console.error('Error en el registro:', error);
  //       Swal.fire({
  //         icon: 'error',
  //         title: 'Error en el registro',
  //         text: 'Hubo un error al registrar tu cuenta. Por favor, verifica tus datos.',
  //       }).then(() => {
  //         if (passwordControl && confirmPasswordControl) {
  //           passwordControl.reset();
  //           confirmPasswordControl.reset();
  //         }
  //       });
  //     }
  //   }
  // }

   onSubmit() {};

  public onClick(event: any): void 
  {
    this.router.navigate(['/login']);
    //console.log(event);
  }
  
  public onClickWel(event: any): void 
  {
    this.router.navigate(['']);
    //console.log(event);
  }
}
