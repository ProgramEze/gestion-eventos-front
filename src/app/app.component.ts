import { ChangeDetectorRef, Component, LOCALE_ID, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { LoginService } from './login/login.service';
import { NgIf } from '@angular/common';
import { DatePipe, registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es'; // Importa la localización de español

registerLocaleData(localeEs, 'es'); // Registra la localización en español

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [NgIf, RouterOutlet],
	providers: [
		DatePipe,
		{ provide: LOCALE_ID, useValue: 'es' }, // Usar español como idioma por defecto
	],
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
	title = 'app-gestion-eventos';
	username: string = '';
	loggedIn: boolean = false;
	esOrganizador: boolean = false;

	constructor(
		private loginService: LoginService,
		private router: Router,
		private cdr: ChangeDetectorRef
	) {}

	ngOnInit(): void {
		this.loginService.loggedIn$.subscribe(() => {
			this.loggedIn = sessionStorage.getItem('loggedIn') === 'true';
			this.username = this.loginService.getNombre() || 'Invitado';
			this.esOrganizador = this.loginService.isRoleIn() === 'Organizador';
			this.cdr.detectChanges(); // Forzar actualización de la vista
		});
	}

	async logout(): Promise<void> {
		try {
			await this.loginService.logout().toPromise();

			// Limpiar sessionStorage
			sessionStorage.clear();

			// Forzar actualización del estado interno
			this.loggedIn = false;
			this.username = '';
			this.esOrganizador = false;
			this.loginService.loggedInSubject.next(false);

			// Esperar un breve momento para asegurar que Angular detecte el cambio antes de redirigir
			await new Promise((resolve) => setTimeout(resolve, 100));

			// Redirigir al usuario a la página principal
			this.router.navigate(['/']);
		} catch (error) {
			console.error('Error en logout:', error);
		}
	}
}
