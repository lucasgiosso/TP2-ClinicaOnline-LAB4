import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder,AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { Firestore,collection,doc, setDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { User, sendEmailVerification } from 'firebase/auth';
import { Auth } from '@angular/fire/auth';
import { HttpClient } from '@angular/common/http';
import { RecaptchaService } from 'src/app/services/recaptcha.service'
import { ImagesService } from 'src/app/services/images.service'
import { finalize, map } from 'rxjs';
import { getStorage, ref, uploadBytes, getDownloadURL, StorageReference, UploadTaskSnapshot, UploadTask, uploadBytesResumable, UploadResult } from 'firebase/storage';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit{

  protected aFormGroup: FormGroup;
 
  captchaImage: string = "";
  correctAnswer: string = "";

  formReg: FormGroup;
  hidePassword: boolean = true; 
  btnVolver = 'Iniciar sesión';
  btnVolverBien = 'Volver a inicio';
  selectedRole: string = '';
  mostrarOtraEspecialidad: boolean = true;
  showLoading: boolean = true;
  showCaptcha: boolean = false;

  
  sitekey: string = "";

  constructor(private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private firestore: Firestore,
    //private http: HttpClient,
    private auth: Auth,
    private ImagesService: ImagesService,
    private captchaService: RecaptchaService)
  
  {
 
    this.formReg = new FormGroup({
      selectedRole: new FormControl('', [Validators.required]),
      nombre: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/),Validators.minLength(2), Validators.maxLength(20)]),
      apellido: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/),Validators.minLength(3)]),
      edad: new FormControl('', [Validators.required, Validators.pattern("^[0-9]+"),Validators.min(18), Validators.max(99)]),
      dni: new FormControl('', [Validators.required,Validators.pattern("^[0-9]+"), Validators.minLength(6),Validators.maxLength(8)]),
      obraSocial: new FormControl('',[Validators.required,Validators.pattern(/^[a-zA-Z\s]+$/)]),
      email: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required]),
      especialidad: new FormControl('', [Validators.required] ),
      otraEspecialidad: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(25), Validators.pattern(/^[a-zA-Z\s]+$/)]),
      imagenPerfil: new FormControl('', [Validators.required,]),
      imagenPerfil1: new FormControl('', [Validators.required]),
      imagenPerfil2: new FormControl('', [Validators.required,]),
    }); 

    const selectedRoleControl = this.formReg.get('selectedRole');

    if (selectedRoleControl) {
      selectedRoleControl.valueChanges.pipe(
        map((selectedRole) => {

          this.updateValidators(selectedRole);
        })
      ).subscribe();
    }

    this.loadCaptchaImage();

    this.aFormGroup = this.formBuilder.group({
      recaptcha: ['', Validators.required]
    });
  }    

  ngOnInit() : void{

    const selectedRoleControl = this.formReg.get('selectedRole');

    if (selectedRoleControl) {
      selectedRoleControl.valueChanges.pipe(
        map((selectedRole) => {

          this.updateValidators(selectedRole);
        })
      ).subscribe();
    }
  
    this.loadCaptchaImage();

    this.aFormGroup = this.formBuilder.group({
      recaptcha: ['', Validators.required]
    });

    this.sitekey = "6LcxAQwpAAAAAKm8-ZSRy42mich3t-WNgNhSASgr"; // QA
    //this.sitekey = "6LfICxIpAAAAAIrr9b-Ky36S61Q_yz763LCA5x3G"; // PROD

    setTimeout(() => {
    this.showLoading = false;
  }, 2000);

}

selectRole(role: string) {
  this.selectedRole = role;
  this.formReg.get('selectedRole')?.setValue(role);
}

onFileSelected(event: any) {
  const file: File = event.target.files[0];
  if (file) {
    this.ImagesService.uploadFile(file)
      .then(downloadUrl => {
        console.log('Archivo subido correctamente. URL:', downloadUrl);

      })
      .catch(error => {
        console.error('Error al subir el archivo:', error);
      });
  }
}

loadCaptchaImage(): void {
  this.captchaService.generateCaptcha()
    .subscribe(response => {
      this.captchaImage = `data:image/svg+xml;base64,${response.captchaData}`;

      this.correctAnswer = response.captchaText;
    });
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

  imageValidator(control: AbstractControl): Promise<string | null> {
    const file = control.value as File;
  
    return new Promise((resolve, reject) => {
      if (file && file.name) {
        const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];
        const extension = file.name.split('.').pop()?.toLowerCase();
  
        if (extension && allowedExtensions.indexOf(extension) === -1) {
          reject({ 'invalidImage': true });
        }
  
        const reader = new FileReader();
        reader.onloadend = () => {
          const dataURL = reader.result as string;
          resolve(dataURL);
          console.log(dataURL);
        };
  
        reader.onerror = () => {
          reject({ 'invalidImage': true });
        };
  
        reader.readAsDataURL(file);

        console.log(file);
      } else {
        resolve(null);
      }
    });
  }
  
