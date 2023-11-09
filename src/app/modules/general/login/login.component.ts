import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';
import { User, UserCredential } from 'firebase/auth';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
  })
  export class LoginComponent implements OnInit{
    
    formLogin: FormGroup;
    errorMensaje: string = '';
    currentUser: User | null = null;

    defaultEmailAdmin = 'admin@clinica-online.com';
    defaultPasswordAdmin = '123456';

    defaultEmailEspecialista = 'especialista@clinica-online.com';
    defaultPasswordEspecialista = '123456';

    defaultEmailPaciente = 'lucasdiazgiosso@gmail.com';
    defaultPasswordPaciente = '123456';

    email: string = '';
    password: string = '';
    showLoading: boolean = true;

    constructor(private router: Router, private fb: FormBuilder,private userService: UserService )
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
            console.error(error);
            let errorMessage = 'Error al iniciar sesión. Por favor, verifica tu correo electrónico y contraseña.';
            if (error.code === 'auth/user-not-found') {
              errorMessage = 'El correo electrónico no existe. Por favor, verifica.';
            } else if (error.code === 'auth/wrong-password') {
              errorMessage = 'La contraseña es incorrecta. Por favor, verifica.';
            }
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: errorMessage,
            });
          });
      }

      
      
    loginLoadAdmin(): void{
      this.formLogin.setValue({email: this.defaultEmailAdmin, password: this.defaultPasswordAdmin});
    }

    loginLoadEspecialista(): void{
      this.formLogin.setValue({email: this.defaultEmailEspecialista, password: this.defaultPasswordEspecialista});
    }

    loginLoadPaciente(): void{
      this.formLogin.setValue({email: this.defaultEmailPaciente, password: this.defaultPasswordPaciente});
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