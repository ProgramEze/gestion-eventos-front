import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { LoginService } from '../login/login.service';
import { CommonModule, NgIf } from '@angular/common';

@Component({
	selector: 'app-home',
	standalone: true, // Asegúrate de que esté marcado como standalone
	imports: [CommonModule, RouterModule], // Asegúrate de que esté importando los módulos necesarios
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
	isLoggedIn: boolean = false;
	isOrganizador: boolean = false;
	isLoading: boolean = true; // Nueva bandera para manejar la carga
	nombre: string = '';
	rol: string = '';
	constructor(private loginService: LoginService, private router: Router) {}

	ngOnInit(): void {
		this.loginService.loggedIn$.subscribe((status) => {
			this.isLoggedIn = status;
			this.nombre = this.loginService.getNombre() || 'Invitado'; // Obtener el nombre del usuario logueado
			this.rol = this.loginService.isRoleIn() || ''; // Obtener el rol del usuario logueado
			this.isOrganizador = this.rol === 'Organizador'; // Evaluar si es organizador
			this.isLoading = false; // Cuando la autenticación se verifica, desactivar la carga
		});

		this.loginService.checkSession();
	}

	// Métodos de navegación
	navigateToPerfil(): void {
		this.router.navigate(['/perfil']);
	}

	navigateToAsistentes(): void {
		this.router.navigate(['/asistentes']);
	}

	navigateToLogin(): void {
		this.router.navigate(['/login']);
	}

	navigateToRegistrar(): void {
		this.router.navigate(['/registrar']);
	}
}
