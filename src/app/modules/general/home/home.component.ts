import { Component, EventEmitter, HostListener, Output, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { navbarData } from './home-data';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { Auth, User } from '@angular/fire/auth';
import Swal from 'sweetalert2';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit{
  showLoading: boolean = true;

  @Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter();
    collapsed = false;
    screenWidth = 0;
    navData = navbarData;
    currentUser$: Observable<User | null>;
    isDropdownOpen = false;
    showLogoutButton = false;

constructor (private router: Router, private userService: UserService, private auth: Auth) {
  this.currentUser$ = this.userService.getCurrentUser();
}

@HostListener('window:resize', ['$event'])
onResize(event: any){
  this.screenWidth = window.innerWidth;
  if (this.screenWidth <= 768) {
    this.collapsed = false;
    this.onToggleSideNav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth});
  }
}

ngOnInit(): void {

  setTimeout(() => {
    this.showLoading = false;
  }, 2000);

  this.screenWidth = window.innerWidth;
  this.currentUser$ = this.userService.getCurrentUser();
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

toggleDropdown() {
  this.isDropdownOpen = !this.isDropdownOpen;
  this.showLogoutButton = this.isDropdownOpen; 
}
  
onClickConfig(event: any): void 
  {
    this.router.navigate(['/home/config']);
    
  }

 
}
