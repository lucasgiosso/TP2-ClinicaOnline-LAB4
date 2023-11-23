import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';
import { User, UserCredential } from 'firebase/auth';
import { ImagesService } from 'src/app/services/images.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
  })
  export class LoginComponent implements OnInit{
    
    formLogin: FormGroup;
    errorMensaje: string = '';
    currentUser: User | null = null;

    defaultEmailAdmin = 'lucasdiazgiosso@gmail.com';
    defaultPasswordAdmin = '123456';

    defaultEmailEspecialista1 = 'a275xk8w@cj.MintEmail.com';
    defaultPasswordEspecialista1 = '123456';

    defaultEmailEspecialista2 = '';
    defaultPasswordEspecialista2 = '123456';

    defaultEmailPaciente1 = 'jms7e6g4@cj.MintEmail.com';
    defaultPasswordPaciente1 = '123456';

    defaultEmailPaciente2 = '';
    defaultPasswordPaciente2 = '123456';

    defaultEmailPaciente3 = '';
    defaultPasswordPaciente3 = '123456';

    email: string = '';
    password: string = '';
    showLoading: boolean = true;

    constructor(private router: Router, private fb: FormBuilder,private userService: UserService, private imagesService: ImagesService )
    {
      this.formLogin = this.fb.group(
        { email: ['', [Validators.required, Validators.email]],
          password: ['', [Validators.required]]});
    }

    ngOnInit(): void {

      setTimeout(() => 
      {
        this.showLoading = false;
      }, 2000);

      this.formLogin = this.fb.group({email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
    
      }

      onSubmit() {
        this.userService.login(this.formLogin.value)
          .then((userCredential: UserCredential) => {
            const user = userCredential.user;
            if (user.emailVerified) {
              console.log('Inicio de sesión exitoso');
              Swal.fire({
                icon: 'success',
                title: 'Inicio de sesión exitoso',
                text: '¡Bienvenido!',
                confirmButtonText: 'OK'
              }).then(() => {
                this.router.navigate(['/home']);
              });
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Error en el inicio de sesión',
                text: 'Debes verificar tu correo electrónico antes de iniciar sesión. Hemos enviado un correo de verificación a tu dirección de correo.',
              });
            }
          })
          .catch((error: any) => {
            let errorMessage = 'Error al iniciar sesión. Por favor, verifica tu correo electrónico y contraseña.';
            if (error.code === 'auth/user-not-found') {
              errorMessage = 'El correo electrónico no existe. Por favor, verifica.';
            } else if (error.code === 'auth/wrong-password') {
              errorMessage = 'La contraseña es incorrecta. Por favor, verifica.';
            } else if (error.message === 'La cuenta aún no ha sido aprobada por el administrador.') {
              Swal.fire({
                icon: 'error',
                title: 'Error de inicio de sesión',
                text: 'La cuenta aún no ha sido aprobada por el administrador.',
              });
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: errorMessage,
              });
            }
          });
      }
      
      
    loginLoadAdmin(): void{
      this.formLogin.setValue({email: this.defaultEmailAdmin, password: this.defaultPasswordAdmin});
    }

    loginLoadEspecialista1(): void{
      this.formLogin.setValue({email: this.defaultEmailEspecialista1, password: this.defaultPasswordEspecialista1});
    }

    loginLoadEspecialista2(): void{
      this.formLogin.setValue({email: this.defaultEmailEspecialista2, password: this.defaultPasswordEspecialista2});
    }

    loginLoadPaciente1(): void{
      this.formLogin.setValue({email: this.defaultEmailPaciente1, password: this.defaultPasswordPaciente1});
    }

    loginLoadPaciente2(): void{
      this.formLogin.setValue({email: this.defaultEmailPaciente2, password: this.defaultPasswordPaciente2});
    }

    loginLoadPaciente3(): void{
      this.formLogin.setValue({email: this.defaultEmailPaciente3, password: this.defaultPasswordPaciente3});
    }
    
    loginLoad(usuario: string): void {
      // Lógica de inicio de sesión aquí...
  
      // Obtén la imagen del usuario
      const imagenUsuario = this.imagesService.getImagenUsuario(usuario);
  
      // Usa la imagen como necesites, por ejemplo, mostrándola en una etiqueta de imagen
      console.log(`Imagen del usuario ${usuario}: ${imagenUsuario}`);
    }
    

    onRegister() {
      this.router.navigate(['/register'])
        .catch(error => console.log(error));
    }

    onClickWel(event: any): void 
  {
    this.router.navigate(['']);
    
  }
    
  }