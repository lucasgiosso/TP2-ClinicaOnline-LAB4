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

    defaultEmailEspecialista1 = '87m2uet7@cj.MintEmail.com';
    defaultPasswordEspecialista1 = '123456';

    defaultEmailEspecialista2 = 'fy3lzdi8@cj.MintEmail.com';
    defaultPasswordEspecialista2 = '123456';

    defaultEmailPaciente1 = 'w48v7aak@cj.MintEmail.com';
    defaultPasswordPaciente1 = '123456';

    defaultEmailPaciente2 = 'zxyecb0q@cj.MintEmail.com';
    defaultPasswordPaciente2 = '123456';

    defaultEmailPaciente3 = '6mql22dq@cj.MintEmail.com';
    defaultPasswordPaciente3 = '123456';

    fotoPerfilUrls: { [key: string]: string } = {};
    imagenPerfilUrl: string = '';
    usuarioActual: any = {};

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
        this.loginLoadAdmin();
        this.loginLoadEspecialista1();
        this.loginLoadEspecialista2();
        this.loginLoadPaciente1();
        this.loginLoadPaciente2();
        this.loginLoadPaciente3();
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
      
      async cargarUsuario(email: string, password: string): Promise<void> {
        try {
          const usuarios = await this.userService.obtenerUsuariosConFotoPerfil(email);
          if (usuarios.length > 0) {
            const usuario = usuarios[0];
            //usuario.imagenPerfilUrl = usuario.imagenPerfilUrl;
            this.fotoPerfilUrls[email] = usuario.imagenPerfilUrl;
            this.formLogin.setValue({ email, password });
            // Aquí puedes hacer algo con la foto de perfil del usuario, por ejemplo:
          } else {
            console.error('Usuario no encontrado');
          }
        } catch (error) {
          console.error('Error al cargar el usuario:', error);
        }
      } 
      
      loginLoadAdmin(): void {
        const email = this.defaultEmailAdmin;
        const password = this.defaultPasswordAdmin;
        this.cargarUsuario(email, password);
        this.formLogin.setValue({ email, password });
      }
      
      loginLoadEspecialista1(): void {
        const email = this.defaultEmailEspecialista1;
        const password = this.defaultPasswordEspecialista1;
        this.cargarUsuario(email, password);
        this.formLogin.setValue({ email, password });
      }
      
      loginLoadEspecialista2(): void {
        const email = this.defaultEmailEspecialista2;
        const password = this.defaultPasswordEspecialista2;
        this.cargarUsuario(email, password);
        this.formLogin.setValue({ email, password });
      }
      
      loginLoadPaciente1(): void {
        const email = this.defaultEmailPaciente1;
        const password = this.defaultPasswordPaciente1;
        this.cargarUsuario(email, password);
        this.formLogin.setValue({ email, password });
      }
      
      loginLoadPaciente2(): void {
        const email = this.defaultEmailPaciente2;
        const password = this.defaultPasswordPaciente2;
        this.cargarUsuario(email, password);
        this.formLogin.setValue({ email, password });
      }
      
      loginLoadPaciente3(): void {
        const email = this.defaultEmailPaciente3;
        const password = this.defaultPasswordPaciente3;
        this.cargarUsuario(email, password);
        this.formLogin.setValue({ email, password });
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