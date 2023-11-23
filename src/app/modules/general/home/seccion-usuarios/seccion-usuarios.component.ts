import { Component,EventEmitter,HostListener,OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { sendEmailVerification } from 'firebase/auth';
import { Auth, User, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, collection, doc, setDoc } from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-seccion-usuarios',
  templateUrl: './seccion-usuarios.component.html',
  styleUrls: ['./seccion-usuarios.component.scss']
})
export class SeccionUsuariosComponent implements OnInit{

  btnVolver = 'Volver a home';
  formReg: FormGroup;
  selectedRole: string = '';
  showLoading: boolean = true;
  usuariosPendientes: any[] = [];
  botonHabilitar: boolean = true;
  botonInhabilitar: boolean = true;


  @Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter();
    collapsed = false;
    screenWidth = 0;
    currentUser$: Observable<User | null>;
    isDropdownOpen = false;
    showLogoutButton = false;

    @HostListener('window:resize', ['$event'])
onResize(event: any){
  this.screenWidth = window.innerWidth;
  if (this.screenWidth <= 768) {
    this.collapsed = false;
    this.onToggleSideNav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth});
  }
}

  constructor ( private formBuilder : FormBuilder, private userService: UserService,private router: Router, private firestore: Firestore, private auth: Auth) {

    this.currentUser$ = this.userService.getCurrentUser();


    this.formReg = new FormGroup({
      selectedRole: new FormControl('', [Validators.required]),
      nombre: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(20),Validators.pattern(/^[a-zA-Z]+$/)]),
      apellido: new FormControl('', [Validators.required, Validators.minLength(3),Validators.pattern(/^[a-zA-Z]+$/)]),
      edad: new FormControl('', [Validators.required, Validators.pattern("^[0-9]+"),Validators.min(18), Validators.max(99)]),
      dni: new FormControl('', [Validators.required,Validators.pattern("^[0-9]+"), Validators.minLength(6),Validators.maxLength(8)]),
      obraSocial: new FormControl('',[Validators.required,Validators.pattern(/^[a-zA-Z]+$/)]),
      email: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required]),
      especialidad: new FormControl('', [Validators.required] ),
      otraEspecialidad: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(25), Validators.pattern(/^[a-zA-Z]+$/)]),
      imagenPerfil: new FormControl('', [Validators.required]),
      imagenPerfil1: new FormControl('', [Validators.required]),
      imagenPerfil2: new FormControl('', [Validators.required]),
    }); 

    const selectedRoleControl = this.formReg.get('selectedRole');

    if (selectedRoleControl) {
      selectedRoleControl.valueChanges.pipe(
        map((selectedRole) => {

          this.updateValidators(selectedRole);
        })
      ).subscribe();
    }
    
  }

  ngOnInit() : void{
    
    setTimeout(() => {
    this.showLoading = false;
  }, 2000);

  this.screenWidth = window.innerWidth;
  this.currentUser$ = this.userService.getCurrentUser();
  this.cargarUsuariosPendientes();
}

  public onClickHome(event: any): void 
  {
    this.router.navigate(['home']);
  }

  getValue(value: string): AbstractControl{
    return this.formReg.get(value) as FormGroup;
  }

  updateValidators(selectedRole: string | null): void {
  
    if (selectedRole === null) {
      return;
    }
  
    this.formReg.get('obraSocial')?.clearValidators();
    this.formReg.get('especialidad')?.clearValidators();
    this.formReg.get('otraEspecialidad')?.clearValidators();
    this.formReg.get('imagenPerfil')?.clearValidators();
    this.formReg.get('imagenPerfil1')?.clearValidators();
    this.formReg.get('imagenPerfil2')?.clearValidators();
  
    if (selectedRole === 'especialista') {
      this.formReg.get('especialidad')?.setValidators([Validators.required]);
  
      if (this.formReg.get('especialidad')?.value === 'otra') {
        this.formReg.get('otraEspecialidad')?.setValidators([Validators.required]);
      }
      
      this.formReg.get('imagenPerfil')?.setValidators([Validators.required]);
      this.formReg.get('obraSocial')?.setValidators([Validators.required]);
  
      this.formReg.get('obraSocial')?.clearValidators();
      this.formReg.get('imagenPerfil1')?.clearValidators();
      this.formReg.get('imagenPerfil2')?.clearValidators();
    } 
    else if (selectedRole === 'paciente') {
  
      this.formReg.get('especialidad')?.clearValidators();
      this.formReg.get('otraEspecialidad')?.clearValidators();
  
  
      this.formReg.get('imagenPerfil1')?.setValidators([Validators.required]);
      this.formReg.get('imagenPerfil2')?.setValidators([Validators.required]);
  
      this.formReg.get('imagenPerfil')?.clearValidators();
    }
    this.formReg.get('obraSocial')?.updateValueAndValidity();
    this.formReg.get('especialidad')?.updateValueAndValidity();
    this.formReg.get('otraEspecialidad')?.updateValueAndValidity();
    this.formReg.get('imagenPerfil')?.updateValueAndValidity();
    this.formReg.get('imagenPerfil1')?.updateValueAndValidity();
    this.formReg.get('imagenPerfil2')?.updateValueAndValidity();
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
    this.showLogoutButton = this.isDropdownOpen; 
  }

  toggleCollapse(): void{
    this.collapsed = !this.collapsed;
    this.onToggleSideNav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth});
  }
  
  closeSidenav(): void{
    this.collapsed = false;
    this.onToggleSideNav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth});
  }
  
  handleNavigation(routeLink: string) {
  
    if (routeLink === 'logout') {
      this.logout();
    }
  }

  async logout() {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Lamentamos que quieras salir...',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, salir'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          console.log('Route link clicked: logout');
          await this.auth.signOut();
          this.router.navigate(['/login']);
        } catch (error) {
          console.error('Error al cerrar sesión:', error);
        }
      } else {
        this.router.navigate(['/home']);
      }
    });
  }

  async sendEmailVerification(user: User) {
    await sendEmailVerification(user);
  }

  async onSubmit() {

    const currentUser = this.auth.currentUser;
    const isAuthenticated = currentUser !== null && currentUser.emailVerified;
    // this.showCaptcha = true;
    
    // if (this.formReg.invalid) {
    //   this.showCaptcha = false;
    //   Swal.fire({
    //     icon: 'error',
    //     title: 'Campos incompletos',
    //     text: 'Por favor, completa todos los campos del formulario.',
    //   });
    //   return;
    // }

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

        // if (this.aFormGroup.get('recaptcha')?.invalid) {
        //   Swal.fire({
        //     icon: 'error',
        //     title: 'Error en el ReCaptcha',
        //     text: 'Por favor, valida el ReCaptcha antes de continuar.',
        //   });
        //   return;
        // }
        
        console.log("paso 1");
        const userCredential = await this.userService.register(email, password);
        const user = userCredential.user;
        console.log("paso 2");
        const userDocRef = doc(collection(this.firestore, 'DatosUsuarios'), user.uid);
        
        let additionalUserData: any = {
          mail: email,
          role: selectedRole,
          nombre: this.formReg.get('nombre')?.value,
          apellido: this.formReg.get('apellido')?.value,
          edad: this.formReg.get('edad')?.value,
          dni: this.formReg.get('dni')?.value
        };
        
        const storageBaseUrl = `https://firebasestorage.googleapis.com/v0/b/tp-clinica-online-ba492.appspot.com/o`;

        let imageUrl1: string = "";
       
        if (selectedRole === 'paciente') {
          
          const file: File = this.formReg.get('imagenPerfil1')?.value;
          console.log(file);

          if (file) {

          const imagePath1 = `profile_images/${user.uid}/image1.jpg`;
          const imageUrl1 = `${storageBaseUrl}/${encodeURIComponent(imagePath1)}`;
          
          // await this.uploadImageAndGetURL(imageUrl1, this.formReg.get('imagenPerfil1')?.value as File);
          try {
       
            const downloadURL = await this.uploadImageAndGetURL(imageUrl1, file);
            console.log('Imagen subida, URL:', downloadURL);
          } catch (error) {
            console.error('Error al subir la imagen:', error);
          }
        }
          
          const imagePath2 = `profile_images/${user.uid}/image2.jpg`;
          const imageUrl2 = `${storageBaseUrl}/${encodeURIComponent(imagePath2)}`;

          await this.uploadImageAndGetURL(imageUrl2, this.formReg.get('imagenPerfil2')?.value as File);
          
          additionalUserData = {
            ...additionalUserData,
            obrasocial: this.formReg.get('obraSocial')?.value,
            aprobadoPorAdmin: true,
            imagenPerfil1: imageUrl1,
            imagenPerfil2: imageUrl2,
        };
        await setDoc(userDocRef, additionalUserData, { merge: true });
        
        } else if (selectedRole === 'especialista') {
          const imagePath = `profile_images/${user.uid}/image.jpg`;
          const imageUrl = `${storageBaseUrl}/${encodeURIComponent(imagePath)}`;
          await this.uploadImageAndGetURL(imageUrl, this.formReg.get('imagenPerfil')?.value as File);
        
          additionalUserData = {
            ...additionalUserData,
            especialidad: this.formReg.get('especialidad')?.value,
            otraEspecialidad: this.formReg.get('otraEspecialidad')?.value,
            aprobadoPorAdmin: false,
            imagenPerfil: imageUrl,
          };
          await setDoc(userDocRef, additionalUserData, { merge: true });
        }     

        else if (selectedRole === 'admin') {
          const imagePath = `profile_images/${user.uid}/image.jpg`;
          const imageUrl = `${storageBaseUrl}/${encodeURIComponent(imagePath)}`;
          await this.uploadImageAndGetURL(imageUrl, this.formReg.get('imagenPerfil')?.value as File);
        
          additionalUserData = {
            ...additionalUserData,
            aprobadoPorAdmin: true,
            imagenPerfil: imageUrl,
          };
          await setDoc(userDocRef, additionalUserData, { merge: true });
        }     
        
         console.log("paso 3, cargado");
    
        if (!user.emailVerified) {
          await this.sendEmailVerification(user);
    
          Swal.fire({
            icon: 'warning',
            title: 'Faltan validar tus datos antes de iniciar sesión.',
            text: 'Debes avisarle al usuario para que valide su correo electrónico antes de iniciar sesión. Hemos enviado un correo de verificación a su dirección de correo.',
          }).then(() => {
            

            if (passwordControl && confirmPasswordControl) {
              passwordControl.reset();
              confirmPasswordControl.reset();
              //selectedRole.reset();
              //additionalUserData.reset({ nombre: '', apellido: '', /* ...otros campos... */ });
              //this.router.navigate(['/home/config']);
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
    } catch (error: any) 
    {
      
      if (error.message === 'Debes verificar tu correo electrónico antes de iniciar sesión.') {

        Swal.fire({
          icon: 'warning',
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
      return Promise.resolve();
    }

}

async uploadImageAndGetURL(path: string, file: File): Promise<string> {
  const storage = getStorage();
  const storageRef = ref(storage, path);

  try {
    // Wait for the upload to complete
    const snapshot = await uploadBytes(storageRef, file, { contentType: 'image/jpeg' });

    // Get the download URL after the upload
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}


  userLogged() {
    this.userService.getCurrentUser().subscribe(
      (user) => {
        console.log(user?.email);
      },
      (error) => {
        console.error('Error al obtener el usuario actual:', error);
      }
    );
  }


  cargarUsuariosPendientes() {
    this.userService.obtenerUsuariosPendientesAprobacion()
      .then((usuarios) => {
        this.usuariosPendientes = usuarios;
      })
      .catch((error) => {
        console.error('Error al cargar usuarios pendientes:', error);
      });
  }

  aprobarUsuario(userId: string) {
    this.userService.aprobarUsuario(userId)
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Usuario habilitado',
          text: 'El usuario ha sido aprobado exitosamente.',
        });

        this.cargarUsuariosPendientes();
      })
      .catch((error) => {
        
        Swal.fire({
          icon: 'error',
          title: 'Error al aprobar usuario',
          text: 'Hubo un error al aprobar el usuario. Por favor, inténtalo de nuevo.',});

      });
  }

  inhabilitarUsuario(userId: string) {
    this.userService.inhabilitarUsuario(userId)
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Usuario inhabilitado',
          text: 'El usuario ha sido aprobado exitosamente.',
        });

        this.cargarUsuariosPendientes();
      })
      .catch((error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error al aprobar usuario',
          text: 'Hubo un error al aprobar el usuario. Por favor, inténtalo de nuevo.',});
      });
  }



}
