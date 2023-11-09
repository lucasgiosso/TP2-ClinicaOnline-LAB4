import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder,AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { Firestore,collection,doc, setDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { NoimagePipe } from 'src/app/pipes/noimage.pipe';
import { User, sendEmailVerification } from 'firebase/auth';


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
  showLoading: boolean = true;

  constructor(private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private firestore: Firestore)
  
  {
 
    this.formReg = new FormGroup({
      selectedRole: new FormControl('', [Validators.required]),
      nombre: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
      apellido: new FormControl('', [Validators.required, Validators.minLength(3)]),
      edad: new FormControl('', [Validators.required, Validators.min(18), Validators.max(99)]),
      dni: new FormControl('', [Validators.required,Validators.pattern("^[0-9]+"), Validators.minLength(6),Validators.maxLength(8)]),
      obraSocial: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required]),
      especialidad: new FormControl('', ),
      otraEspecialidad: new FormControl('', [Validators.minLength(4), Validators.maxLength(25)]),
      imagenPerfil: new FormControl(null,),
      imagenPerfil1: new FormControl(null, ),
      imagenPerfil2: new FormControl(null, ),
    });
    
    // this.formReg.setValidators(this.missingImages);

    // console.log('edad:', this.formReg.get('edad'));
    // console.log('dni:', this.formReg.get('dni'));
    // console.log('obraSocial:', this.formReg.get('obraSocial'));
    // console.log('email:', this.formReg.get('email'));
    // console.log('password:', this.formReg.get('password'));
    // console.log('confirmPassword:', this.formReg.get('confirmPassword'));
    // console.log('especialidad:', this.formReg.get('especialidad'));
    // console.log('otraEspecialidad:', this.formReg.get('otraEspecialidad'));
    // console.log('imagenPerfil:', this.formReg.get('imagenPerfil'));
    // console.log('imagenPerfil1:', this.formReg.get('imagenPerfil1'));
    // console.log('imagenPerfil2:', this.formReg.get('imagenPerfil2'));

  }    

  ngOnInit() : void{
    
    setTimeout(() => {
    this.showLoading = false;
  }, 2000);}

    togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  getValue(value: string): AbstractControl{
    return this.formReg.get(value) as FormGroup;
  }

  async sendEmailVerification(user: User) {
    await sendEmailVerification(user);
  }

  getImageUrl(image: any): string {
    if (image instanceof Blob) {
      return URL.createObjectURL(image);
    } else {
      return 'assets/noimage.png';
    }
  }

  missingImages: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const imagenPerfil = control.get('imagenPerfil')?.value;
    const imagenPerfil1 = control.get('imagenPerfil1')?.value;
    const imagenPerfil2 = control.get('imagenPerfil2')?.value;
  
    // Verifica si los valores son instancias de File
    if ((imagenPerfil && !(imagenPerfil instanceof File)) ||
        (imagenPerfil1 && !(imagenPerfil1 instanceof File)) ||
        (imagenPerfil2 && !(imagenPerfil2 instanceof File))) {
      return { invalidImage: true };
    }
  
    return null;
  };
  

  validateImage(control: AbstractControl): ValidationErrors | null {
    const image = control.value as File;
  
    if (!image) {
      console.log('No se ha seleccionado ninguna imagen.');
      return { missingImage: true };
    }
  
    if (!(image instanceof File)) {
      console.log('El valor del control no es una instancia de File.');
      return { invalidImage: true };
    }
  
    if (image.size > 1000000) { // Límite de tamaño en bytes (1 MB)
      console.log('La imagen tiene un tamaño incorrecto. Debe ser de hasta 1 MB.');
      return { invalidSize: true };
    }
  
    console.log('La imagen se ha cargado correctamente.');
    return null;
  }


  async onSubmit() {
    
    if (this.formReg.invalid) {
      return;
    }

    const passwordControl = this.formReg.get('password');
    const confirmPasswordControl = this.formReg.get('confirmPassword');
    const selectedRole = this.formReg.get('selectedRole')?.value;
    const { email, password, confirmPassword } = this.formReg.value;
  
    if (password !== confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Error en la contraseña',
        text: 'Las contraseñas no coinciden. Por favor, verifica.',
      }).then(() => {
        if (passwordControl && confirmPasswordControl) {
          passwordControl.reset();
          confirmPasswordControl.reset();
        }
      });
      return;
    }

    if (!selectedRole) {
      Swal.fire({
        icon: 'error',
        title: 'Perfil no seleccionado',
        text: 'Por favor, selecciona un perfil antes de registrarte.',
      });
      return;
    }
   
    try {
      const userExists = await this.userService.checkIfUserExists(email);
    
      if (userExists) {
        Swal.fire({
          icon: 'error',
          title: 'Usuario existente',
          text: 'El correo electrónico ya está registrado. Inicia sesión en lugar de registrarte.',
        }).then(() => {
          if (passwordControl && confirmPasswordControl) {
            passwordControl.reset();
            confirmPasswordControl.reset();
            this.router.navigate(['/login']);
            return;
          }
        });
      } 
      else {
        
        console.log("paso 1");
        const userCredential = await this.userService.register(email, password);
        const user = userCredential.user;
        console.log("paso 2");
        const userDocRef = doc(collection(this.firestore, 'DatosUsuarios'), user.uid);
        console.log("paso 3");
        await setDoc(userDocRef, { mail: email, role: selectedRole }, { merge: true });
        console.log("paso 4");
    
        if (!user.emailVerified) {
          await this.sendEmailVerification(user);
    
          Swal.fire({
            icon: 'error',
            title: 'Faltan validar tus datos antes de iniciar sesión.',
            text: 'Debes verificar tu correo electrónico antes de iniciar sesión. Hemos enviado un correo de verificación a tu dirección de correo.',
          }).then(() => {
            
            if (passwordControl && confirmPasswordControl) {
              passwordControl.reset();
              confirmPasswordControl.reset();
              this.router.navigate(['/login']);
            }
          });
        } else {
    
          Swal.fire({
            icon: 'success',
            title: 'Registro exitoso',
            text: '¡Bienvenido!',
            confirmButtonText: 'OK'
          }).then(() => {
            this.router.navigate(['/login']);
          });
        }
      }
    } catch (error: any) {
      if (error.message === 'Debes verificar tu correo electrónico antes de iniciar sesión.') {

        Swal.fire({
          icon: 'error',
          title: 'Faltan validar tus datos',
          text: error.message,
        });
        this.router.navigate(['/login']);
      } else if (error.code === 'auth/invalid-email') {
        Swal.fire({
          icon: 'error',
          title: 'Error en el correo electrónico',
          text: 'El formato del correo electrónico es incorrecto. Por favor, verifica.',
        });
      } else if (error.code === 'auth/weak-password') {
        Swal.fire({
          icon: 'error',
          title: 'Contraseña débil',
          text: 'La contraseña es demasiado débil. Debe contener al menos 6 caracteres.',
        }).then(() => {
          if (passwordControl && confirmPasswordControl) {
            passwordControl.reset();
            confirmPasswordControl.reset();
          }
        });
      } else if (error.code === 'auth/email-already-in-use') {
        Swal.fire({
          icon: 'error',
          title: 'Correo electrónico en uso',
          text: 'El correo electrónico ya está registrado. Inicia sesión en lugar de registrarte.',
        }); 
      } else {
        console.error('Error en el registro:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error en el registro',
          text: 'Hubo un error al registrar tu cuenta. Por favor, verifica tus datos.',
        }).then(() => {
          if (passwordControl && confirmPasswordControl) {
            passwordControl.reset();
            confirmPasswordControl.reset();
          }
        });
      }
    }
    
}

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
