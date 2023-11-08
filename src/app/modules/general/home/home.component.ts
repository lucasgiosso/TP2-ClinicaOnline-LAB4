import { Component, EventEmitter, HostListener, Output, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { navbarData } from './home-data';
import { Observable } from 'rxjs';

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
    //currentUser$: Observable<User | null>;
    currentUser$: any;
    isDropdownOpen = false;
    showLogoutButton = false;

constructor (private router: Router) {}

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
  }, 1000);

  this.screenWidth = window.innerWidth;
  //this.currentUser$ = this.userService.getCurrentUser();
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

logout() {}

userLogged() {}

toggleDropdown() {
  this.isDropdownOpen = !this.isDropdownOpen;
  this.showLogoutButton = this.isDropdownOpen; 
}
  
onClickConfig(event: any): void 
  {
    this.router.navigate(['/home/config']);
    
  }

 
}
