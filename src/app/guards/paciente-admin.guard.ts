import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { Observable, map } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable()
export class PacienteAdminGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree | Observable<boolean | UrlTree> {
    
    return this.userService.userRole$.pipe(
      map((userRole) => {
        console.log('Valor de userRole:', userRole);

        if (userRole === 'admin' || userRole === 'paciente' ) {
          return true; 
        } else {

          Swal.fire({
            icon: 'error',
            title: 'Acceso denegado',
            text: 'Solo los usuarios con el rol de "admin" o "paciente" pueden acceder a esta página.',
          }).then(() => {
            this.router.navigateByUrl('/home'); 
          });
          return false;
        }
      })
    );
  }
}
