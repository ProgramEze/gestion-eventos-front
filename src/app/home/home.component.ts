import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { LoginService } from '../login/login.service';
import { CommonModule, NgIf } from '@angular/common';
import { Evento } from '../models/evento.model';
import { EventoService } from '../eventos/evento.service';

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
	cantidad: number = 0;
	proximosEventos: Evento[] = [];
	constructor(
		private loginService: LoginService,
		private eventoService: EventoService,
		private router: Router
	) {}

	ngOnInit(): void {
		this.loginService.loggedIn$.subscribe((status) => {
			this.isLoggedIn = status;
			this.nombre = this.loginService.getNombre() || 'Invitado'; // Obtener el nombre del usuario logueado
			this.rol = this.loginService.isRoleIn() || ''; // Obtener el rol del usuario logueado
			this.isOrganizador = this.rol === 'Organizador'; // Evaluar si es organizador
			this.isLoading = false; // Cuando la autenticación se verifica, desactivar la carga
			if (this.isLoggedIn) this.cargarDatos();
		});

		this.loginService.checkSession();
	}

	cargarDatos() {
		this.isLoading = true;

		this.eventoService.getCantidadEventosHastaFinAnio().subscribe({
			next: (response: number) => {
				this.cantidad = response;
				console.log('Cantidad de eventos:', this.cantidad);
				this.verificarCargaCompletada(); // Verificar si se completó la carga
			},
			error: (err) =>
				console.error('Error al cargar la cantidad de eventos', err),
		});

		this.eventoService.getCincoEventos().subscribe({
			next: (eventos) => {
				if (Array.isArray(eventos)) {
					this.proximosEventos = eventos; // Solo asigna si es un array
					console.log(
						'Eventos próximos:',
						this.proximosEventos.length
					);
					this.verificarCargaCompletada();
				} else {
					console.error('Formato de respuesta incorrecto:', eventos);
				}
			},
			error: (err) =>
				console.error('Error al cargar los próximos eventos:', err),
		});
	}

	// Verifica si ambos datos ya se han cargado
	verificarCargaCompletada() {
		if (this.proximosEventos.length > 0 && this.cantidad > 0) {
			this.isLoading = false;
			console.log('Carga completada');
		}
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