//   async onSubmit() {

//     this.showCaptcha = true;
    
//     if (this.formReg.invalid) {
//       this.showCaptcha = false;
//       Swal.fire({
//         icon: 'error',
//         title: 'Campos incompletos',
//         text: 'Por favor, completa todos los campos del formulario.',
//       });
//       return;
//     }

//     const passwordControl = this.formReg.get('password');
//     const confirmPasswordControl = this.formReg.get('confirmPassword');
//     const selectedRole = this.formReg.get('selectedRole')?.value;
//     const { email, password, confirmPassword } = this.formReg.value;
  
//     if (password !== confirmPassword) {
//       Swal.fire({
//         icon: 'error',
//         title: 'Error en la contraseña',
//         text: 'Las contraseñas no coinciden. Por favor, verifica.',
//       }).then(() => {
//         if (passwordControl && confirmPasswordControl) {
//           passwordControl.reset();
//           confirmPasswordControl.reset();
//         }
//       });
//       return;
//     }

//     if (!selectedRole) {
//       Swal.fire({
//         icon: 'error',
//         title: 'Perfil no seleccionado',
//         text: 'Por favor, selecciona un perfil antes de registrarte.',
//       });
//       return;
//     }
   
//     try {
//       const userExists = await this.userService.checkIfUserExists(email);
    
//       if (userExists) {
//         Swal.fire({
//           icon: 'error',
//           title: 'Usuario existente',
//           text: 'El correo electrónico ya está registrado. Inicia sesión en lugar de registrarte.',
//         }).then(() => {
//           if (passwordControl && confirmPasswordControl) {
//             passwordControl.reset();
//             confirmPasswordControl.reset();
//             this.router.navigate(['/login']);
//             return;
//           }
//         });
//       } 
//       else {

//         if (this.aFormGroup.get('recaptcha')?.invalid) {
//           Swal.fire({
//             icon: 'error',
//             title: 'Error en el ReCaptcha',
//             text: 'Por favor, valida el ReCaptcha antes de continuar.',
//           });
//           return;
//         }
        
//         console.log("paso 1");
//         const userCredential = await this.userService.register(email, password);
//         const user = userCredential.user;
//         console.log("paso 2");
//         const userDocRef = doc(collection(this.firestore, 'DatosUsuarios'), user.uid);
        
//         let additionalUserData: any = {
//           mail: email,
//           role: selectedRole,
//           nombre: this.formReg.get('nombre')?.value,
//           apellido: this.formReg.get('apellido')?.value,
//           edad: this.formReg.get('edad')?.value,
//           dni: this.formReg.get('dni')?.value
//         };
        
//         const storageBaseUrl = `https://firebasestorage.googleapis.com/v0/b/tp-clinica-online-ba492.appspot.com/o`;
//         let imageUrl1: string = "";

//         if (selectedRole === 'paciente') {
//           const file: File = this.formReg.get('imagenPerfil1')?.value;
//           console.log(file);

//           if (file) {

//           const imagePath1 = `profile_images/${user.uid}/image1.jpg`;
//           const imageUrl1 = `${storageBaseUrl}/${encodeURIComponent(imagePath1)}`;
          
//           // await this.uploadImageAndGetURL(imageUrl1, this.formReg.get('imagenPerfil1')?.value as File);
//           try {
       
//             // const downloadURL = await this.uploadImageAndGetURL(imageUrl1, file);
//             // console.log('Imagen subida, URL:', downloadURL);
//           } catch (error) {
//             console.error('Error al subir la imagen:', error);
//           }
//         }
          
//           const imagePath2 = `profile_images/${user.uid}/image2.jpg`;
//           const imageUrl2 = `${storageBaseUrl}/${encodeURIComponent(imagePath2)}`;

//           //await this.uploadImageAndGetURL(imageUrl2, this.formReg.get('imagenPerfil2')?.value as File);
          
//           additionalUserData = {
//             ...additionalUserData,
//             obrasocial: this.formReg.get('obraSocial')?.value,
//             aprobadoPorAdmin: true,
//             imagenPerfil1: imageUrl1,
//             imagenPerfil2: imageUrl2,
//         };
//         await setDoc(userDocRef, additionalUserData, { merge: true });

//         }     
        
//          console.log("paso 3, cargado");
    
//         if (!user.emailVerified) {
//           await this.sendEmailVerification(user);
    
//           Swal.fire({
//             icon: 'warning',
//             title: 'Faltan validar tus datos antes de iniciar sesión.',
//             text: 'Debes verificar tu correo electrónico antes de iniciar sesión. Hemos enviado un correo de verificación a tu dirección de correo.',
//           }).then(() => {
            
