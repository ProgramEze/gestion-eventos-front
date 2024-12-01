import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { LoginService } from './login/login.service';
import { NgIf } from '@angular/common';
import { CommonModule, DatePipe, registerLocaleData } from '@angular/common';
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

	constructor(private loginService: LoginService, private router: Router) {}

	ngOnInit(): void {
		// Revisa si el usuario está logueado al cargar la página
		this.loginService.checkSession();
		console.log(this.loginService.isLoggedIn());
		// Escucha cambios de sesión
		this.loginService.loggedIn$.subscribe((status) => {
			this.loggedIn = status;
			this.username = this.loginService.getNombre() || 'Invitado'; // Esto se actualizará correctamente después del logout
			this.esOrganizador = this.loginService.isRoleIn() === 'Organizador';
		});
	}

	logout(): void {
		this.loggedIn = false;
		this.username = ''; // Limpiar el nombre
		this.esOrganizador = false; // Limpiar el estado de organizador
		this.loginService.logout().subscribe(() => {});
	}
}

/*
Que todos vean los eventos pero deban loguearse para participar
*/