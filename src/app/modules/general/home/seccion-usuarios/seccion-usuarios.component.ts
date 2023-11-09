import { Component,EventEmitter,OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth, User } from 'firebase/auth';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';


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

  btnVolver = 'Volver a inicio';
  formReg: FormGroup;
  selectedRole: string = '';
  showLoading: boolean = true;

  @Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter();
    collapsed = false;
    screenWidth = 0;
    currentUser$: Observable<User | null>;
    isDropdownOpen = false;
    showLogoutButton = false;

  constructor (private router: Router, private formBuilder : FormBuilder, private userService: UserService) {

    this.currentUser$ = this.userService.getCurrentUser();

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

  ngOnInit() : void{
    
    setTimeout(() => {
    this.showLoading = false;
  }, 2000);}

  onSubmit() {};

  public onClickHome(event: any): void 
  {
    this.router.navigate(['home']);
    //console.log(event);
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
    this.showLogoutButton = this.isDropdownOpen; 
  }

  // async logout() {
  //   Swal.fire({
  //     title: '¿Estás seguro?',
  //     text: 'Lamentamos que quieras salir...',
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#3085d6',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: 'Sí, salir'
  //   }).then(async (result) => {
  //     if (result.isConfirmed) {
  //       try {
  //         console.log('Route link clicked: logout');
  //         await this.auth.signOut();
  //         this.router.navigate(['/login']);
  //       } catch (error) {
  //         console.error('Error al cerrar sesión:', error);
  //       }
  //     } else {
  //       this.router.navigate(['/home']);
  //     }
  //   });
  // }

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
}
