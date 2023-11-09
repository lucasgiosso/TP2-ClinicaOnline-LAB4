import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Auth,User } from 'firebase/auth';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-mis-turnos',
  templateUrl: './mis-turnos.component.html',
  styleUrls: ['./mis-turnos.component.scss']
})
export class MisTurnosComponent implements OnInit{

  btnVolver = 'Volver a inicio';
  showLoading: boolean = true;

  @Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter();
  collapsed = false;
  screenWidth = 0;
  currentUser$: Observable<User | null>;
  isDropdownOpen = false;
  showLogoutButton = false;

  constructor (private router: Router, private userService: UserService) {
    this.currentUser$ = this.userService.getCurrentUser();
  }

  ngOnInit() : void{
    
    setTimeout(() => {
    this.showLoading = false;
  }, 2000);}

  public onClickHome(event: any): void 
  {
    this.router.navigate(['home']);

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