//             if (passwordControl && confirmPasswordControl) {
//               passwordControl.reset();
//               confirmPasswordControl.reset();
//               this.router.navigate(['/login']);
//             }
//           });
//         } else {
    
//           Swal.fire({
//             icon: 'success',
//             title: 'Registro exitoso',
//             text: '¡Bienvenido!',
//             confirmButtonText: 'OK'
//           }).then(() => {
//             this.router.navigate(['/login']);
//           });
//         }
//       }
//     } catch (error: any) 
//     {
      
//       if (error.message === 'Debes verificar tu correo electrónico antes de iniciar sesión.') {

//         Swal.fire({
//           icon: 'warning',
//           title: 'Faltan validar tus datos',
//           text: error.message,
//         });
//         this.router.navigate(['/login']);
//       } else if (error.code === 'auth/invalid-email') {
//         Swal.fire({
//           icon: 'error',
//           title: 'Error en el correo electrónico',
//           text: 'El formato del correo electrónico es incorrecto. Por favor, verifica.',
//         });
//       } else if (error.code === 'auth/weak-password') {
//         Swal.fire({
//           icon: 'error',
//           title: 'Contraseña débil',
//           text: 'La contraseña es demasiado débil. Debe contener al menos 6 caracteres.',
//         }).then(() => {
//           if (passwordControl && confirmPasswordControl) {
//             passwordControl.reset();
//             confirmPasswordControl.reset();
//           }
//         });
//       } else if (error.code === 'auth/email-already-in-use') {
//         Swal.fire({
//           icon: 'error',
//           title: 'Correo electrónico en uso',
//           text: 'El correo electrónico ya está registrado. Inicia sesión en lugar de registrarte.',
//         }); 
//       } else {
//         console.error('Error en el registro:', error);
//         Swal.fire({
//           icon: 'error',
//           title: 'Error en el registro',
//           text: 'Hubo un error al registrar tu cuenta. Por favor, verifica tus datos.',
//         }).then(() => {
//           if (passwordControl && confirmPasswordControl) {
//             passwordControl.reset();
//             confirmPasswordControl.reset();
//           }
//         });
//       }
//       return Promise.resolve();
//     }
// }

async onSubmit() {
  this.showCaptcha = true;

  if (this.formReg.invalid) {
    this.showCaptcha = false;
    Swal.fire({
      icon: 'error',
      title: 'Campos incompletos',
      text: 'Por favor, completa todos los campos del formulario.',
    });
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
    } else {
      if (this.aFormGroup.get('recaptcha')?.invalid) {
        Swal.fire({
          icon: 'error',
          title: 'Error en el ReCaptcha',
          text: 'Por favor, valida el ReCaptcha antes de continuar.',
        });
        return;
      }

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
      
      if (selectedRole === 'paciente') {
        
        let imageUrl1: string = "";
        let imageUrl2: string = ""; 

        const file: File = this.formReg.get('imagenPerfil1')?.value;
        console.log(file);

        if (file) {

          try {
            const downloadURL = await this.ImagesService.uploadFile(file);
            console.log('Imagen subida, URLLLLLLL:', downloadURL);
            imageUrl1 = downloadURL;
          } catch (error) {
            console.error('Error al subir la imagen:', error);
          }
        }

        const file2: File = this.formReg.get('imagenPerfil2')?.value;
        
        if (file2) {
          try {
            const downloadURL2 = await this.ImagesService.uploadFile(file2);
            console.log('Imagen 2 subida, URL:', downloadURL2);
            imageUrl2 = downloadURL2;
          } catch (error) {
            console.error('Error al subir la imagen 2:', error);
          }
        }

        additionalUserData = {
          ...additionalUserData,
          obrasocial: this.formReg.get('obraSocial')?.value,
          aprobadoPorAdmin: true,
          imagenPerfil1: imageUrl1,
          imagenPerfil2: imageUrl2,
        };
        console.log("paso 3, cargado");
  
        await setDoc(userDocRef, additionalUserData, { merge: true });
    }else if (selectedRole === 'especialista') 
    {
        const imagePath = `profile_images/${user.uid}/image.jpg`;
        const imageUrl = `${storageBaseUrl}/${encodeURIComponent(imagePath)}`;
        //await this.uploadImageAndGetURL(imageUrl, this.formReg.get('imagenPerfil')?.value as File);
      
        additionalUserData = {
          ...additionalUserData,
          especialidad: this.formReg.get('especialidad')?.value,
          otraEspecialidad: this.formReg.get('otraEspecialidad')?.value,
          aprobadoPorAdmin: false,
          imagenPerfil: imageUrl,
        };
        console.log("paso 3, cargado");
        await setDoc(userDocRef, additionalUserData, { merge: true });
      }     

      if (!user.emailVerified) {
        await this.sendEmailVerification(user);

        Swal.fire({
          icon: 'warning',
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
