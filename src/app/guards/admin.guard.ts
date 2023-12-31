import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { Observable, map } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree | Observable<boolean | UrlTree> {
    
    // Utilizar el servicio para obtener el rol del usuario
    return this.userService.userRole$.pipe(
      map((userRole) => {
        console.log('Valor de userRole (AdminGuard):', userRole);

        if (userRole === 'admin') {
          return true; 
        } else {

          Swal.fire({
            icon: 'error',
            title: 'Acceso denegado',
            text: 'Solo los usuarios con el rol de "admin" pueden acceder a esta página.',
          }).then(() => {
            this.router.navigateByUrl('/home'); 
          });
          return false;
        }
      })
    );
  }
}
