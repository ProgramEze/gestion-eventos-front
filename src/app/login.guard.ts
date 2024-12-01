import { Injectable } from '@angular/core';
import {
	CanActivate,
	ActivatedRouteSnapshot,
	RouterStateSnapshot,
	Router,
} from '@angular/router';
import { LoginService } from './login/login.service';

@Injectable({
	providedIn: 'root',
})
export class LoginGuard implements CanActivate {
	constructor(private loginService: LoginService, private router: Router) {}

	canActivate(
		route: ActivatedRouteSnapshot, // Aquí es donde se obtiene la información de la ruta activada
		state: RouterStateSnapshot
	): boolean {
		// Asegúrate de que el estado de la sesión esté actualizado
		this.loginService.checkSession();

		// Obtener el rol requerido desde los datos de la ruta
		const requiredRole = route.data['roles']; // Asegúrate de que la clave se llame 'roles'

		// Verificar si el usuario está logueado
		if (
			!this.loginService.isLoggedIn() ||
			!requiredRole.includes(this.loginService.isRoleIn())
		) {
			this.router.navigate(['/']);
			return false;
		}

		return true;
	}
}
